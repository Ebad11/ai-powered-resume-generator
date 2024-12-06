import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, Plus } from 'lucide-react';
import './style.css';

const Toast = ({ message }) => (
  <div className="toast">{message}</div>
);

const Education = () => {
  const navigate = useNavigate();
  const [educations, setEducations] = useState([]);
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
    setEducations(prev => [...prev, { ...education }]);
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
      const allEducation = [...educations, education];
      setEducations(allEducation);
      console.log("All Education:", allEducation);
    }
    navigate('/next-route');
  };

  return (
    <div className="personal-info-container">
      {showToast && <Toast message="Education details saved! You can add more." />}

      <form onSubmit={handleSubmit}>
        <section className="info-section">
          <div className="title-container">
            <h2 className="title">Education Details</h2>
            <span className="experience-count">
              {educations.length} education details added
            </span>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="instituteName">Institute Name</label>
              <input
                type="text"
                id="instituteName"
                name="instituteName"
                value={education.instituteName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="degree">Degree</label>
              <input
                type="text"
                id="degree"
                name="degree"
                value={education.degree}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="field">Field of Study</label>
              <input
                type="text"
                id="field"
                name="field"
                value={education.field}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="grade">Grade/CGPA/Percentage</label>
              <input
                type="text"
                id="grade"
                name="grade"
                value={education.grade}
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
                value={education.startDate}
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
                value={education.endDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group" style={{ marginTop: '20px' }}>
            <h2 className="title">Achievements</h2>
            <textarea
              name="achievements"
              value={education.achievements}
              onChange={handleChange}
              className="summary-textarea"
              rows={8}
              placeholder="List your academic achievements, awards, or notable projects..."
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

export default Education;