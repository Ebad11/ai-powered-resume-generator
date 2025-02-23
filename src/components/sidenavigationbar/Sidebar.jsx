import React, { useState } from 'react';
import './style.css';
import { User, Briefcase, GraduationCap, Code, Star, Award, FileText, ChevronLeft, ChevronRight } from 'lucide-react';

const Sidebar = ({ onSectionChange, activeSection }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    
    const sections = [
        { title: 'Template Selection', icon: <FileText size={20} /> },
        { title: 'Personal Info', icon: <User size={20} /> },
        { title: 'Work Experience', icon: <Briefcase size={20} /> },
        { title: 'Education', icon: <GraduationCap size={20} /> },
        { title: 'Skills', icon: <Code size={20} /> },
        { title: 'Projects', icon: <Star size={20} /> },
        { title: 'Awards Honors', icon: <Award size={20} /> }
    ];

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <div className={`cyber-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
            <button className="collapse-btn" onClick={toggleSidebar}>
                {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>
            
            <div className="cyber-sidebar-header">
                <h2 className="cyber-sidebar-title">FILL SECTION</h2>
                <p className="cyber-sidebar-subtitle">Select the section to proceed</p>
            </div>
            
            <div className="cyber-sidebar-content">
                <div className="cyber-sections-grid">
                    {sections.map((section) => (
                        <button
                            key={section.title}
                            className={`cyber-section-btn ${
                                activeSection === section.title ? 'active' : ''
                            }`}
                            onClick={() => onSectionChange(section.title)}
                        >
                            <span className="cyber-section-icon">{section.icon}</span>
                            <span className="cyber-section-text">
                                {section.title.toUpperCase()}
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Sidebar;