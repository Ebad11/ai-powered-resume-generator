import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landingpage from './screens/landingpage/Landingpage';
import Screen from './Screensection/Screen';
import { ResumeProvider } from './utils/ResumeContext';
import Resumedisplay from './screens/resumedisplay/Resumedisplay';
import CustomCursor from './components/cursor/Cursor';
import './App.css';
import Loginsignup from './screens/login_signup/Login_signup';
import TransitionLayout from './components/transitionlayout/TransitionLayout';
function App() {
  return (
    <ResumeProvider>
      <CustomCursor />
      <Router>
        {/* <TransitionLayout> */}
        <Routes>
        <Route path="/" element={<Landingpage />} />
        <Route path="/login-signup" element={<Loginsignup />} />
        <Route path="/screen/*" element={<Screen />} />
          <Route path="/resume-display" element={<Resumedisplay />} />
        </Routes>
        {/* </TransitionLayout> */}
      </Router>
    </ResumeProvider>
  //   <div>
  //   <Chunk />
  // </div>
  );
}

export default App;
