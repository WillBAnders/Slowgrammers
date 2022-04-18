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
import Utils from "./Utils";

function App() {
  const [profile, setProfile] = useState(undefined);

  useEffect(() => {
    if (profile === undefined) {
      Utils.fetchJson("/profile")
        .then((r) => {
          setProfile(r.body.profile);
        })
        .catch((error) => {
          if (error.status !== 401) {
            alert(`Error ${error.status ?? "(Unexpected)"}: ${error.message}`);
          }
          setProfile(null);
        });
    }
  }, [profile]);

  return (
    <div className="flex-wrapper">
      <BrowserRouter>
        <Navbar profile={profile} setProfile={setProfile} />
        <Routes>
          <Route path="/" exact element={<LandingPage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route
            path="/courses/:code"
            element={<CoursePage profile={profile} setProfile={setProfile} />}
          />
          <Route
            path="/signup"
            element={<SignupPage setProfile={setProfile} />}
          />
          <Route
            path="/signin"
            element={<SigninPage setProfile={setProfile} />}
          />
          <Route
            path="/profile"
            element={<ProfilePage profile={profile} setProfile={setProfile} />}
          />
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
