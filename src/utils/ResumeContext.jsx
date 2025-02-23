import React, { createContext, useState } from 'react';

// Create the ResumeContext
export const ResumeContext = createContext();

// Create the provider component
export const ResumeProvider = ({ children }) => {
    const [resume, setResume] = useState({
        templet: "",
        personalInfo: {},
        workExperiences: [],
        education: [],
        skills: [],
        projects: [],
        awards: [],
    });

    const setSelectedTemplate = (templateId) => {
        setResume(prev => ({
            ...prev,
            templet: templateId
        }));
    };

    const updateResume = (newResumeData) => {
        setResume(newResumeData);
    };

    return (
        <ResumeContext.Provider value={{ resume, setResume, setSelectedTemplate, updateResume }}>
            {children}
        </ResumeContext.Provider>
    );
};
