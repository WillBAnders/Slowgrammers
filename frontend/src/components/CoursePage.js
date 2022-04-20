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
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import Utils from "../Utils";
import AsyncWrapper from "./AsyncWrapper";

export default function CoursePage({ profile, setProfile }) {
  const params = useParams();

  async function loadData() {
    const response = await Utils.fetchJson(`/courses/${params.code}`);
    return response.body;
  }

  function patchTutoringCourse(event, add) {
    event.preventDefault();
    Utils.fetchJson("/profile", {
      method: "PATCH",
      body: JSON.stringify({
        tutoring: [{ code: params.code, action: add }],
      }),
    })
      .then((r) => {
        setProfile(undefined);
      })
      .catch((error) => {
        alert(`Error ${error.status ?? "(Unexpected)"}: ${error.message}`);
      });
  }

  function Component({ data }) {
    const [filter, setFilter] = React.useState({original: "", uppercase: ""});

    return (
      <div>
        <Stack direction="column" alignItems="center" justifyContent="center">
          <Typography
            className="main-text"
            variant="h2"
          >
            {data.course.code.toUpperCase()}
          </Typography>
          <Typography
            className="main-text"
            variant="h4"
          >
            {data.course.name}
          </Typography>
        </Stack>
        <Box
          display="flex"
          width="100%"
          alignItems="center"
          justifyContent="center"
        >
          <Paper
            elevation={0}
            sx={{
              width: "400px",
              margin: "10px",
              maxWidth: "750px",
            }}
          >
            <Stack direction="row">
              <TextField
                value={filter.original}
                fullWidth
                title="SearchBar"
                id="tutor-search"
                label="Search Tutors"
                variant="outlined"
                onChange={(e) => setFilter({
                  original: e.target.value,
                  uppercase: e.target.value.toUpperCase(),
                })}
                inputProps={{
                  "data-testid": "SearchBarin",
                  title: "SearchBarInput",
                }}
              />
              {profile?.hasOwnProperty("bio") &&
                (data.tutors.every((t) => t.username !== profile.username) ? (
                  <Button
                    aria-label="AddIcon"
                    variant="contained"
                    color="success"
                    title="addbutton"
                    onClick={(e) => patchTutoringCourse(e, true)}
                  >
                    <AddIcon />
                  </Button>
                ) : (
                  <Button
                    aria-label="DeleteIcon"
                    variant="contained"
                    color="error"
                    title="removebutton"
                    onClick={(e) => patchTutoringCourse(e, false)}
                  >
                    <DeleteIcon />
                  </Button>
                ))}
            </Stack>
          </Paper>
        </Box>
        <Grid
          container
          alignItems="center"
          justifyContent="center"
          direction="column"
          style={{ width: "100%" }}
        >
          <Stack
            title="tutorlist"
            direction="column"
            justifyContent="center"
            alignItems="stretch"
            spacing={1}
            sx={{ width: "80%" }}
          >
            {data.tutors.length === 0 ? (
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Stack>
                  <Typography variant="h4" justifyContent="center">
                    No Tutors Available
                  </Typography>
                  <Link
                    to="/courses"
                    style={{ textDecoration: "none", color: "blue" }}
                  >
                    <Button
                      variant="contained"
                      size="large"
                      sx={{
                        ml: {
                          xs: "100px",
                        },
                      }}
                    >
                      Go Back
                    </Button>
                  </Link>
                </Stack>
              </Box>
            ) : (
              data.tutors
                .filter(
                  (t) =>
                    (t.firstname + " " + t.lastname)
                      .toUpperCase()
                      .includes(filter.uppercase) ||
                    t.availability.some((a) => a.day.toUpperCase().includes(filter.uppercase))
                )
                .map((t) => (
                  <Link
                    key={t.username}
                    to={`/tutors/${t.username}`}
                    style={{ textDecoration: "none", color: "blue" }}
                  >
                    <Card>
                      <CardHeader
                        title={t.firstname + " " + t.lastname}
                        subheader={
                          <Rating
                            name="read-only"
                            precision={0.1}
                            size="small"
                            value={t.rating}
                            readOnly
                          />
                        }
                      />
                      <CardContent>
                        <Typography
                          sx={{ marginBottom: "10px" }}
                          component="div"
                        >
                          Availability:
                          <Grid
                            container
                            justifyContent="center"
                            alignItems="center"
                            spacing={0}
                            sx={{ width: "100%" }}
                          >
                            {t.availability.map(a => (
                              <Card
                                key={a.day + " " + a.startTime}
                                direction="row"
                                spacing={1}
                                sx={{
                                  padding: "5px",
                                  margin: "2px",
                                }}
                              >
                                {a.day + " " + a.startTime + " - " + a.endTime}
                              </Card>
                            ))}
                          </Grid>
                        </Typography>
                      </CardContent>
                    </Card>
                  </Link>
                ))
            )}
          </Stack>
        </Grid>
      </div>
    );
  }

  return (
    <AsyncWrapper handler={loadData} deps={[profile]} component={Component} />
  );
}
