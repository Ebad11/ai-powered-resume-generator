import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landingpage from './screens/landingpage/Landingpage';
import Screen from './Screensection/Screen';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landingpage />} />
        <Route path="/screen/*" element={<Screen />} />
      </Routes>
    </Router>
  );
}

export default App;
