import React from "react";
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import CoursePage from "./components/CoursePage"
import LandingPage from "./components/LandingPage"
import TutorPage from './components/TutorPage'
import SignUpPage from "./components/SignUpPage";

function App() {
  return(
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" exact element={<LandingPage/>}/>
          <Route path="/Courses" element={<CoursePage/>}/>
          <Route path="/Tutors" element={<TutorPage />} />
          <Route path="/SignUp" element={<SignUpPage/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;