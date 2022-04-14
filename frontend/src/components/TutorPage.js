import React from 'react'
import { Avatar, TextField, Box, Paper, Stack, Button, CardHeader, Card, CardContent, Typography, Rating } from "@mui/material";
import { blue } from '@mui/material/colors'
import { useParams } from "react-router-dom";
import { ThreeDots } from 'react-loader-spinner';
import md5 from 'md5'

export default function TutorPage() {
  const params = useParams();
  const [data, setData] = React.useState({});
  const [isLoading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch(`/tutors/${params.username}`)
      .then((r) => r.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((error) => {
        //TODO: error page
        console.error(error.message);
      });
  }, []);

  if (isLoading) {
    return (
      <div className="loadingContainer">
        <ThreeDots
          type="ThreeDots"
          color="#00b22d"
          height={100}
          width={100}
        //3 secs
        />
      </div>
    );
  } else if (data.error !== undefined) {
    return (
      <Box
        mt={20}
        sx={{
          display: "flex",
          alignContent: "center",
          justifyContent: "center",
        }}
      >
        <Stack direction="column" justifyContent="center" alignItems="center">
          <Typography
            sx={{
              fontSize: {
                md: 60,
                xs: 30,
              },
            }}
          >
            Error:
          </Typography>
          <Typography
            sx={{
              fontSize: {
                md: 60,
                xs: 30,
              },
            }}
          >
            {data.error}
          </Typography>
        </Stack>
      </Box>
    );
  } else {
    return (
      <div>
        <Stack
          title="Avatar_and_Name"
          direction="row"
          spacing={{ xs: 2, md: 3 }}
          sx={{
            ml: {
              md: "200px",
            },
          }}
        >
          <div className="gravatar">
            <img
              src={'https://www.gravatar.com/avatar/' + md5(data.tutor.username)) + '?f=y&d=identicon'}
            />
          </div>
          <Typography
            sx={{
              fontSize: {
                md: 75,
                xs: 30,
              },
            }}
          >
            {data.tutor.firstname + " " + data.tutor.lastname}
          </Typography>
        </Stack>
        <Stack
          title="Username_and_Rating"
          direction="row"
          spacing={{ xs: 15, md: 80 }}
        >
          <Typography
            sx={{
              ml: {
                xs: 8,
                md: 40,
              },
              fontSize: {
                md: 40,
                xs: 20,
              },
            }}
            color="gray"
          >
            @{data.tutor.username}
          </Typography>
          {<Rating title="Rating" value={data.tutor.rating} readOnly />}
        </Stack>
        <Typography
          title="Email_Address"
          sx={{
            ml: {
              xs: 8,
              md: 41,
            },
            fontSize: {
              md: 30,
              xs: 15,
            },
          }}
        >
          {data.tutor.email}
        </Typography>
        <Typography
          title="Phone_Number"
          sx={{
            ml: {
              xs: 8,
              md: 41,
            },
            fontSize: {
              md: 30,
              xs: 15,
            },
          }}
        >
          {data.tutor.phone}
        </Typography>
        <Box
          title="Bio"
          sx={{
            ml: {
              xs: 8,
              md: 41,
            },
            width: { xs: 300, md: 700 },
            height: { xs: 150, md: 300 },
            backgroundColor: "#dfdfdf",
          }}
        >
          <Typography
            sx={{
              fontSize: {
                md: 20,
                xs: 10,
              },
            }}
            style={{ wordWrap: "break-word" }}
          >
            {data.tutor.bio}
          </Typography>
        </Box>
      </div>
    );
  }
}
