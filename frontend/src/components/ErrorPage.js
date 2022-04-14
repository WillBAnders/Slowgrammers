import React from "react";
import {
  Button,
  Stack,
  CardHeader,
  CardContent,
  Rating,
  Card,
  Typography,
  Grid,
  TextField,
  Paper,
  Box,
} from "@mui/material";
import { useParams, Link } from "react-router-dom";

export default function ErrorPage() {
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
          Page not found.
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
