import React from 'react';
import {Box, Card, CardHeader, Paper, Stack, TextField} from "@mui/material";
import {Link} from "react-router-dom";

export default function CoursePage() {
  const [courses, setCourses] = React.useState([]);
  const [filter, setFilter] = React.useState("");

  React.useEffect(() => {
    fetch("/courses")
      .then(r => r.json())
      .then(data => setCourses(data.courses))
      .catch(error => {
        //TODO: error page
        console.error(error.message);
      });
  }, []);

  return (
    <div className="Courses">
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
            maxWidth: "750px"
          }}
        >
          <TextField
            value={filter}
            fullWidth
            title="SearchBar"
            className="SearchBar"
            id="SearchBar"
            label="SearchBar"
            variant="outlined"
            name="SearchBar"
            onChange={e => setFilter(e.target.value.toUpperCase())}
            inputProps={{
              "data-testid": "SearchBarin",
              "title": "SearchBarInput"
            }}
          />
        </Paper>
      </Box>
      <Box
        display="flex"
        width="100%"
        alignSelf="center"
        alignItems="center"
        justifyContent="center"
      >
        <Paper
          elevation={0}
          sx={{
            width: {xs: '95%', md: '28%'}
          }}
        >
          <Stack
            direction="column"
            spacing={{xs: 1, sm: 2, md: 2.5}}
            data-testid="buttonStack"
            title="buttonStack"
          >
            {courses
              .filter(c => (c.code + c.name).toUpperCase().includes(filter))
              .map(c => (
                <Link
                  key={c.code}
                  to={`/courses/${c.code}`}
                  style={{textDecoration: 'none', color: "blue"}}
                >
                  <Card>
                    <CardHeader title={c.code.toUpperCase()} subheader={c.name}/>
                  </Card>
                </Link>
              ))
            }
          </Stack>
        </Paper>
      </Box>
    </div>
  );
}
