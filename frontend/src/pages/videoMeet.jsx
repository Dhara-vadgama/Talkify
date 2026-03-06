import React from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import io from "socket.io-client";
import "./videoMeet.css";
import { useRef, useState, useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import CallEndIcon from "@mui/icons-material/CallEnd";
import ScreenShareIcon from "@mui/icons-material/ScreenShare";
import StopScreenShareIcon from "@mui/icons-material/StopScreenShare";
import MessageIcon from "@mui/icons-material/Message";
import Badge from "@mui/material/Badge";
import { useNavigate } from "react-router-dom";
// const server_url = "http://localhost:3002";
import server from "../../environment";
const server_url = server;
var connections = {};
const peerConfigConnection = {
  iceServers: [
    {
      urls: "stun:stun.l.google.com:19302",
    },
  ],
};
export default function VideoMeet() {
  var socketRef = useRef();
  let socketIdRef = useRef();
  let localVideoRef = useRef();

  let [videoAvailable, setVideoAvailable] = useState(true);
  let [audioAvailable, setAudioAvailable] = useState(true);
  let [video, setVideo] = useState(false);
  let [audio, setAudio] = useState(false);
  let [screen, setScreen] = useState();
  let [showModal, setShowModal] = useState(false);
  let [screenAvailable, setScreenAvailable] = useState();
  let [messages, setMessages] = useState([]);
  let [message, setMessage] = useState("");
  let [newMessages, setNewMessages] = useState(0);
  let [askForUsername, setAskForUsername] = useState(true);
  let [username, setUsername] = useState("");
  const videoRef = useRef([]);
  let [videos, setVideos] = useState([]);
  let routeTo = useNavigate();

  // if(isChrome()===false){

  // }
  const getPermissions = async () => {
    try {
      const videoPermmision = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      if (videoPermmision) {
        setVideoAvailable(true);
      } else {
        setVideoAvailable(false);
      }
      const audioPermission = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      if (audioPermission) {
        setAudioAvailable(true);
      } else {
        setAudioAvailable(false);
      }
      if (navigator.mediaDevices.getDisplayMedia) {
        setScreenAvailable(true);
      } else {
        setScreenAvailable(false);
      }
      if (videoAvailable || audioAvailable) {
        const userMediaStream = await navigator.mediaDevices.getUserMedia({
          video: videoAvailable,
          audio: audioAvailable,
        });
        if (userMediaStream) {
          window.localStream = userMediaStream;
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = userMediaStream;
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getPermissions();
  }, []);
  let getUserMediaSuccess = (stream) => {
    try {
      if (localVideoRef.current && localVideoRef.current.srcObject) {
        let tracks = localVideoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      }
    } catch (e) {
      console.log(e);
    }
    window.localStream = stream;
    localVideoRef.current.srcObject = stream;

    for (let id in connections) {
      if (id === socketIdRef.current) continue;

      stream.getTracks().forEach((track) => {
        const senders = connections[id].getSenders();
        const trackExists = senders.some((s) => s.track === track);
        if (!trackExists) {
          connections[id].addTrack(track, stream);
        }
      });

      connections[id].createOffer().then((description) => {
        connections[id]
          .setLocalDescription(description)
          .then(() => {
            socketRef.current.emit(
              "signal",
              id,
              JSON.stringify({ sdp: connections[id].localDescription }),
            );
          })
          .catch((e) => console.log(e));
      });
    }

    stream.getTracks().forEach(
      (track) =>
        (track.onended = () => {
          setVideo(false);
          setAudio(false);
          try {
            let tracks = localVideoRef.current.srcObject.getTracks();
            tracks.forEach((track) => track.stop());
          } catch {
            (e) => console.log(e);
          }
          // let blackSilence = (...args) =>
          //   new MediaStream([black(...args), silence()]);
          // window.localStream = blackSilence();
          // localVideoRef.current.srcObject = window.localStream;

          for (let id in connections) {
            // connections[id].addStream(blackSilence());
            connections[id].createOffer().then((description) => {
              connections[id]
                .setLocalDescription(description)
                .then(() => {
                  socketRef.current.emit(
                    "signal",
                    id,
                    JSON.stringify({ sdp: connections[id].localDescription }),
                  );
                })
                .catch((e) => console.log(e));
            });
          }
        }),
    );
  };
  let silence = () => {
    let ctx = new AudioContext();
    let oscillator = ctx.createOscillator();
    let dst = oscillator.connect(ctx.createMediaStreamDestination());
    oscillator.start();
    ctx.resume();
    return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false });
  };
  //black video
  let black = ({ width = 640, height = 480 } = {}) => {
    let canvas = Object.assign(document.createElement("canvas"), {
      width,
      height,
    });
    canvas.getContext("2d").fillRect(0, 0, width, height);
    let stream = canvas.captureStream();

    return Object.assign(stream.getVideoTracks()[0], { enabled: false });
  };

  let getUserMedia = () => {
    if ((video && videoAvailable) || (audio && audioAvailable)) {
      navigator.mediaDevices
        .getUserMedia({ video: videoAvailable, audio: audioAvailable })
        .then(getUserMediaSuccess)
        .then((stream) => {})
        .catch((e) => console.log(e));
    } else {
      try {
        if (localVideoRef.current && localVideoRef.current.srcObject) {
          let tracks = localVideoRef.current.srcObject.getTracks();
          tracks.forEach((track) => track.stop());
        }
      } catch (e) {
        console.log(e);
      }
    }
  };
  const getMediaStream = async (videoEnabled = true, audioEnabled = true) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: videoEnabled,
        audio: audioEnabled,
      });

      return stream;
    } catch (err) {
      console.log("Media error:", err);
      return null;
    }
  };
  // useEffect(() => {
  //   if (video !== undefined && audio !== undefined) {
  //     getUserMedia();
  //   }
  // }, [audio, video]);
  let gotMessageFromServer = (fromId, message) => {
    var signal = JSON.parse(message);
    if (fromId !== socketIdRef.current) {
      if (signal.sdp) {
        if (!connections[fromId]) {
          connections[fromId] = new RTCPeerConnection(peerConfigConnection);
          setupTrackHandler(fromId);
        }
        connections[fromId]
          .setRemoteDescription(new RTCSessionDescription(signal.sdp))
          .then(() => {
            if (signal.sdp.type === "offer") {
              connections[fromId]
                .createAnswer()
                .then((description) => {
                  return connections[fromId].setLocalDescription(description);
                })
                .then(() => {
                  socketRef.current.emit(
                    "signal",
                    fromId,
                    JSON.stringify({
                      sdp: connections[fromId].localDescription,
                    }),
                  );
                })
                .catch((e) => console.log(e));
            }
          })
          .catch((e) => console.log(e));
      }
      if (signal.ice) {
        connections[fromId]
          .addIceCandidate(new RTCIceCandidate(signal.ice))
          .catch((e) => console.log(e));
      }
    }
  };

  let setupTrackHandler = (socketListId) => {
    connections[socketListId].onicecandidate = (event) => {
      if (event.candidate != null) {
        socketRef.current.emit(
          "signal",
          socketListId,
          JSON.stringify({ ice: event.candidate }),
        );
      }
    };

    connections[socketListId].ontrack = (event) => {
      const remoteStream = event.streams[0];

      setVideos((prevVideos) => {
        const existingVideo = prevVideos.find(
          (video) => video.socketId === socketListId,
        );

        if (existingVideo) {
          return prevVideos.map((video) =>
            video.socketId === socketListId
              ? { ...video, stream: remoteStream }
              : video,
          );
        } else {
          return [
            ...prevVideos,
            {
              socketId: socketListId,
              stream: remoteStream,
            },
          ];
        }
      });
    };
  };
  let addMessage = (data, sender, socketIdSender) => {
    setMessages((messages) => [
      ...messages,
      {
        sender: sender,
        data: data,
      },
    ]);
    if (socketIdSender !== socketIdRef.current) {
      setNewMessages((prev) => prev + 1);
    }
  };
  let connectToSocketServer = () => {
    socketRef.current = io.connect(server_url, { secure: false });
    socketRef.current.on("signal", gotMessageFromServer);
    socketRef.current.on("connect", () => {
      socketRef.current.emit("join-call", window.location.pathname);
      socketIdRef.current = socketRef.current.id;
      socketRef.current.on("chat-message", addMessage);
      socketRef.current.on("user-left", (socketId) => {
        setVideos((videos) =>
          videos.filter((video) => video.socketId !== socketId),
        );
      });
      socketRef.current.on("user-joined", (id, clients) => {
        clients.forEach((socketListId) => {
          if (!connections[socketListId]) {
            connections[socketListId] = new RTCPeerConnection(
              peerConfigConnection,
            );
            setupTrackHandler(socketListId);
          }

          if (window.localStream) {
            window.localStream.getTracks().forEach((track) => {
              const senders = connections[socketListId].getSenders();
              const trackExists = senders.some((s) => s.track === track);
              if (!trackExists) {
                connections[socketListId].addTrack(track, window.localStream);
              }
            });
          }
        });
        if (id === socketIdRef.current) {
          for (let id2 in connections) {
            if (id2 === socketIdRef.current) continue;
            try {
              if (window.localStream) {
                window.localStream.getTracks().forEach((track) => {
                  const senders = connections[id2].getSenders();
                  const trackExists = senders.some((s) => s.track === track);
                  if (!trackExists) {
                    connections[id2].addTrack(track, window.localStream);
                  }
                });
              }
            } catch (e) {
              console.log(e);
            }
            connections[id2].createOffer().then((description) => {
              connections[id2]
                .setLocalDescription(description)
                .then(() => {
                  socketRef.current.emit(
                    "signal",
                    id2,
                    JSON.stringify({ sdp: connections[id2].localDescription }),
                  );
                })
                .catch((e) => {
                  console.log(e);
                });
            });
          }
        }
      });
    });
  };
  let getMedia = async () => {
    const stream = await getMediaStream(true, true);
    if (!stream) return;

    window.localStream = stream;

    setVideo(true);
    setAudio(true);

    setTimeout(() => {
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    }, 0);

    connectToSocketServer();
  };
  let connect = () => {
    console.log("Connect button clicked");
    setAskForUsername(false);
    getMedia();
  };

  let handleVideo = () => {
    if (window.localStream) {
      window.localStream.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setVideo(!video);
    }
  };

  let handleAudio = () => {
    if (window.localStream) {
      window.localStream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setAudio(!audio);
    }
  };
  let getDisplayMediaSuccess = (stream) => {
    try {
      window.localStream.getTracks().forEach((track) => track.stop());
    } catch (e) {
      console.log(e);
    }
    window.localStream = stream;
    localVideoRef.current.srcObject = stream;
    for (let id in connections) {
      if (id === socketIdRef.current) continue;
      window.localStream.getTracks().forEach((track) => {
        connections[id].addTrack(track, window.localStream);
      });
      connections[id].createOffer().then((description) => {
        connections[id].setLocalDescription(description).then(() => {
          socketRef.current.emit(
            "signal",
            id,
            JSON.stringify({ sdp: connections[id].localDescription }),
          );
        });
      });
    }
    stream.getTracks().forEach(
      (track) =>
        (track.onended = () => {
          setScreen(false);
          try {
            let tracks = localVideoRef.current.srcObject.getTracks();
            tracks.forEach((track) => track.stop());
          } catch {
            (e) => console.log(e);
          }
          // let blackSilence = (...args) =>
          //   new MediaStream([black(...args), silence()]);
          // window.localStream = blackSilence();
          // localVideoRef.current.srcObject = window.localStream;

          getUserMedia();
        }),
    );
  };
  let getDisplayMedia = () => {
    if (screen) {
      if (navigator.mediaDevices.getDisplayMedia) {
        navigator.mediaDevices
          .getDisplayMedia({ video: true, audio: true })
          .then(getDisplayMediaSuccess)
          .then((stream) => {})
          .catch((e) => console.log(e));
      }
    }
  };
  useEffect(() => {
    if (screen !== undefined) {
      getDisplayMedia();
    }
  }, [screen]);
  let handleScreen = () => {
    setScreen(!screen);
  };
  useEffect(() => {
    if (showModal) {
      setNewMessages(0);
    }
  }, [showModal]);
  let handleChat = () => {
    setShowModal(!showModal);
    setNewMessages(0);
  };

  let sendMessages = () => {
    if (!socketRef.current) {
      console.log("Socket not ready");
      return;
    }

    if (!message.trim()) return;

    socketRef.current.emit("chat-message", message, username);

    setMessage("");
  };
  let handleEndCall = () => {
    try {
      // stop camera & mic
      if (window.localStream) {
        window.localStream.getTracks().forEach((track) => track.stop());
      }

      // close peer connections
      for (let id in connections) {
        connections[id].close();
        delete connections[id];
      }

      // disconnect socket
      if (socketRef.current) {
        socketRef.current.disconnect();
      }

      // go to home page
      routeTo("/home");
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div>
      {askForUsername === true ? (
        <div>
          <h2>Enter into Lobby</h2>
          <TextField
            id="outlined-basic"
            label="Username"
            value={username}
            variant="outlined"
            onChange={(e) => setUsername(e.target.value)}
          />
          <Button variant="contained" onClick={connect}>
            Connect
          </Button>
          <div>
            <video ref={localVideoRef} autoPlay muted></video>
          </div>
        </div>
      ) : (
        <div className="meetVideoConatiner">
          {showModal ? (
            <div className="chatRoom">
              <div className="chatContainer">
                <h2>Chat</h2>
                <div className="chattingDisplay">
                  {messages.length > 0 ? (
                    messages.map((e, i) => {
                      return (
                        <div style={{ marginBottom: "20px" }} key={i}>
                          <p style={{ fontWeight: "bold" }}>{e.sender}</p>
                          <p>{e.data}</p>
                        </div>
                      );
                    })
                  ) : (
                    <p>No Messages Yet</p>
                  )}
                </div>
                <div className="chattingArea">
                  <TextField
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        sendMessages();
                      }
                    }}
                    id="outlined-basic"
                    label="Enter Your Chat"
                    variant="outlined"
                  />
                  <Button variant="contained" onClick={sendMessages}>
                    Send
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <></>
          )}

          <div className="buttonContainer">
            <IconButton onClick={handleVideo} style={{ color: "white" }}>
              {video === true ? <VideocamIcon /> : <VideocamOffIcon />}
            </IconButton>
            <IconButton onClick={handleEndCall} style={{ color: "red" }}>
              <CallEndIcon />
            </IconButton>
            <IconButton onClick={handleAudio} style={{ color: "white" }}>
              {audio === true ? <MicIcon /> : <MicOffIcon />}
            </IconButton>
            {screenAvailable === true ? (
              <IconButton onClick={handleScreen} style={{ color: "white" }}>
                {screen === true ? (
                  <ScreenShareIcon />
                ) : (
                  <StopScreenShareIcon />
                )}
              </IconButton>
            ) : (
              <></>
            )}
            <Badge badgeContent={newMessages} color="secondary" max={999}>
              <IconButton onClick={handleChat} style={{ color: "white" }}>
                <MessageIcon />
              </IconButton>
            </Badge>
          </div>

          <video
            ref={localVideoRef}
            className="meetUserVideo"
            autoPlay
            muted
          ></video>
          <div className="conferenceView">
            {[...videos].map((video) => (
              <div className="videoBox" key={video.socketId}>
                <video
                  autoPlay
                  playsInline
                  ref={(ref) => {
                    if (ref && video.stream) {
                      ref.srcObject = video.stream;
                    }
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
