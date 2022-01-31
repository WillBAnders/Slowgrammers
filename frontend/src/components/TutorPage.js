import React from 'react'
import { Stack, CardHeader, CardContent, Rating, Card, Typography, Grid, TextField, Paper, Box } from '@mui/material'
import tutorsList from '../tests/Tutors'

const TutorPage = () => {
    function writeOutTutors(tutors, filter){
        if (filter === undefined) {
            filter = "";
        }
        let tutorList = [];
        for (let i = 0; i < tutors.length; i++){
                let title = tutors.at(i).firstName + " " + tutors.at(i).lastName;
                let courses = tutors.at(i).classCode;
                let coursesuppercased = courses.map(courses => courses.toUpperCase());
                let avail = tutors.at(i).availability;
                let availuppercased = avail.map(avail => avail.toUpperCase());
                if (title.toUpperCase().includes(filter.toUpperCase()) || coursesuppercased.find(element => element.includes(filter.toUpperCase())) || availuppercased.find(element => element.includes(filter.toUpperCase()))) tutorList.push(
                <Card key={tutors.at(i).id} >
                    <CardHeader 
                        title={title}
                        subheader={<Rating name="read-only" precision={0.1} size="small" value={tutors.at(i).rating} readOnly />}
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

export default TutorPage
