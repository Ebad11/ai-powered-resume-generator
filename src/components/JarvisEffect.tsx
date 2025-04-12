
import React from 'react';

// This component creates the JARVIS-like scanning effect with neon blue theme
const JarvisEffect: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Scan line effect */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-jarvis-blue/20 animate-scan-line" />
      
      {/* Blue glow circles */}
      <div className="absolute top-[10%] left-[10%] w-[300px] h-[300px] rounded-full bg-jarvis-glow opacity-30" />
      <div className="absolute bottom-[15%] right-[5%] w-[250px] h-[250px] rounded-full bg-jarvis-glow opacity-20" />
      
      {/* Grid overlay */}
      <div 
        className="absolute inset-0 opacity-10" 
        style={{
          backgroundImage: `
            linear-gradient(rgba(30,174,219, 0.2) 1px, transparent 1px),
            linear-gradient(90deg, rgba(30,174,219, 0.2) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />
      
      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-[100px] h-[100px] border-l-2 border-t-2 border-jarvis-blue/40" />
      <div className="absolute top-0 right-0 w-[100px] h-[100px] border-r-2 border-t-2 border-jarvis-blue/40" />
      <div className="absolute bottom-0 left-0 w-[100px] h-[100px] border-l-2 border-b-2 border-jarvis-blue/40" />
      <div className="absolute bottom-0 right-0 w-[100px] h-[100px] border-r-2 border-b-2 border-jarvis-blue/40" />
    </div>
  );
};

export default JarvisEffect;
