// import React, { useState, useEffect } from "react";
// import { useLocation } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";

// const TransitionLayout = ({ children }) => {
//   const location = useLocation();
//   const [particles, setParticles] = useState([]);
//   const [displayLocation, setDisplayLocation] = useState(location);
//   const [transitionStage, setTransitionStage] = useState("idle");

//   useEffect(() => {
//     if (location.pathname !== displayLocation.pathname) {
//       setTransitionStage("fadeOut");

//       // Generate floating particles
//       const newParticles = Array.from({ length: 100 }, (_, i) => ({
//         id: i,
//         x: Math.random() * 100, // Random X position (0 to 100% of viewport width)
//         y: Math.random() * 20 + 80, // Start from bottom (80% to 100% of viewport height)
//         size: Math.random() * 5 + 2, // Random size between 2px and 7px
//         speed: Math.random() * 2 + 1, // Random speed between 1 and 3
//       }));
//       setParticles(newParticles);

//       setTimeout(() => {
//         setDisplayLocation(location);
//         setTransitionStage("fadeIn");
//       }, 2000);
//     }
//   }, [location, displayLocation]);

//   return (
//     <div className="transition-container">
//       {/* Particles Floating Effect */}
//       {transitionStage === "fadeOut" && (
//         <motion.div
//           className="transition-overlay"
//           initial={{ opacity: 1 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           transition={{ duration: 0.5 }}
//         >
//           {particles.map((particle) => (
//             <motion.div
//               key={particle.id}
//               className="particle"
//               initial={{ x: `${particle.x}%`, y: "100%" }}
//               animate={{ y: "-10%" }} // Moves particles upwards
//               transition={{
//                 duration: 1.5,
//                 ease: "easeOut",
//                 delay: Math.random() * 0.5,
//               }}
//               style={{
//                 left: `${particle.x}%`,
//                 width: `${particle.size}px`,
//                 height: `${particle.size}px`,
//               }}
//             />
//           ))}
//         </motion.div>
//       )}

//       {/* Page Content with Fade-in */}
//       <AnimatePresence mode="wait">
//         <motion.div
//           key={displayLocation.pathname}
//           initial={{ opacity: 0, y: 50 }}
//           animate={{ opacity: 1, y: 0 }}
//           exit={{ opacity: 0, y: -50 }}
//           transition={{ duration: 0.1 }}
//         >
//           {children}
//         </motion.div>
//       </AnimatePresence>

//       {/* CSS Fixes */}
//       <style jsx>{`
//         .transition-container {
//           position: relative;
//           width: 100%;
//           height: 100vh;
//           overflow: hidden;
//         }

//         .transition-overlay {
//           position: absolute;
//           top: 0;
//           left: 0;
//           right: 0;
//           bottom: 0;
//           background-color: black;
//           z-index: 100;
//         }

//         .particle {
//           position: absolute;
//           background-color: cyan;
//           border-radius: 50%;
//           opacity: 0.8;
//           box-shadow: 0 0 8px cyan;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default TransitionLayout;
