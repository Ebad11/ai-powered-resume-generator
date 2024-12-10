import React, { useState } from 'react';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    skills: '',
    keywords: '',
    experience: [{ title: '', description: '', duration: '' }],
    education: [{ degree: '', institution: '', year: '', duration: '' }],
    projects: [{ title: '', description: '' }],
    achievements: [{ title: '', description: '' }],
    template: 'template1', // Default template
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        skills: formData.skills.split(',').map(skill => skill.trim()),
        keywords: formData.keywords.split(',').map(keyword => keyword.trim()),
        experience: formData.experience.filter(exp => exp.title && exp.description && exp.duration),
        education: formData.education.filter(edu => edu.degree && edu.institution && edu.duration),
        projects: formData.projects.filter(project => project.title && project.description),
        achievements: formData.achievements.filter(achievement => achievement.title && achievement.description),
      };

      const response = await fetch('http://localhost:5000/api/resume/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
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

  const handleArrayChange = (index, field, value, arrayName) => {
    const updatedArray = [...formData[arrayName]];
    updatedArray[index][field] = value;
    setFormData(prev => ({ ...prev, [arrayName]: updatedArray }));
  };

  const addArrayItem = (arrayName, newItem) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: [...prev[arrayName], newItem],
    }));
  };

  return (
    <div className="App">
      <h1>AI Powered Resume Generator</h1>
      <form onSubmit={handleSubmit}>
        {/* Personal Details */}
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
        <textarea
          name="keywords"
          placeholder="Keywords (comma-separated)"
          onChange={handleChange}
        />

        {/* Template Selection */}
        <h2>Select Template</h2>
        <div onChange={handleChange}>
          <label>
            <input type="radio" name="template" value="template1" defaultChecked /> Clean Professional
          </label>
          <label>
            <input type="radio" name="template" value="template2" /> Structured Classic
          </label>
          <label>
            <input type="radio" name="template" value="template3" /> Modern Elegance
          </label>
        </div>

        {/* Experience Section */}
        <h2>Experience</h2>
        {formData.experience.map((exp, index) => (
          <div key={index}>
            <input
              type="text"
              placeholder="Title"
              value={exp.title}
              onChange={(e) => handleArrayChange(index, 'title', e.target.value, 'experience')}
              required
            />
            <textarea
              placeholder="Company"
              value={exp.description}
              onChange={(e) => handleArrayChange(index, 'description', e.target.value, 'experience')}
              required
            />
            <input
              type="text"
              placeholder="Duration (e.g., 2020-2022 or 2020-current)"
              value={exp.duration}
              onChange={(e) => handleArrayChange(index, 'duration', e.target.value, 'experience')}
              required
            />
          </div>
        ))}
        <button type="button" onClick={() => addArrayItem('experience', { title: '', description: '', duration: '' })}>Add Experience</button>

        {/* Education Section */}
        <h2>Education</h2>
        {formData.education.map((edu, index) => (
          <div key={index}>
            <input
              type="text"
              placeholder="Degree"
              value={edu.degree}
              onChange={(e) => handleArrayChange(index, 'degree', e.target.value, 'education')}
              required
            />
            <input
              type="text"
              placeholder="Institution"
              value={edu.institution}
              onChange={(e) => handleArrayChange(index, 'institution', e.target.value, 'education')}
              required
            />
            <input
              type="text"
              placeholder="Year"
              value={edu.year}
              onChange={(e) => handleArrayChange(index, 'year', e.target.value, 'education')}
              required
            />
            <input
              type="text"
              placeholder="Duration (e.g., 2018-2022 or 2018-current)"
              value={edu.duration}
              onChange={(e) => handleArrayChange(index, 'duration', e.target.value, 'education')}
              required
            />
          </div>
        ))}
        <button type="button" onClick={() => addArrayItem('education', { degree: '', institution: '', year: '', duration: '' })}>Add Education</button>

        {/* Projects Section */}
        <h2>Projects</h2>
        {formData.projects.map((project, index) => (
          <div key={index}>
            <input
              type="text"
              placeholder="Title"
              value={project.title}
              onChange={(e) => handleArrayChange(index, 'title', e.target.value, 'projects')}
              required
            />
            <textarea
              placeholder="Description"
              value={project.description}
              onChange={(e) => handleArrayChange(index, 'description', e.target.value, 'projects')}
              required
            />
          </div>
        ))}
        <button type="button" onClick={() => addArrayItem('projects', { title: '', description: '' })}>Add Project</button>

        {/* Achievements Section */}
        <h2>Achievements</h2>
        {formData.achievements.map((achievement, index) => (
          <div key={index}>
            <input
              type="text"
              placeholder="Title"
              value={achievement.title}
              onChange={(e) => handleArrayChange(index, 'title', e.target.value, 'achievements')}
              required
            />
            <textarea
              placeholder="Description"
              value={achievement.description}
              onChange={(e) => handleArrayChange(index, 'description', e.target.value, 'achievements')}
              required
            />
          </div>
        ))}
        <button type="button" onClick={() => addArrayItem('achievements', { title: '', description: '' })}>Add Achievement</button>

        <button type="submit">Generate Resume</button>
      </form>
    </div>
  );
}

export default App;
