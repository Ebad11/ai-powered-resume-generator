
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMe, updateResumeData } from '@/utils/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { Plus, Trash2, ChevronLeft } from 'lucide-react';

const UpdateProfile: React.FC = () => {
  const navigate = useNavigate();
  const { user, setUser, setNeedsResumeData } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Resume data states
  const [skills, setSkills] = useState<string[]>([]);
  const [currentSkill, setCurrentSkill] = useState('');
  
  const [experience, setExperience] = useState<Array<{ title: string; description: string; duration: string }>>([
    { title: '', description: '', duration: '' }
  ]);
  
  const [education, setEducation] = useState<Array<{ institution: string; degree: string; duration: string }>>([
    { institution: '', degree: '', duration: '' }
  ]);
  
  const [projects, setProjects] = useState<Array<{ title: string; description: string }>>([
    { title: '', description: '' }
  ]);
  
  const [achievements, setAchievements] = useState<Array<{ title: string; description: string }>>([
    { title: '', description: '' }
  ]);
  
  const [keywords, setKeywords] = useState<string[]>([]);
  const [currentKeyword, setCurrentKeyword] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const data = await getMe();
        
        // Update states with user data
        setSkills(data.user.skills || []);
        setExperience(data.user.experience && data.user.experience.length > 0 
          ? data.user.experience 
          : [{ title: '', description: '', duration: '' }]);
        setEducation(data.user.education && data.user.education.length > 0 
          ? data.user.education 
          : [{ institution: '', degree: '', duration: '' }]);
        setProjects(data.user.projects && data.user.projects.length > 0 
          ? data.user.projects 
          : [{ title: '', description: '' }]);
        setAchievements(data.user.achievements && data.user.achievements.length > 0 
          ? data.user.achievements 
          : [{ title: '', description: '' }]);
        setKeywords(data.user.keywords || []);
        
        // Update user context
        setUser(data.user);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load profile data',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, [setUser]);

  // Handlers for skills
  const handleAddSkill = () => {
    if (currentSkill.trim()) {
      setSkills([...skills, currentSkill.trim()]);
      setCurrentSkill('');
    }
  };

  const handleRemoveSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  // Handlers for keywords
  const handleAddKeyword = () => {
    if (currentKeyword.trim()) {
      setKeywords([...keywords, currentKeyword.trim()]);
      setCurrentKeyword('');
    }
  };

  const handleRemoveKeyword = (index: number) => {
    setKeywords(keywords.filter((_, i) => i !== index));
  };

  // Handlers for experience
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

  // Handlers for education
  const handleAddEducation = () => {
    setEducation([...education, { institution: '', degree: '', duration: '' }]);
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

  // Handlers for projects
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

  // Handlers for achievements
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

  // const validateForm = () => {
  //   if (skills.length === 0) {
  //     toast({
  //       title: 'Validation Error',
  //       description: 'At least one skill is required',
  //       variant: 'destructive',
  //     });
  //     return false;
  //   }
    
  //   if (experience.some(e => !e.title || !e.description || !e.duration)) {
  //     toast({
  //       title: 'Validation Error',
  //       description: 'All experience fields are required',
  //       variant: 'destructive',
  //     });
  //     return false;
  //   }
    
  //   if (education.some(e => !e.title || !e.description || !e.duration)) {
  //     toast({
  //       title: 'Validation Error',
  //       description: 'All education fields are required',
  //       variant: 'destructive',
  //     });
  //     return false;
  //   }
    
  //   if (projects.some(p => !p.title || !p.description)) {
  //     toast({
  //       title: 'Validation Error',
  //       description: 'All project fields are required',
  //       variant: 'destructive',
  //     });
  //     return false;
  //   }
    
  //   if (achievements.some(a => !a.title || !a.description)) {
  //     toast({
  //       title: 'Validation Error',
  //       description: 'All achievement fields are required',
  //       variant: 'destructive',
  //     });
  //     return false;
  //   }
    
  //   return true;
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // if (!validateForm()) {
    //   return;
    // }
    
    setIsSaving(true);
    
    try {
      const data = {
        skills,
        experience,
        education,
        projects,
        achievements,
        keywords,
      };
      
      const response = await updateResumeData(data);
      
      toast({
        title: 'Profile Updated',
        description: 'Profile systems updated, sir',
      });
      
      // Update user context to reflect that resume data is now provided
      setNeedsResumeData(false);
      
      // Navigate back to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-jarvis-red animate-pulse text-2xl">
          <span className="mr-2">Loading profile data</span>
          <span className="animate-bounce inline-block">.</span>
          <span className="animate-bounce inline-block delay-75">.</span>
          <span className="animate-bounce inline-block delay-150">.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center">
          <button
            onClick={() => navigate('/dashboard')}
            className="mr-4 p-2 rounded-full border border-jarvis-red/30 hover:bg-jarvis-red/10 transition-colors"
          >
            <ChevronLeft size={20} className="text-jarvis-red" />
          </button>
          <h2 className="jarvis-title text-3xl">Update Profile</h2>
        </div>
        
        <motion.form
          onSubmit={handleSubmit}
          className="space-y-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Skills */}
          <div className="hud-panel">
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
          <div className="hud-panel">
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
          <div className="hud-panel">
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
                        Institution Name
                      </label>
                      <input
                        type="text"
                        value={edu.institution}
                        onChange={(e) => handleUpdateEducation(index, 'institution', e.target.value)}
                        className="hud-input w-full"
                        placeholder="e.g. XYZ University"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-jarvis-gold/70 mb-1">
                        Qualification
                      </label>
                      <input
                        value={edu.degree}
                        onChange={(e) => handleUpdateEducation(index, 'degree', e.target.value)}
                        className="hud-input w-full"
                        placeholder="e.g. Bachelor of Science in Computer Science"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-jarvis-gold/70 mb-1">
                        Duration
                      </label>
                      <input
                        type="text"
                        value={edu.duration}
                        onChange={(e) => handleUpdateEducation(index, 'duration', e.target.value)}
                        className="hud-input w-full"
                        placeholder="e.g. Jan 2020 - Present"
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
          
          {/* Projects */}
          <div className="hud-panel">
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
          <div className="hud-panel">
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
          <div className="hud-panel">
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
          
          <div className="flex justify-end mt-8">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="mr-4 border border-jarvis-red/50 text-jarvis-red px-6 py-2 rounded-md hover:bg-jarvis-red/10"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="jarvis-button cursor-none"
              disabled={isSaving}
            >
              {isSaving ? (
                <span className="flex items-center justify-center">
                  <span className="mr-2">Updating</span>
                  <span className="animate-bounce inline-block">.</span>
                  <span className="animate-bounce inline-block delay-75">.</span>
                  <span className="animate-bounce inline-block delay-150">.</span>
                </span>
              ) : (
                <span>Update Profile</span>
              )}
            </button>
          </div>
        </motion.form>
      </div>
    </div>
  );
};

export default UpdateProfile;
