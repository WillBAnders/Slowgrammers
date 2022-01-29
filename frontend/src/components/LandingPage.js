import React from 'react'
import { Link } from 'react-router-dom'
import Button from "@mui/material/Button";
import Navbar from './Navbar';
import Home from './Home';
import AboutUs from './AboutUs'
import Services from './Services'
import Join from './Join'

const LandingPage = () => {
    return (
        <div>
            <Navbar />
            <Home />
            <AboutUs />
            <Services />
            <Join />
        </div>
    )
}

export default LandingPage
