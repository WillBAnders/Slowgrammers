import React from 'react'
import { Card, Grid, CardHeader, Typography } from '@mui/material'
import AccessibilityIcon from '@mui/icons-material/Accessibility';
import ComputerIcon from '@mui/icons-material/Computer';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import '../styles/LandingPage.css'
import { Box } from '@mui/system';

const AboutUs = () => {
    return (
        <div id="aboutus">
            <Typography
                className="main-text"
                sx={{ 
                    fontWeight: 525,
                    paddingLeft: {
                        xs: "0px",
                        md: "30px"
                    },
                    paddingTop: {
                        xs: "30px",
                        md: "0px"
                    }
                 }}
                variant="h2"
            >
                About Us    
            </Typography>
            <Grid container spacing={3} 
            alignItems="center"
            justifyContent="center"
            style={{ minHeight: '95vh' }}>
                <Grid item xs={12} md={3} container justify="center">
                    <Card className="card-size">
                        <Box sx={{display:"flex",
                                 justifyContent:"center",
                                 p:{
                                     xs: "10px"
                                 }
                                }}>
                            <ComputerIcon justify="center"/>
                        </Box>
                            <CardHeader
                                title={'Accessible'}
                                subheader={'TutorsVILLE has a community of tutors that can work online and have varying schedules! Or you can become a tutor yourself!'}
                                className="card-title"
                            />
                            
                    </Card>
                </Grid>
                <Grid item xs={12} md={3} container justify="center">
                    <Card className="card-size">
                        <Box sx={{display:"flex",
                                 justifyContent:"center",
                                 p:{
                                     xs: "10px"
                                 }
                                }}>
                            <AccessibilityIcon />
                        </Box>
                        <CardHeader
                            title={'Personalized'}
                            subheader={'TutorsVILLE has personalized tutoring, specific to your classes. Get help on any assignment, or join to help tutor in your strongsuit!'}
                            className="card-title"
                        />  
                            
                    </Card>
                </Grid>
                <Grid item xs={12} md={3} container justify="center">
                    <Card className="card-size">
                        <Box sx={{display:"flex",
                                 justifyContent:"center",
                                 p:{
                                     xs: "10px"
                                 }
                                }}>
                            <SupportAgentIcon />
                        </Box>
                        <CardHeader
                                title={'Quick Help'}
                                subheader={'TutorsVILLE has extremely fast support! Reach out to get help on any problem you encounter.'}
                                className="card-title"
                            />
                            
                    </Card>
                </Grid>
            </Grid>
        </div>
    )
}

export default AboutUs
