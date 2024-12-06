import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { ContactShadows, Environment, OrbitControls } from '@react-three/drei';
import './style.css';
import Robo from '../../components/Robo';
import { useNavigate } from 'react-router-dom';


const Landingpage = () => {

  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/screen');
  };

  return (
    <div className="landing-container">
      <div className="left-section">
        <h1>Welcome to GEN-RESUME</h1>
        <p>The ultimate companion for building your resume</p>
        <ul>
          <li>
            <strong>AI-Powered Optimization:</strong> Get personalized resume suggestions tailored to your skills and career goals.
          </li>
          <li>
            <strong>Customizable Templates:</strong> Choose from a variety of professionally designed resume formats.
          </li>
          <li>
            <strong>ATS Friendly:</strong> Ensure your resume passes Applicant Tracking Systems for better job application success.
          </li>
          <li>
            <strong>Multi-Export Options:</strong> Export your resume in PDF, Word, or plain text formats effortlessly.
          </li>
        </ul>
        <button className="get-started-button" onClick={handleGetStarted}>Get Started</button>
      </div>

      <div className="canvas-container">
        <Canvas style={{ backgroundColor: '#f5f5f5' }}>
          <Suspense fallback={null}>
            <Robo rotation={[Math.PI / 6, 6, 0]} />
            <OrbitControls enablePan={false} enableZoom={false} />
            <Environment preset="warehouse" />
            <ContactShadows position={[0, 0.5, 0]} />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
};

export default Landingpage;
