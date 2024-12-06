import React from 'react';
import './style.css'

const Footer = () => {
  return (
    <footer className="footer">
    <div className="footer-content">
      <div className="footer-section">
        <h3 className="footer-title">Nova Cops</h3>
      </div>
      <div className="footer-section">
        <h4 className="footer-subtitle">For Users</h4>
        <ul className="footer-list">
          <li>For Students</li>
          <li>For Employees</li>
          <li>Sign up</li>
        </ul>
      </div>
      <div className="footer-section">
        <h4 className="footer-subtitle">Services</h4>
        <ul className="footer-list">
          <li>Private data detector</li>
          <li>Test Class</li>
          <li>Duplicate Detector</li>
        </ul>
      </div>
      <div className="footer-section">
        <h4 className="footer-subtitle">Company</h4>
        <ul className="footer-list">
          <li>Blog</li>
          <li>About us</li>
          <li>Contact</li>
        </ul>
      </div>
    </div>
  </footer>
  );
};

export default Footer;