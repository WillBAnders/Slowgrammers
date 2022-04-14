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

const theme = createTheme();

export default function SignupPage() {
  const navigate = useNavigate();
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [incorrectUsername, setIncorrectUsername] = React.useState(false);
  const [incorrectPassword, setIncorrectPassword] = React.useState(false);
  const [usernameTaken, setUsernameTaken] = React.useState(false);

  function onSubmit(event) {
    event.preventDefault();

    //console.log(username + password)

    const usernameRegex = new RegExp("[a-zA-Z0-9_]{5,20}");
    const passwordRegex = new RegExp(
      "[a-zA-Z0-9-_\\!\\@\\#\\$\\%\\^&\\*\\.]{7,30}"
    );

    let u = usernameRegex.test(username);
    let p = passwordRegex.test(password);

    if (u === true && p === true) {
      fetch("/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password,
        }),
      }).then((res) => {
        if (res.status === 200) {
          navigate("/");
        } else if (res.status === 401) {
          setUsernameTaken(true);
          setIncorrectUsername(false);
          setIncorrectPassword(false);
        }
      });
    } else if (u === false && p === false) {
      setUsernameTaken(false);
      setIncorrectUsername(true);
      setIncorrectPassword(true);
    } else if (u === false) {
      setUsernameTaken(false);
      setIncorrectUsername(true);
      setIncorrectPassword(false);
    } else {
      setUsernameTaken(false);
      setIncorrectUsername(false);
      setIncorrectPassword(true);
    }
    //console.log(res)
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
            {usernameTaken ? (
              <Alert severity="error" sx={{ mb: 1 }}>
                Username already taken!
              </Alert>
            ) : (
              <div />
            )}
            {incorrectUsername ? (
              <Alert severity="error" sx={{ mb: 1 }}>
                Username should contain 5-20 alphanumeric or _ characters.
              </Alert>
            ) : (
              <div />
            )}
            {incorrectPassword ? (
              <Alert severity="error">
                Password should contain 7-30 alphanumeric or -_!@#$%^&*.
                characters.
              </Alert>
            ) : (
              <div />
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
