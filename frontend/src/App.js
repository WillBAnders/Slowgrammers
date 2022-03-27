import { React, useState, useEffect } from "react";
import { BrowserRouter, Route, Routes, useParams } from 'react-router-dom'
import CoursesPage from "./components/CoursesPage"
import LandingPage from "./components/LandingPage"
import CoursePage from './components/CoursePage'
import SignupPage from "./components/SignupPage";
import SigninPage from "./components/SigninPage";
import Navbar from './components/Navbar';
import ProfilePage from "./components/ProfilePage";
import ErrorPage from "./components/ErrorPage";

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
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/courses/:coursecode" element={<CoursePage />} />
          <Route path="/signup" element={<SignupPage setName={setName} />} />
          <Route path="/signin" element={<SigninPage setName={setName} />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/tutors/:username" element={<ProfilePage />} />
          <Route path= "*" element={<ErrorPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
