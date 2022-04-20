import React from "react";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Autocomplete from "@mui/material/Autocomplete";
import LoadingContainer from "./LoadingContainer";
import { DAYS, TIMES } from "../styles/TableData";
import Utils from "../Utils";

export default function ProfilePage({ profile, setProfile }) {
  const [updated, setUpdated] = React.useState({});
  const [day, setDay] = React.useState("");
  const [startTime, setStartTime] = React.useState("");
  const [endTime, setEndTime] = React.useState("");
  const [availability, setAvailability] = React.useState([]);
  React.useEffect(() => {
    setAvailability(profile?.availability ?? []);
  }, [profile]);

  function onSubmit(event) {
    event.preventDefault();
    Utils.fetchJson("/profile", {
      method: "PATCH",
      body: JSON.stringify({ ...updated, availability }),
    })
      .then((r) => {
        setProfile(undefined);
      })
      .catch((error) => {
        alert(`Error ${error.status ?? "(Unexpected)"}: ${error.message}`);
      });
  }

  function update(field, value) {
    setUpdated((fields) => ({ ...fields, [field]: value }));
  }

  function addTime(event) {
    event.preventDefault();
    if (day === "" || startTime === "" || endTime === "") {
      alert("The provided availability is missing values.");
      return;
    }
    const stIndex = TIMES.indexOf(startTime);
    const etIndex = TIMES.indexOf(endTime);
    if (stIndex >= etIndex) {
      alert("The provided time range is invalid.");
      return;
    } else if (
      availability.some(
        (a) =>
          day === a.day &&
          stIndex < TIMES.indexOf(a.endTime) &&
          etIndex > TIMES.indexOf(a.startTime)
      )
    ) {
      alert("The provided time range overlaps with an existing entry.");
      return;
    }
    const index = availability.findIndex(
      (a) =>
        day === a.day &&
        (stIndex === TIMES.indexOf(a.endTime) ||
          etIndex === TIMES.indexOf(a.startTime))
    );
    const temp = [...availability];
    if (index !== -1) {
      if (
        index + 1 < temp.length &&
        temp[index + 1].day === day &&
        TIMES.indexOf(temp[index + 1].startTime) === etIndex
      ) {
        temp.splice(index, 2, {
          day,
          startTime:
            TIMES[Math.min(stIndex, TIMES.indexOf(temp[index].startTime))],
          endTime:
            TIMES[Math.max(etIndex, TIMES.indexOf(temp[index + 1].endTime))],
        });
      } else {
        temp[index] = {
          day,
          startTime:
            TIMES[Math.min(stIndex, TIMES.indexOf(temp[index].startTime))],
          endTime: TIMES[Math.max(etIndex, TIMES.indexOf(temp[index].endTime))],
        };
      }
    } else {
      temp.push({ day, startTime, endTime });
      temp.sort((a, b) => {
        return a.day === b.day
          ? TIMES.indexOf(a.startTime) - TIMES.indexOf(b.startTime)
          : DAYS.indexOf(a.day) - DAYS.indexOf(b.day);
      });
    }
    setAvailability(temp);
  }

  function removeTime(event, index) {
    event.preventDefault();
    const temparray = [...availability];
    temparray.splice(index, 1);
    setAvailability(temparray);
  }

  if (!profile) {
    return <LoadingContainer />;
  } else {
    return (
      <div>
        <Typography
          className="main-text"
          align="center"
          justifyContent="center"
          sx={{
            fontWeight: 525,
            paddingTop: {
              xs: "30px",
              md: "0px",
            },
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
          <Box component="form" noValidate onSubmit={onSubmit} sx={{ mt: 1 }}>
            <Grid container>
              <Grid item xs={5}>
                <TextField
                  fullWidth
                  required
                  title="firstname"
                  id="firstname"
                  label="First Name"
                  defaultValue={profile.firstname ?? ""}
                  onChange={(e) => update("firstname", e.target.value)}
                  sx={{ m: 1 }}
                />
                <TextField
                  fullWidth
                  required
                  title="email"
                  id="email"
                  label="Email Address"
                  defaultValue={profile.email ?? ""}
                  onChange={(e) => update("email", e.target.value)}
                  sx={{ m: 1 }}
                />
              </Grid>
              <Grid item xs={5}>
                <TextField
                  fullWidth
                  required
                  title="lastname"
                  id="lastname"
                  label="Last Name"
                  defaultValue={profile.lastname ?? ""}
                  onChange={(e) => update("lastname", e.target.value)}
                  sx={{ m: 1, pl: 1 }}
                />

                <TextField
                  required
                  fullWidth
                  title="phone"
                  id="phone"
                  label="Phone Number"
                  defaultValue={profile.phone ?? ""}
                  onChange={(e) => update("phone", e.target.value)}
                  sx={{ m: 1, pl: 1 }}
                />
              </Grid>
            </Grid>
            <TextField
              required
              fullWidth
              title="bio"
              id="bio"
              label="Biography"
              defaultValue={profile.bio ?? ""}
              onChange={(e) => update("bio", e.target.value)}
              multiline
              rows={5}
              maxRows={8}
              sx={{ m: 1, pl: 1 }}
            />
            <Button type="submit" title="submit" variant="contained">
              Update
            </Button>
          </Box>
        </Box>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{ mt: 2 }}
          component="form"
          onSubmit={addTime}
          noValidate
        >
          <Stack direction="row">
            <Autocomplete
              disablePortal
              id="DaySelector"
              value={day}
              onChange={(event, newValue) => {
                setDay(newValue);
              }}
              options={DAYS}
              sx={{ width: { xs: 100, md: 300 } }}
              renderInput={(params) => <TextField {...params} label="Day" />}
            />
            <Autocomplete
              disablePortal
              id="StartTimeSelector"
              options={TIMES}
              value={startTime}
              onChange={(event, newValue) => {
                setStartTime(newValue);
              }}
              sx={{ width: { xs: 100, md: 300 } }}
              renderInput={(params) => (
                <TextField {...params} label="Start Time" />
              )}
            />
            <Autocomplete
              disablePortal
              id="EndTimeSelector"
              value={endTime}
              onChange={(event, newValue) => {
                setEndTime(newValue);
              }}
              options={TIMES}
              sx={{ width: { xs: 100, md: 300 } }}
              renderInput={(params) => (
                <TextField {...params} label="End Time" />
              )}
            />

            <Button
              type="submit"
              aria-label="AddIcon"
              variant="contained"
              color="success"
              title="addbutton"
            >
              <AddIcon />
            </Button>
          </Stack>
        </Box>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{ mt: 2 }}
        >
          <Stack>
            {availability.length === 0 ? (
              <div>No availability given</div>
            ) : (
              availability.map((a, i) => {
                return (
                  <Stack
                    direction="row"
                    key={a.day + " " + a.startTime}
                    component="form"
                    onSubmit={(e) => removeTime(e, i)}
                  >
                    <Card>
                      <CardContent>
                        {a.day + ": " + a.startTime + " - " + a.endTime}
                      </CardContent>
                    </Card>
                    <Button
                      aria-label="DeleteIcon"
                      variant="contained"
                      color="error"
                      type="submit"
                      title="removebutton"
                    >
                      <DeleteIcon />
                    </Button>
                  </Stack>
                );
              })
            )}
          </Stack>
        </Box>
      </div>
    );
  }
}
