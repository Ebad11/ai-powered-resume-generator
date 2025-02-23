import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Building, MapPin, Calendar, FileText, Plus, Briefcase } from 'lucide-react';
import { ResumeContext } from '../../utils/ResumeContext';
import './style.css';

const Toast = ({ message }) => (
  <div className="toast">{message}</div>
);

const WorkExperience = () => {
  const navigate = useNavigate();
  const { resume, setResume } = useContext(ResumeContext);
  const [showToast, setShowToast] = useState(false);
  const [workExperience, setWorkExperience] = useState({
    companyName: '',
    postName: '',
    location: '',
    startDate: '',
    endDate: '',
    information: ''
  });

  const isFormFilled = () => Object.values(workExperience).every(value => value.trim() !== '');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setWorkExperience(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddMore = () => {
    // Update the resume context with the new experience
    setResume(prevResume => ({
      ...prevResume,
      workExperiences: [
        ...(prevResume.workExperiences || []),
        { ...workExperience }
      ]
    }));

    // Reset the form
    setWorkExperience({
      companyName: '',
      postName: '',
      location: '',
      startDate: '',
      endDate: '',
      information: ''
    });

    // Show toast
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormFilled()) {
      // Add the current experience to the resume context before navigating
      setResume(prevResume => ({
        ...prevResume,
        workExperiences: [
          ...(prevResume.workExperiences || []),
          { ...workExperience }
        ]
      }));
      console.log("Updated Resume:", resume);
    }
    navigate('/screen/education');
  };

  return (
    <div className="personal-info-container">
      {showToast && <Toast message="Experience saved! You can add more." />}

      <div className="form-wrapper">
        <form onSubmit={handleSubmit}>
          <h2 className="section-title">Work Experience_</h2>
          <span className="experience-count">
            {(resume.workExperiences?.length || 0)} experiences added
          </span>
          <div className="form-grid">
            <div className="form-group">
              <label>
                <Building size={16} /> Company_Name
              </label>
              <input
                type="text"
                name="companyName"
                value={workExperience.companyName}
                onChange={handleChange}
                placeholder="Enter company name..."
              />
            </div>

            <div className="form-group">
              <label>
                <Briefcase size={16} /> Post_Name
              </label>
              <input
                type="text"
                name="postName"
                value={workExperience.postName}
                onChange={handleChange}
                placeholder="Enter post name..."
              />
            </div>

            <div className="form-group">
              <label>
                <MapPin size={16} /> Location
              </label>
              <input
                type="text"
                name="location"
                value={workExperience.location}
                onChange={handleChange}
                placeholder="Enter location..."
              />
            </div>

            <div className="form-group">
              <label>
                <Calendar size={16} /> Start_Date
              </label>
              <input
                type="date"
                name="startDate"
                value={workExperience.startDate}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>
                <Calendar size={16} /> End_Date
              </label>
              <input
                type="date"
                name="endDate"
                value={workExperience.endDate}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group full-width">
            <label>
              <FileText size={16} /> Description_
            </label>
            <textarea
              name="information"
              value={workExperience.information}
              onChange={handleChange}
              placeholder="Describe your role and responsibilities..."
              className="description-input"
            />
          </div>

          <div className="button-group">
            <button type="button" className="add-button" onClick={handleAddMore}>
              Add More <Plus size={20} />
            </button>
            <button type="submit" className="next-button">
              Next <ArrowRight size={20} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WorkExperience;