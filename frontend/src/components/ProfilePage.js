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
import {days, times} from '../styles/TableData'


const ProfilePage = (user) => {
    const [_user, setUser] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [day, setDay] = React.useState('');
    const [startTime, setStartTime] = React.useState('');
    const [endTime, setEndTime] = React.useState('');
    const [availability, setAvailability] = React.useState([]);

    useEffect(() => {
        if (user.user != null) {
            setUser(user)
            setFirstname(user.user.firstname)
            setLastname(user.user.lastname)
            setEmail(user.user.email)
            setPhone(user.user.phone)
        }
    }, [user, _user])

    const checkTimeValidity = () => {
        const start = times.indexOf(startTime);
        const end = times.indexOf(endTime);
        return availability
            .filter(a => day === a.day)
            .every(a => start > times.indexOf(a.endTime) || end < times.indexOf(a.startTime));
    }

    const merge = () => {
        const stIndex = times.indexOf(startTime);
        const etIndex = times.indexOf(endTime);
        for (let i = 0; i < availability.length; i++){
            if (day === availability[i].day){
                const avsIndex = times.indexOf(availability[i].startTime);
                const aveIndex = times.indexOf(availability[i].endTime);
                if(stIndex < avsIndex && etIndex < aveIndex){
                    availability[i].startTime = startTime;
                    console.log("Changing Start");
                    if (merge(startTime, availability[i].endTime)){ 
                        const temparray = [...availability]
                        temparray.splice(i, 1)
                        setAvailability(temparray); 
                    }
                    return true;
                }
                else if (stIndex > avsIndex && etIndex > aveIndex){
                    availability[i].endTime = endTime;
                    console.log("Changing End");
                    if (merge(availability[i].startTime, endTime)){ 
                        const temparray = [...availability]
                        temparray.splice(i+1, 1)
                        setAvailability(temparray); 
                    }
                    return true;
                }
                else if (stIndex < avsIndex && etIndex > aveIndex){
                    console.log("Changing Both");
                    availability[i].startTime = startTime;
                    availability[i].endTime = endTime;
                    if (merge(availability[i].startTime, availability[i].endTime)){ 
                        const temparray = [...availability]
                        temparray.splice(i, 1)
                        setAvailability(temparray); 
                    }
                    return true;
                }
            }
        }
        return false;
    }

    const addTime = (event) => {
        event.preventDefault();
        console.log(day + ", " + startTime + "-" + endTime);
        if (!day || ! startTime || !endTime){
            console.log("Invalid time");
                alert("Incomplete entry made"); 
        }
        else if (times.indexOf(startTime) < times.indexOf(endTime) && checkTimeValidity()){
            console.log("Valid time");
            const newday = {day: day, startTime: startTime, endTime: endTime};
            setAvailability((availability) => {
                return [...availability, newday].sort((a, b) => {
                    return a.day === b.day
                        ? times.indexOf(a.startTime) - times.indexOf(b.startTime)
                        : days.indexOf(a.day) - days.indexOf(b.day)
                })
            });
        }
        else{
            if (!merge()){
                console.log("Invalid time");
                alert("Invalid time chosen"); 
            }
        }
    }

    const removeTime = (event, index) => {
        event.preventDefault();
        const temparray = [...availability]
        temparray.splice(index, 1)
        setAvailability(temparray);
    }

    function showAvailability(availabil){
        let availcards = [];
        if (availabil.length != 0){
            for (let i = 0; i < availabil.length; i++){
                availcards.push(
                    <Stack 
                        direction="row"
                        key={i}
                        component="form"
                        onSubmit={e => removeTime(e, i)}
                    >
                        <Card >
                            <CardContent>
                                {availabil[i].day}: {availabil[i].startTime} - {availabil[i].endTime}
                            </CardContent>
                        </Card>
                        <Button 
                            aria-label='DeleteIcon' 
                            variant="contained" 
                            color="error"
                            type="submit"
                            title="removebutton"
                        >
                            <DeleteIcon />
                        </Button>
                    </Stack>
                );
            }
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
                    component="form"
                    onSubmit={addTime}
                    noValidate
                >
                    <Stack direction="row" >
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
                            type="submit"
                            aria-label='AddIcon' 
                            variant="contained" 
                            color="success"
                            title="addbutton"
                            >
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
                    <Stack>
                        {showAvailability(availability)}
                    </Stack>
                </Box>
            </div>
        )
    }
}

export default ProfilePage
