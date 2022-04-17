import React from "react";
import { Avatar, Box, Stack, Typography, Rating } from "@mui/material";
import { useParams } from "react-router-dom";
import md5 from "md5";
import AsyncWrapper from "./AsyncWrapper";
import Utils from "../Utils";

export default function TutorPage() {
  const params = useParams();

  async function loadData() {
    const response = await Utils.fetchJson(`/tutors/${params.username}`);
    return response.body;
  }

  function Component({ data }) {
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
            <Avatar
              src={
                "https://www.gravatar.com/avatar/" +
                md5(data.tutor.username) +
                "?f=y&d=identicon"
              }
              alt={data.tutor.username + " avatar"}
              sx={{ height: "80px", width: "80px" }}
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

  return <AsyncWrapper handler={loadData} component={Component} />;
}
