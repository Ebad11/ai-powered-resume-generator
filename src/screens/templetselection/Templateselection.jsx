import React, { useContext } from 'react';
import { ResumeContext } from '../../utils/ResumeContext';
import './style.css';
import { useNavigate } from 'react-router-dom';
import Template1 from '../../assets/templates/Templet1';


const Templateselection = () => {
    const { setSelectedTemplate } = useContext(ResumeContext);
    const navigate=useNavigate();
      
    const templates = [
        { id: 1, name: 'template1',description:'Clean Professional' },
        { id: 2, name: 'template2', description:'Structured Classic' },
        { id: 3, name: 'template3', description:'Modern Elegance' },
    ];

    const handleSelectTemplate = (templateId) => {

        setSelectedTemplate(templateId);
        navigate('/screen/personal-info');
    };

    return (
        <>
            <div className='heading'></div>
            <div className="template-selection">
                {templates.map((template) => (
                    <div key={template.id} className="card" onClick={() => handleSelectTemplate(template.name)}>
                        <h3>{template.description}</h3>
                    </div>
                ))}
            </div>
        </>
    );
};

export default Templateselection;
