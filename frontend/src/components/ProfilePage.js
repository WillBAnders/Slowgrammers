import React from 'react';
import { useState } from 'react';
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


export default function ProfilePage(user) {
    const [updated, setUpdated] = React.useState({});
    const [day, setDay] = React.useState('');
    const [startTime, setStartTime] = React.useState('');
    const [endTime, setEndTime] = React.useState('');
    const [availability, setAvailability] = React.useState([]);

    function onSubmit(event) {
        event.preventDefault();
        fetch("/profile", {
          method: "PATCH",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify(updated),
        })
          .then((r) => r.json())
          .then((_data) => {})
          .catch((error) => {
            //TODO: error page
            console.error(error.message);
          });
      }

    const checkTimeValidity = () => {
        const start = times.indexOf(startTime);
        const end = times.indexOf(endTime);
        return availability
            .filter(a => day === a.day)
            .every(a => start > times.indexOf(a.endTime) || end < times.indexOf(a.startTime));
    }

    const addTime = (event) => {
        event.preventDefault();
        if (!day || !startTime || !endTime) {
            alert("Incomplete time inputed");
            return;
        }
        const stIndex = times.indexOf(startTime);
        const etIndex = times.indexOf(endTime);
        if (etIndex <= stIndex || availability.some(a => day === a.day && stIndex < times.indexOf(a.endTime) && etIndex > times.indexOf(a.startTime))) {
            alert("Invalid time inputed");
            return;
        }
        const index = availability.findIndex(a =>
            day === a.day &&
            (stIndex === times.indexOf(a.endTime) || etIndex === times.indexOf(a.startTime))
        );
        const temp = [...availability];
        if (index !== -1) {
            if (index + 1 < temp.length && temp[index + 1].day === day && times.indexOf(temp[index + 1].startTime) === etIndex) {
                temp.splice(index, 2, {
                    day,
                    startTime: times[Math.min(stIndex, times.indexOf(temp[index].startTime))],
                    endTime: times[Math.max(etIndex, times.indexOf(temp[index + 1].endTime))],
                });
            } else {
                temp[index] = {
                    day,
                    startTime: times[Math.min(stIndex, times.indexOf(availability[index].startTime))],
                    endTime: times[Math.max(etIndex, times.indexOf(availability[index].endTime))]
                };
            }
        } else {
            temp.push({day, startTime, endTime});
            temp.sort((a, b) => {
                return a.day === b.day
                    ? times.indexOf(a.startTime) - times.indexOf(b.startTime)
                    : days.indexOf(a.day) - days.indexOf(b.day)
            });
        }
        setAvailability(temp);
        // [12am-3am, 7am-9am]
        // Case 1: [6am-8am] (good)
        // Case 2: [3am-7am] (not done)
        // Case 3: [7am-10am] (good)

        //const astIndex = times.indexOf(availability[index].startTime);
        //const aetIndex = times.indexOf(availability[index].endTime);
        /*
        if (sstIndex >= astIndex) {
            availability[index].endTime = endTime;
        } else if (etIndex <= aetIndex) {
            availability[index].startTime = startTime;
        } else {
            availability.splice()
        }
        */
    }

    const merge = () => {
        let stIndex = times.indexOf(startTime);
        let etIndex = times.indexOf(endTime);
        let st = startTime;
        let et = endTime;
        let mergecount = 0;
        for (let i = 0; i < availability.length; i++){
            if (day === availability[i].day){
                const avsIndex = times.indexOf(availability[i].startTime);
                const aveIndex = times.indexOf(availability[i].endTime);
                if(stIndex < avsIndex && etIndex < aveIndex){
                    console.log("Changing start");
                    availability[i].startTime = st;
                    et = availability[i].endTime;
                    if(mergecount > 0){
                        const temparray = [...availability]
                        temparray.splice(i-1, 1)
                        setAvailability(temparray);
                    }
                    mergecount++;
                    stIndex = times.indexOf(st);
                    etIndex = times.indexOf(et);
                }
                else if (stIndex > avsIndex && etIndex > aveIndex){
                    console.log("Changing end");
                    availability[i].endTime = et;
                    st = availability[i].startTime;
                    if(mergecount > 0){
                        const temparray = [...availability]
                        temparray.splice(i, 1)
                        setAvailability(temparray);
                    }
                    mergecount++;
                    stIndex = times.indexOf(st);
                    etIndex = times.indexOf(et);
                }
                else if (stIndex <= avsIndex && etIndex >= aveIndex && !(stIndex === avsIndex && etIndex === aveIndex)){
                    availability[i].startTime = st;
                    availability[i].endTime = et;
                    st = availability[i].startTime;
                    et = availability[i].endTime;
                    if(mergecount > 0){
                        const temparray = [...availability]
                        temparray.splice(i, 1)
                        setAvailability(temparray);
                    }
                    mergecount++;
                    stIndex = times.indexOf(st);
                    etIndex = times.indexOf(et);
                }
            }
        }
        return mergecount > 0;
    }

    const addTimeOld = (event) => {
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
            setDay("");
            setStartTime("");
            setEndTime("");
        }
        else{
            if (!merge()){
                console.log("Invalid time");
                alert("Invalid time chosen"); 
            }
            else{
                setDay("");
                setStartTime("");
                setEndTime("");
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
        console.log("Availability", availabil);
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

    function update(field, value) {
        setUpdated((fields) => ({ ...fields, [field]: value }));
      }

      if (user === null) {
        return (
          <div className="loadingContainer">
            <ThreeDots type="ThreeDots" color="#00b22d" height={100} width={100} />
          </div>
        );
      } else {
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
                  md: "0px",
                },
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
              <Box component="form" noValidate onSubmit={onSubmit} sx={{ mt: 1 }}>
                <Grid container>
                  <Grid item xs={5}>
                    <TextField
                      fullWidth
                      required
                      title="firstname"
                      id="firstname"
                      label="First Name"
                      defaultValue={user.firstname ?? ""}
                      onChange={(e) => update("firstname", e.target.value)}
                      sx={{ m: 1 }}
                    />
                    <TextField
                      fullWidth
                      required
                      title="email"
                      id="email"
                      label="Email Address"
                      defaultValue={user.email ?? ""}
                      onChange={(e) => update("email", e.target.value)}
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
                      defaultValue={user.lastname ?? ""}
                      onChange={(e) => update("lastname", e.target.value)}
                      sx={{ m: 1, pl: 1 }}
                    />
    
                    <TextField
                      required
                      fullWidth
                      title="phone"
                      id="phone"
                      label="Phone Number"
                      defaultValue={user.phone ?? ""}
                      onChange={(e) => update("phone", e.target.value)}
                      sx={{ m: 1, pl: 1 }}
                    />
                  </Grid>
                </Grid>
                <TextField
                    required
                    fullWidth
                    title="bio"
                    id="bio"
                    label="Biography"
                    defaultValue={user.bio ?? ""}
                    onChange={(e) => update("bio", e.target.value)}
                    multiline
                    rows={5}
                    maxRows={8}
                    sx={{ m: 1, pl: 1 }}
                />
                <Button type="submit" title="submit" variant="contained">
                  Update
                </Button>
              </Box>
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