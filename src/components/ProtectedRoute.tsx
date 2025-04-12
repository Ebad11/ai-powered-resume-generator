
import { ReactNode, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading, needsResumeData } = useAuth();
  const location = useLocation();

  // If still loading, don't render anything yet
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-jarvis-red animate-pulse text-2xl">
          <span className="mr-2">Initializing systems</span>
          <span className="animate-bounce inline-block">.</span>
          <span className="animate-bounce inline-block delay-75">.</span>
          <span className="animate-bounce inline-block delay-150">.</span>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If authenticated but needs resume data and not already on the update profile page
  if (needsResumeData && location.pathname !== '/update-profile') {
    return <Navigate to="/update-profile" state={{ from: location }} replace />;
  }

  // If all conditions pass, render the children
  return <>{children}</>;
};

export default ProtectedRoute;
