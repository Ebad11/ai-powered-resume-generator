import React, { useState } from 'react';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    skills: '',
    experience: '',
    education: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        skills: formData.skills.split(',').map(skill => skill.trim()),
        experience: JSON.parse(formData.experience || '[]'),
        education: JSON.parse(formData.education || '[]')
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

  return (
    <div className="App">
      <h1>Resume Generator</h1>
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
        <textarea
          name="experience"
          placeholder="Experience (JSON)"
          onChange={handleChange}
        />
        <textarea
          name="education"
          placeholder="Education (JSON)"
          onChange={handleChange}
        />
        <button type="submit">Generate Resume</button>
      </form>
    </div>
  );
}

export default App;