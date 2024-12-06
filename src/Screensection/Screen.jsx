// Screen.js
import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import './style.css';
import Sidebar from '../components/sidenavigationbar/Sidebar';
import Header from '../components/header_nav_bar/header_bar';
import Footer from '../components/footer_bar/footer_bar';
import PersonalInfo from '../screens/personalinfo/Personalinfo';
import Summary from '../screens/summary/Summary';
import WorkExperience from '../screens/workexperience/Workexperience';
import Education from '../screens/education/Education';
// import Language from './components/Language';
// import Expertise from './components/Expertise';
// import Course from './components/Course';
// import Skills from './components/Skills';
// import TextSection from './components/TextSection';

const Screen = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('Personal Info');

  const handleSectionChange = (title) => {
    setActiveSection(title);
    const path = title.toLowerCase().replace(/\s+/g, '-');
    navigate(`/screen/${path}`);
  };

  return (
    <div className="layout">
      <Header className="header" />
      <div className="content-wrapper">
        <Sidebar 
          className="sidebar" 
          onSectionChange={handleSectionChange}
          activeSection={activeSection}
        />
        <div className="main-content">
          <Routes className="routes">
            <Route path="/" element={<div style={{ marginLeft: '90px'}}><PersonalInfo /></div>} />
            <Route path="/personal-info" element={<div style={{ marginLeft: '90px'}}><PersonalInfo /></div>} />            
            <Route path="/summary" element={<div style={{ marginLeft: '90px', marginBottom:'0'}}><Summary /></div>} />
            <Route path="/work-experience" element={<div style={{ marginLeft: '90px'}}><WorkExperience /></div>} />
            <Route path="/education" element={<div style={{ marginLeft: '90px'}}><Education /></div>} />
            {/* <Route path="/skills" element={<div style={{ marginLeft: '90px'}}><Skills /></div>} /> */}
            {/* <Route path="/projects" element={<div style={{ marginLeft: '90px'}}><Projects /></div>} /> */}
            {/* <Route path="/certification" element={<div style={{ marginLeft: '90px'}}><Certificates /></div>} /> */}
            {/* <Route path="/awards" element={<div style={{ marginLeft: '90px'}}><Awards /></div>} /> */}
            {/* <Route path="/text-section" element={<div style={{ marginLeft: '90px'}}><TextSection /></div>} /> */}
          </Routes>
        </div>
      </div>
      <Footer className="footer" />
    </div>
  );
};

export default Screen;