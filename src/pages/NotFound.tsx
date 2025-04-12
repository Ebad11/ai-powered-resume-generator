
import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFound: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full hud-panel text-center py-10"
      >
        <div className="mb-6 relative mx-auto w-24 h-24">
          <div className="absolute inset-0 rounded-full border-2 border-jarvis-red/50 animate-pulse"></div>
          <div className="absolute inset-4 rounded-full border-2 border-jarvis-red flex items-center justify-center">
            <span className="text-jarvis-red text-4xl font-bold">404</span>
          </div>
        </div>
        
        <h1 className="jarvis-title text-3xl mb-4">System Error</h1>
        <p className="text-gray-300 mb-6">The requested resource could not be located.</p>
        
        <Link to="/" className="jarvis-button inline-block cursor-none">
          Return to Main Interface
        </Link>
        
        <div className="mt-8 text-xs text-jarvis-red/70">
          <p>Error code: 404</p>
          <p>Path: {location.pathname}</p>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
