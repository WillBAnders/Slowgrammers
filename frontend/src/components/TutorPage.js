import React from 'react'
import { Stack, CardHeader, CardContent, Rating, Card, Typography, Grid, TextField, Paper, Box } from '@mui/material'
import tutorsList from '../tests/Tutors'

const TutorPage = () => {
    const [tutors, setTutors] = React.useState([]);
    //Effect callbacks are synchronous to prevent race conditions. So we need to put the async function inside
    React.useEffect(() => {
        async function fetchTutors(){
            const data = await fetch("/tutors").then(r => r.json());
            setTutors(data.tutors);
        }
        fetchTutors();
    }, []);

    function getTutorInfo(tutorArray){
        //[
        // {
        //     "courses": [
        //         {
        //             "code": "cop-3502",
        //             "name": "Programming Fundamentals 1"
        //         }
        //     ],
        //     "tutor": {
        //         "username": "Alice"
        //     }
        // }
        //]
        var tutorsInfo = [];

        async function fetchTutorInfo(name){
            const data = await fetch(`/tutors/${name}`).then(r => r.json());
            tutorsInfo.push(data)
        }

        tutorArray.forEach(tutor => {
            fetchTutorInfo(tutor.username)
        });

        console.log(tutorsInfo)
        return tutorsInfo
    }

    function writeOutTutors(_tutors, filter){
        if (filter === undefined) {
            filter = "";
        }
        let tutorList = [];
        for (let i = 0; i < _tutors.length; i++){
                let title = _tutors.at(i).firstName + " " + _tutors.at(i).lastName;
                let courses = _tutors.at(i).classCode;
                let coursesuppercased = courses.map(courses => courses.toUpperCase());
                let avail = _tutors.at(i).availability;
                let availuppercased = avail.map(avail => avail.toUpperCase());
                if (title.toUpperCase().includes(filter.toUpperCase()) || coursesuppercased.find(element => element.includes(filter.toUpperCase())) || availuppercased.find(element => element.includes(filter.toUpperCase()))) tutorList.push(
                <Card key={_tutors.at(i).id} >
                    <CardHeader 
                        title={title}
                        subheader={<Rating name="read-only" precision={0.1} size="small" value={_tutors.at(i).rating} readOnly />}
                    />
                    <CardContent>
                        <Typography
                            component="div"
                            sx={{marginBottom: "10px"}}
                        >
                            Classes:
                            {writeOutClasses(courses)}
                        </Typography>
                        <Typography 
                            sx={{marginBottom: "10px"}}
                            component="div"
                        >
                            Availability:
                            {writeOutAvailability(avail)}
                        </Typography>
                    </CardContent>
                </Card>
            );
        }
        return tutorList;
    }
    function writeOutClasses(classes){
        return (
            <Grid
                container
                justifyContent="center"
                alignItems="center"
                spacing={0}
                sx={{width: "100%"}}
            >
                    {classes.map((singleClass) =>{
                        return(
                            <Card 
                                key={singleClass}
                                direction="row"
                                spacing={1}
                                sx={{
                                    padding: "5px",
                                    margin: "2px"
                                }}
                            >
                                {singleClass}
                            </Card>
                        )
                    })}
            </Grid>
        )
    }

    function writeOutAvailability(days){
        return (
            <Grid
                container
                justifyContent="center"
                alignItems="center"
                spacing={0}
                sx={{width: "100%"}}
            >
                {days.map((day) =>{
                    return(
                        <Card 
                            key={day}
                            direction="row"
                            spacing={1}
                            sx={{
                                padding: "5px",
                                margin: "2px"
                            }}
                        >
                            {day}
                        </Card>
                    )
                })}
            </Grid>
        )
    }
    const [value, setValue] = React.useState("");
    const handleChange = e => {
        setValue(e.target.value);
    };
    return (
        <div>
            <Box sx={{display:"flex", justifyContent:"center"}}>
                <Typography
                    className="main-text"
                    variant="h2"
                    justifyContent="center"
                    sx={{
                        marginTop: "10px"
                    }}
                >
                    Tutors
                </Typography>
            </Box>
            <Box 
                display="flex" 
                width="100%"
                alignItems="center"
                justifyContent="center"
            >
                <Paper
                    elevation={0}
                    sx={{
                        width: "400px",
                        margin: "10px",
                        maxWidth: "750px"
                    }}
                >
                    <TextField 
                        value={value}
                        fullWidth 
                        id="tutor-search" 
                        label="Search Here" 
                        variant="outlined"
                        onChange={handleChange} 
                        />
                </Paper>
            </Box>

            <Grid 
                container 
                spacing={0} 
                alignItems="center"
                justifyContent="center"
                direction="column"
                style={{ minHeight: '100vh', width: "100%"}}
            >
                <Stack
                    direction="column"
                    justifyContent="center"
                    alignItems="stretch"
                    spacing={1}
                    sx={{ width: "80%"}}
                >
                    {writeOutTutors(tutorsList, value)}
                </Stack>
            </Grid>
        </div>
    )
}

// {writeOutTutors(getTutorInfo(tutors), value)}

export default TutorPage
