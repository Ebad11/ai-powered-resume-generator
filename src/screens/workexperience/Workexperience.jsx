import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, Plus } from 'lucide-react';
import './style.css';

const Toast = ({ message }) => (
  <div className="toast">{message}</div>
);

const WorkExperience = () => {
  const navigate = useNavigate();
  const [experiences, setExperiences] = useState([]);
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
    setExperiences(prev => [...prev, { ...workExperience }]);
    setWorkExperience({
      companyName: '',
      postName: '',
      location: '',
      duration: '',
      information: ''
    });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormFilled()) {
      const allExperiences = [...experiences, workExperience];
      setExperiences(allExperiences);
      console.log("All Experiences:", allExperiences);
    }
    navigate('/next-route');
  };

  return (
    <div className="personal-info-container">
      {showToast && <Toast message="Experience saved! You can add more." />}

      <form onSubmit={handleSubmit}>
        <section className="info-section">
          <div className="title-container">
            <h2 className="title">Experience Details</h2>
            <span className="experience-count">
              {experiences.length} experiences added
            </span>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="companyName">Company Name</label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={workExperience.companyName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="postName">Post Name</label>
              <input
                type="text"
                id="postName"
                name="postName"
                value={workExperience.postName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={workExperience.location}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="startDate">Start Date</label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={workExperience.startDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="endDate">End Date</label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={workExperience.endDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group" style={{ marginTop: '20px' }}>
            <h2 className="title">Description</h2>
            <textarea
              name="information"
              value={workExperience.information}
              onChange={handleChange}
              className="summary-textarea"
              rows={8}
              placeholder="Describe your role and responsibilities..."
              required
            />
          </div>
        </section>

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
  );
};

export default WorkExperience;