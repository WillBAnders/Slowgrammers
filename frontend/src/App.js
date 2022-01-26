import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { TextField } from "@mui/material";

function loadButtons(courses, filter){
  if (filter == undefined){
    filter = "";
  }
  let buttons = [];
  for (let i = 0; i < courses.length; i++){
    let text = courses.at(i).code + ": " + courses.at(i).name;
    let link = "/courses/" + courses.at(i).code;
    link = link.replace(/\s/g , "-");
    if (text.toUpperCase().includes(filter.toUpperCase())){
      buttons.push(
        <Button 
          variant="contained" 
          text= {text}
          href= {link}
        >
          {text}
        </Button>
      );
    }
  }
  console.log(buttons.length);
  return buttons;
}

function App() {
  const [courses, setCourses] = React.useState([]);
  React.useEffect(async() => {
      const data = await fetch("/courses").then(r => r.json());
      setCourses(data.courses);
    }, []);
  const [value, setValue] = React.useState("");
    const handleChange = e => {
        setValue(e.target.value);
    };
  // Used for setting up the importing of course names and turning them into buttons
  let searchresult = value;
  console.log(searchresult);
  return (
    <div className="Courses">
      <TextField value={value} 
        id="outlined-basic" 
        label="SearchBar" 
        variant="outlined" 
        name="SearchBar" 
        onChange={handleChange}
        />
      {/* Course Buttons */}
      <Stack direction="column" spacing={{ xs: 1, sm: 2, md: 2.5 }}>
        {loadButtons(courses, value)}
      </Stack>
      {/* Window Part */}
    </div>
  );
}

export default App;