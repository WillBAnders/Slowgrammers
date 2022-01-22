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

function App(classes) {
  {/* Needed to open and close the tutor window */}
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [title, setTitle] = React.useState("");
  function SetTitle(classname){
    console.log(classname);
    setTitle(classname);
    console.log(title);
  }
  const handleClickOpen = (classname) => {
    setOpen(true);
    SetTitle(classname);
  };
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <div className="Classes">
      {/* Class Buttons */}
      <Stack direction="column" spacing={{ xs: 1, sm: 2, md: 2.5 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={{ xs: 1, sm: 2, md: 4 }}
          justifyContent="center"
          alignItems="center"
        >
          <Button
            variant="contained"
            onClick={() => handleClickOpen("COP3502C")}
          >
            COP3502C-Programming Fundamentals 1
            {console.log(title)}
          </Button>
          <Button
            variant="contained"
            onClick={() => handleClickOpen("COP3503C")}
          >
            COP3503C-Programming Fundamentals 2
          </Button>
          <Button
            variant="contained"
            onClick={() => handleClickOpen("COP3530")}
          >
            COP3530- Data Structures and Algorithms
          </Button>
        </Stack>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={{ xs: 1, sm: 2, md: 4 }}
          justifyContent="center"
          alignItems="center"
        >
          <Button
            variant="contained"
            onClick={() => handleClickOpen("COT3100")}
          >
            COT3100- Applications of Discrete Structures
          </Button>
          <Button
            variant="contained"
            onClick={() => handleClickOpen("CDA3101")}
          >
            CDA3101- Introduction to Computer Organization
          </Button>
          <Button
            variant="contained"
            onClick={() => handleClickOpen("CEN3031")}
          >
            CEN3031- Introduction to Software Engineering
          </Button>
        </Stack>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={{ xs: 1, sm: 2, md: 4 }}
          justifyContent="center"
          alignItems="center"
        >
          <Button
            variant="contained"
            onClick={() => handleClickOpen("CIS4301")}
          >
            CIS4301- Information and Database Systems
          </Button>
          <Button
            variant="contained"
            onClick={() => handleClickOpen("CNT4007")}
          >
            CNT4007- Computer Network Fundamentals
          </Button>
          <Button
            variant="contained"
            onClick={() => handleClickOpen("COP4020")}
          >
            COP4020- Programming Language Concepts
          </Button>
        </Stack>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={{ xs: 1, sm: 2, md: 4 }}
          justifyContent="center"
          alignItems="center"
        >
          <Button
            variant="contained"
            onClick={() => handleClickOpen("COP4533")}
          >
            COP4533- Algorithm Abstraction and Design
          </Button>
          <Button
            variant="contained"
            onClick={() => handleClickOpen("COP4600")}
          >
            COP4600- Operating Systems
          </Button>
        </Stack>
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
