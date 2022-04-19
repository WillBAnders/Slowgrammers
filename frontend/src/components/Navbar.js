import * as React from "react";
import { Link } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { useLocation } from "react-router-dom";
import Utils from "../Utils";

const pages = ["About Us", "Service", "Courses"];
const pagesMap = new Map([
  ["About Us", "about"],
  ["Service", "service"],
  ["Courses", "courses"],
]);

//const settings = ['Profile', 'Finance', 'Logout'];

const Navbar = ({ profile, setProfile }) => {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const location = useLocation();

  React.useEffect(() => {
    if (location.hash) {
      let elem = document.getElementById(location.hash.slice(1));
      if (elem) {
        elem.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }
  }, [location]);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const signout = () => {
    Utils.fetchJson("/signout", {
      method: "POST",
    })
      .then(() => {
        setProfile(null);
        handleCloseUserMenu();
      })
      .catch((error) => {
        alert(`Error ${error.status ?? "(Unexpected)"}: ${error.message}`);
      });
  };

  let buttons;
  if (profile !== null) {
    buttons = (
      <Box sx={{ flexGrow: 0 }}>
        <Tooltip title="Open settings">
          <div>
            <IconButton title="menu" onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Avatar alt="John Doe" src="" />
            </IconButton>
          </div>
        </Tooltip>
        <Menu
          sx={{ mt: "45px" }}
          id="menu-appbar"
          anchorEl={anchorElUser}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={Boolean(anchorElUser)}
          onClose={handleCloseUserMenu}
        >
          <Link
            to="/profile"
            style={{ textDecoration: "none", color: "black" }}
          >
            <MenuItem onClick={handleCloseUserMenu}>
              <Typography textAlign="center">Profile</Typography>
            </MenuItem>
          </Link>
          <MenuItem onClick={handleCloseUserMenu}>
            <Typography textAlign="center" color="black">
              Finance
            </Typography>
          </MenuItem>
          <MenuItem title="signout" onClick={signout}>
            <Typography textAlign="center" color="black">
              Logout
            </Typography>
          </MenuItem>
        </Menu>
      </Box>
    );
  } else {
    buttons = (
      <Box sx={{ flexGrow: 0 }}>
        <Link to="/signup" style={{ textDecoration: "none", color: "white" }}>
          <Button
            title="signupbutton"
            variant="contained"
            color="secondary"
            sx={{ margin: "5px" }}
          >
            Sign Up
          </Button>
        </Link>
        <Link to="/signin" style={{ textDecoration: "none", color: "white" }}>
          <Button
            title="signinbutton"
            variant="contained"
            color="secondary"
            sx={{ margin: "5px" }}
          >
            Sign In
          </Button>
        </Link>
      </Box>
    );
  }

  return (
    <div className="navbarr">
      <AppBar position="absolute">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Link to="/" style={{ textDecoration: "none", color: "white" }}>
              <Typography
                variant="h4"
                noWrap
                component="div"
                sx={{ mr: 2, display: { xs: "none", md: "flex" } }}
              >
                TutorsVILLE
              </Typography>
            </Link>

            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                {pages.map((page) =>
                  page !== "Courses" ? (
                    <MenuItem key={pagesMap.get(page)}>
                      <Link
                        activeClass="active"
                        to={"/#" + pagesMap.get(page)}
                        onClick={handleCloseNavMenu}
                        style={{ textDecoration: "none", color: "black" }}
                      >
                        <Typography textAlign="right">{page}</Typography>
                      </Link>
                    </MenuItem>
                  ) : (
                    <MenuItem key={pagesMap.get(page)}>
                      <Link
                        key={pagesMap.get(page)}
                        to={"/" + pagesMap.get(page)}
                        style={{ textDecoration: "none", color: "black" }}
                        onClick={handleCloseNavMenu}
                      >
                        <Typography textAlign="right">{page}</Typography>
                      </Link>
                    </MenuItem>
                  )
                )}
              </Menu>
            </Box>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}
            >
              <Link to="/" style={{ textDecoration: "none", color: "white" }}>
                TutorsVILLE
              </Link>
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              {pages.map((page) =>
                page !== "Courses" ? (
                  <Link
                    key={pagesMap.get(page)}
                    activeClass="active"
                    to={"/#" + pagesMap.get(page)}
                    style={{ textDecoration: "none", color: "white" }}
                  >
                    <Button
                      key={pagesMap.get(page)}
                      onClick={handleCloseNavMenu}
                      sx={{ my: 2, color: "white", display: "block" }}
                    >
                      {page}
                    </Button>
                  </Link>
                ) : (
                  <Link
                    to={"/" + pagesMap.get(page)}
                    key={pagesMap.get(page)}
                    style={{ textDecoration: "none", color: "white" }}
                  >
                    <Button
                      key={pagesMap.get(page)}
                      onClick={handleCloseNavMenu}
                      sx={{ my: 2, color: "white", display: "block" }}
                    >
                      {page}
                    </Button>
                  </Link>
                )
              )}
            </Box>
            {buttons}
          </Toolbar>
        </Container>
      </AppBar>
    </div>
  );
};
export default Navbar;
