import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, Plus, Briefcase, Calendar, Globe, FileText } from 'lucide-react';
import { ResumeContext } from '../../utils/ResumeContext';
import './style.css';

const Toast = ({ message }) => (
  <div className="toast">{message}</div>
);

const Projects = () => {
  const navigate = useNavigate();
  const { resume, setResume } = useContext(ResumeContext);
  const [showToast, setShowToast] = useState(false);
  const [projectInfo, setProjectInfo] = useState({
    projectName: '',
    role: '',
    startDate: '',
    endDate: '',
    technologies: '',
    projectUrl: '',
    description: ''
  });

  const projectTypes = [
    'Personal Project',
    'Academic Project',
    'Professional Project',
    'Open Source',
    'Client Project',
    'Research Project'
  ];

  const isFormFilled = () => Object.values(projectInfo).every(value => value.trim() !== '');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProjectInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddMore = () => {
    // Update the resume context with the new project
    setResume(prevResume => ({
      ...prevResume,
      projects: [
        ...(prevResume.projects || []),
        { ...projectInfo }
      ]
    }));

    // Reset the form
    setProjectInfo({
      projectName: '',
      role: '',
      startDate: '',
      endDate: '',
      technologies: '',
      projectUrl: '',
      description: ''
    });

    // Show toast
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormFilled()) {
      setResume(prevResume => ({
        ...prevResume,
        projects: [
          ...(prevResume.projects || []),
          { ...projectInfo }
        ]
      }));
      console.log("Updated Resume:", resume);
    }
    navigate('/screen/awards-honors');
  };

  return (
    <div className="personal-info-container">
      <div className="form-wrapper">
        {showToast && <Toast message="Project saved! You can add more." />}

        <form onSubmit={handleSubmit}>
          <h2 className="section-title">Project Details_</h2>
          <span className="experience-count">
            {(resume.projects?.length || 0)} projects added
          </span>

          <div className="form-grid">
            <div className="form-group">
              <label>
                <Briefcase size={16} /> Project_Name
              </label>
              <input
                type="text"
                name="projectName"
                value={projectInfo.projectName}
                onChange={handleChange}
                placeholder="e.g., E-commerce Website"
                required
              />
            </div>

            <div className="form-group">
              <label>
                <Briefcase size={16} /> Your_Role
              </label>
              <input
                type="text"
                name="role"
                value={projectInfo.role}
                onChange={handleChange}
                placeholder="e.g., Lead Developer"
                required
              />
            </div>

            <div className="form-group">
              <label>
                <Calendar size={16} /> Start_Date
              </label>
              <input
                type="date"
                name="startDate"
                value={projectInfo.startDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>
                <Calendar size={16} /> End_Date
              </label>
              <input
                type="date"
                name="endDate"
                value={projectInfo.endDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>
                <FileText size={16} /> Technologies_Used
              </label>
              <input
                type="text"
                name="technologies"
                value={projectInfo.technologies}
                onChange={handleChange}
                placeholder="e.g., React, Node.js, MongoDB"
                required
              />
            </div>

            <div className="form-group">
              <label>
                <Globe size={16} /> Project_URL
              </label>
              <input
                type="url"
                name="projectUrl"
                value={projectInfo.projectUrl}
                onChange={handleChange}
                placeholder="https://..."
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>
              <FileText size={16} /> Project_Description
            </label>
            <textarea
              name="description"
              value={projectInfo.description}
              onChange={handleChange}
              className="summary-textarea"
              placeholder="Describe the project, your role, and key achievements..."
              required
            />
          </div>

          <div className="button-group">
            <button
              type="button"
              className="add-more-button"
              disabled={!isFormFilled()}
              onClick={handleAddMore}
            >
              Add More <Plus size={20} />
            </button>
            <button type="button" className="generate-button">
              Generate <Sparkles size={20} />
            </button>
            <button type="submit" className="next2-button">
              Next <ArrowRight size={20} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Projects;