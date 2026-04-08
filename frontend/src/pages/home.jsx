import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { generateMeetingCode, getMeetingShareUrl } from "../lib/meetingCode";
import { toast } from "sonner";

export default function Home() {
  const navigate = useNavigate();
  const [generatedCode, setGeneratedCode] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerateCode = useCallback(() => {
    const code = generateMeetingCode();
    setGeneratedCode(code);
    setCopied(false);
  }, []);

  const handleJoinMeeting = () => {
    if (!generatedCode) {
      toast.error("Please generate a meeting code first");
      return;
    }
    navigate(`/meeting/${generatedCode}`);
  };

 

  const handleCopyCode = async () => {
    try {
      const url = getMeetingShareUrl(generatedCode);
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Meeting link copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };
  const handleShare = async () => {
    const url = getMeetingShareUrl(generatedCode);
    const shareData = {
      title: "Join my Talkify meeting",
      text: `Join my video meeting on Talkify! Meeting code: ${generatedCode}`,
      url,
    };
    if (navigator.share) {
      try { await navigator.share(shareData); } catch { /* cancelled */ }
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Meeting link copied to clipboard!");
    }
  };

  return (
    <div className="page">
      {/* Navbar */}
      <nav className="nav">
        <div className="brand">
          <span style={{ fontSize: "1.3rem" }}>📹</span>
          <h2 className="brandText">Talkify</h2>
        </div>
  
        <div className="navActions">
          <button
            className="iconBtn"
            onClick={() => navigate("/history")}
            title="History"
          >
            🕘
          </button>
  
          <button
            className="outlineBtn"
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/auth");
            }}
          >
            Logout
          </button>
        </div>
      </nav>
  
      {/* Main Content */}
      <div className="main">
        <h2 className="heading">
          Providing Quality Video Call Just Like Quality{" "}
          <span style={{ color: "#4285f4" }}>Education</span>
        </h2>
  
        <div className="card">
          <h3 className="cardTitle">Meeting Code</h3>
  
          <button className="generateBtn" onClick={handleGenerateCode}>
            🔄 Generate New Meeting Code
          </button>
  
          {generatedCode && (
            <>
              <div className="codeBox">
                <code className="codeText">{generatedCode}</code>
              </div>
  
              <div className="urlBox">
                <span className="urlLabel">Share this link:</span>
                <span className="urlText">
                  {getMeetingShareUrl(generatedCode)}
                </span>
              </div>
  
              <div className="actionRow">
                <button className="actionBtn" onClick={handleJoinMeeting}>
                  🎥 Join Meeting
                </button>
  
                <button
                  className="actionBtnOutline"
                  onClick={handleCopyCode}
                >
                  {copied ? "✅ Copied!" : "📋 Copy Link"}
                </button>
  
                <button
                  className="actionBtnOutline"
                  onClick={handleShare}
                >
                  📤 Share
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}