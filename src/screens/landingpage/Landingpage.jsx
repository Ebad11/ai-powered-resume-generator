import React, { Suspense, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ContactShadows, Environment, OrbitControls } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import './style.css';
import Robo1 from '../../components/Robo1';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/imgs/logo.jpg';
import CustomCursor from '../../components/cursor/Cursor';


const useMousePosition = () => {
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event) => {
      setMousePosition({
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  return mousePosition;
};

const RotatingRoboScene = () => {
  const mouse = useMousePosition();
  const { scene, camera } = useThree();

  useFrame(() => {
    const roboObject = scene.getObjectByName('Sketchfab_Scene');
    if (roboObject) {
      const objectPosition = roboObject.position || new THREE.Vector3(0, 2, 0);
      const targetPosition = new THREE.Vector3(mouse.x * 10, mouse.y * 10, 5);
      const direction = targetPosition.clone().sub(objectPosition).normalize();
      const lookAtVector = new THREE.Vector3(direction.x, direction.y, direction.z);
      roboObject.lookAt(lookAtVector);
      roboObject.rotation.set(0, 0, 0);
      roboObject.lookAt(lookAtVector);
      roboObject.rotation.x = Math.max(-Math.PI / 6, Math.min(Math.PI / 6, roboObject.rotation.x));
      roboObject.rotation.z = 0;
    }
  });

  return <Robo1 scale={20} position={[0, 2, 0]} rotation={[-Math.PI /0.9, -Math.PI / 1, -Math.PI / 1]} />;
};

const Landingpage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/screen');
    window.scrollTo(0, 0);
  };

  const textVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 1.2, ease: "easeOut", staggerChildren: 0.3 }
    }
  };

  const buttonVariants = {
    hover: { scale: 1.1, boxShadow: "0 0 20px rgba(0, 255, 255, 0.7)", transition: { duration: 0.3 } },
    tap: { scale: 0.95 }
  };

  return (
    <div className="cyber-landing-container">
              <CustomCursor />

      <div className="cyber-grid"></div>

      <motion.div className="glitch-container" initial="hidden" animate="visible" variants={textVariants}>
        <h1 className="cyber-title">
          <div className="logo-title-wrapper">
            <motion.img 
              src={logo} 
              alt="GEN Resume Logo" 
              className="logo-image" 
              whileHover={{ rotate: 360, transition: { duration: 1 } }}
            />
            <span className="glitch" data-text="GEN-RESUME">GEN-RESUME</span>
          </div>
        </h1>
        <motion.div 
          className="subtitle"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 1.2 }}
        >
          NEXT-GEN RESUME BUILDER
        </motion.div>
        <motion.p
          className="intro-text"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1.5 }}
        >
          Transform your career with AI-driven resume creation
        </motion.p>
        <motion.button 
          className="cyber-button intro-button"
          onClick={handleGetStarted}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          Try Now
        </motion.button>
      </motion.div>

      {/* 3D Robo Section */}
      <div className="cyber-center-section">
        <Canvas style={{ height: '45vh', width: '30%', background: 'transparent' }} camera={{ position: [0, 2, 15], fov: 60 }}>
          <Suspense fallback={null}>
            <ambientLight intensity={0.6} />
            <pointLight position={[10, 10, 10]} intensity={2} color="#00fff2" />
            <spotLight position={[0, 5, 5]} angle={0.3} intensity={1.5} color="#00fff2" />
            <RotatingRoboScene />
            <OrbitControls 
              enablePan={false} 
              enableZoom={false}
              minPolarAngle={Math.PI / 4}
              maxPolarAngle={Math.PI / 2}
              autoRotate={false}
            />
            <Environment preset="city" background={false} />
            <ContactShadows position={[0, -4, 0]} opacity={0.7} scale={15} blur={3} color="#00fff2" />
          </Suspense>
        </Canvas>
      </div>

      {/* Features Section */}
      <div className="features-section">
        <h2 className="section-title">Why Choose GEN-Resume?</h2>
        <motion.div className="feature-grid" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 1.2 }}>
          <div className="cyber-card">
            <div className="feature-item">
              <span className="feature-icon">🤖</span>
              <h3 className="feature-title">AI-Powered Design</h3>
              <p className="feature-description">Create stunning resumes with cutting-edge AI technology.</p>
            </div>
          </div>
          <div className="cyber-card">
            <div className="feature-item">
              <span className="feature-icon">⚡</span>
              <h3 className="feature-title">Instant Generation</h3>
              <p className="feature-description">Generate professional resumes in seconds.</p>
            </div>
          </div>
          <div className="cyber-card">
            <div className="feature-item">
              <span className="feature-icon">🌐</span>
              <h3 className="feature-title">Customizable Templates</h3>
              <p className="feature-description">Choose from a variety of futuristic templates.</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Testimonials Section */}
      <div className="testimonials-section">
        <h2 className="section-title">What Users Say</h2>
        <motion.div className="testimonial-grid" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5, duration: 1.2 }}>
          <div className="cyber-card testimonial-card">
            <p className="testimonial-text">"This tool transformed my resume in minutes! I landed my dream job!"</p>
            <p className="testimonial-author">- Sarah K., Software Engineer</p>
          </div>
          <div className="cyber-card testimonial-card">
            <p className="testimonial-text">"The AI suggestions were spot-on. Highly recommend!"</p>
            <p className="testimonial-author">- Michael P., Graphic Designer</p>
          </div>
        </motion.div>
      </div>

      {/* Call-to-Action Banner */}
      <div className="cta-banner">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5 }}
        >
          <h2 className="cta-title">Ready to Build Your Future?</h2>
          <p className="cta-text">Join thousands of professionals using GEN-Resume to stand out.</p>
          <motion.button 
            className="cyber-button cta-button"
            onClick={handleGetStarted}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            Get Started Now
          </motion.button>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="cyber-footer">
        <div className="footer-content">
          <p>&copy; 2025 GEN-Resume. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landingpage;