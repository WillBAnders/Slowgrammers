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



function BackApp(classes) {
var classes = []
classes.push("COP3502C- Programming Fundamentals 1");
classes.push("COP3503C- Programming Fundamentals 2");
classes.push("COP3530- Data Structures and Algorithms");
classes.push("COT3100- Applications of Discrete Structures");
classes.push("CDA3101- Introduction to Computer Organization");
classes.push("CEN3031- Introduction to Software Engineering");
classes.push("CIS4301- Information and Database Systems");
classes.push("CNT4007- Computer Network Fundamentals");
classes.push("COP4020- Programming Language Concepts");
classes.push("COP4533- Algorithm Abstraction and Design");
classes.push("COP4600- Operating Systems");
  // Needed to open and close the tutor window
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [title, setTitle] = React.useState("");
  const handleClickOpen = (classname) => {
    setOpen(true);
    setTitle(classname);
  };
  const handleClose = () => {
    setOpen(false);
  };
  // Used for setting up the importing of class names and turning them into buttons
  var arrButtons = [];
  var stacks = [];
  var i = 0;
  while (i < classes.length){
    let text = classes.at(i);
    arrButtons.push(
      <Button 
        variant="contained" 
        text= {classes.at(i)}
        onClick={() => handleClickOpen(text)}
      >
        {text}
      </Button>
    );
    if ((i + 1) % 3 == 0 || i + 1 == classes.length) {
      stacks.push(
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={{ xs: 1, sm: 2, md: 4 }}
          justifyContent="center"
          alignItems="center"
        >
          {arrButtons}
        </Stack>
      );
      arrButtons = [];
    }
    i++;
  }
  return (
    <div className="Classes">
      {/* Class Buttons */}
      <Stack direction="column" spacing={{ xs: 1, sm: 2, md: 2.5 }}>
        {stacks} 
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

export default BackApp;
