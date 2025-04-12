
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { verifyOtp } from '@/utils/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

const VerifyOtp: React.FC = () => {
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(300); // 5 minutes in seconds
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Get email from query parameter
    const params = new URLSearchParams(location.search);
    const emailParam = params.get('email');
    
    if (emailParam) {
      setEmail(emailParam);
    } else {
      // If no email found, redirect to login
      navigate('/login');
    }
    
    // Countdown timer
    const timer = setInterval(() => {
      setCountdown(prevCountdown => {
        if (prevCountdown <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prevCountdown - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [location.search, navigate]);

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    // Allow only numbers and limit to 6 characters
    const numericInput = input.replace(/[^0-9]/g, '').slice(0, 6);
    setOtp(numericInput);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (otp.length !== 6) {
      toast({
        title: 'Validation Error',
        description: 'OTP must be 6 digits',
        variant: 'destructive',
      });
      return;
    }
    
    if (countdown === 0) {
      toast({
        title: 'OTP Expired',
        description: 'Please request a new OTP',
        variant: 'destructive',
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await verifyOtp(email, otp);
      
      // Store token and user data
      localStorage.setItem('token', response.token);
      setUser(response.user);
      
      toast({
        title: 'Verification successful',
        description: 'Systems online',
      });
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('OTP verification failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <motion.div 
        className="max-w-md w-full hud-panel"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-6 text-center">
          <h2 className="jarvis-title text-3xl mb-2">OTP Verification</h2>
          <p className="text-jarvis-red/80 text-sm">Enter the 6-digit code sent to {email}</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <div className="flex justify-center mb-4">
              <div className="w-full max-w-sm relative">
                <input
                  type="text"
                  value={otp}
                  onChange={handleChange}
                  className="hud-input w-full text-center tracking-[1em] text-2xl py-4"
                  placeholder="------"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                />
                
                {/* Fancy HUD overlay effect */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-0 left-0 w-full h-[1px] bg-jarvis-red/40"></div>
                  <div className="absolute bottom-0 left-0 w-full h-[1px] bg-jarvis-red/40"></div>
                  <div className="absolute top-0 left-0 h-full w-[1px] bg-jarvis-red/40"></div>
                  <div className="absolute top-0 right-0 h-full w-[1px] bg-jarvis-red/40"></div>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <div className={`text-sm mb-1 ${countdown < 60 ? 'text-jarvis-red' : 'text-gray-400'}`}>
                Expires in: {formatTime(countdown)}
              </div>
            </div>
          </div>
          
          <button 
            type="submit" 
            className="jarvis-button w-full cursor-none"
            disabled={isLoading || countdown === 0}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <span className="mr-2">Verifying</span>
                <span className="animate-bounce inline-block">.</span>
                <span className="animate-bounce inline-block delay-75">.</span>
                <span className="animate-bounce inline-block delay-150">.</span>
              </span>
            ) : countdown === 0 ? (
              <span>OTP Expired</span>
            ) : (
              <span>Verify Code</span>
            )}
          </button>
        </form>
        
        <div className="mt-8 text-center text-sm">
          <p className="text-jarvis-light/70">
            Didn't receive the code?{' '}
            <a href="/login" className="text-jarvis-gold hover:underline">
              Restart Process
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyOtp;
