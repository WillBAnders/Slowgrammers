import React from 'react'
import { Button, Stack, CardHeader, CardContent, Rating, Card, Typography, Grid, TextField, Paper, Box } from '@mui/material'
import { useParams, Link } from "react-router-dom";


export default function ErrorPage(){
    return(
        <Stack>
            <Typography 
                color={"#ff0000"}
                variant="h1"
            >
                ERROR 404! PAGE NOT FOUND!
            </Typography>
            <Link to="/" style={{ textDecoration: 'none', color: "blue" }}>
                <Button
                    variant="contained"
                    size="large"
                    color="error"
                    sx={{
                        ml: {
                            xs:"100px",
                            sm:"260px",
                            md: "560px",
                        }
                    }}>
                    Return to Home Page
                </Button>  
            </Link>
        </Stack>
    );
}