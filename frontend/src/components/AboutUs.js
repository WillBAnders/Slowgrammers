import React from 'react'
import { Card, Grid, CardHeader } from '@mui/material'
import AccessibilityIcon from '@mui/icons-material/Accessibility';
import ComputerIcon from '@mui/icons-material/Computer';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import '../styles/LandingPage.css'

const AboutUs = () => {
    return (
        <div>
            <Grid container spacing={3} 
            alignItems="center"
            justifyContent="center"
            style={{ minHeight: '100vh' }}>
                <Grid item xs={12} md={3} container justify="center">
                    <Card className="card-size">
                            <ComputerIcon justify="center"/>
                            <CardHeader
                                title={'Accessible'}
                                subheader={'TutorsVILLE has tutors that work online and can schedule around you!'}
                                className="card-title"
                            />
                            
                    </Card>
                </Grid>
                <Grid item xs={12} md={3} container justify="center">
                    <Card className="card-size">
                            <AccessibilityIcon />
                            <CardHeader
                                title={'Personalized'}
                                subheader={'TutorsVILLE has personalized tutoring, specific to your classes. Get help on any assignment!'}
                                className="card-title"
                            />  
                            
                    </Card>
                </Grid>
                <Grid item xs={12} md={3} container justify="center">
                    <Card className="card-size">
                        <SupportAgentIcon />
                        <CardHeader
                                title={'Quick Help'}
                                subheader={'TutorsVILLE has extremely fast support! Reach out at any time to get help.'}
                                className="card-title"
                            />
                            
                    </Card>
                </Grid>
            </Grid>
        </div>
    )
}

export default AboutUs
