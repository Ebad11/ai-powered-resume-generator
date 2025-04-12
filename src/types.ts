
export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  skills: string[];
  experience: Experience[];
  education: Education[];
  projects: Project[];
  achievements: Achievement[];
  keywords: string[];
  needsResumeData: boolean;
  hasGeneratedContent: boolean;
}

export interface Experience {
  title: string;
  description: string;
  duration: string;
  _id?: string;
}

export interface Education {
  title: string;
  description: string;
  _id?: string;
}

export interface Project {
  title: string;
  description: string;
  _id?: string;
}

export interface Achievement {
  title: string;
  description: string;
  _id?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface SignupResponse {
  message: string;
  email: string;
}

export interface OtpVerifyResponse {
  message: string;
  token: string;
  user: User;
}

export interface GenerateResumeParams {
  template: 'template1' | 'template2' | 'template3';
  regenerateContent: boolean;
  position?: string;
  field?: string;
}

export interface GenerateResumeResponse {
  success: boolean;
  document: string; // base64
  fileName: string;
}

export interface TailorResumeParams {
  position: string;
  field: string;
  template: 'template1' | 'template2' | 'template3';
}
