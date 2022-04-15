import { React, useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import CoursesPage from "./components/CoursesPage";
import LandingPage from "./components/LandingPage";
import CoursePage from "./components/CoursePage";
import SignupPage from "./components/SignupPage";
import SigninPage from "./components/SigninPage";
import Navbar from "./components/Navbar";
import ProfilePage from "./components/ProfilePage";
import ErrorContainer from "./components/ErrorContainer";
import TutorPage from "./components/TutorPage";
import Footer from "./components/Footer";
import "./styles/Footer.css";

function App() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetch("/profile", {
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    })
      .then((r) => r.json())
      .then((r) => {
        setProfile(r.profile);
      });
  }, []);

  //console.log("Re-render App.js, name = " + name)

  return (
    <div className="flex-wrapper">
      <BrowserRouter>
        <Navbar profile={profile} setProfile={setProfile} />
        <Routes>
          <Route path="/" exact element={<LandingPage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route
            path="/courses/:code"
            element={<CoursePage profile={profile} />}
          />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/signin" element={<SigninPage />} />
          <Route path="/profile" element={<ProfilePage profile={profile} />} />
          <Route path="/tutors/:username" element={<TutorPage />} />
          <Route
            path="*"
            element={<ErrorContainer status={404} message={"Unknown page."} />}
          />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
