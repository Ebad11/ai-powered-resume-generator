
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signup,loginWithGoogle } from '@/utils/api';
import { toast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { Plus, Trash2 } from 'lucide-react';

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  // Basic information
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Resume data
  const [skills, setSkills] = useState<string[]>([]);
  const [currentSkill, setCurrentSkill] = useState('');
  
  const [experience, setExperience] = useState<Array<{ title: string; description: string; duration: string }>>([
    { title: '', description: '', duration: '' }
  ]);
  
  const [education, setEducation] = useState<Array<{ title: string; description: string }>>([
    { title: '', description: '' }
  ]);
  
  const [projects, setProjects] = useState<Array<{ title: string; description: string }>>([
    { title: '', description: '' }
  ]);
  
  const [achievements, setAchievements] = useState<Array<{ title: string; description: string }>>([
    { title: '', description: '' }
  ]);
  
  const [keywords, setKeywords] = useState<string[]>([]);
  const [currentKeyword, setCurrentKeyword] = useState('');

  const validateStep1 = () => {
    if (!name || !email || !phone || !password || !confirmPassword) {
      toast({
        title: 'Validation Error',
        description: 'All fields are required',
        variant: 'destructive',
      });
      return false;
    }
    
    if (password !== confirmPassword) {
      toast({
        title: 'Validation Error',
        description: 'Passwords do not match',
        variant: 'destructive',
      });
      return false;
    }
    
    if (password.length < 6) {
      toast({
        title: 'Validation Error',
        description: 'Password must be at least 6 characters',
        variant: 'destructive',
      });
      return false;
    }
    
    return true;
  };

  const validateStep2 = () => {
    if (skills.length === 0) {
      toast({
        title: 'Validation Error',
        description: 'At least one skill is required',
        variant: 'destructive',
      });
      return false;
    }
    
    if (experience.some(e => !e.title || !e.description || !e.duration)) {
      toast({
        title: 'Validation Error',
        description: 'All experience fields are required',
        variant: 'destructive',
      });
      return false;
    }
    
    if (education.some(e => !e.title || !e.description)) {
      toast({
        title: 'Validation Error',
        description: 'All education fields are required',
        variant: 'destructive',
      });
      return false;
    }
    
    return true;
  };

  const handleNextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const handleAddSkill = () => {
    if (currentSkill.trim()) {
      setSkills([...skills, currentSkill.trim()]);
      setCurrentSkill('');
    }
  };

  const handleRemoveSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const handleAddKeyword = () => {
    if (currentKeyword.trim()) {
      setKeywords([...keywords, currentKeyword.trim()]);
      setCurrentKeyword('');
    }
  };

  const handleRemoveKeyword = (index: number) => {
    setKeywords(keywords.filter((_, i) => i !== index));
  };

  const handleAddExperience = () => {
    setExperience([...experience, { title: '', description: '', duration: '' }]);
  };

  const handleUpdateExperience = (index: number, field: string, value: string) => {
    const updatedExperience = [...experience];
    updatedExperience[index] = { ...updatedExperience[index], [field]: value };
    setExperience(updatedExperience);
  };

  const handleRemoveExperience = (index: number) => {
    if (experience.length > 1) {
      setExperience(experience.filter((_, i) => i !== index));
    }
  };

  const handleAddEducation = () => {
    setEducation([...education, { title: '', description: '' }]);
  };

  const handleUpdateEducation = (index: number, field: string, value: string) => {
    const updatedEducation = [...education];
    updatedEducation[index] = { ...updatedEducation[index], [field]: value };
    setEducation(updatedEducation);
  };

  const handleRemoveEducation = (index: number) => {
    if (education.length > 1) {
      setEducation(education.filter((_, i) => i !== index));
    }
  };

  const handleAddProject = () => {
    setProjects([...projects, { title: '', description: '' }]);
  };

  const handleUpdateProject = (index: number, field: string, value: string) => {
    const updatedProjects = [...projects];
    updatedProjects[index] = { ...updatedProjects[index], [field]: value };
    setProjects(updatedProjects);
  };

  const handleRemoveProject = (index: number) => {
    if (projects.length > 1) {
      setProjects(projects.filter((_, i) => i !== index));
    }
  };

  const handleAddAchievement = () => {
    setAchievements([...achievements, { title: '', description: '' }]);
  };

  const handleUpdateAchievement = (index: number, field: string, value: string) => {
    const updatedAchievements = [...achievements];
    updatedAchievements[index] = { ...updatedAchievements[index], [field]: value };
    setAchievements(updatedAchievements);
  };

  const handleRemoveAchievement = (index: number) => {
    if (achievements.length > 1) {
      setAchievements(achievements.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep2()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const userData = {
        name,
        email,
        phone,
        password,
        confirmPassword,
        skills,
        experience,
        education,
        projects,
        achievements,
        keywords,
      };
      
      const response = await signup(userData);
      
      toast({
        title: 'Profile initialization complete',
        description: 'OTP dispatched to your email',
      });
      
      // Navigate to OTP verification page with email
      navigate(`/verify-otp?email=${encodeURIComponent(email)}`);
    } catch (error) {
      console.error('Signup failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto hud-panel">
        <div className="mb-6 text-center">
          <h2 className="jarvis-title text-3xl mb-2">Create Access Profile</h2>
          <p className="text-jarvis-red/80 text-sm">Please provide your information to initialize the system</p>
        </div>
        
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((s) => (
              <div 
                key={s} 
                className={`flex-1 h-1 ${s <= step ? 'bg-jarvis-red' : 'bg-gray-600'} transition-colors`}
              />
            ))}
          </div>
          <div className="flex justify-between mt-2">
            <span className={`text-sm ${step >= 1 ? 'text-jarvis-gold' : 'text-gray-500'}`}>Basic Info</span>
            <span className={`text-sm ${step >= 2 ? 'text-jarvis-gold' : 'text-gray-500'}`}>Experience & Education</span>
            <span className={`text-sm ${step >= 3 ? 'text-jarvis-gold' : 'text-gray-500'}`}>Projects & Achievements</span>
          </div>
        </div>
        
        <form onSubmit={handleSubmit}>
          {/* Step 1: Basic Information */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-jarvis-gold mb-1" htmlFor="name">
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="hud-input w-full"
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-jarvis-gold mb-1" htmlFor="email">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="hud-input w-full"
                    placeholder="Enter your email"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-jarvis-gold mb-1" htmlFor="phone">
                    Phone
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="hud-input w-full"
                    placeholder="Enter your phone number"
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
                    placeholder="Create a password"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-jarvis-gold mb-1" htmlFor="confirmPassword">
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="hud-input w-full"
                    placeholder="Confirm your password"
                  />
                </div>
                          <button 
                            onClick={loginWithGoogle}
                            className="mt-4 cursor-none w-full py-2 px-4 border border-jarvis-gold/50 hover:bg-jarvis-gold/10 rounded-md flex items-center justify-center space-x-2 transition-all"
                          >
                            <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                              <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                                <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
                                <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
                                <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
                                <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
                              </g>
                            </svg>
                            <span className="text-white ">Continue with Google</span>
                          </button>
              </div>
              
              <div className="flex justify-end mt-6">
                <button
                  type="button"
                  className="jarvis-button cursor-none"
                  onClick={handleNextStep}
                >
                  Next Step
                </button>
              </div>
            </motion.div>
          )}
          
          {/* Step 2: Experience & Education */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* Skills */}
              <div>
                <h3 className="text-jarvis-gold text-lg mb-3">Skills</h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  {skills.map((skill, index) => (
                    <div 
                      key={index} 
                      className="bg-jarvis-red/20 border border-jarvis-red/30 text-white text-sm px-3 py-1 rounded-full flex items-center"
                    >
                      <span>{skill}</span>
                      <button 
                        type="button" 
                        onClick={() => handleRemoveSkill(index)}
                        className="ml-2 text-white/70 hover:text-white"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex">
                  <input
                    type="text"
                    value={currentSkill}
                    onChange={(e) => setCurrentSkill(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                    className="hud-input flex-1"
                    placeholder="Add a skill"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="ml-2 bg-jarvis-red/20 border border-jarvis-red/50 hover:bg-jarvis-red/30 text-white px-3 rounded-md"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>
              
              {/* Experience */}
              <div>
                <h3 className="text-jarvis-gold text-lg mb-3">Experience</h3>
                <div className="space-y-6">
                  {experience.map((exp, index) => (
                    <div key={index} className="hud-panel !p-4">
                      <div className="flex justify-between mb-3">
                        <h4 className="text-jarvis-red">Experience #{index + 1}</h4>
                        <button
                          type="button"
                          onClick={() => handleRemoveExperience(index)}
                          className="text-jarvis-red/70 hover:text-jarvis-red"
                          disabled={experience.length <= 1}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-jarvis-gold/70 mb-1">
                            Title / Position
                          </label>
                          <input
                            type="text"
                            value={exp.title}
                            onChange={(e) => handleUpdateExperience(index, 'title', e.target.value)}
                            className="hud-input w-full"
                            placeholder="e.g. Software Engineer"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-jarvis-gold/70 mb-1">
                            Duration
                          </label>
                          <input
                            type="text"
                            value={exp.duration}
                            onChange={(e) => handleUpdateExperience(index, 'duration', e.target.value)}
                            className="hud-input w-full"
                            placeholder="e.g. Jan 2020 - Present"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm text-jarvis-gold/70 mb-1">
                            Description
                          </label>
                          <textarea
                            value={exp.description}
                            onChange={(e) => handleUpdateExperience(index, 'description', e.target.value)}
                            className="hud-input w-full"
                            rows={3}
                            placeholder="Describe your responsibilities and achievements"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddExperience}
                    className="w-full py-2 border border-dashed border-jarvis-red/50 text-jarvis-red hover:bg-jarvis-red/10 rounded-md flex items-center justify-center space-x-2"
                  >
                    <Plus size={16} />
                    <span>Add Experience</span>
                  </button>
                </div>
              </div>
              
              {/* Education */}
              <div>
                <h3 className="text-jarvis-gold text-lg mb-3">Education</h3>
                <div className="space-y-6">
                  {education.map((edu, index) => (
                    <div key={index} className="hud-panel !p-4">
                      <div className="flex justify-between mb-3">
                        <h4 className="text-jarvis-red">Education #{index + 1}</h4>
                        <button
                          type="button"
                          onClick={() => handleRemoveEducation(index)}
                          className="text-jarvis-red/70 hover:text-jarvis-red"
                          disabled={education.length <= 1}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm text-jarvis-gold/70 mb-1">
                            Title / Degree
                          </label>
                          <input
                            type="text"
                            value={edu.title}
                            onChange={(e) => handleUpdateEducation(index, 'title', e.target.value)}
                            className="hud-input w-full"
                            placeholder="e.g. Bachelor of Science in Computer Science"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-jarvis-gold/70 mb-1">
                            Description
                          </label>
                          <textarea
                            value={edu.description}
                            onChange={(e) => handleUpdateEducation(index, 'description', e.target.value)}
                            className="hud-input w-full"
                            rows={3}
                            placeholder="Include institution name, graduation year, and any relevant details"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddEducation}
                    className="w-full py-2 border border-dashed border-jarvis-red/50 text-jarvis-red hover:bg-jarvis-red/10 rounded-md flex items-center justify-center space-x-2"
                  >
                    <Plus size={16} />
                    <span>Add Education</span>
                  </button>
                </div>
              </div>
              
              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  className="border border-jarvis-red/50 text-jarvis-red px-6 py-2 rounded-md hover:bg-jarvis-red/10"
                  onClick={handlePrevStep}
                >
                  Previous
                </button>
                <button
                  type="button"
                  className="jarvis-button cursor-none"
                  onClick={handleNextStep}
                >
                  Next Step
                </button>
              </div>
            </motion.div>
          )}
          
          {/* Step 3: Projects & Achievements */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* Projects */}
              <div>
                <h3 className="text-jarvis-gold text-lg mb-3">Projects</h3>
                <div className="space-y-6">
                  {projects.map((project, index) => (
                    <div key={index} className="hud-panel !p-4">
                      <div className="flex justify-between mb-3">
                        <h4 className="text-jarvis-red">Project #{index + 1}</h4>
                        <button
                          type="button"
                          onClick={() => handleRemoveProject(index)}
                          className="text-jarvis-red/70 hover:text-jarvis-red"
                          disabled={projects.length <= 1}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm text-jarvis-gold/70 mb-1">
                            Title
                          </label>
                          <input
                            type="text"
                            value={project.title}
                            onChange={(e) => handleUpdateProject(index, 'title', e.target.value)}
                            className="hud-input w-full"
                            placeholder="e.g. E-commerce Platform"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-jarvis-gold/70 mb-1">
                            Description
                          </label>
                          <textarea
                            value={project.description}
                            onChange={(e) => handleUpdateProject(index, 'description', e.target.value)}
                            className="hud-input w-full"
                            rows={3}
                            placeholder="Describe the project, technologies used, and your role"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddProject}
                    className="w-full py-2 border border-dashed border-jarvis-red/50 text-jarvis-red hover:bg-jarvis-red/10 rounded-md flex items-center justify-center space-x-2"
                  >
                    <Plus size={16} />
                    <span>Add Project</span>
                  </button>
                </div>
              </div>
              
              {/* Achievements */}
              <div>
                <h3 className="text-jarvis-gold text-lg mb-3">Achievements</h3>
                <div className="space-y-6">
                  {achievements.map((achievement, index) => (
                    <div key={index} className="hud-panel !p-4">
                      <div className="flex justify-between mb-3">
                        <h4 className="text-jarvis-red">Achievement #{index + 1}</h4>
                        <button
                          type="button"
                          onClick={() => handleRemoveAchievement(index)}
                          className="text-jarvis-red/70 hover:text-jarvis-red"
                          disabled={achievements.length <= 1}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm text-jarvis-gold/70 mb-1">
                            Title
                          </label>
                          <input
                            type="text"
                            value={achievement.title}
                            onChange={(e) => handleUpdateAchievement(index, 'title', e.target.value)}
                            className="hud-input w-full"
                            placeholder="e.g. Employee of the Year"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-jarvis-gold/70 mb-1">
                            Description
                          </label>
                          <textarea
                            value={achievement.description}
                            onChange={(e) => handleUpdateAchievement(index, 'description', e.target.value)}
                            className="hud-input w-full"
                            rows={3}
                            placeholder="Describe the achievement, when you received it, and its significance"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddAchievement}
                    className="w-full py-2 border border-dashed border-jarvis-red/50 text-jarvis-red hover:bg-jarvis-red/10 rounded-md flex items-center justify-center space-x-2"
                  >
                    <Plus size={16} />
                    <span>Add Achievement</span>
                  </button>
                </div>
              </div>
              
              {/* Keywords */}
              <div>
                <h3 className="text-jarvis-gold text-lg mb-3">Keywords</h3>
                <p className="text-sm text-gray-400 mb-3">Add keywords that describe your professional profile</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {keywords.map((keyword, index) => (
                    <div 
                      key={index} 
                      className="bg-jarvis-gold/20 border border-jarvis-gold/30 text-white text-sm px-3 py-1 rounded-full flex items-center"
                    >
                      <span>{keyword}</span>
                      <button 
                        type="button" 
                        onClick={() => handleRemoveKeyword(index)}
                        className="ml-2 text-white/70 hover:text-white"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex">
                  <input
                    type="text"
                    value={currentKeyword}
                    onChange={(e) => setCurrentKeyword(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddKeyword())}
                    className="hud-input flex-1"
                    placeholder="Add a keyword"
                  />
                  <button
                    type="button"
                    onClick={handleAddKeyword}
                    className="ml-2 bg-jarvis-gold/20 border border-jarvis-gold/50 hover:bg-jarvis-gold/30 text-white px-3 rounded-md"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>
              
              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  className="border border-jarvis-red/50 text-jarvis-red px-6 py-2 rounded-md hover:bg-jarvis-red/10"
                  onClick={handlePrevStep}
                >
                  Previous
                </button>
                <button
                  type="submit"
                  className="jarvis-button cursor-none"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <span className="mr-2">Creating Profile</span>
                      <span className="animate-bounce inline-block">.</span>
                      <span className="animate-bounce inline-block delay-75">.</span>
                      <span className="animate-bounce inline-block delay-150">.</span>
                    </span>
                  ) : (
                    <span>Create Profile</span>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </form>
        
        <div className="mt-8 text-center text-sm">
          <p className="text-jarvis-light/70">
            Already have an account?{' '}
            <Link to="/login" className="text-jarvis-gold hover:underline">
              Access System
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
