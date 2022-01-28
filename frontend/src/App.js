import React from "react";
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import CoursePage from "./components/CoursePage"
import LandingPage from "./components/LandingPage"

function App() {
  return(
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" exact element={<LandingPage/>}/>
          <Route path="/CoursePage" element={<CoursePage/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;