// components/PersonalInfo.js
import React, { useState } from 'react';
import './style.css';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


const PersonalInfo = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        title: '',
        linkedin: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        navigate('/screen/summary');
    };

    return (
        <div className="personal-info-container">
            <form onSubmit={handleSubmit}>
                <section className="info-section">
                    <h2 className="title">Personal Info.</h2>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>First Name</label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Last Name</label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Phone no.</label>
                            <input
                                type='tel'
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Email id</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </section>

                <section className="info-section">
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Title</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>LinkedIn</label>
                            <input
                                type="text"
                                name="linkedin"
                                value={formData.linkedin}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </section>
                <button type="submit" className="next-button">
                    Next <ArrowRight size={20} />
                </button>
            </form>
        </div>
    );
};

export default PersonalInfo;