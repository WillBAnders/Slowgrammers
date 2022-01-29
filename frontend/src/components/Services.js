import React from 'react'
import { Card, Grid, CardHeader, CardContent, CardMedia, Button, Typography, Box } from '@mui/material'
import '../styles/LandingPage.css'


const Services = () => {
    return (
        <div>
            <Grid 
                container 
                spacing={2} 
                alignItems="center"
                justifyContent="center"
                style={{ minHeight: '100vh' }}
                >
                <Grid item xs={12} md={5} container justify="center">
                    <Card className="card-size">
                            <CardMedia
                                component="img"
                                className="service-photo"
                                src="/images/tutors.png"
                                title="Tutors"
                                sx={{maxHeight: '308px'}}
                            />
                            <CardHeader
                                title={'Tutors'}
                                className="card-title"
                            />
                            <CardContent >
                                <Typography>
                                    TutorsVILLE has many tutors which specialize in certain subjects and can help you!
                                </Typography>
                            </CardContent>
                            <Box className="button-size">
                                <Button variant="contained">
                                    See Tutors
                                </Button>
                            </Box>
                    </Card>
                </Grid>
                <Grid item xs={12} md={5} container justify="center">
                    <Card className="card-size">
                            <CardMedia
                                component="img"
                                className="service-photo"
                                src="/images/courses.jpg"
                                title="Tutors"
                                sx={{maxHeight: '308px'}}
                            />
                            <CardHeader
                                title={'Courses'}
                                className="card-title"
                            />  
                            <CardContent>
                                <Typography>
                                TutorsVILLE has course selection so you can get help tailored exactly to what you need!
                                </Typography>
                            </CardContent>
                            <Box className="button-size">
                                <Button variant="contained">
                                    See Courses
                                </Button>
                            </Box>
                    </Card>
                </Grid>
            </Grid>
        </div>
    )
}

export default Services
