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
  const [name, setName] = useState(false);

  useEffect(() => {
    (
      async () => {
        const response = await fetch('/user', {
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });

        const content = await response.json();
        if (content[0]) {
          setName(content[0].username);
        }
      }
    )();
  });

  return (
    <div>
      <BrowserRouter>
        <Navbar name={name} setName={setName} />
        <Routes>
          <Route path="/" exact element={<LandingPage />} />
          <Route path="/courses" element={<CoursePage />} />
          <Route path="/courses/:coursecode" element={<TutorPage />} />
          <Route path="/signUp" element={<SignUpPage />} />
          <Route path="/signIn" element={<SignInPage setName={setName} />} />
          <Route path="/:username" element={<ProfilePage name = {name}/>} />
          <Route path="/tutors/:username" element={<ProfilePage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;