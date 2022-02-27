import React from 'react'
import { Avatar, TextField, Box, Paper, Stack, Button, CardHeader, Card, CardContent, Typography, Rating } from "@mui/material";
import {blue} from '@mui/material/colors'
import sans from "../styles/sans.png"
import { useParams } from "react-router-dom";
import axios from 'axios';
import {ThreeDots} from 'react-loader-spinner';

const ProfilePage = () => {
    //Typography variant doesn't work with responsive design, so I have to go with font sizes
    let params = useParams();
    console.log(params.username);
    const username= params.username;
    let url = '/tutors/' + username;
    /*const [info, setInfo] = React.useState(() => {
        axios.get(url)
            .then(data => setInfo(data.data));
    });*/
    const [info, setInfo] = React.useState();
    const [isLoading, setLoading] = React.useState(true);
    React.useEffect(() => {
        async function fetchInfo() {
            await fetch(url, {}).then(r => r.json())
            .then(data => setInfo(data));
            setLoading(false);
        }
        try{
            fetchInfo();
        }
        catch(e){
            console.log(e);
        }
    }, [url]);
    console.log("info: ");
    console.log(info);
    //console.log(info.tutor);
    if (isLoading) {
        return (
          <div  className="loadingContainer">
          <ThreeDots
          type="ThreeDots"
          color="#00b22d"
          height={100}
          width={100}
           //3 secs
        />
        </div>
        )
      } else {
    return(
        <div>
            <Stack
                direction="row"
                spacing={{xs:2, md: 3}}
                sx={{
                    ml: {
                        md: '200px'
                    }
                }}
            >
            <Avatar 
                sx={{
                    mt: {md: '5px'},
                    bgcolor: blue[500],
                    width: {xs: 50, md: 100},
                    height: {xs: 50, md: 100}
                }}
                alt= {
                    "Sans Undertale"
                }
                src={sans} />
            <Typography 
                sx={{
                    fontSize:{
                        md:75,
                        xs:30
                    }
                }}
            >
                First Name, Last Name
            </Typography>
            </Stack>
            <Stack
                direction="row"
                spacing={{xs:15, md: 80}}
            >
                <Typography
                    sx={{
                        ml:{
                            xs: 8,
                            md: 40
                        },
                        fontSize:{
                            md:40,
                            xs:20
                        }
                    }}
                    color="gray"
                >
                    @{info.tutor.username}
                    
                </Typography>
                {<Rating 
                    name="read-only" 
                    value = {info.tutor.rating}
                    readOnly
                />}
            </Stack>
            <Typography
                sx={{
                    ml:{
                        xs: 8,
                        md: 41
                    },
                    fontSize:{
                        md:30,
                        xs:15
                    }
                }}
            >
                sans.undertale@ufl.edu
            </Typography>
            <Typography
                sx={{
                    ml:{
                        xs: 8,
                        md: 41
                    },
                    fontSize:{
                        md:30,
                        xs:15
                    }
                }}
            >
                229-655-4245
            </Typography>
            <Box
                sx={{
                    ml:{
                        xs: 8,
                        md: 41
                    },
                    width: {xs: 300, md: 700},
                    height: {xs: 150, md: 300},
                    backgroundColor: '#dfdfdf'
                }}
            >
                <Typography
                sx={{
                    fontSize:{
                        md:20,
                        xs:10
                    }
                }}
                style={{wordWrap: "break-word"}}
                >
                    Sample Bio
                </Typography>    
            </Box>
        </div>

    )}
}

export default ProfilePage