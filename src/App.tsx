import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import VerifyOtp from "@/pages/VerifyOtp";
import Dashboard from "@/pages/Dashboard";
import UpdateProfile from "@/pages/UpdateProfile";
import NotFound from "@/pages/NotFound";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import CustomCursor from "./components/ui/custom-cursor";

const queryClient = new QueryClient();

// Google Callback Component
const GoogleCallback: React.FC = () => {
  const location = useLocation();
  const { setUser, setNeedsResumeData } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');
    const needsResumeData = queryParams.get('needsResumeData') === 'true';

    if (token) {
      localStorage.setItem('token', token); // Store token
      toast({
        title: 'Success',
        description: 'Logged in with Google!',
      });

      // Fetch user data to update AuthContext
      const fetchUser = async () => {
        try {
          const response = await fetch('http://localhost:5000/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await response.json();
          setUser(data.user);
          setNeedsResumeData(data.needsResumeData);
          window.location.href = needsResumeData ? '/update-profile' : '/dashboard';
        } catch (error) {
          console.error('Failed to fetch user:', error);
          localStorage.removeItem('token');
          toast({
            title: 'Error',
            description: 'Google login failed',
            variant: 'destructive',
          });
          window.location.href = '/login';
        }
      };

      fetchUser();
    } else {
      toast({
        title: 'Error',
        description: 'No token received from Google login',
        variant: 'destructive',
      });
      window.location.href = '/login';
    }
  }, [location, setUser, setNeedsResumeData, toast]);

  return <div>Processing Google login...</div>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
        <CustomCursor/>
          <Layout>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/verify-otp" element={<VerifyOtp />} />
              <Route path="/google-callback" element={<GoogleCallback />} /> {/* New route */}
              
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/update-profile" element={
                <ProtectedRoute>
                  <UpdateProfile />
                </ProtectedRoute>
              } />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;