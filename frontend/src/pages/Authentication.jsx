import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { AuthContext } from "../context/authContext";
import Snackbar from "@mui/material/Snackbar";
import { Link } from "react-router-dom";

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
          borderRadius: 12,
          textTransform: "none",
          fontWeight: 600,
          fontSize: "0.95rem",
          padding: "12px 0",
        },
      },
    },
  },
});

export default function Authentication() {
  const [username, setUserName] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [name, setName] = React.useState("");
  const [formState, setFormState] = React.useState(0);
  const [error, setError] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const { handleRegister, handleLogin } = React.useContext(AuthContext);

  let handleAuth = async () => {
    try {
      if (formState == 0) {
        let result = await handleLogin(username, password);
        setMessage(result);
        setOpen(true);
      }
      if (formState == 1) {
        let result = await handleRegister(name, username, password);
        setMessage(result);
        setOpen(true);
      }
    } catch (e) {
      let msg = e?.response?.data?.message || e.message || "Server error";
      setError(msg);
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #1a1c22 0%, #1e2530 50%, #181c26 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 2,
          py: 4,
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 380 }}>
          {/* Logo */}
          <Link
            to="/"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              textDecoration: "none",
              marginBottom: 24,
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                bgcolor: "#4285f4",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.2rem",
              }}
            >
              📹
            </Box>
            <Box
              component="span"
              sx={{ fontSize: "1.6rem", fontWeight: 700, color: "#e8eaed" }}
            >
              Talkify
            </Box>
          </Link>

          {/* Card */}
          <Box
            sx={{
              background: "rgba(255,255,255,0.04)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 4,
              p: { xs: 3, sm: 4 },
              boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
            }}
          >
            <Box sx={{ textAlign: "center", mb: 3 }}>
              <Box
                component="h2"
                sx={{ fontSize: "1.3rem", fontWeight: 600, color: "#e8eaed", mb: 0.5 }}
              >
                {formState === 0 ? "Welcome Back" : "Create Account"}
              </Box>
              <Box
                component="p"
                sx={{ fontSize: "0.85rem", color: "rgba(232,234,237,0.5)" }}
              >
                {formState === 0 ? "Sign in to continue" : "Join Talkify today"}
              </Box>
            </Box>

            {/* Toggle */}
            <Box
              sx={{
                display: "flex",
                borderRadius: 3,
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.08)",
                mb: 3,
              }}
            >
              {["Sign In", "Sign Up"].map((label, idx) => (
                <Box
                  key={label}
                  onClick={() => {
                    setFormState(idx);
                    setError("");
                  }}
                  sx={{
                    flex: 1,
                    py: 1.2,
                    textAlign: "center",
                    cursor: "pointer",
                    fontSize: "0.85rem",
                    fontWeight: 500,
                    transition: "all 0.2s",
                    color: formState === idx ? "#fff" : "rgba(232,234,237,0.5)",
                    background:
                      formState === idx
                        ? "#4285f4"
                        : "transparent",
                  }}
                >
                  {label}
                </Box>
              ))}
            </Box>

            {/* Form */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {formState === 1 && (
                <TextField
                  fullWidth
                  label="Full Name"
                  variant="outlined"
                  size="small"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              )}

              <TextField
                fullWidth
                label="Username"
                variant="outlined"
                size="small"
                value={username}
                onChange={(e) => setUserName(e.target.value)}
              />

              <TextField
                fullWidth
                label="Password"
                type="password"
                variant="outlined"
                size="small"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              {error && (
                <Box
                  sx={{
                    fontSize: "0.8rem",
                    color: "#ea4335",
                    textAlign: "center",
                    py: 0.5,
                  }}
                >
                  {error}
                </Box>
              )}

              <Button
                variant="contained"
                fullWidth
                onClick={handleAuth}
                sx={{
                  mt: 1,
                  background: "#4285f4",
                  "&:hover": { background: "#3b78e7" },
                  boxShadow: "0 4px 16px rgba(66,133,244,0.3)",
                }}
              >
                {formState === 0 ? "Sign In" : "Sign Up"}
              </Button>
            </Box>
          </Box>

          <Snackbar
            open={open}
            autoHideDuration={4000}
            onClose={() => setOpen(false)}
            message={message}
          />
        </Box>
      </Box>
    </ThemeProvider>
  );
}
