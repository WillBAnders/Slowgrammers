import { React, useState, useEffect } from "react";
import { BrowserRouter, Route, Routes, useParams } from 'react-router-dom'
import CoursePage from "./components/CoursePage"
import LandingPage from "./components/LandingPage"
import TutorPage from './components/TutorPage'
import SignUpPage from "./components/SignUpPage";
import SignInPage from "./components/SigninPage";
import Navbar from './components/Navbar';
import ProfilePage from "./components/ProfilePage";

function App() {
  const [name, setName] = useState(null);

  useEffect(() => {
    fetch("/profile", {
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    }).then(r => r.json()).then(r => {
      console.log("setName ", r.user?.username)
      setName(r.user?.username)
    })
  }, []);

  console.log("Re-render App.js, name = " + name)

  return (
    <div>
      <BrowserRouter>
        <Navbar name={name} setName={setName} />
        <Routes>
          <Route path="/" exact element={<LandingPage />} />
          <Route path="/courses" element={<CoursePage />} />
          <Route path="/courses/:coursecode" element={<TutorPage />} />
          <Route path="/signUp" element={<SignUpPage setName={setName} />} />
          <Route path="/signIn" element={<SignInPage setName={setName} />} />
          <Route path="/profile" element={<ProfilePage name = {name}/>} />
          <Route path="/tutors/:username" element={<ProfilePage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
