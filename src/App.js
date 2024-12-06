import React, { useState } from 'react';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    skills: '',
    experience: [{ title: '', description: '', duration: '' }],
    education: [{ degree: '', institution: '', year: '', duration: '' }]
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        skills: formData.skills.split(',').map(skill => skill.trim()),
        experience: formData.experience.filter(exp => exp.title && exp.description && exp.duration),
        education: formData.education.filter(edu => edu.degree && edu.institution && edu.duration)
      };

      const response = await fetch('http://localhost:5000/api/resume/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const blob = await response.blob();
      const href = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = href;
      link.setAttribute('download', `${formData.name}_resume.docx`);
      document.body.appendChild(link);
      link.click();
      link.remove();

    } catch (error) {
      console.error('Error:', error);
      alert('Failed to generate resume');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleExperienceChange = (index, field, value) => {
    const updatedExperience = [...formData.experience];
    updatedExperience[index][field] = value;
    setFormData(prev => ({ ...prev, experience: updatedExperience }));
  };
  
  const handleEducationChange = (index, field, value) => {
    const updatedEducation = [...formData.education];
    updatedEducation[index][field] = value;
    setFormData(prev => ({ ...prev, education: updatedEducation }));
  };

  const addExperience = () => {
    setFormData(prev => ({
      ...prev,
      experience: [...prev.experience, { title: '', description: '' }]
    }));
  };

  const addEducation = () => {
    setFormData(prev => ({
      ...prev,
      education: [...prev.education, { degree: '', institution: '', year: '' }]
    }));
  };

  return (
    <div className="App">
      <h1>AI Powered Resume Generator</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          onChange={handleChange}
          required
        />
        <textarea
          name="skills"
          placeholder="Skills (comma-separated)"
          onChange={handleChange}
          required
        />

        <h2>Experience</h2>
        {formData.experience.map((exp, index) => (
          <div key={index}>
            <input
              type="text"
              placeholder="Title"
              value={exp.title}
              onChange={(e) => handleExperienceChange(index, 'title', e.target.value)}
              required
            />
            <textarea
              placeholder="Company"
              value={exp.description}
              onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Duration (e.g., 2020-2022 or 2020-current)"
              value={exp.duration}
              onChange={(e) => handleExperienceChange(index, 'duration', e.target.value)}
              required
            />
          </div>
        ))}
        <button type="button" onClick={addExperience}>Add Experience</button>

        <h2>Education</h2>
        {formData.education.map((edu, index) => (
          <div key={index}>
            <input
              type="text"
              placeholder="Degree"
              value={edu.degree}
              onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Institution"
              value={edu.institution}
              onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Year"
              value={edu.year}
              onChange={(e) => handleEducationChange(index, 'year', e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Duration (e.g., 2018-2022 or 2018-current)"
              value={edu.duration}
              onChange={(e) => handleEducationChange(index, 'duration', e.target.value)}
              required
            />
          </div>
        ))}
        <button type="button" onClick={addEducation}>Add Education</button>


        <button type="submit">Generate Resume</button>
      </form>
    </div>
  );
}

export default App;
