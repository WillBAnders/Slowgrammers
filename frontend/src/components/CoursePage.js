import React from 'react'
import { TextField, Box, Paper, Stack, Button } from "@mui/material";
import { BrowserRouter, Route, Link } from "react-router-dom";
import { positions } from '@mui/system';

const CoursePage = () => {
    function loadButtons(courses, filter) {
        if (filter === undefined) {
            filter = "";
        }
        let buttons = [];
        for (let i = 0; i < courses.length; i++) {
            let text = courses.at(i).code + ": " + courses.at(i).name;
            let link = "/courses/" + courses.at(i).code;
            link = link.replace(/\s/g, "-");
            if (text.toUpperCase().includes(filter.toUpperCase())) {
                //Added the key to be equal to i (might have to make unique IDs for each of the courses)
                    buttons.push(
                        <Link to={link} style={{ textDecoration: 'none', color: "blue" }}>
                            <Button
                                key = {i}
                                variant="contained"
                                text={text}
                                style={{maxWidth: '400px', maxHeight: '100px', minWidth: '400px', minHeight: '100px'}}
                            >
                                {text}
                            </Button>
                        </Link>
                    );
            }
        }
        //console.log(buttons.length);
        return buttons;
    }

    const [courses, setCourses] = React.useState([]);
    //Effect callbacks are synchronous to prevent race conditions. So we need to put the async function inside
    React.useEffect(() => {
        async function fetchCourses(){
            const data = await fetch("/courses").then(r => r.json());
            setCourses(data.courses);
        }
        fetchCourses();
    }, []);

    const [value, setValue] = React.useState("");
    const handleChange = e => {
        setValue(e.target.value);
    };
    // Used for setting up the importing of course names and turning them into buttons
    /*
    Used for debugging:
        let searchresult = value;
        console.log(searchresult);
    */
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
                    <TextField value={value}
                        fullWidth 
                        id="outlined-basic"
                        label="SearchBar"
                        variant="outlined"
                        name="SearchBar"
                        onChange={handleChange}
                        inputProps={{
                            "data-testid": "SearchBarin"
                        }}
                    />
            </Paper>
            </Box>
            {/* Course Buttons */}
            <Box 
                display="flex" 
                width="100%"
                alignSelf="right"
                alignItems="right"
                justifyContent="right"
            >
                <Paper
                    elevation={0}
                    sx={{
                        mr: 10
                    }}
                >
                    <Stack 
                        direction="column" 
                        spacing={{ xs: 1, sm: 2, md: 2.5 }}
                        label="buttonStack">
                        {loadButtons(courses, value)}
                    </Stack>
                </Paper>
            </Box>
            {/* Window Part */}
        </div>
    )
}

export default CoursePage
