import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Search from "./Search.js"

function App() {
  const [courses, setCourses] = React.useState([]);
React.useEffect(async() => {
  const data = await fetch("/courses").then(r => r.json());
  setCourses(data.courses);
}, []);
  // Used for setting up the importing of course names and turning them into buttons
  let arrButtons = [];
  let searchVal = Search.SendValue;
  console.log("Searchval: " + searchVal);
  for (let i = 0; i < courses.length; i++){
    let text = courses.at(i).code + ": " + courses.at(i).name;
    let link = "/courses/" + courses.at(i).code;
    link = link.replace(/\s/g , "-");
    arrButtons.push(
      <Button 
        variant="contained" 
        text= {text}
        href= {link}
      >
        {text}
      </Button>
    );
  }
  return (
    <div className="Courses">
      <Search />
      {/* Course Buttons */}
      <Stack direction="column" spacing={{ xs: 1, sm: 2, md: 2.5 }}>
        {arrButtons} 
      </Stack>
      {/* Window Part */}
    </div>
  );
}

export default App;