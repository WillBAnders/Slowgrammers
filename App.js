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

function OpenTutorWindow() {
  const [open, setOpen] = React.useState(true);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  /*function handleClickOpen() {
    setOpen(true);
    console.log("open");
  }

  function handleClose() {
    setOpen(false);
    console.log("close");
  }*/
  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={setOpen(false)}
      aria-labelledby="Tutor Window"
    >
      <DialogTitle id="Tutor Window">
        {"Pick your tutor for this class"}
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
  );
}

function App() {
  var otw = OpenTutorWindow;
  return (
    <div className="Classes">
      <Stack direction="column" spacing={{ xs: 1, sm: 2, md: 2.5 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={{ xs: 1, sm: 2, md: 4 }}
          justifyContent="center"
          alignItems="center"
        >
          {/*onClick={() => {
    alert('clicked');
  }} */}
          <Button
            variant="contained"
            onClick={() => {
              otw();
            }}
          >
            COP3502C-Programming Fundamentals 1
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              console.clear();
            }}
          >
            COP3503C-Programming Fundamentals 2
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              console.log("test");
            }}
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
          <Button variant="contained">
            COT3100- Applications of Discrete Structures
          </Button>
          <Button variant="contained">
            CDA3101- Introduction to Computer Organization
          </Button>
          <Button variant="contained">
            CEN3031- Introduction to Software Engineering
          </Button>
        </Stack>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={{ xs: 1, sm: 2, md: 4 }}
          justifyContent="center"
          alignItems="center"
        >
          <Button variant="contained">
            CIS4301- Information and Database Systems"
          </Button>
          <Button variant="contained">
            CNT4007- Computer Network Fundamentals"
          </Button>
          <Button variant="contained">
            COP4020- Programming Language Concepts"
          </Button>
        </Stack>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={{ xs: 1, sm: 2, md: 4 }}
          justifyContent="center"
          alignItems="center"
        >
          <Button variant="contained">
            COP4533- Algorithm Abstraction and Design
          </Button>
          <Button variant="contained">COP4600- Operating Systems</Button>
        </Stack>
      </Stack>
    </div>
  );
}

export default App;