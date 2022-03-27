import React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import {useNavigate} from "react-router";
import {Link} from "react-router-dom";

const theme = createTheme();

export default function SignupPage({setName}) {
  const navigate = useNavigate();
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  function onSubmit(event) {
    event.preventDefault();
    fetch("/signup", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({username, password}),
    })
      .then(r => r.json())
      .then(data => {
        setName(username);
        navigate("/");
      })
      .catch(error => {
        //TODO: error page
        console.error(error.message);
      });
  }

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs" sx={{pt: {xs: "30px", md: "40px"}}}>
        <CssBaseline/>
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{m: 1, bgcolor: "secondary.main"}}>
            <LockOutlinedIcon/>
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={onSubmit} sx={{mt: 3}}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  title="username"
                  required
                  fullWidth
                  label="Username"
                  autoComplete="username"
                  onChange={e => setUsername(e.target.value)}
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
                  onChange={e => setPassword(e.target.value)}
                />
              </Grid>
            </Grid>
            <Button
              title="submit"
              type="submit"
              fullWidth
              variant="contained"
              sx={{mt: 3, mb: 2}}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link to="/signin" style={{textDecoration: "none", color: "blue"}}>
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
