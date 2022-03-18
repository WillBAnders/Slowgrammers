import React from 'react'
import { Stack, CardHeader, CardContent, Rating, Card, Typography, Grid, TextField, Paper, Box } from '@mui/material'
import { useParams } from "react-router-dom";
import {ThreeDots} from 'react-loader-spinner';


const TutorPage = () => {
    const [tutors, setTutors] = React.useState([]);
    const [isLoading, setLoading] = React.useState(true);
    let params = useParams().coursecode;
    //Effect callbacks are synchronous to prevent race conditions. So we need to put the async function inside
    React.useEffect(() => {
        async function fetchTutors(){
            const data = await fetch(`/courses/${params}`).then(r => r.json());
            setTutors(data.tutors);
            setLoading(false);
        }
        fetchTutors();
    }, []);

    function writeOutTutors(_tutors, filter){
        if (filter === undefined) {
            filter = "";
        }
        console.log(_tutors);
        let tutorList = [];
        for (let i = 0; i < _tutors.length; i++){
                console.log(_tutors.at(i));
                let title = _tutors.at(i).user.firstname + " " + _tutors.at(i).user.lastname;
                console.log(title);
                /*let courses = _tutors.at(i).courses;
                console.log(courses);
                let coursesuppercased = courses.map(courses => courses.toUpperCase());*/
                let avail = _tutors.at(i).availability;
                console.log(avail);
                let availuppercased = avail.toUpperCase(); //avail.map(avail => avail.toUpperCase());
                if (title.toUpperCase().includes(filter.toUpperCase()) /*|| coursesuppercased.find(element => element.includes(filter.toUpperCase()))*/ || availuppercased.find(element => element.includes(filter.toUpperCase()))) tutorList.push(
                <Card key={_tutors.at(i).id} >
                    <CardHeader 
                        title={title}
                        subheader={<Rating name="read-only" precision={0.1} size="small" value={_tutors.at(i).rating} readOnly />}
                    />
                    <CardContent>
                        {/*<Typography
                            component="div"
                            sx={{marginBottom: "10px"}}
                        >
                            Classes:
                            {writeOutClasses(courses)}
                        </Typography>*/}
                        <Typography 
                            sx={{marginBottom: "10px"}}
                            component="div"
                        >
                            Availability:
                            {writeOutAvailability(avail)}
                        </Typography>
                    </CardContent>
                </Card>
            );
        }
        return tutorList;
    }
    function writeOutClasses(classes){
        return (
            <Grid
                container
                justifyContent="center"
                alignItems="center"
                spacing={0}
                sx={{width: "100%"}}
            >
                    {classes.map((singleClass) =>{
                        return(
                            <Card 
                                key={singleClass}
                                direction="row"
                                spacing={1}
                                sx={{
                                    padding: "5px",
                                    margin: "2px"
                                }}
                            >
                                {singleClass}
                            </Card>
                        )
                    })}
            </Grid>
        )
    }

    function writeOutAvailability(incourse){
        const days = incourse.split(",");
        return (
            <Grid
                container
                justifyContent="center"
                alignItems="center"
                spacing={0}
                sx={{width: "100%"}}
            >
                {days.map((day) =>{
                    return(
                        <Card 
                            key={day}
                            direction="row"
                            spacing={1}
                            sx={{
                                padding: "5px",
                                margin: "2px"
                            }}
                        >
                            {day}
                        </Card>
                    )
                })}
            </Grid>
        )
    }
    const [value, setValue] = React.useState("");
    const handleChange = e => {
        setValue(e.target.value);
    };
    if (isLoading) {
        return (
            <div  className="loadingContainer">
            <ThreeDots
            type="ThreeDots"
            color="#00b22d"
            height={100}
            width={100}
            //3 secs
            />
            </div>
            )
    } else {
        return (
            <div>
                <Box sx={{display:"flex", justifyContent:"center"}}>
                    <Typography
                        className="main-text"
                        variant="h2"
                        justifyContent="center"
                        sx={{
                            marginTop: "10px"
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
                            maxWidth: "750px"
                        }}
                    >
                        <TextField 
                            value={value}
                            fullWidth 
                            title="SearchBar"
                            id="tutor-search" 
                            label="Search Here" 
                            variant="outlined"
                            onChange={handleChange} 
                            inputProps={{
                                "data-testid": "SearchBarin",
                                "title": "SearchBarInput"
                            }}
                            />
                    </Paper>
                </Box>

                <Grid 
                    container 
                    spacing={0} 
                    alignItems="center"
                    justifyContent="center"
                    direction="column"
                    style={{ width: "100%"}}
                >
                    <Stack
                        title = "tutorlist"
                        direction="column"
                        justifyContent="center"
                        alignItems="stretch"
                        spacing={1}
                        sx={{ width: "80%"}}
                    >
                        {writeOutTutors(tutors, value)}
                    </Stack>
                </Grid>
            </div>
        )
    }
}

// to get the full list of tutors and the information:
//    getTutorInfo(tutors)

//what should be getting called in the page (~line 196)
//    {writeOutTutors(getTutorInfo(tutors), value)}

export default TutorPage
