import { React, useState } from "react";
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import CoursePage from "./components/CoursePage"
import LandingPage from "./components/LandingPage"
import TutorPage from './components/TutorPage'
import SignUpPage from "./components/SignUpPage";
import SignInPage from "./components/SigninPage";
import Navbar from './components/Navbar';

function App() {
  const [name, setName] = useState(false);

  return(
    <div>
      <BrowserRouter>
        <Navbar name={name} setName={setName}/>
        <Routes>
          <Route path="/" exact element={<LandingPage/>}/>
          <Route path="/Courses" element={<CoursePage/>}/>
          <Route path="/Tutors" element={<TutorPage />} />
          <Route path="/SignUp" element={<SignUpPage/>} />
          <Route path="/SignIn" element={<SignInPage setName={setName}/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;