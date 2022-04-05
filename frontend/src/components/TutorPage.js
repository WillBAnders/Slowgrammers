import React from "react";
import { Avatar, Box, Stack, Typography, Rating } from "@mui/material";
import { blue } from "@mui/material/colors";
import { useParams } from "react-router-dom";
import { ThreeDots } from "react-loader-spinner";

const TutorPage = ({ name }) => {
  //Typography variant doesn't work with responsive design, so I have to go with font sizes
  let params = useParams();
  let username = name ?? params.username;
  let url = "/tutors/" + username;
  const [info, setInfo] = React.useState();
  const [isLoading, setLoading] = React.useState(true);
  React.useEffect(() => {
    async function fetchInfo() {
      await fetch(url, {})
        .then((r) => r.json())
        .then((data) => setInfo(data));
      setLoading(false);
    }
    try {
      fetchInfo();
    } catch (e) {
      console.log(e);
    }
  }, [url]);
  console.log("info: ");
  console.log(info);
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
  } else {
    if (info.error) {
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
              Error 404
            </Typography>
            <Typography
              sx={{
                fontSize: {
                  md: 60,
                  xs: 30,
                },
              }}
            >
              {info.error}
            </Typography>
          </Stack>
        </Box>
      );
    } else {
      let fullname = info.tutor.user.firstname + " " + info.tutor.user.lastname;
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
            <Avatar
              sx={{
                mt: { md: "5px" },
                bgcolor: blue[500],
                width: { xs: 50, md: 100 },
                height: { xs: 50, md: 100 },
              }}
              alt={fullname}
            />
            <Typography
              sx={{
                fontSize: {
                  md: 75,
                  xs: 30,
                },
              }}
            >
              {fullname}
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
              @{username}
            </Typography>
            {<Rating title="Rating" value={info.tutor.rating} readOnly />}
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
            {info.tutor.user.email}
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
            {info.tutor.user.phone}
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
              {info.tutor.bio}
            </Typography>
          </Box>
        </div>
      );
    }
  }
};

export default TutorPage;
