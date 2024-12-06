import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import './style.css';
import Sidebar from '../components/sidenavigationbar/Sidebar';
import Header from '../components/header_nav_bar/header_bar';
import Footer from '../components/footer_bar/footer_bar';
import PersonalInfo from '../screens/personalinfo/Personalinfo';
import Summary from '../screens/summary/Summary';
import WorkExperience from '../screens/workexperience/Workexperience';
import Education from '../screens/education/Education';

const Screen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeSection, setActiveSection] = useState('Personal Info');

  const routeToSection = {
    '/screen/': 'Personal Info',
    '/screen/personal-info': 'Personal Info',
    '/screen/summary': 'Summary',
    '/screen/work-experience': 'Work Experience',
    '/screen/education': 'Education',
    '/screen/skills': 'Skills',
    '/screen/projects': 'Projects',
    '/screen/certifications': 'Certifications',
    '/screen/awards-honors': 'Awards & Honors',
    '/screen/text-section': 'Text Section'
  };

  useEffect(() => {
    const currentPath = location.pathname;
    const matchingSection = routeToSection[currentPath];
    if (matchingSection) {
      setActiveSection(matchingSection);
    }
  }, [location.pathname]);

  const handleSectionChange = (title) => {
    setActiveSection(title);
    const path = title.toLowerCase().replace(/\s+/g, '-');
    // Add '/screen/' prefix to maintain consistent routing
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
            {/* <Route path="/skills" element={<div style={{ marginLeft: '90px'}}><Skills /></div>} />
            <Route path="/projects" element={<div style={{ marginLeft: '90px'}}><Projects /></div>} />
            <Route path="/certifications" element={<div style={{ marginLeft: '90px'}}><Certificates /></div>} />
            <Route path="/awards-honors" element={<div style={{ marginLeft: '90px'}}><Awards /></div>} />
            <Route path="/text-section" element={<div style={{ marginLeft: '90px'}}><TextSection /></div>} /> */}
          </Routes>
        </div>
      </div>
      <Footer className="footer" />
    </div>
  );
};

export default Screen;