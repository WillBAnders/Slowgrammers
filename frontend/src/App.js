import React from "react";
import { BrowserRouter, Route, Routes, useParams } from 'react-router-dom'
import CoursePage from "./components/CoursePage"
import LandingPage from "./components/LandingPage"
import TutorPage from './components/TutorPage'
import SignUpPage from "./components/SignUpPage";
import SignInPage from "./components/SigninPage";
import Navbar from './components/Navbar';
import ProfilePage from "./components/ProfilePage";

function App() {
  return(
    <div>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" exact element={<LandingPage/>}/>
          <Route path="/courses" element={<CoursePage/>}/>
          <Route path="/tutors" element={<TutorPage />} />
          <Route path="/signUp" element={<SignUpPage/>} />
          <Route path="/signIn" element={<SignInPage/>} />
          <Route path="/tutors/:username" element={<ProfilePage/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;