import React, { useState, useEffect } from 'react';
import './styles.css';
import logo from '../../assets/imgs/logo.jpg';


const Loginsignup = () => {
  const [isLoginActive, setIsLoginActive] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [particles, setParticles] = useState([]);

  // Toggle between login and signup
  const toggleForm = () => {
    setIsLoginActive(!isLoginActive);
  };

  // Submit handler
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log(isLoginActive ? 'Login' : 'Signup', { username, email, password });
  };

  // Generate random particles for background effect
  useEffect(() => {
    const generateParticles = () => {
      const newParticles = [];
      for (let i = 0; i < 50; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 3 + 1,
          speed: Math.random() * 1 + 0.2,
        });
      }
      setParticles(newParticles);
    };

    generateParticles();

    // Animate particles
    const animateParticles = setInterval(() => {
      setParticles(prevParticles =>
        prevParticles.map(particle => ({
          ...particle,
          y: particle.y + particle.speed > 100 ? 0 : particle.y + particle.speed
        }))
      );
    }, 50);

    return () => clearInterval(animateParticles);
  }, []);

  return (
    <div className="auth-container">
      {/* Background particles */}
      <div className="particles-container">
        {particles.map(particle => (
          <div
            key={particle.id}
            className="particle"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size+2}px`,
            }}
          />
        ))}
      </div>

      {/* Grid lines */}
      <div className="grid-lines horizontal" />
      <div className="grid-lines vertical" />

      <div className="auth-box">
      <div className="logo-container">
  <div className="logo">
    <div className="logo-inner">
      <img src={logo} alt="Logo" className="logo-image" />
    </div>
  </div>
  <h1 className="glow-text">GEN-RESUME</h1>
</div>
        
        <div className="form-container">
          <h2 className="form-title glow-text">
            {isLoginActive ? 'ACCESS PORTAL' : 'CREATE PROFILE'}
          </h2>
          
          <form onSubmit={handleSubmit}>
            {!isLoginActive && (
              <div className="input-group">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  // required
                  className="cyber-input"
                />
                <span className="input-highlight"></span>
                <label>Username</label>
              </div>
            )}
            
            <div className="input-group">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                // required
                className="cyber-input"
              />
              <span className="input-highlight"></span>
              <label>Email</label>
            </div>
            
            <div className="input-group">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                // required
                className="cyber-input"
              />
              <span className="input-highlight"></span>
              <label>Password</label>
            </div>
            
            <button type="submit" className="cyber-button">
              <span className="button-content">
                {isLoginActive ? 'LOGIN' : 'SIGNUP'}
              </span>
              <span className="button-glitch"></span>
            </button>
          </form>
          
          <div className="form-switch">
            <p>
              {isLoginActive ? "Don't have an account?" : "Already have an account?"}
              <span className="switch-link" onClick={toggleForm}>
                {isLoginActive ? ' SIGNUP' : ' LOGIN'}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loginsignup;