import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import HomeIcon from "@mui/icons-material/Home";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#4285f4" },
    background: { default: "#1a1c22", paper: "#23262f" },
  },
  typography: { fontFamily: "'Inter', 'Google Sans', system-ui, sans-serif" },
  shape: { borderRadius: 12 },
});

export default function History() {
  const { getHistoryOfUser } = useContext(AuthContext);
  const [meetings, setMeetings] = useState([]);
  const routeTo = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const history = await getHistoryOfUser();
        setMeetings(history);
      } catch {}
    };
    fetchHistory();
  }, []);

  let formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #1a1c22 0%, #1e2530 50%, #181c26 100%)",
          color: "#e8eaed",
          p: 3,
        }}
      >
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
          <IconButton
            onClick={() => routeTo("/home")}
            sx={{ color: "#e8eaed" }}
          >
            <HomeIcon />
          </IconButton>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Meeting History
          </Typography>
        </Box>

        {/* Cards */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
            },
            gap: 2,
            maxWidth: 900,
            mx: "auto",
          }}
        >
          {meetings.length !== 0 ? (
            meetings.map((e, i) => (
              <Card
                key={i}
                sx={{
                  background: "rgba(255,255,255,0.04)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 3,
                }}
              >
                <CardContent>
                  <Typography
                    sx={{ fontWeight: 600, color: "#4285f4", mb: 0.5 }}
                  >
                    Code: {e.meetingCode}
                  </Typography>
                  <Typography
                    sx={{ fontSize: "0.85rem", color: "rgba(232,234,237,0.5)" }}
                  >
                    Date: {formatDate(e.date)}
                  </Typography>
                </CardContent>
              </Card>
            ))
          ) : (
            <Typography
              sx={{
                gridColumn: "1 / -1",
                textAlign: "center",
                color: "rgba(232,234,237,0.3)",
                py: 6,
              }}
            >
              No meeting history yet
            </Typography>
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
}

