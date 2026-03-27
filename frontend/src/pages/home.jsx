import React, { useContext, useState } from "react";
import withAuth from "../utils/withAuth";
import { useNavigate } from "react-router-dom";
import "./home.css";
import { Button, IconButton, TextField } from "@mui/material";
import RestoreIcon from "@mui/icons-material/Restore";
import { AuthContext } from "../context/authContext";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#4285f4" },
    background: { default: "#1a1c22", paper: "#23262f" },
  },
  typography: { fontFamily: "'Inter', 'Google Sans', system-ui, sans-serif" },
  shape: { borderRadius: 12 },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 12,
            background: "rgba(255,255,255,0.04)",
            "& fieldset": { borderColor: "rgba(255,255,255,0.1)" },
            "&:hover fieldset": { borderColor: "rgba(66,133,244,0.5)" },
            "&.Mui-focused fieldset": { borderColor: "#4285f4" },
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          textTransform: "none",
          fontWeight: 600,
        },
      },
    },
  },
});

function HomeComponent() {
  let navigate = useNavigate();
  const [meetingCode, setMeetingCode] = useState("");
  const { addToUserHistory } = useContext(AuthContext);

  let handleJoinVideoCall = async () => {
    await addToUserHistory(meetingCode);
    navigate(`/${meetingCode}`);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <div className="homePageContainer">
        {/* Navbar */}
        <div className="navBar">
          <div className="navBarBrand">
            <span style={{ fontSize: "1.3rem" }}>📹</span>
            <h2>Talkify</h2>
          </div>
          <div className="navBarActions">
            <IconButton
              onClick={() => navigate("/history")}
              sx={{ color: "rgba(232,234,237,0.7)" }}
            >
              <RestoreIcon />
            </IconButton>
            <Button
              variant="outlined"
              size="small"
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/auth");
              }}
              sx={{
                borderColor: "rgba(255,255,255,0.15)",
                color: "#e8eaed",
                "&:hover": { borderColor: "rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.04)" },
              }}
            >
              Logout
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="meetContainer">
          <div className="leftPanel">
            <h2>
              Providing Quality Video Call Just Like Quality{" "}
              <span>Education</span>
            </h2>
            <div className="joinGroup">
              <TextField
                onChange={(e) => setMeetingCode(e.target.value)}
                label="Meeting Code"
                variant="outlined"
                size="small"
                fullWidth
                sx={{ maxWidth: 300 }}
              />
              <Button
                variant="contained"
                onClick={handleJoinVideoCall}
                sx={{
                  px: 4,
                  py: 1.2,
                  background: "#4285f4",
                  "&:hover": { background: "#3b78e7" },
                  boxShadow: "0 4px 16px rgba(66,133,244,0.3)",
                }}
              >
                Join
              </Button>
            </div>
          </div>
          <div className="rightPanel">
            <img src="/logo3.png" alt="Meeting illustration" />
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default withAuth(HomeComponent);
