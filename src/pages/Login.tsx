
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { loginWithGoogle, login } from '@/utils/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

const Login: React.FC = () => {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Check for tokens in URL (for Google OAuth callback)
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get('token');
    const needsResumeData = queryParams.get('needsResumeData') === 'true';

    if (token) {
      localStorage.setItem('token', token);
      toast({
        title: 'Access granted',
        description: 'Login successful',
      });
      
      // Redirect based on whether user needs to complete profile
      if (needsResumeData) {
        navigate('/update-profile');
      } else {
        navigate('/dashboard');
      }
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!emailOrPhone || !password) {
      toast({
        title: 'Validation Error',
        description: 'Email/Phone and password are required',
        variant: 'destructive',
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await login(emailOrPhone, password);
      localStorage.setItem('token', response.token);
      setUser(response.user);
      
      // Display success message with JARVIS style
      toast({
        title: 'Access granted, sir',
        description: 'Systems online and operational',
      });
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <motion.div 
        className="max-w-md w-full hud-panel"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-6 text-center">
          <h2 className="jarvis-title text-3xl mb-2">System Access</h2>
          <p className="text-jarvis-red/80 text-sm">Biometric scan bypassed. Manual authentication required.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm text-jarvis-gold mb-1" htmlFor="emailOrPhone">
              Email / Phone
            </label>
            <input
              id="emailOrPhone"
              type="text"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              className="hud-input w-full"
              placeholder="Enter email or phone"
            />
          </div>
          
          <div>
            <label className="block text-sm text-jarvis-gold mb-1" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="hud-input w-full"
              placeholder="Enter password"
            />
          </div>
          
          <button 
            type="submit" 
            className="jarvis-button w-full cursor-none"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <span className="mr-2">Processing</span>
                <span className="animate-bounce inline-block">.</span>
                <span className="animate-bounce inline-block delay-75">.</span>
                <span className="animate-bounce inline-block delay-150">.</span>
              </span>
            ) : (
              <span>Access System</span>
            )}
          </button>
        </form>
        
        <div className="mt-6">
          <div className="relative flex items-center justify-center">
            <div className="absolute left-0 w-1/4 h-[1px] bg-jarvis-red/30"></div>
            <span className="text-jarvis-gold/70 text-sm px-2">OR</span>
            <div className="absolute right-0 w-1/4 h-[1px] bg-jarvis-red/30"></div>
          </div>
          
          <button 
            onClick={loginWithGoogle}
            className="mt-4 w-full py-2  cursor-none px-4 border border-jarvis-gold/50 hover:bg-jarvis-gold/10 rounded-md flex items-center justify-center space-x-2 transition-all"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
              <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
                <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
                <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
                <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
              </g>
            </svg>
            <span className="text-white">Continue with Google</span>
          </button>
        </div>
        
        <div className="mt-8 text-center text-sm">
          <p className="text-jarvis-light/70">
            Don't have an account?{' '}
            <Link to="/signup" className="text-jarvis-gold hover:underline">
              Create Access Profile
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
