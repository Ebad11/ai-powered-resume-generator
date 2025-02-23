import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import './style.css';
import Sidebar from '../components/sidenavigationbar/Sidebar';
import Header from '../components/header_nav_bar/header_bar';
import Footer from '../components/footer_bar/footer_bar';
import PersonalInfo from '../screens/personalinfo/Personalinfo';
import WorkExperience from '../screens/workexperience/Workexperience';
import Education from '../screens/education/Education';
import Skills from '../screens/skills/Skills';
import Project from '../screens/projectscreen/Project';
import AwardsHonors from '../screens/awards/Awards';
import Templetselection from '../screens/templetselection/Templateselection';

const Screen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeSection, setActiveSection] = useState('Personal Info');
  const [loadingRoute, setLoadingRoute] = useState(false);

  const routeToSection = {
    '/screen/template-selection': 'Template Selection',
    '/screen/personal-info': 'Personal Info',
    '/screen/work-experience': 'Work Experience',
    '/screen/education': 'Education',
    '/screen/skills': 'Skills',
    '/screen/projects': 'Projects',
    '/screen/awards-honors': 'Awards Honors',
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
    setLoadingRoute(true);
    setActiveSection(title);
    const path = title.toLowerCase().replace(/\s+/g, '-');
    navigate(`/screen/${path}`);
    setTimeout(() => setLoadingRoute(false), 300);
  };

  return (
    <div className="layout">
      <div className="content-wrapper">
        <Sidebar 
          className={`sidebar ${loadingRoute ? 'loading' : ''}`}
          onSectionChange={handleSectionChange}
          activeSection={activeSection}
        />
        <div className={`main-content ${loadingRoute ? 'loading' : ''}`}>
          <Routes>
          <Route 
              path="/" 
              element={
                <div className="route-content">
                  <Templetselection />
                </div>
              }
            />
            <Route 
              path="/template-selection" 
              element={
                <div className="route-content">
                  <Templetselection />
                </div>
              }
            />
            <Route 
              path="/personal-info" 
              element={
                <div className="route-content">
                  <PersonalInfo />
                </div>
              }
            />
            <Route 
              path="/work-experience" 
              element={
                <div className="route-content">
                  <WorkExperience />
                </div>
              }
            />
            <Route 
              path="/education" 
              element={
                <div className="route-content">
                  <Education />
                </div>
              }
            />
            <Route 
              path="/skills" 
              element={
                <div className="route-content">
                  <Skills />
                </div>
              }
            />
            <Route 
              path="/projects" 
              element={
                <div className="route-content">
                  <Project />
                </div>
              }
            />
            <Route 
              path="/awards-honors" 
              element={
                <div className="route-content">
                  <AwardsHonors />
                </div>
              }
            />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Screen;