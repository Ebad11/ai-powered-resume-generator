import React, { useEffect, useState, useRef, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../assets/images/logo.jpg';
import robo from '../assets/videos/robo_hi.gif'


const Landing: React.FC = () => {
  const [displayText, setDisplayText] = useState('');
  const fullText = "Welcome to";
  const [showGlitch, setShowGlitch] = useState(false);
  const subtitle = "AI-Powered Resume Generation";
  const description = "Create professional resumes tailored to your skills and experience using advanced AI technology.";
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const testimonials = [
    {
      name: "Alex Chen",
      role: "Software Engineer",
      text: "GEN-RESUME helped me land interviews at top tech companies. The AI-optimized content truly highlighted my skills.",
    },
    {
      name: "Sarah Johnson",
      role: "Marketing Director",
      text: "I was amazed by how quickly I could generate a professional resume that perfectly captured my experience.",
    },
    {
      name: "Michael Rodriguez",
      role: "Recent Graduate",
      text: "As a new graduate with limited experience, GEN-RESUME made my resume stand out to employers. I got 3 job offers in a month!",
    },
  ];



  useEffect(() => {
    let index = 0;
    const typingInterval = 100;
    const intervalId = setInterval(() => {
      setDisplayText(fullText.substring(0, index));
      index++;
      if (index > fullText.length) {
        clearInterval(intervalId);
        setTimeout(() => setShowGlitch(true), 300);
      }
    }, typingInterval);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const testimonialInterval = setInterval(() => {
      setCurrentTestimonialIndex((prev) =>
        prev === testimonials.length - 1 ? 0 : prev + 1
      );
    }, 5000);
    return () => clearInterval(testimonialInterval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const elements = document.querySelectorAll('.reveal-on-scroll');
      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight - 100;
        if (isVisible) {
          (el as HTMLElement).style.opacity = '1';
          (el as HTMLElement).style.transform = 'translateY(0)';
        }
      });
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6 },
    },
  };

  const glitchAnimation = {
    animate: {
      textShadow: [
        '0 0 0 rgba(0,255,255,0)',
        '2px 0 2px rgba(255,0,0,0.7), -2px 0 2px rgba(0,255,255,0.7), 0 0 8px rgba(255,255,255,0.7)',
        '0 0 0 rgba(0,255,255,0)',
        '-3px 0 3px rgba(255,0,0,0.7), 3px 0 3px rgba(0,255,255,0.7), 0 0 10px rgba(255,255,255,0.7)',
        '0 0 0 rgba(0,255,255,0)',
      ],
      x: ['0px', '-2px', '2px', '-1px', '1px', '0px'],
      transition: {
        repeat: Infinity,
        repeatType: 'mirror',
        duration: 2,
      },
    },
  };

  const particlesCount = 20;
  const particles = Array(particlesCount)
    .fill(0)
    .map((_, index) => ({
      id: index,
      size: Math.random() * 5 + 1,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5,
    }));

  const scrollToContent = () => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col items-center relative overflow-hidden bg-gradient-to-b from-cyan to-zinc-900">
      {/* Animated floating particles */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-jarvis-gold/30"
            style={{
              width: particle.size,
              height: particle.size,
              left: `${particle.x}%`,
              top: `${particle.y}%`,
            }}
            animate={{
              y: [0, -300, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      {/* Code background with animation */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <pre className="text-xs text-jarvis-red/40 overflow-hidden h-full">
            {Array(50)
              .fill(0)
              .map((_, i) => (
                <motion.div
                  key={i}
                  className="my-1"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 0.4 }}
                  transition={{ duration: 0.5, delay: i * 0.02 }}
                >
                  {`function generateResume(data) { return AI.process(data.skills.map(s => optimize(s))); } // Line ${i + 1}`}
                </motion.div>
              ))}
          </pre>
        </div>
      </div>

      {/* Hero section */}
      <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 w-full">
        <motion.div
          className="max-w-7xl w-full z-10 flex flex-col lg:flex-row items-center justify-between"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Left Side: Text and Buttons */}
          <div className="lg:w-1/2 text-center lg:text-left space-y-8">
            <motion.div variants={itemVariants} className="w-28 h-28 mx-auto lg:mx-0 relative mb-6">
              <div className="absolute inset-0 rounded-full border-2 border-jarvis-red animate-ping opacity-20"></div>
              <div className="absolute inset-[4px] rounded-full border-2 border-jarvis-gold animate-pulse"></div>
              <motion.div
                className="absolute inset-[8px] rounded-full bg-gradient-to-br from-jarvis-red/30 to-jarvis-red/10 flex items-center justify-center"
                animate={{
                  boxShadow: ['0 0 0px rgba(255,0,0,0)', '0 0 20px rgba(255,0,0,0.5)', '0 0 0px rgba(255,0,0,0)'],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              >
                <span className="text-jarvis-gold text-5xl font-bold">
                  <img src={logo} alt="GEN-RESUME Logo" />
                </span>
              </motion.div>
            </motion.div>

            <motion.h1 variants={itemVariants} className="text-4xl md:text-6xl font-bold relative">
              <span className="text-white">{displayText}</span>
              {!showGlitch && <span className="border-r-4 border-jarvis-red ml-1 animate-blink"></span>}
              {showGlitch && (
                <motion.span
                  className="text-jarvis-gold ml-2 block md:inline-block my-2 md:my-0"
                  {...glitchAnimation}
                  style={{ clipPath: 'inset(0 0 0 0)' }}
                >
                  GEN-RESUME
                </motion.span>
              )}
            </motion.h1>

            <motion.p variants={itemVariants} className="text-xl md:text-2xl text-jarvis-red font-light">
              {subtitle}
            </motion.p>

            <motion.p variants={itemVariants} className="text-lg text-gray-300 max-w-md mx-auto lg:mx-0">
              {description}
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-6 mt-8"
            >
              <Link to="/signup" className="jarvis-button group relative overflow-hidden cursor-none">
                <span className="relative z-10">Create Account</span>
                <span className="ml-2 group-hover:translate-x-1 transition-transform inline-block relative z-10">
                  →
                </span>
                <motion.div
                  className="absolute inset-0 bg-jarvis-red/20 -z-0"
                  animate={{
                    scale: [1, 1.05, 1],
                    opacity: [0.2, 0.3, 0.2],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                />
              </Link>
              <Link to="/login" className="jarvis-gold-button relative overflow-hidden">
                <span className="relative z-10">Access System</span>
                <motion.div
                  className="absolute inset-0 bg-jarvis-gold/20 -z-0"
                  animate={{
                    scale: [1, 1.05, 1],
                    opacity: [0.1, 0.2, 0.1],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                  }}
                />
              </Link>
            </motion.div>
          </div>

          {/* Right Side: 3D Model (Robo) */}
          <motion.div
            className="lg:w-1/2 mt-12 lg:mt-0 flex justify-center relative"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <div className="relative w-[100px] h-[400px] md:w-[500px] md:h-[500px] flex items-center justify-center">
              <div className="relative z-10 w-full h-full">
                <img
                  src={robo}
                  alt="Robo"
                  className="w-full h-full object-cover"
                />    
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="mt-16"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          onClick={scrollToContent}
        >
          <button className="text-jarvis-gold opacity-80 hover:opacity-100 transition-opacity">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
            <span className="sr-only">Scroll Down</span>
          </button>
        </motion.div>
      </div>

      {/* Features section */}
      <div ref={scrollRef} className="w-full py-16 px-4 relative z-10 bg-zinc-900/50">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-center mb-12 text-jarvis-gold reveal-on-scroll"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Why Choose GEN-RESUME?
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "AI-powered Optimization",
                description: "Our advanced AI analyzes and enhances your resume content for maximum impact",
                icon: "⚡",
              },
              {
                title: "Multiple Templates",
                description: "Choose from dozens of professional, ATS-friendly templates",
                icon: "📄",
              },
              {
                title: "Job-specific Tailoring",
                description: "Customize your resume for specific job descriptions to increase your chances",
                icon: "🎯",
              },
              {
                title: "Instant Generation",
                description: "Create a polished, professional resume in minutes, not hours",
                icon: "⏱️",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="hud-panel p-6 relative overflow-hidden reveal-on-scroll"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(255, 0, 0, 0.1), 0 10px 10px -5px rgba(255, 0, 0, 0.04)" }}
              >
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-jarvis-gold mb-3">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
                <motion.div
                  className="absolute -bottom-2 -right-2 w-12 h-12 bg-jarvis-red/10 rounded-full"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.1, 0.2, 0.1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: index * 0.5,
                  }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* How it works section */}
      <div className="w-full py-16 px-4 relative z-10 bg-black">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-center mb-16 text-jarvis-red reveal-on-scroll"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            How GEN-RESUME Works
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Input Your Information",
                description: "Enter your work experience, education, and skills or import from LinkedIn",
              },
              {
                step: "02",
                title: "AI Optimization",
                description: "Our AI analyzes your input and optimizes content for maximum impact",
              },
              {
                step: "03",
                title: "Generate & Download",
                description: "Select a template, customize, and download your ready-to-use resume",
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                className="relative reveal-on-scroll"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="absolute -top-10 -left-2 text-6xl font-bold text-jarvis-red/10">{step.step}</div>
                <div className="border border-jarvis-gold/30 rounded-lg p-6 bg-zinc-900/30 h-full">
                  <h3 className="text-xl font-bold text-jarvis-gold mb-4">{step.title}</h3>
                  <p className="text-gray-300">{step.description}</p>
                </div>
                {index < 2 && (
                  <motion.div
                    className="hidden md:block absolute top-1/2 -right-4 text-jarvis-gold/50"
                    animate={{ x: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials section */}
      <div className="w-full py-16 px-4 relative z-10 bg-zinc-900/80">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-12 text-white reveal-on-scroll"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Success Stories
          </motion.h2>

          <div className="relative h-64">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonialIndex}
                className="absolute top-0 left-0 w-full hud-panel p-8"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
              >
                <div className="mb-6">
                  <svg
                    className="w-10 h-10 text-jarvis-gold/60 mx-auto"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>
                <p className="text-gray-300 text-lg mb-6">{testimonials[currentTestimonialIndex].text}</p>
                <div>
                  <p className="font-bold text-jarvis-gold">{testimonials[currentTestimonialIndex].name}</p>
                  <p className="text-gray-400">{testimonials[currentTestimonialIndex].role}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex justify-center space-x-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full ${currentTestimonialIndex === index ? 'bg-jarvis-gold' : 'bg-gray-600'
                  }`}
                onClick={() => setCurrentTestimonialIndex(index)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* CTA section */}
      <div className="w-full py-16 px-4 relative z-10 bg-black">
        <motion.div
          className="max-w-4xl mx-auto text-center hud-panel p-10 reveal-on-scroll"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.div
            animate={{
              boxShadow: ['0 0 0px rgba(255,215,0,0)', '0 0 30px rgba(255,215,0,0.3)', '0 0 0px rgba(255,215,0,0)'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
            }}
            className="rounded-lg"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-jarvis-gold">
              Ready to Upgrade Your Resume?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of professionals who have boosted their career with GEN-RESUME
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link to="/signup" className="jarvis-button group relative overflow-hidden px-8 py-3 cursor-none">
                <span className="relative z-10 text-lg">Get Started Free</span>
                <span className="ml-2 group-hover:translate-x-2 transition-transform inline-block relative z-10">
                  →
                </span>
                <motion.div
                  className="absolute inset-0 bg-jarvis-red/20 -z-0"
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.2, 0.4, 0.2],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                />
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="w-full py-8 px-4 bg-zinc-950 text-gray-400 z-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <span className="font-bold text-xl text-jarvis-gold">GEN-RESUME</span>
            <p className="text-sm mt-1">© 2025 GEN-RESUME. All rights reserved.</p>
          </div>
          <div className="flex space-x-6">
            <Link to="/terms" className="hover:text-jarvis-gold transition-colors">Terms</Link>
            <Link to="/privacy" className="hover:text-jarvis-gold transition-colors">Privacy</Link>
            <Link to="/contact" className="hover:text-jarvis-gold transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;