import React from 'react'
import { Box, Typography, Grid, Button } from '@mui/material'
import Typewriter from 'typewriter-effect';
import '../styles/LandingPage.css'


//sx={{ flexDirection: { xs: "column", md: "row"}
const Home = () => {
    return (
        <div id="home" className="home-div">
            <Grid container spacing={1} >
                <Grid item xs={12} md={5} container justify="center" alignItems="center">
                    <Typography
                        className="main-text"
                        variant="h2"
                    >
                        Welcome aboard, begin
                            <div className="typew">
                            <Typewriter
                                skipAddStyles
                                options={{
                                    strings: [
                                    'Tutoring.', 
                                    'Learning.', 
                                    'Working.', 
                                    'Exploring.'],
                                    autoStart: true,
                                    loop: true,
                                }}
                            />
                            </div>
                            <Button variant="contained">
                                Get Started
                            </Button>
                    </Typography>
                </Grid>
                <Grid item xs={12} md={7} container justify="center" alignItems="left">
                    <img src="/images/Main.jpg"  className="main-img" alt="home"/>
                </Grid>
            </Grid>
        </div>
    )
}

export default Home
