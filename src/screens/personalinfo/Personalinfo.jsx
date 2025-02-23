import React, { useContext } from 'react';
import { ArrowRight, User, Mail, Phone, Briefcase, LinkedinIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ResumeContext } from '../../utils/ResumeContext';
import './style.css';

const PersonalInfo = () => {
    const navigate = useNavigate();
    const { resume, setResume } = useContext(ResumeContext);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setResume((prevResume) => ({
            ...prevResume,
            personalInfo: {
                ...prevResume.personalInfo,
                [name]: value,
            },
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate('/screen/work-experience');
    };

    return (
        <div className="personal-info-container">
            <div className="form-wrapper">
                <form>
                    <h2 className="section-title">Personal Info_</h2>
                    
                    <div className="form-grid">
                        <div className="form-group">
                            <label>
                                <User size={16} /> First_Name
                            </label>
                            <input
                                type="text"
                                name="firstName"
                                value={resume.personalInfo?.firstName || ''}
                                onChange={handleChange}
                                placeholder="Enter first name..."
                            />
                        </div>

                        <div className="form-group">
                            <label>
                                <User size={16} /> Last_Name
                            </label>
                            <input
                                type="text"
                                name="lastName"
                                value={resume.personalInfo?.lastName || ''}
                                onChange={handleChange}
                                placeholder="Enter last name..."
                            />
                        </div>

                        <div className="form-group">
                            <label>
                                <Phone size={16} /> Phone_Number
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={resume.personalInfo?.phone || ''}
                                onChange={handleChange}
                                placeholder="Enter phone number..."
                            />
                        </div>

                        <div className="form-group">
                            <label>
                                <Mail size={16} /> Email_Address
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={resume.personalInfo?.email || ''}
                                onChange={handleChange}
                                placeholder="Enter email..."
                            />
                        </div>

                        <div className="form-group">
                            <label>
                                <Briefcase size={16} /> Title_Position
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={resume.personalInfo?.title || ''}
                                onChange={handleChange}
                                placeholder="Enter professional title..."
                            />
                        </div>

                        <div className="form-group">
                            <label>
                                <LinkedinIcon size={16} /> LinkedIn_Profile
                            </label>
                            <input
                                type="text"
                                name="linkedin"
                                value={resume.personalInfo?.linkedin || ''}
                                onChange={handleChange}
                                placeholder="Enter LinkedIn URL..."
                            />
                        </div>
                    </div>

                    <button onClick={handleSubmit} className="next-button">
                        Next <ArrowRight size={20} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PersonalInfo;