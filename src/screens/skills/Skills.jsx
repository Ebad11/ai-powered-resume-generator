import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, Plus, Code, Star, Clock, Tag, FileText } from 'lucide-react';
import { ResumeContext } from '../../utils/ResumeContext';
import './style.css'

const Toast = ({ message }) => (
  <div className="toast">{message}</div>
);

const Skills = () => {
  const navigate = useNavigate();
  const { resume, setResume } = useContext(ResumeContext);
  const [showToast, setShowToast] = useState(false);
  const [skillInfo, setSkillInfo] = useState({
    skillName: '',
    proficiencyLevel: '',
    yearsOfExperience: '',
    category: '',
    description: ''
  });

  const proficiencyLevels = [
    'Beginner',
    'Intermediate',
    'Advanced',
    'Expert'
  ];

  const skillCategories = [
    'Technical Skills',
    'Soft Skills',
    'Languages',
    'Tools',
    'Other'
  ];

  const isFormFilled = () => Object.values(skillInfo).every(value => value.trim() !== '');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSkillInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddMore = () => {
    // Update the resume context with the new skill
    setResume(prevResume => ({
      ...prevResume,
      skills: [
        ...(prevResume.skills || []),
        { ...skillInfo }
      ]
    }));

    // Reset the form
    setSkillInfo({
      skillName: '',
      proficiencyLevel: '',
      yearsOfExperience: '',
      category: '',
      description: ''
    });

    // Show toast
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormFilled()) {
      // Add the current skill to the resume context before navigating
      setResume(prevResume => ({
        ...prevResume,
        skills: [
          ...(prevResume.skills || []),
          { ...skillInfo }
        ]
      }));
      console.log("Updated Resume:", resume);
    }
    navigate('/screen/projects');
  };

  return (
    <div className="personal-info-container">
      <div className="form-wrapper">
        {showToast && <Toast message="Skill saved! You can add more." />}

        <form onSubmit={handleSubmit}>
          <h2 className="section-title">Skills Details</h2>
          <span className="experience-count">
            {(resume.skills?.length || 0)} skills added
          </span>

          <div className="form-grid">
            <div className="form-group">
              <label>
                <Code size={16} /> Skill Name
              </label>
              <input
                type="text"
                name="skillName"
                value={skillInfo.skillName}
                onChange={handleChange}
                placeholder="e.g., JavaScript, Project Management"
                required
              />
            </div>

            <div className="form-group">
              <label>
                <Star size={16} /> Proficiency Level
              </label>
              <select
                name="proficiencyLevel"
                value={skillInfo.proficiencyLevel}
                onChange={handleChange}
                required
              >
                <option value="">Select Proficiency</option>
                {proficiencyLevels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>
                <Clock size={16} /> Years Of Experience
              </label>
              <input
                type="number"
                name="yearsOfExperience"
                value={skillInfo.yearsOfExperience}
                onChange={handleChange}
                min="0"
                step="0.5"
                placeholder="e.g., 2.5"
                required
              />
            </div>

            <div className="form-group">
              <label>
                <Tag size={16} /> Category
              </label>
              <select
                name="category"
                value={skillInfo.category}
                onChange={handleChange}
                required
              >
                <option value="">Select Category</option>
                {skillCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>
              <FileText size={16} /> Description
            </label>
            <textarea
              name="description"
              value={skillInfo.description}
              onChange={handleChange}
              className="summary-textarea"
              placeholder="Describe your experience with this skill..."
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

export default Skills;