import React from 'react'
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
