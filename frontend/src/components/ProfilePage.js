import { React, useState, useEffect, Suspense } from "react";
import { Navigate } from 'react-router';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { ThreeDots } from 'react-loader-spinner';


const ProfilePage = (user) => {
    const [_user, setUser] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    useEffect(() => {
        if (user.user != null) {
            setUser(user)
            setFirstname(user.user.firstname)
            setLastname(user.user.lastname)
            setEmail(user.user.email)
            setPhone(user.user.phone)
        }
    }, [user, _user])

    const handleSubmit = async (event) => {
        event.preventDefault();

        fetch('/profile', {
            method: 'PATCH',
            body: JSON.stringify({
                firstname: firstname,
                lastname: lastname,
                email: email,
                phone: phone
            }),
            headers: {
                'Content-type': 'application/json',
            },
            credentials: 'include',
        })
            .then((response) => response.json())
            .then((json) => console.log(json));
    };

    const loading = (() => {
        return (<div className="loadingContainer">
            <ThreeDots
                type="ThreeDots"
                color="#00b22d"
                height={100}
                width={100}
            />
        </div>)
    })

    if (_user === '') {
        return (loading())
    } 
    else {
        return (
            <div>
                <Typography
                    className="main-text"
                    align="center"
                    justifyContent="center"
                    sx={{
                        fontWeight: 525,
                        paddingTop: {
                            xs: "30px",
                            md: "0px"
                        }
                    }}
                    variant="h2"
                >
                    Edit Profile
            </Typography>
                <Box
                    alignItems="center"
                    justifyContent="center"
                    display="flex"
                    width="100%"
                >
                    <Suspense fallback={loading()}>
                        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
                            <Grid container >
                                <Grid item xs={5}>
                                    <TextField
                                        fullWidth
                                        required
                                        title="firstname"
                                        id="firstname"
                                        label="First Name"
                                        defaultValue={_user.user == null ? 'firstname' : _user.user.firstname}
                                        onChange={(e) => { setFirstname(e.target.value) }}
                                        sx={{ m: 1 }}
                                    />
                                    <TextField
                                        fullWidth
                                        required
                                        title="email"
                                        id="email"
                                        label="Email"
                                        defaultValue={_user.user == null ? 'email' : _user.user.email}
                                        onChange={(e) => { setEmail(e.target.value) }}
                                        sx={{ m: 1 }}
                                    />
                                </Grid>
                                <Grid item xs={5}>
                                    <TextField
                                        fullWidth
                                        required
                                        title="lastname"
                                        id="lastname"
                                        label="Last Name"
                                        defaultValue={_user.user == null ? 'lastname' : _user.user.lastname}
                                        onChange={(e) => { setLastname(e.target.value) }}
                                        sx={{ m: 1, pl: 1 }}
                                    />

                                    <TextField
                                        required
                                        fullWidth
                                        title="phone"
                                        id="phone"
                                        label="Phone Number"
                                        defaultValue={_user.user == null ? 'phone' : _user.user.phone}
                                        onChange={(e) => { setPhone(e.target.value) }}
                                        sx={{ m: 1, pl: 1 }}
                                    />
                                </Grid>
                            </Grid>
                            <Button
                                type="submit"
                                title="submit"
                                variant="contained"
                            >
                                Update
                  </Button>
                        </Box>
                    </Suspense>
                </Box>
            </div>
        )
    }
}

export default ProfilePage
