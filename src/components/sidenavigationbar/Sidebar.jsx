// Sidebar.js
import React from 'react';
import './style.css';
import {
  User,
  FileText,
  Briefcase,
  GraduationCap,
  Globe,
  Star,
  BookOpen,
  Award,
} from 'lucide-react';

const Sidebar = ({ onSectionChange, activeSection }) => {
const sections = [
  { id: 1, title: 'Personal Info', Icon: User },
  { id: 2, title: 'Summary', Icon: FileText },
  { id: 3, title: 'Work Experience', Icon: Briefcase },
  { id: 4, title: 'Education', Icon: GraduationCap },
  { id: 5, title: 'Skills', Icon: Globe },
  { id: 6, title: 'Projects', Icon: Star },
  { id: 7, title: 'Certifications', Icon: BookOpen },
  { id: 8, title: 'Awards & Honors', Icon: Award },
];

  const handleSectionClick = (title) => {
    onSectionChange(title);
  };

  return (
    <div className="fill-section-container">
      <h2 className="fill-section-title">Fill Section</h2>
      <p className="fill-section-subtitle">Select the section</p>
      
      <div className="sections-grid">
        {sections.map((section) => (
          <button
            key={section.id}
            className={`section-button ${activeSection === section.title ? 'active' : ''}`}
            onClick={() => handleSectionClick(section.title)}
          >
            <span className="section-icon">
              <section.Icon size={24} color={activeSection === section.title ? '#5C3CDB' : '#000000'} />
            </span>
            <span className="section-title" style={{ color: activeSection === section.title ? '#5C3CDB' : '#000000' }}>{section.title}</span>
          </button>
        ))}
      </div>

      <button 
        className="text-section-button"
        onClick={() => handleSectionClick('Text Section')}
      >
        Text Section
      </button>
    </div>
  );
};

export default Sidebar;