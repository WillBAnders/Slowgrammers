import * as React from 'react';
import { useState } from 'react'
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Link, Navigate } from 'react-router-dom'

const theme = createTheme();

export default function SigninPage({ setName }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [navigate, setNavigate] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    console.log(username + password)

    const res = await fetch('/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        username,
        password
      })
    });

    setNavigate(true);
    //const content = await res.json();  

    if (res.status === 200) {
      console.log(res)
      setName(username)
    }
  };

  if (navigate) {
    return <Navigate to="/" />;
  }
  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: 'url(/images/signin.png)',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '60%',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square sx={{ pt: { xs: "30px", md: "40px" } }}>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                title="username"
                margin="normal"
                required
                fullWidth
                label="Username"
                autoComplete="username"
                autoFocus
                onChange={(e) => { setUsername(e.target.value) }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Password"
                type="password"
                autoComplete="current-password"
                title="password"
                onChange={(e) => { setPassword(e.target.value) }}
              />
              <Button
                type="submit"
                title="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item>
                  <Link to="/SignUp" style={{ textDecoration: 'none', color: "blue" }}>
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
