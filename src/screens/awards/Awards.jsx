import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, Plus, Award, Calendar, Tag, FileText } from 'lucide-react';
import { ResumeContext } from '../../utils/ResumeContext';
import './style.css';

const Toast = ({ message }) => (
  <div className="toast">{message}</div>
);

const AwardsHonours = () => {
  const navigate = useNavigate();
  const { resume, setResume } = useContext(ResumeContext);
  const [showToast, setShowToast] = useState(false);
  const [currentAward, setCurrentAward] = useState({
    awardTitle: '',
    issuer: '',
    dateReceived: '',
    category: '',
    description: ''
  });

  // const data = {
  //   personalInfo: {
  //     firstName: "Anjan",
  //     lastName: "Thakur",
  //     email: "thakuranjan2006@gmail.com",
  //     phone: "9967660765"
  //   },
  //   templet: "template1",
  //   skills: [
  //     {
  //       skillName: "Python",
  //       proficiencyLevel: "Beginner",
  //       yearsOfExperience: "0.5",
  //       category: "Technical Skills"
  //     },
  //     {
  //       skillName: "C",
  //       proficiencyLevel: "Beginner",
  //       yearsOfExperience: "0.3",
  //       category: "Technical Skills"
  //     },
  //     {
  //       skillName: "JavaScript",
  //       proficiencyLevel: "Beginner",
  //       yearsOfExperience: "0.3",
  //       category: "Technical Skills"
  //     }
  //   ],
  //   workExperiences: [
  //     {
  //       postName: "Web Development Intern",
  //       companyName: "Lotus Educare Academy",
  //       location: "India",
  //       description: "Completed a 6-week internship in web development, during which I developed a billing system for a mart as a team using Node.js. Contributed to designing and implementing backend functionalities, ensuring smooth operation of the system.",
  //       startDate: "2023-06-01",
  //       endDate: "2023-07-21"
  //     }
  //   ],
  //   education: [
  //     {
  //       degree: "Diploma",
  //       instituteName: "Bharati Vidyapeeth Institute of Technology ",
  //       field: "Computer Technology",
  //       startDate: "2021-08-21",
  //       endDate: "2024-06-15"
  //     },
  //     {
  //       degree: "B.Tech",
  //       instituteName: "Fr. Conceicao Rodrigues Institute of Technology",
  //       field: "Computer Engineering",
  //       startDate: "2024-09-5",
  //       endDate: "2027-06-15"
  //     }
  //   ],
  //   projects: [
  //     {
  //       projectName: "Plant Disease Detection System",
  //       role: "Lead Developer",
  //       technologies: ["Python", "Flask", "PyTorch", "OpenCV"],
  //       description: "Designed and implemented a CNN-based system for detecting plant diseases in real-time using Python and Flask. Integrated image processing techniques and data augmentation for robustness and scalability. Developed a user-friendly web interface for farmers and agricultural workers to upload images and receive actionable insights.",
  //       startDate: "2024-11-12",
  //       endDate: "Ongoing"
  //     },
  //     {
  //       projectName: "Eye-Controlled Keyboard",
  //       role: "Solo Developer",
  //       technologies: ["Python", "OpenCV"],
  //       description: "Created a Python-based virtual keyboard system controlled through eye movements using OpenCV. Developed the application to assist individuals with physical disabilities, providing a functional, executable file as the output.",
  //       startDate: "2024-02-12",
  //       endDate: "2024-08-16"
  //     },
  //     {
  //       projectName: "Billing System for Mart",
  //       role: "Team Member",
  //       technologies: ["Node.js", "Express.js"],
  //       description: "Collaboratively developed a billing system for a mart as part of a team. Contributed equally to the design and backend implementation using Node.js, ensuring reliable and efficient transaction handling.",
  //       startDate: "2023-06-01",
  //       endDate: "2023-07-21"
  //     }
  //   ],
  //   awards: [
  //   {}
  //   ]
  // };

  const generateResume = async (resumeData) => {
    try {
      const safeJoin = (arr, separator = ', ') => {
        if (Array.isArray(arr)) {
          return arr.join(separator);
        }
        if (typeof arr === 'string') {
          return arr;
        }
        return '';
      };

      const formatDate = (dateString) => {
        if (!dateString) return 'Present';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
          year: 'numeric',
          month: 'long'
        });
      };

      const payload = {
        name: `${resumeData.personalInfo.firstName} ${resumeData.personalInfo.lastName}`,
        email: resumeData.personalInfo.email,
        phone: resumeData.personalInfo.phone,
        template: resumeData.templet,
        
        skills: (resumeData.skills || []).map(skill => 
          `${skill.skillName} (${skill.proficiencyLevel}, ${skill.yearsOfExperience} years, ${skill.category})`
        ),
        
        keywords: [
          ...new Set([
            ...(resumeData.skills || []).map(skill => skill.category),
            ...(resumeData.skills || []).map(skill => skill.skillName)
          ])
        ],
        
        experience: (resumeData.workExperiences || []).map(exp => ({
          title: exp.postName || '',
          description: `${exp.companyName || ''} - ${exp.location || ''}\n${exp.description || ''}`,
          duration: `${formatDate(exp.startDate)} - ${formatDate(exp.endDate)}`
        })),
        
        education: (resumeData.education || []).map(edu => ({
          degree: edu.degree || '',
          institution: edu.instituteName || '',
          year: edu.endDate ? edu.endDate.split('-')[0] : '',

          duration: `${formatDate(edu.startDate)} - ${formatDate(edu.endDate)}`,
          field: edu.field || ''
        })),
        
        projects: (resumeData.projects || []).map(project => ({
          title: project.projectName || '',
          description: `Role: ${project.role || ''}\nTechnologies: ${project.technologies ? safeJoin(project.technologies) : ''}\n${project.description || ''}`,
          duration: `${formatDate(project.startDate)} - ${formatDate(project.endDate)}`
        })),
        
        achievements: (resumeData.awards || []).map(award => ({
          title: award.awardTitle || '',
          description: `Issued by ${award.issuer || ''} (${award.category || ''})\nDate Received: ${formatDate(award.dateReceived)}\n${award.description || ''}`
        }))
      };

      payload.experience = payload.experience.filter(exp => exp.title && exp.description && exp.duration);
      payload.education = payload.education.filter(edu => edu.degree && edu.institution && edu.duration);
      payload.projects = payload.projects.filter(project => project.title && project.description);
      payload.achievements = payload.achievements.filter(achievement => achievement.title && achievement.description);

      console.log('Payload being sent:', payload);

      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/resume/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', errorText);
        throw new Error(`HTTP error! Status: ${response.status}, Details: ${errorText}`);
      }

      const result = await response.json();
      
      setResume(prev => ({
        ...prev,
        generatedDocument: {
          base64: result.document,
          fileName: result.fileName
        }
      }));
      console.log(result);

      navigate('/resume-display');
    } catch (error) {
      console.error('Error generating resume:', error);
      alert('Failed to generate resume. Please check console for details.');
    }
  };

  const awardCategories = [
    'Academic Excellence',
    'Professional Achievement',
    'Leadership',
    'Research',
    'Community Service',
    'Innovation',
    'Other'
  ];

  const isFormFilled = () => Object.values(currentAward).every(value => value.trim() !== '');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentAward(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddMore = () => {
    setResume(prevResume => ({
      ...prevResume,
      awards: [
        ...(prevResume.awards || []),
        { ...currentAward }
      ]
    }));

    setCurrentAward({
      awardTitle: '',
      issuer: '',
      dateReceived: '',
      category: '',
      description: ''
    });

    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormFilled()) {
      const updatedResume = {
        ...resume,
        awards: [
          ...(resume.awards || []),
          { ...currentAward }
        ]
      };
      setResume(updatedResume);
      generateResume(updatedResume);
 
    }
  };

  return (
    <div className="personal-info-container">
      <div className="form-wrapper">
        {showToast && <Toast message="Award saved! You can add more." />}

        <form onSubmit={handleSubmit}>
          <h2 className="section-title">Awards & Honours_</h2>
          <span className="experience-count">
            {(resume.awards?.length || 0)} awards added
          </span>

          <div className="form-grid">
            <div className="form-group">
              <label>
                <Award size={16} /> Award_Title
              </label>
              <input
                type="text"
                name="awardTitle"
                value={currentAward.awardTitle}
                onChange={handleChange}
                placeholder="e.g., Outstanding Achievement Award"
                required
              />
            </div>

            <div className="form-group">
              <label>
                <FileText size={16} /> Issuing_Organization
              </label>
              <input
                type="text"
                name="issuer"
                value={currentAward.issuer}
                onChange={handleChange}
                placeholder="e.g., IEEE"
                required
              />
            </div>

            <div className="form-group">
              <label>
                <Calendar size={16} /> Date_Received
              </label>
              <input
                type="date"
                name="dateReceived"
                value={currentAward.dateReceived}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>
                <Tag size={16} /> Category_
              </label>
              <select
                name="category"
                value={currentAward.category}
                onChange={handleChange}
                required
              >
                <option value="">Select Category</option>
                {awardCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>
              <FileText size={16} /> Description_
            </label>
            <textarea
              name="description"
              value={currentAward.description}
              onChange={handleChange}
              className="summary-textarea"
              placeholder="Describe the award and its significance..."
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

export default AwardsHonours;