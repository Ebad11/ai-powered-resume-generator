import React from 'react';
import { FiChevronDown } from 'react-icons/fi';
import './style.css'

const Header = () => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="nav-items">
          <div className="nav-item">
            <span>Dashboard</span>
            <FiChevronDown />
          </div>
          <div className="nav-item">
            <span>About us</span>
            <FiChevronDown />
          </div>
          <div className="nav-item">
            <span>English</span>
            <FiChevronDown />
          </div>
        </div>
        <div className="profile">
          <img 
            src="/api/placeholder/40/40" 
            alt="Profile" 
            className="profile-img" 
          />
          <div className="profile-info">
            <div>Tejas Patil</div>
            <div className="profile-role">Admin</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;