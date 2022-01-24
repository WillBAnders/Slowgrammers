import React from "react";
import ReactDOM from "react-dom";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/material/Icon";

function App() {
let courses = []
courses.push("COP3502C- Programming Fundamentals 1");
courses.push("COP3503C- Programming Fundamentals 2");
courses.push("COP3530- Data Structures and Algorithms");
courses.push("COT3100- Applications of Discrete Structures");
courses.push("CDA3101- Introduction to Computer Organization");
courses.push("CEN3031- Introduction to Software Engineering");
courses.push("CIS4301- Information and Database Systems");
courses.push("CNT4007- Computer Network Fundamentals");
courses.push("COP4020- Programming Language Concepts");
courses.push("COP4533- Algorithm Abstraction and Design");
courses.push("COP4600- Operating Systems");
  // Needed to open and close the tutor window
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [title, setTitle] = React.useState("");
  const handleClickOpen = (coursename) => {
    setOpen(true);
    setTitle(coursename);
  };
  const handleClose = () => {
    setOpen(false);
  };
  // Used for setting up the importing of course names and turning them into buttons
  let arrButtons = [];
  for (let i = 0; i < courses.length; i++){
    let text = courses.at(i);
    arrButtons.push(
      <Button 
        variant="contained" 
        text= {courses.at(i)}
        onClick={() => handleClickOpen(text)}
      >
        {text}
      </Button>
    );
  }
  return (
    <div className="Courses">
      {/* Course Buttons */}
      <Stack direction="column" spacing={{ xs: 1, sm: 2, md: 2.5 }}>
        {arrButtons} 
      </Stack>
      {/* Window Part */}
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="Tutor Window"
      >
        <DialogTitle id="Tutor Window">
          {"Pick your tutor for " + title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            If you're seeing this, that means that the dialog box is working.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <IconButton aria-label="close">
            <CloseIcon />
          </IconButton>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default App;