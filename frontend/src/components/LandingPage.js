import React from 'react'
import { Link } from 'react-router-dom'
import Button from "@mui/material/Button";
import Navbar from './Navbar';
import Home from './Home';
import AboutUs from './AboutUs'

const LandingPage = () => {
    return (
        <div>
            <Navbar />
            <Home />
            <AboutUs />
            <Link to="/CoursePage">Go to Course Pages</Link>
        </div>
    )
}

export default LandingPage
