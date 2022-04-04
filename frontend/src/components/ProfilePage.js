import React from 'react';
import { useState, useEffect, Suspense } from 'react';
import { Navigate } from 'react-router';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { ThreeDots } from 'react-loader-spinner';
import Autocomplete from '@mui/material/Autocomplete';


const ProfilePage = (user) => {
    const [_user, setUser] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [day, setDay] = React.useState('');
    const [startTime, setStartTime] = React.useState('');
    const [endTime, setEndTime] = React.useState('');
    const [myAvailability, setMyAvailability] = React.useState([]);

    useEffect(() => {
        if (user.user != null) {
            setUser(user)
            setFirstname(user.user.firstname)
            setLastname(user.user.lastname)
            setEmail(user.user.email)
            setPhone(user.user.phone)
        }
    }, [user, _user])

    const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ]

    const times = [
        "12:00 AM",
        "12:15 AM",
        "12:30 AM",
        "12:45 AM",
        "1:00 AM",
        "1:15 AM",
        "1:30 AM",
        "1:45 AM",
        "2:00 AM",
        "2:15 AM",
        "2:30 AM",
        "2:45 AM",
        "3:00 AM",
        "3:15 AM",
        "3:30 AM",
        "3:45 AM",
        "4:00 AM",
        "4:15 AM",
        "4:30 AM",
        "4:45 AM", 
        "5:00 AM",
        "5:15 AM",
        "5:30 AM",
        "5:45 AM",
        "6:00 AM",
        "6:15 AM",
        "6:30 AM",
        "6:45 AM",
        "7:00 AM",
        "7:15 AM",
        "7:30 AM",
        "7:45 AM",
        "8:00 AM",
        "8:15 AM",
        "8:30 AM",
        "8:45 AM",
        "9:00 AM",
        "9:15 AM",
        "9:30 AM",
        "9:45 AM",
        "10:00 AM",
        "10:15 AM",
        "10:30 AM",
        "10:45 AM",
        "11:00 AM",
        "11:15 AM",
        "11:30 AM",
        "11:45 AM",
        "12:00 PM",
        "12:15 PM",
        "12:30 PM",
        "12:45 PM",
        "1:00 PM",
        "1:15 PM",
        "1:30 PM",
        "1:45 PM",
        "2:00 PM",
        "2:15 PM",
        "2:30 PM",
        "2:45 PM",
        "3:00 PM",
        "3:15 PM",
        "3:30 PM",
        "3:45 PM",
        "4:00 PM",
        "4:15 PM",
        "4:30 PM",
        "4:45 PM", 
        "5:00 PM",
        "5:15 PM",
        "5:30 PM",
        "5:45 PM",
        "6:00 PM",
        "6:15 PM",
        "6:30 PM",
        "6:45 PM",
        "7:00 PM",
        "7:15 PM",
        "7:30 PM",
        "7:45 PM",
        "8:00 PM",
        "8:15 PM",
        "8:30 PM",
        "8:45 PM",
        "9:00 PM",
        "9:15 PM",
        "9:30 PM",
        "9:45 PM",
        "10:00 PM",
        "10:15 PM",
        "10:30 PM",
        "10:45 PM",
        "11:00 PM",
        "11:15 PM",
        "11:30 PM",
        "11:45 PM",
    ]

    const addTime = () => {
        console.log(day + ", " + startTime + "-" + endTime);
        if (startTime < endTime){
            console.log("Valid time");
            myAvailability.push(Object.freeze({day: day, startTime: startTime, endTime: endTime}));
        }
        console.log(myAvailability);
    }

    const removeTime = (index) => {
        myAvailability.splice(index, 1);
    }

    function showAvailability(availabil){
        console.log(availabil.length);
        let availcards = [];
        if (availabil.length != 0){
            for (let i = 0; i < availabil.length; i++){
                console.log(availabil[i]);
            }
            availabil.forEach (avail =>
                availcards.push(
                    <Stack direction="row">
                        <Card>
                            <CardContent>
                                {avail.day} from {avail.startTime} to {avail.endTime}
                            </CardContent>
                        </Card>
                        <Button 
                            aria-label='DeleteIcon' 
                            variant="contained" 
                            color="error"
                            title="removebutton"
                            onClick={removeTime(myAvailability.indexOf(avail))}>
                            <DeleteIcon />
                        </Button>
                    </Stack>
                )
            );
            return availcards;
        }
        else{
            return(
                <div>
                    No availability given
                </div>
            )
        }
    }

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
                <Box
                    display="flex" 
                    alignItems="center"
                    justifyContent="center" 
                    sx={{mt: 2}}
                >
                    <Stack direction="row">
                        <Autocomplete
                            disablePortal
                            id="DaySelector"
                            value={day}
                            onChange={(event, newValue) => {
                                setDay(newValue);
                            }}
                            options={days}
                            sx={{ width: {xs: 100, md: 300} }}
                            renderInput={(params) => <TextField {...params} label="Day" />}
                        />
                        <Autocomplete
                            disablePortal
                            id="StartTimeSelector"
                            options={times}
                            value={startTime}
                            onChange={(event, newValue) => {setStartTime(newValue)}}
                            sx={{ width: {xs: 100, md: 300} }}
                            renderInput={(params) => <TextField {...params} label="Start Time" />}
                        />
                        <Autocomplete
                            disablePortal
                            id="EndTimeSelector"
                            value={endTime}
                            onChange={(event, newValue) => {setEndTime(newValue)}}
                            options={times}
                            sx={{ width: {xs: 100, md: 300} }}
                            renderInput={(params) => <TextField {...params} label="End Time" />}
                        />
                        <Button 
                            aria-label='AddIcon' 
                            variant="contained" 
                            color="success"
                            title="addbutton"
                            onClick={addTime}>
                            <AddIcon />
                        </Button>
                    </Stack>
                </Box>
                <Box
                    display="flex" 
                    alignItems="center"
                    justifyContent="center" 
                    sx={{mt: 2}}
                >
                    {showAvailability(myAvailability)}
                </Box>
            </div>
        )
    }
}

export default ProfilePage
