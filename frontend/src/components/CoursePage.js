import React from 'react'
import { Button, Stack, CardHeader, CardContent, Rating, Card, Typography, Grid, TextField, Paper, Box } from '@mui/material'
import { useParams, Link } from "react-router-dom";
import {ThreeDots} from 'react-loader-spinner';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

export default function CoursePage({ username }) {
  const params = useParams();
  const [isLoading, setLoading] = React.useState(true);
  const [data, setData] = React.useState(null);
  const [filter, setFilter] = React.useState("");

  React.useEffect(() => {
    fetch(`/courses/${params.code}`)
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

  function patchTutoringCourse(event, add) {
    event.preventDefault();
    fetch("/profile", {
      method: "PATCH",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        tutoring: [{ code: params.code, action: add }],
      }),
    })
      .then((r) => r.json())
      .then((_data) => {
        window.location.reload();
      })
      .catch((error) => {
        //TODO: error page
        console.error(error.message);
      });
  }

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
    return (
      <div>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Typography
            className="main-text"
            variant="h2"
            justifyContent="center"
            sx={{
              marginTop: "10px",
            }}
          >
            Tutors
          </Typography>
        </Box>
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
                value={filter}
                fullWidth
                title="SearchBar"
                id="tutor-search"
                label="Search Here"
                variant="outlined"
                onChange={(e) => setFilter(e.target.value.toUpperCase())}
                inputProps={{
                  "data-testid": "SearchBarin",
                  title: "SearchBarInput",
                }}
              />
              {username !== null &&
                (data.tutors.every((t) => t.user.username !== username) ? (
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
          spacing={0}
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
                    (t.user.firstname + " " + t.user.lastname)
                      .toUpperCase()
                      .includes(filter) ||
                    t.availability.some((a) => a.toUpperCase().includes(filter))
                )
                .map((t) => (
                  <Link
                    key={t.user.username}
                    to={`/tutors/${t.user.username}`}
                    style={{ textDecoration: "none", color: "blue" }}
                  >
                    <Card>
                      <CardHeader
                        title={t.user.firstname + " " + t.user.lastname}
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
                            {t.availability.map((day) => (
                              <Card
                                key={day}
                                direction="row"
                                spacing={1}
                                sx={{
                                  padding: "5px",
                                  margin: "2px",
                                }}
                              >
                                {day}
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
}