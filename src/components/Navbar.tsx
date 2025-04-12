
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, User } from 'lucide-react';
import logo from '../assets/images/logo.jpg'

const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();

  // Skip navbar on landing page
  if (location.pathname === '/') {
    return null;
  }

  return (
    <header className="relative z-10 border-b border-jarvis-red/30 backdrop-blur bg-jarvis-dark/80">
      <div className="container mx-auto flex items-center justify-between py-4 px-4">
        <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full border-2 border-jarvis-gold flex items-center justify-center overflow-hidden animate-pulse">
            <div className="w-full h-full bg-jarvis-red opacity-70" >
              <img src={logo} className='h-7'/>
            </div>
          </div>
          <h1 className="jarvis-title text-2xl">GEN-RESUME</h1>
        </Link>

        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <span className="text-jarvis-gold text-sm hidden md:inline-block">
                Welcome, {user?.name.split(' ')[0]}
              </span>
              <div className="group relative">
                <button 
                  className="flex items-center space-x-2 px-3 py-1 rounded-md border border-jarvis-red/30 hover:bg-jarvis-red/10 transition-all"
                  onClick={logout}
                >
                  <LogOut size={18} className="text-jarvis-red" />
                  <span className="text-jarvis-light hidden md:inline-block">Power Down</span>
                </button>
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-jarvis-red scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-3">
              <Link
                to="/login"
                className="flex items-center space-x-1 px-3 py-1 rounded-md hover:bg-jarvis-red/10 transition-all"
              >
                <User size={16} className="text-jarvis-red" />
                <span>Login</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
