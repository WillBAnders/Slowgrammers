import React from 'react'
import { Stack, CardHeader, CardContent, Rating, Card, Typography, Grid, TextField, Paper, Box } from '@mui/material'
import tutorsList from '../tests/Tutors'

const TutorPage = () => {
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
                    <TextField fullWidth id="tutor-search" label="Search Here" variant="outlined" />
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
                    {tutorsList.map((tutor) =>{
                        return(
                            <Card key={tutor.id} >
                                <CardHeader 
                                    title={`${tutor.firstName} ${tutor.lastName}`}
                                    subheader={<Rating name="read-only" precision={0.1} size="small" value={tutor.rating} readOnly />}
                                />
                                <CardContent>
                                    <Typography
                                        component="div"
                                        sx={{marginBottom: "10px"}}
                                    >
                                        Classes:
                                        {writeOutClasses(tutor.classCode)}
                                    </Typography>
                                    <Typography 
                                        sx={{marginBottom: "10px"}}
                                        component="div"
                                    >
                                        Availability:
                                        {writeOutAvailability(tutor.availability)}
                                    </Typography>
                                </CardContent>
                            </Card>
                        )
                    })}
                </Stack>
            </Grid>
        </div>
    )
}

export default TutorPage
