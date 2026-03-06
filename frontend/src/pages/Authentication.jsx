import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { AuthContext } from "../context/authContext";
import Snackbar from "@mui/material/Snackbar";

const defaultTheme = createTheme();

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
        console.log(result);
        setMessage(result);
        setOpen(true);
      }
      if (formState == 1) {
        let result = await handleRegister(name, username, password);
        console.log(result);
        setMessage(result);
        setOpen(true);
      }
    } catch (e) {
      console.log("FULL ERROR 👉", e);
      // console.log("RESPONSE 👉", e?.response);
      // console.log("DATA 👉", e?.response?.data);

      let message = e?.response?.data?.message || e.message || "Server error";

      setError(message);
    }
  };
  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid
        container
        component="main"
        sx={{
          height: "100vh",
          background: "linear-gradient(135deg,#203360,#3f51b5)",
        }}
        alignItems="center"
        justifyContent="center"
      >
        <CssBaseline />
        <Grid
          item
          xs={11}
          sm={8}
          md={5}
          component={Paper}
          elevation={10}
          sx={{
            borderRadius: 3,
            backdropFilter: "blur(10px)",
          }}
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: 400,
              p: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>

            {/* Toggle Buttons */}
            <Box
              sx={{
                display: "flex",
                gap: 2,
                mb: 2,
              }}
            >
              <Button
                fullWidth
                sx={{
                  mt: 2,
                  borderRadius: 3,
                  height: 45,
                }}
                variant={formState === 0 ? "contained" : "outlined"}
                onClick={() => setFormState(0)}
              >
                Sign In
              </Button>

              <Button
                sx={{ width: 120 }}
                variant={formState === 1 ? "contained" : "outlined"}
                onClick={() => setFormState(1)}
              >
                Sign Up
              </Button>
            </Box>

            {/* Form */}
            <Box
              component="form"
              noValidate
              sx={{
                width: "100%",
                maxWidth: 400,
                p: { xs: 2, sm: 3 },
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {/* Reserved space to avoid layout jump */}
              <Box sx={{ minHeight: 80 }}>
                {formState === 1 ? (
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Full Name"
                    id="fullName"
                    name="name"
                    autoFocus
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                ) : (
                  " "
                )}
              </Box>

              <TextField
                margin="normal"
                required
                fullWidth
                label="Username"
                id="username"
                name="username"
                autoFocus
                value={username}
                onChange={(e) => setUserName(e.target.value)}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                label="Password"
                type="password"
                name="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              {error && (
                <Box
                  sx={{
                    color: "error.main",
                    fontSize: "0.9rem",
                    mt: 1,
                  }}
                >
                  {error}
                </Box>
              )}
              <Button
                fullWidth
                variant="contained"
                sx={{
                  mt: 2,
                  borderRadius: 3,
                  height: 45,
                  transition: "0.2s",
                  "&:hover": {
                    transform: "scale(1.03)",
                  },
                }}
                onClick={handleAuth}
              >
                {formState === 0 ? "Sign In" : "Sign Up"}
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>

      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={() => setOpen(false)}
        message={message}
      />
    </ThemeProvider>
  );
}
