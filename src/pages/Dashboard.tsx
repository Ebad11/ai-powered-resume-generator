import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { generateResume, tailorResume } from '@/utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, FileText, Settings, X, CheckCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const resumeContainerRef = useRef(null);

  const [activePanel, setActivePanel] = useState<string | null>(null);
  const [welcomeTyped, setWelcomeTyped] = useState(false);

  // Generate Resume states
  const [selectedTemplate, setSelectedTemplate] = useState<'template1' | 'template2' | 'template3'>('template1');
  const [regenerateContent, setRegenerateContent] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  // Tailor Resume states
  const [position, setPosition] = useState('');
  const [field, setField] = useState('');
  const [isTailoring, setIsTailoring] = useState(false);

  // Resume display states
  const [generatedResume, setGeneratedResume] = useState<{
    base64: string;
    fileName: string;
  } | null>(null);
  const [showResume, setShowResume] = useState(false);

  // Template data
  const templates = [
    {
      id: 'template1', 
      name: 'Modern Template',
      description: 'Clean, contemporary design with a focus on readability',
      color: 'blue'
    },
    {
      id: 'template2', 
      name: 'Professional Template',
      description: 'Traditional layout ideal for corporate positions',
      color: 'green'
    },
    {
      id: 'template3', 
      name: 'Creative Template',
      description: 'Unique design to showcase creativity and innovation',
      color: 'purple'
    }
  ];

  useEffect(() => {
    const timer = setTimeout(() => setWelcomeTyped(true), 800);
    return () => clearTimeout(timer);
  }, []);

  // Handle click outside to close dialog
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (activePanel && !target.closest('.dialog-content') && !target.closest('.hud-panel')) {
        setActivePanel(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activePanel]);

  // Effect for rendering document when resume data is available
  useEffect(() => {
    if (generatedResume?.base64 && resumeContainerRef.current) {
      try {
        const base64String = generatedResume.base64;

        // Convert base64 to ArrayBuffer
        const binaryString = window.atob(base64String);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        const arrayBuffer = bytes.buffer;

        // Import dynamically to prevent SSR issues
        import('docx-preview')
          .then(({ renderAsync }) => {
            renderAsync(arrayBuffer, resumeContainerRef.current, resumeContainerRef.current, {
              className: 'docx-viewer'
            }).catch(err => console.error('Error rendering document:', err));
          })
          .catch(err => console.error('Error loading docx-preview:', err));
      } catch (err) {
        console.error('Error processing document data:', err);
      }
    }
  }, [generatedResume, resumeContainerRef.current]);

  const handleGenerateResume = async () => {
    setIsGenerating(true);
    try {
      const response = await generateResume({
        template: selectedTemplate,
        regenerateContent,
        position: position || undefined,
        field: field || undefined,
      });
      if (response.success) {
        setGeneratedResume({
          base64: response.document,
          fileName: response.fileName || 'resume.docx'
        });
        setShowResume(true);
        toast({ title: 'Resume generation complete', description: 'File ready for deployment' });
      }
    } catch (error) {
      console.error('Resume generation failed:', error);
    } finally {
      setIsGenerating(false);
      setActivePanel(null); // Close the panel after generation
    }
  };

  const handleTailorResume = async () => {
    if (!position || !field || !selectedTemplate) {
      toast({
        title: 'Validation Error',
        description: 'Position, field, and template are required',
        variant: 'destructive',
      });
      return;
    }
    setIsTailoring(true);
    try {
      const response = await tailorResume({
        position,
        field,
        template: selectedTemplate
      });
      if (response.success) {
        toast({
          title: 'Resume tailored',
          description: 'Resume tailored for optimal performance'
        });
        setPosition('');
        setField('');
        setGeneratedResume({
          base64: response.document,
          fileName: response.fileName || 'resume.docx'
        });
        setShowResume(true);
      }
    } catch (error) {
      console.error('Resume tailoring failed:', error);
      toast({
        title: 'Error',
        description: 'Failed to tailor resume',
        variant: 'destructive',
      });
    } finally {
      setIsTailoring(false);
      setActivePanel(null);
    }
  };

  const togglePanel = (panel: string) => {
    setActivePanel(activePanel === panel ? null : panel);
  };

  const handleDownloadResume = () => {
    if (generatedResume?.base64) {
      try {
        const base64String = generatedResume.base64;

        // Convert base64 to Blob
        const binaryString = window.atob(base64String);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        const blob = new Blob([bytes], {
          type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        });

        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = generatedResume.fileName || 'Resume.docx';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => {
          URL.revokeObjectURL(blobUrl);
        }, 1000);
      } catch (err) {
        console.error('Error downloading document:', err);
      }
    } else {
      console.error('No document available to download');
    }
  };

  // Template selection card component
  const TemplateCard = ({ template, isSelected, onSelect }) => (
    <div 
      className={`border-2 ${isSelected ? 'border-jarvis-red' : 'border-jarvis-red/30'} rounded-lg p-4   transition-all ${isSelected ? 'bg-jarvis-darkAlt shadow-[0_0_15px_rgba(209,19,19,0.4)]' : 'bg-jarvis-dark'}`}
      onClick={() => onSelect(template.id)}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-jarvis-gold text-lg">{template.name}</h3>
        {isSelected && <CheckCircle size={18} className="text-jarvis-red" />}
      </div>
      <p className="text-sm text-gray-300">{template.description}</p>
      {/* Add sample preview image or illustration */}
      <div className={`mt-3 h-16 bg-gradient-to-r from-jarvis-dark to-jarvis-red/20 rounded flex items-center justify-center border border-jarvis-red/20`}>
        <FileText size={24} className="text-jarvis-red/70" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1
            className={`text-2xl md:text-3xl overflow-hidden whitespace-nowrap ${welcomeTyped ? 'border-r-0' : 'border-r-4 border-jarvis-red'
              }`}
          >
            <span className="inline-block jarvis-title">
              {welcomeTyped
                ? `Greetings, ${user?.name.split(' ')[0]}. How may I assist you today?`
                : 'Initializing system...'}
            </span>
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Generate Resume Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`hud-panel hover:shadow-[0_0_15px_rgba(209,19,19,0.3)] transition-all ${activePanel === 'generate' ? 'ring-2 ring-jarvis-red' : ''
              }`}
            onClick={() => togglePanel('generate')}
          >
            <div className="flex items-center justify-between mb-4  ">
              <h2 className="text-xl text-jarvis-gold">Generate Resume</h2>
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-jarvis-red/20 border border-jarvis-red/50 animate-pulse">
                <FileText size={20} className="text-jarvis-red" />
              </div>
            </div>
            <p className="text-gray-300 mb-4">Create a professional resume based on your profile data.</p>
          </motion.div>

          {/* Tailor Resume Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className={`hud-panel hover:shadow-[0_0_15px_rgba(209,19,19,0.3)] transition-all ${activePanel === 'tailor' ? 'ring-2 ring-jarvis-red' : ''
              }`}
            onClick={() => togglePanel('tailor')}
          >
            <div className="flex items-center justify-between mb-4  ">
              <h2 className="text-xl text-jarvis-gold">Tailor Resume</h2>
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-jarvis-gold/20 border border-jarvis-gold/50">
                <FileText size={20} className="text-jarvis-gold" />
              </div>
            </div>
            <p className="text-gray-300 mb-4">Customize your resume for a specific job position.</p>
          </motion.div>

          {/* Update Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="hud-panel   hover:shadow-[0_0_15px_rgba(209,19,19,0.3)] transition-all"
            onClick={() => togglePanel('profile')}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl text-jarvis-gold">Update Profile</h2>
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-jarvis-red/20 border border-jarvis-red/50">
                <Settings size={20} className="text-jarvis-red" />
              </div>
            </div>
            <p className="text-gray-300 mb-4">Modify your professional information to improve your resume.</p>
          </motion.div>
        </div>

        {/* Resume Display Section */}
        <AnimatePresence>
          {showResume && generatedResume && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="mt-12"
            >
              <div className="bg-jarvis-dark border-2 border-jarvis-red/50 p-6 rounded-lg shadow-[0_0_25px_rgba(209,19,19,0.4)]">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl text-jarvis-gold flex items-center">
                    <FileText size={24} className="mr-2 text-jarvis-red" />
                    Your Resume
                  </h2>
                  <button
                    onClick={() => setShowResume(false)}
                    className="w-8 h-8 flex items-center justify-center rounded-full border border-jarvis-red/50 bg-jarvis-red/20 hover:bg-jarvis-red/30 transition-colors"
                  >
                    <X size={18} className="text-jarvis-red" />
                  </button>
                </div>

                <div className="resume-display-container mb-6">
                  <div className="bg-white rounded-lg p-4 min-h-64 max-h-90 " ref={resumeContainerRef}>
                    {/* Resume will be rendered here by docx-preview */}
                    {!generatedResume.base64 && (
                      <p className="text-gray-800">No resume available to display.</p>
                    )}
                  </div>
                </div>

                <div>
                  <button
                    onClick={handleDownloadResume}
                    className="jarvis-button w-full group cursor-none"
                  >
                    <span className="flex items-center justify-center">
                      <span>Download Resume</span>
                      <Download size={16} className="ml-2 group-hover:translate-y-1 transition-transform" />
                    </span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dialog Overlay for each panel */}
        <AnimatePresence>
          {activePanel && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="w-full max-w-3xl dialog-content"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Generate Resume Dialog */}
                {activePanel === 'generate' && (
                  <div className="bg-jarvis-dark border-2 border-jarvis-red/50 p-6 rounded-lg shadow-[0_0_25px_rgba(209,19,19,0.4)]">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl text-jarvis-gold flex items-center">
                        <FileText size={24} className="mr-2 text-jarvis-red" />
                        Generate Resume
                      </h2>
                      <button
                        onClick={() => setActivePanel(null)}
                        className="w-8 h-8 flex items-center justify-center rounded-full border border-jarvis-red/50 bg-jarvis-red/20 hover:bg-jarvis-red/30 transition-colors"
                      >
                        <X size={18} className="text-jarvis-red" />
                      </button>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm text-jarvis-gold mb-3">Select Template</label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {templates.map(template => (
                            <TemplateCard 
                              key={template.id}
                              template={template}
                              isSelected={selectedTemplate === template.id}
                              onSelect={setSelectedTemplate}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="regenerateContent"
                          checked={regenerateContent}
                          onChange={(e) => setRegenerateContent(e.target.checked)}
                          className="mr-2 bg-jarvis-darkAlt border border-jarvis-red/50 rounded focus:ring-jarvis-red/20"
                        />
                        <label htmlFor="regenerateContent" className="text-sm">
                          Regenerate Content
                        </label>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-jarvis-gold mb-2">Position (optional)</label>
                          <input
                            type="text"
                            placeholder="e.g. Software Engineer"
                            value={position}
                            onChange={(e) => setPosition(e.target.value)}
                            className="hud-input w-full"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-jarvis-gold mb-2">Field (optional)</label>
                          <input
                            type="text"
                            placeholder="e.g. Healthcare Technology"
                            value={field}
                            onChange={(e) => setField(e.target.value)}
                            className="hud-input w-full"
                          />
                        </div>
                      </div>

                      <div className="pt-4">
                        <button
                          onClick={handleGenerateResume}
                          disabled={isGenerating}
                          className="jarvis-button w-full group cursor-none"
                        >
                          {isGenerating ? (
                            <span className="flex items-center justify-center">
                              <span className="mr-2">Generating</span>
                              <span className="animate-bounce inline-block">.</span>
                              <span className="animate-bounce inline-block delay-75">.</span>
                              <span className="animate-bounce inline-block delay-150">.</span>
                            </span>
                          ) : (
                            <span className="flex items-center justify-center">
                              <span>Generate Resume</span>
                              <Download size={16} className="ml-2 group-hover:translate-y-1 transition-transform" />
                            </span>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tailor Resume Dialog */}
                {activePanel === 'tailor' && (
                  <div className="bg-jarvis-dark border-2 border-jarvis-gold/50 p-6 rounded-lg shadow-[0_0_25px_rgba(255,215,0,0.3)]">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl text-jarvis-gold flex items-center">
                        <FileText size={24} className="mr-2 text-jarvis-gold" />
                        Tailor Resume
                      </h2>
                      <button
                        onClick={() => setActivePanel(null)}
                        className="w-8 h-8 flex items-center justify-center rounded-full border border-jarvis-gold/50 bg-jarvis-gold/20 hover:bg-jarvis-gold/30 transition-colors"
                      >
                        <X size={18} className="text-jarvis-gold" />
                      </button>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm text-jarvis-gold mb-2">Position</label>
                        <input
                          type="text"
                          placeholder="e.g. Software Engineer"
                          value={position}
                          onChange={(e) => setPosition(e.target.value)}
                          className="hud-input w-full"
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-jarvis-gold mb-2">Field</label>
                        <input
                          type="text"
                          placeholder="e.g. Healthcare Technology"
                          value={field}
                          onChange={(e) => setField(e.target.value)}
                          className="hud-input w-full"
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-jarvis-gold mb-3">Select Template</label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {templates.map(template => (
                            <TemplateCard 
                              key={template.id}
                              template={template}
                              isSelected={selectedTemplate === template.id}
                              onSelect={setSelectedTemplate}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="pt-4">
                        <button
                          onClick={handleTailorResume}
                          disabled={isTailoring || !position || !field || !selectedTemplate}
                          className="jarvis-gold-button w-full"
                        >
                          {isTailoring ? (
                            <span className="flex items-center justify-center">
                              <span className="mr-2">Tailoring</span>
                              <span className="animate-bounce inline-block">.</span>
                              <span className="animate-bounce inline-block delay-75">.</span>
                              <span className="animate-bounce inline-block delay-150">.</span>
                            </span>
                          ) : (
                            <span>Tailor Resume</span>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Update Profile Dialog */}
                {activePanel === 'profile' && (
                  <div className="bg-jarvis-dark border-2 border-jarvis-red/50 p-6 rounded-lg shadow-[0_0_25px_rgba(209,19,19,0.4)]">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl text-jarvis-gold flex items-center">
                        <Settings size={24} className="mr-2 text-jarvis-red" />
                        Update Profile
                      </h2>
                      <button
                        onClick={() => setActivePanel(null)}
                        className="w-8 h-8 flex items-center justify-center rounded-full border border-jarvis-red/50 bg-jarvis-red/20 hover:bg-jarvis-red/30 transition-colors"
                      >
                        <X size={18} className="text-jarvis-red" />
                      </button>
                    </div>

                    <div className="space-y-6">
                      <p className="text-gray-300">Modify your professional details and preferences to customize your resume generation.</p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-jarvis-gold mb-2">Personal Information</label>
                          <ul className="text-sm text-gray-300 space-y-1">
                            <li>• Name: {user?.name}</li>
                            <li>• Email: {user?.email}</li>
                            <li>• Profile Status: Active</li>
                          </ul>
                        </div>
                        <div>
                          <label className="block text-sm text-jarvis-gold mb-2">Resume Statistics</label>
                          <ul className="text-sm text-gray-300 space-y-1">
                            <li>• Generated: 5</li>
                            <li>• Tailored: 3</li>
                            <li>• Last Updated: 3 days ago</li>
                          </ul>
                        </div>
                      </div>

                      <div className="pt-4">
                        <button
                          onClick={() => navigate('/update-profile')}
                          className="jarvis-button w-full cursor-none"
                        >
                          <span className="flex items-center justify-center">
                            <span>Edit Complete Profile</span>
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* HUD Elements */}
        <div className="fixed bottom-6 left-6 right-6 flex justify-between items-end pointer-events-none z-10">
          <div className="relative">
            <div className="absolute bottom-0 left-0 w-[100px] h-[50px] border-l-2 border-b-2 border-jarvis-red/40"></div>
            <div className="ml-4 mb-2 max-w-[200px] text-xs text-jarvis-red/70 pointer-events-none">
              <div>User: {user?.name}</div>
              <div>System: GEN-RESUME v1.0</div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute bottom-0 right-0 w-[100px] h-[50px] border-r-2 border-b-2 border-jarvis-red/40"></div>
            <div className="mr-4 mb-2 pointer-events-auto">
              <button
                onClick={logout}
                className="text-jarvis-red/80 hover:text-jarvis-red text-xs flex items-center space-x-1"
              >
                <span>POWER DOWN</span>
                <div className="w-3 h-3 rounded-full border border-jarvis-red/50 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-jarvis-red/70"></div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;