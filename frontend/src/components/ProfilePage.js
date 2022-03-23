import { React, useState, useEffect, Suspense } from "react";
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { ThreeDots } from 'react-loader-spinner';


const ProfilePage = (user) => {
    const [_user, setUser] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    useEffect(() => {
        if (user.user != null) {
            setUser(user)
            setFirstname(user.user.firstname)
            setLastname(user.user.lastname)
            setEmail(user.user.email)
            setPhone(user.user.phone)
        }
    }, [url]);
    console.log("info: ");
    console.log(info);
    const isTutorRating = ({tutorRating}) =>{
        if (tutorRating) return(
            <Rating 
                title="Rating"
                value = {info.tutor.rating}
                readOnly
            />
        );
        else return (
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
                No Rating Provided
            </Typography>
        );
    }
    if (isLoading) {
        return (
          <div  className="loadingContainer">
          <ThreeDots
          type="ThreeDots"
          color="#00b22d"
          height={100}
          width={100}
        />
        </div>
        )
      } else {
        let fullname = info.tutor.user.firstname + " " + info.tutor.user.lastname;
        return(
            <div>
                <Stack
                    title="Avatar_and_Name"
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
                        fullname
                    }
                    />
                <Typography 
                    sx={{
                        fontSize:{
                            md:75,
                            xs:30
                        }
                    }}
                >
                    {fullname ?? "Anonymous"}
                </Typography>
                </Stack>
                <Stack
                    title="Username_and_Rating"
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
                        {info.profile.username ?? "@NoUsername"}  
                    </Typography>
                    {isTutorRating(tutorRating)}
                </Stack>
                <Typography
                    title="Email_Address"
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
                    {info.tutor.user.email}
                </Typography>
                <Typography
                    className="main-text"
                    align="center"
                    justifyContent="center"
                    sx={{
                        fontWeight: 525,
                        paddingTop: {
                            xs: "30px",
                            md: "0px"
                        }
                    }}
                    variant="h2"
                >
                    Edit Profile
            </Typography>
                <Box
                    alignItems="center"
                    justifyContent="center"
                    display="flex"
                    width="100%"
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
                        {info.tutor.bio ?? ""}
                    </Typography>    
                </Box>
            </div>
        )
    }
}

export default ProfilePage
