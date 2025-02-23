import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landingpage from './screens/landingpage/Landingpage';
import Screen from './Screensection/Screen';
import { ResumeProvider } from './utils/ResumeContext';
import Resumedisplay from './screens/resumedisplay/Resumedisplay';
function App() {
  return (
    <ResumeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landingpage />} />
          <Route path="/screen/*" element={<Screen />} />
          <Route path="/resume-display" element={<Resumedisplay />} />
        </Routes>
      </Router>
    </ResumeProvider>
  //   <div>
  //   <Chunk />
  // </div>
  );
}

export default App;
