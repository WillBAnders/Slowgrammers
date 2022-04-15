import React from "react";
import { Button, Stack, Typography, Box } from "@mui/material";
import { Link } from "react-router-dom";

export default function ErrorContainer({ status = null, message }) {
  return (
    <Box
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
          Error {status ?? "(Unknown)"}
        </Typography>
        <Typography
          sx={{
            fontSize: {
              md: 60,
              xs: 30,
            },
          }}
        >
          {message}
        </Typography>
        <Link to="/" style={{ textDecoration: "none", color: "blue" }}>
          <Button variant="contained" size="large" color="error">
            Return to Home Page
          </Button>
        </Link>
      </Stack>
    </Box>
  );
}
