import React from "react";
import Avatar from "@mui/material/Avatar";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import Utils from "../Utils";

const theme = createTheme();

export default function SignupPage({ setProfile }) {
  const navigate = useNavigate();
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [incorrectUsername, setIncorrectUsername] = React.useState(false);
  const [incorrectPassword, setIncorrectPassword] = React.useState(false);
  const [usernameTaken, setUsernameTaken] = React.useState(false);

  function onSubmit(event) {
    event.preventDefault();
    const u = /^[A-Za-z][A-Za-z0-9_\-.]{0,71}$/.test(username);
    const p = /^.{8,72}$/.test(password);
    if (u && p) {
      Utils.fetchJson("/signup", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      })
        .then((r) => {
          navigate("/");
          setProfile(undefined);
        })
        .catch((error) => {
          if (error.status === 401) {
            setUsernameTaken(true);
          } else {
            alert(`Error ${error.status ?? "(Unexpected)"}: ${error.message}`);
          }
        });
    } else {
      setIncorrectUsername(!u);
      setIncorrectPassword(!p);
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <Container
        component="main"
        maxWidth="xs"
        sx={{ pt: { xs: "30px", md: "40px" } }}
      >
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div>
            {usernameTaken && (
              <Alert severity="error" sx={{ mb: 1 }}>
                Username already exists.
              </Alert>
            )}
            {incorrectUsername && (
              <Alert severity="error" sx={{ mb: 1 }}>
                Username must start with a letter, can only contain alphanumeric
                characters and '_', '-', or '.', and cannot exceed 72
                characters.
              </Alert>
            )}
            {incorrectPassword && (
              <Alert severity="error">
                Password must contain 8-72 characters.
              </Alert>
            )}
          </div>
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={onSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  title="username"
                  required
                  fullWidth
                  label="Username"
                  autoComplete="username"
                  onChange={(e) => setUsername(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  title="password"
                  required
                  fullWidth
                  label="Password"
                  type="password"
                  autoComplete="new-password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Grid>
            </Grid>
            <Button
              title="submit"
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link
                  to="/signin"
                  style={{ textDecoration: "none", color: "blue" }}
                >
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
