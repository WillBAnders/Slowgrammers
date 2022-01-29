import React from 'react'
import { Typography, Grid, Button } from '@mui/material'
import '../styles/LandingPage.css'

export default function Join() {
    return (
        <div id="home" className="home-div">
            <Grid 
            container 
            spacing={1} 
            alignItems="center"
            justifyContent="center"
            style={{ minHeight: '100vh' }}>
                <Grid item xs={12} md={7} container justify="center" alignItems="left">
                    <img src="/images/join.png"  height="435px" width="695px" className="main-img" alt="join"/>
                </Grid>
                <Grid item xs={12} md={5} container justify="center" alignItems="center">
                    <Typography
                        className="main-text"
                        variant="h2"
                    >
                        Join TutsVILLE today! <br/>
                            <Button variant="contained">
                                Sign Up
                            </Button>
                    </Typography>
                </Grid>
            </Grid>
        </div>
    )
}
