import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, Plus, Building, GraduationCap, BookOpen, Calendar, Award, Trophy } from 'lucide-react';
import { ResumeContext } from '../../utils/ResumeContext';
import './style.css';

const Toast = ({ message }) => (
  <div className="toast">{message}</div>
);

const Education = () => {
  const navigate = useNavigate();
  const { resume, setResume } = useContext(ResumeContext);
  const [showToast, setShowToast] = useState(false);
  const [education, setEducation] = useState({
    instituteName: '',
    degree: '',
    field: '',
    startDate: '',
    endDate: '',
    grade: '',
    achievements: ''
  });

  const isFormFilled = () => Object.values(education).every(value => value.trim() !== '');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEducation(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddMore = () => {
    setResume(prevResume => ({
      ...prevResume,
      education: [
        ...(prevResume.educationDetails || []),
        { ...education }
      ]
    }));

    setEducation({
      instituteName: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      grade: '',
      achievements: ''
    });

    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormFilled()) {
      setResume(prevResume => ({
        ...prevResume,
        education: [
          ...(prevResume.educationDetails || []),
          { ...education }
        ]
      }));
    }
    navigate('/screen/skills');
  };

  return (
    <div className="personal-info-container">
      <div className="form-wrapper">
        {showToast && <Toast message="Education details saved! You can add more." />}

        <form onSubmit={handleSubmit}>
          <h2 className="section-title">Education Details_</h2>
          <span className="experience-count">
            {(resume.educationDetails?.length || 0)} education details added
          </span>

          <div className="form-grid">
            <div className="form-group">
              <label>
                <Building size={16} /> Institute_Name
              </label>
              <input
                type="text"
                name="instituteName"
                value={education.instituteName}
                onChange={handleChange}
                placeholder="Enter institute name..."
                required
              />
            </div>

            <div className="form-group">
              <label>
                <GraduationCap size={16} /> Degree_
              </label>
              <input
                type="text"
                name="degree"
                value={education.degree}
                onChange={handleChange}
                placeholder="Enter degree..."
                required
              />
            </div>

            <div className="form-group">
              <label>
                <BookOpen size={16} /> Field_Of_Study
              </label>
              <input
                type="text"
                name="field"
                value={education.field}
                onChange={handleChange}
                placeholder="Enter field of study..."
                required
              />
            </div>

            <div className="form-group">
              <label>
                <Award size={16} /> Grade/CGPA
              </label>
              <input
                type="text"
                name="grade"
                value={education.grade}
                onChange={handleChange}
                placeholder="Enter grade/CGPA..."
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
                value={education.startDate}
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
                value={education.endDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>
              <Trophy size={16} /> Achievements_
            </label>
            <textarea
              name="achievements"
              value={education.achievements}
              onChange={handleChange}
              className="summary-textarea"
              placeholder="List your academic achievements, awards, or notable projects..."
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

export default Education;