
import axios from 'axios';
import { toast } from '@/hooks/use-toast';
import { 
  ApiResponse, 
  LoginResponse, 
  SignupResponse, 
  OtpVerifyResponse, 
  User, 
  GenerateResumeParams, 
  GenerateResumeResponse,
  TailorResumeParams
} from '@/types';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data?.message || error.message);
    toast({
      title: 'Error',
      description: error.response?.data?.message || 'Something went wrong',
      variant: 'destructive'
    });
    return Promise.reject(error);
  }
);

// Auth APIs
export const loginWithGoogle = () => {
  window.location.href = `${API_BASE_URL}/auth/google`;
};

export const login = async (emailOrPhone: string, password: string): Promise<LoginResponse> => {
  const response = await api.post('/auth/login', { emailOrPhone, password });
  return response.data;
};

export const signup = async (userData: {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  skills: string[];
  experience: { title: string; description: string; duration: string }[];
  education: { title: string; description: string }[];
  projects: { title: string; description: string }[];
  achievements: { title: string; description: string }[];
  keywords: string[];
}): Promise<SignupResponse> => {
  const response = await api.post('/auth/signup', userData);
  return response.data;
};

export const verifyOtp = async (email: string, otp: string): Promise<OtpVerifyResponse> => {
  const response = await api.post('/auth/verify-otp', { email, otp });
  return response.data;
};

export const getMe = async (): Promise<{ user: User; needsResumeData: boolean; hasGeneratedContent: boolean; tailoredResumes: any[] }> => {
  const response = await api.get('/auth/me');
  return response.data;
};

export const updateResumeData = async (data: {
  skills: string[];
  experience: { title: string; description: string; duration: string }[];
  education: { institution: string; degree: string; duration:string }[];
  projects: { title: string; description: string }[];
  achievements: { title: string; description: string }[];
  keywords: string[];
}): Promise<ApiResponse<any>> => {
  const response = await api.put('/auth/update-resume-data', data);
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
  window.location.href = '/login';
};

// Resume APIs
export const generateResume = async (params: GenerateResumeParams): Promise<GenerateResumeResponse> => {
  const response = await api.post('/resume/generate', params);
  return response.data;
};

export const tailorResume = async (params: TailorResumeParams): Promise<ApiResponse<any>> => {
  const response = await api.post('/resume/tailor-resume', params);
  return response.data;
};

export default api;
