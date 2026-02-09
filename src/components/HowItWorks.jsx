import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, Link2, FolderGit2, Sparkles, GraduationCap, MessageSquare, Video, Mail, Share2, ZoomIn, ZoomOut, Maximize2, X } from 'lucide-react';

const steps = [
  {
    id: 1,
    icon: <UserPlus className="w-7 h-7 md:w-8 md:h-8" />,
    title: "Register / Login",
    description: "Create your account in seconds",
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-500",
    shadowColor: "shadow-blue-500/50",
    position: { x: 12, y: 20 },
    connections: [2]
  },
  {
    id: 2,
    icon: <Link2 className="w-7 h-7 md:w-8 md:h-8" />,
    title: "Connect Profiles",
    description: "Link GitHub & LinkedIn",
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-500",
    shadowColor: "shadow-purple-500/50",
    position: { x: 35, y: 8 },
    connections: [3]
  },
  {
    id: 3,
    icon: <FolderGit2 className="w-7 h-7 md:w-8 md:h-8" />,
    title: "Select Repository",
    description: "Choose ONE GitHub repo",
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-500",
    shadowColor: "shadow-green-500/50",
    position: { x: 58, y: 18 },
    connections: [4]
  },
  {
    id: 4,
    icon: <Sparkles className="w-7 h-7 md:w-8 md:h-8" />,
    title: "AI Analysis",
    description: "System analyzes project + resume",
    color: "from-yellow-500 to-orange-500",
    bgColor: "bg-yellow-500",
    shadowColor: "shadow-yellow-500/50",
    position: { x: 80, y: 12 },
    connections: [5]
  },
  {
    id: 5,
    icon: <GraduationCap className="w-7 h-7 md:w-8 md:h-8" />,
    title: "Skills Evaluation",
    description: "AI evaluates skills & readiness",
    color: "from-red-500 to-rose-500",
    bgColor: "bg-red-500",
    shadowColor: "shadow-red-500/50",
    position: { x: 90, y: 38 },
    connections: [6]
  },
  {
    id: 6,
    icon: <MessageSquare className="w-7 h-7 md:w-8 md:h-8" />,
    title: "AI Mentor Chat",
    description: "Chat with personal AI mentor",
    color: "from-indigo-500 to-blue-500",
    bgColor: "bg-indigo-500",
    shadowColor: "shadow-indigo-500/50",
    position: { x: 82, y: 65 },
    connections: [7]
  },
  {
    id: 7,
    icon: <Video className="w-7 h-7 md:w-8 md:h-8" />,
    title: "Mock Interview",
    description: "AI-powered mock interviews",
    color: "from-teal-500 to-cyan-500",
    bgColor: "bg-teal-500",
    shadowColor: "shadow-teal-500/50",
    position: { x: 60, y: 82 },
    connections: [8]
  },
  {
    id: 8,
    icon: <Mail className="w-7 h-7 md:w-8 md:h-8" />,
    title: "Weekly Alerts",
    description: "Receive alerts + emails",
    color: "from-violet-500 to-purple-500",
    bgColor: "bg-violet-500",
    shadowColor: "shadow-violet-500/50",
    position: { x: 35, y: 80 },
    connections: [9]
  },
  {
    id: 9,
    icon: <Share2 className="w-7 h-7 md:w-8 md:h-8" />,
    title: "LinkedIn Share",
    description: "Post achievements to LinkedIn",
    color: "from-pink-500 to-rose-500",
    bgColor: "bg-pink-500",
    shadowColor: "shadow-pink-500/50",
    position: { x: 15, y: 60 },
    connections: []
  }
];

const HowItWorks = () => {
  const [activeStep, setActiveStep] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.2, 2));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.2, 0.6));
  const toggleFullscreen = () => setIsFullscreen(!isFullscreen);

  // Generate organic curved path between two points
  const generatePath = (start, end, width, height) => {
    const startX = (start.x / 100) * width;
    const startY = (start.y / 100) * height;
    const endX = (end.x / 100) * width;
    const endY = (end.y / 100) * height;

    const deltaX = endX - startX;
    const deltaY = endY - startY;
    
    // Create smooth organic curves
    const cp1x = startX + deltaX * 0.25 + deltaY * 0.15;
    const cp1y = startY + deltaY * 0.25 - deltaX * 0.15;
    const cp2x = startX + deltaX * 0.75 - deltaY * 0.15;
    const cp2y = startY + deltaY * 0.75 + deltaX * 0.15;

    return `M ${startX} ${startY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${endX} ${endY}`;
  };

  return (
    <section id="workflow" className="relative py-20 md:py-32 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
      {/* Enhanced Background */}
      <div className="absolute inset-0">
        {/* Animated grid with depth */}
        <div className="absolute inset-0 opacity-[0.15]">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              radial-gradient(circle at 2px 2px, rgba(59, 130, 246, 0.15) 1px, transparent 0)
            `,
            backgroundSize: '50px 50px',
            animation: 'gridMove 20s linear infinite'
          }}></div>
        </div>

        {/* Dynamic gradient orbs */}
        <motion.div 
          className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-gradient-to-r from-blue-600/15 to-cyan-600/15 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-20 right-1/4 w-[500px] h-[500px] bg-gradient-to-r from-purple-600/15 to-pink-600/15 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 md:mb-24">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block text-blue-400 font-semibold tracking-wider uppercase text-sm mb-4"
          >
            Your Journey
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-6xl font-bold text-white mb-6"
          >
            How It <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">Works</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto"
          >
            An intelligent network connecting each step of your career transformation
          </motion.p>
        </div>

        {/* Mind Map View - Desktop */}
        <div className="hidden lg:block">
          <div className="relative w-full max-w-7xl mx-auto" style={{ height: '800px' }}>
            {/* SVG for curved connections */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
              <defs>
                {/* Define gradient for each connection */}
                {steps.map((step) => 
                  step.connections.map((targetId) => {
                    const targetStep = steps.find(s => s.id === targetId);
                    return (
                      <linearGradient
                        key={`gradient-${step.id}-${targetId}`}
                        id={`gradient-${step.id}-${targetId}`}
                        x1="0%" y1="0%" x2="100%" y2="100%"
                      >
                        <stop offset="0%" stopColor={step.bgColor.replace('bg-', '#')} stopOpacity="0.6" />
                        <stop offset="100%" stopColor={targetStep?.bgColor.replace('bg-', '#')} stopOpacity="0.6" />
                      </linearGradient>
                    );
                  })
                )}

                {/* Glow filter */}
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>

              {/* Draw all connections */}
              {steps.map((step) => 
                step.connections.map((targetId) => {
                  const targetStep = steps.find(s => s.id === targetId);
                  if (!targetStep) return null;

                  const path = generatePath(step.position, targetStep.position, 1200, 800);

                  return (
                    <g key={`connection-${step.id}-${targetId}`}>
                      {/* Main path */}
                      <motion.path
                        d={path}
                        fill="none"
                        stroke={`url(#gradient-${step.id}-${targetId})`}
                        strokeWidth={activeStep === step.id || activeStep === targetId ? "3" : "2"}
                        opacity={activeStep === null || activeStep === step.id || activeStep === targetId ? 0.8 : 0.3}
                        initial={{ pathLength: 0, opacity: 0 }}
                        whileInView={{ pathLength: 1, opacity: 0.8 }}
                        viewport={{ once: true }}
                        transition={{ 
                          duration: 1.5, 
                          delay: step.id * 0.1,
                          ease: "easeInOut"
                        }}
                        filter="url(#glow)"
                      />

                      {/* Animated flow particles */}
                      <motion.circle
                        r="4"
                        fill={step.bgColor.replace('bg-', '#')}
                        opacity="0.8"
                        filter="url(#glow)"
                      >
                        <animateMotion
                          dur="4s"
                          repeatCount="indefinite"
                          path={path}
                          begin={`${step.id * 0.5}s`}
                        />
                        <animate
                          attributeName="opacity"
                          values="0;0.8;0"
                          dur="4s"
                          repeatCount="indefinite"
                        />
                      </motion.circle>
                    </g>
                  );
                })
              )}
            </svg>

            {/* Step Nodes */}
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, scale: 0, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  delay: index * 0.1, 
                  type: "spring", 
                  stiffness: 200,
                  damping: 15
                }}
                style={{
                  position: 'absolute',
                  left: `${step.position.x}%`,
                  top: `${step.position.y}%`,
                  transform: 'translate(-50%, -50%)',
                  zIndex: activeStep === step.id ? 50 : 10
                }}
                onMouseEnter={() => setActiveStep(step.id)}
                onMouseLeave={() => setActiveStep(null)}
                className="cursor-pointer"
              >
                {/* Pulsing background ring */}
                <motion.div
                  className={`absolute -inset-6 bg-gradient-to-r ${step.color} rounded-full blur-2xl opacity-0`}
                  animate={{
                    opacity: activeStep === step.id ? [0.3, 0.6, 0.3] : 0,
                    scale: activeStep === step.id ? [1, 1.2, 1] : 1
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                />

                {/* Step number badge */}
                <motion.div
                  className={`absolute -top-3 -left-3 w-8 h-8 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center text-white font-bold text-sm shadow-xl border-2 border-slate-900 z-10`}
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  transition={{ duration: 0.3 }}
                >
                  {index + 1}
                </motion.div>

                {/* Main node card */}
                <motion.div
                  className={`relative bg-slate-800/90 backdrop-blur-xl border-2 border-slate-700 rounded-2xl p-5 min-w-[220px] shadow-2xl ${step.shadowColor}`}
                  whileHover={{ 
                    scale: 1.05,
                    borderColor: step.bgColor.replace('bg-', '#'),
                    boxShadow: `0 25px 50px -12px ${step.bgColor.replace('bg-', 'rgba(')}0.5)`
                  }}
                  animate={{
                    borderColor: activeStep === step.id ? step.bgColor.replace('bg-', '#') : 'rgb(51, 65, 85)'
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Icon container */}
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white mb-4 shadow-lg mx-auto`}>
                    <motion.div
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                    >
                      {step.icon}
                    </motion.div>
                  </div>

                  {/* Content */}
                  <h3 className="text-white font-bold text-base mb-2 text-center">
                    {step.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed text-center">
                    {step.description}
                  </p>

                  {/* Animated progress bar */}
                  <div className="mt-4 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full bg-gradient-to-r ${step.color} rounded-full`}
                      initial={{ width: "0%", opacity: 0 }}
                      whileInView={{ width: "100%", opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 + 0.5, duration: 1 }}
                    />
                  </div>
                </motion.div>

                {/* Connection indicator dots */}
                {step.connections.length > 0 && (
                  <motion.div
                    className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-lg"
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  />
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile/Tablet View with Zoom */}
        <div className={`lg:hidden relative ${isFullscreen ? 'fixed inset-0 z-50 bg-slate-950 p-6 overflow-auto' : ''}`}>
          {/* Zoom Controls */}
          <div className="flex justify-between items-center gap-2 mb-6">
            <div className="flex gap-2">
              <button
                onClick={handleZoomOut}
                className="p-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white hover:bg-slate-700 transition-colors active:scale-95"
                aria-label="Zoom out"
              >
                <ZoomOut className="w-5 h-5" />
              </button>
              <button
                onClick={handleZoomIn}
                className="p-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white hover:bg-slate-700 transition-colors active:scale-95"
                aria-label="Zoom in"
              >
                <ZoomIn className="w-5 h-5" />
              </button>
            </div>
            <button
              onClick={toggleFullscreen}
              className="p-2.5 bg-gradient-to-r from-blue-600 to-purple-600 border border-blue-500 rounded-lg text-white hover:from-blue-700 hover:to-purple-700 transition-all active:scale-95 flex items-center gap-2 px-4"
              aria-label="Toggle fullscreen"
            >
              {isFullscreen ? <X className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
              <span className="text-sm font-semibold">{isFullscreen ? 'Exit' : 'Fullscreen'}</span>
            </button>
          </div>

          {/* Scrollable Container */}
          <div className={`overflow-auto rounded-xl border-2 border-slate-700/50 bg-slate-900/30 backdrop-blur-sm ${isFullscreen ? 'h-[calc(100vh-120px)]' : 'h-[700px]'}`}>
            <div 
              style={{ 
                transform: `scale(${zoom})`, 
                transformOrigin: 'top left', 
                transition: 'transform 0.3s ease',
                minWidth: '1200px',
                height: '900px',
                position: 'relative'
              }}
            >
              {/* SVG for mobile connections */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
                <defs>
                  {steps.map((step) => 
                    step.connections.map((targetId) => {
                      const targetStep = steps.find(s => s.id === targetId);
                      return (
                        <linearGradient
                          key={`gradient-mobile-${step.id}-${targetId}`}
                          id={`gradient-mobile-${step.id}-${targetId}`}
                          x1="0%" y1="0%" x2="100%" y2="100%"
                        >
                          <stop offset="0%" stopColor={step.bgColor.replace('bg-', '#')} stopOpacity="0.6" />
                          <stop offset="100%" stopColor={targetStep?.bgColor.replace('bg-', '#')} stopOpacity="0.6" />
                        </linearGradient>
                      );
                    })
                  )}
                </defs>

                {steps.map((step) => 
                  step.connections.map((targetId) => {
                    const targetStep = steps.find(s => s.id === targetId);
                    if (!targetStep) return null;

                    const path = generatePath(step.position, targetStep.position, 1200, 900);

                    return (
                      <g key={`connection-mobile-${step.id}-${targetId}`}>
                        <motion.path
                          d={path}
                          fill="none"
                          stroke={`url(#gradient-mobile-${step.id}-${targetId})`}
                          strokeWidth="2.5"
                          opacity="0.7"
                          initial={{ pathLength: 0 }}
                          whileInView={{ pathLength: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.5, delay: step.id * 0.1 }}
                        />

                        <motion.circle r="3" fill={step.bgColor.replace('bg-', '#')} opacity="0.8">
                          <animateMotion
                            dur="4s"
                            repeatCount="indefinite"
                            path={path}
                            begin={`${step.id * 0.5}s`}
                          />
                          <animate
                            attributeName="opacity"
                            values="0;0.8;0"
                            dur="4s"
                            repeatCount="indefinite"
                          />
                        </motion.circle>
                      </g>
                    );
                  })
                )}
              </svg>

              {/* Mobile Step Nodes */}
              {steps.map((step, index) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08, type: "spring", stiffness: 200 }}
                  style={{
                    position: 'absolute',
                    left: `${step.position.x}%`,
                    top: `${step.position.y}%`,
                    transform: 'translate(-50%, -50%)',
                    zIndex: 10
                  }}
                >
                  <div className={`absolute -top-2.5 -left-2.5 w-7 h-7 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center text-white font-bold text-xs shadow-lg border-2 border-slate-900`}>
                    {index + 1}
                  </div>

                  <div className={`relative bg-slate-800/95 backdrop-blur-xl border-2 border-slate-700 rounded-xl p-4 w-[200px] shadow-xl`}>
                    <div className={`w-14 h-14 rounded-lg bg-gradient-to-br ${step.color} flex items-center justify-center text-white mb-3 shadow-lg mx-auto`}>
                      {step.icon}
                    </div>

                    <h3 className="text-white font-bold text-sm mb-1.5 text-center">{step.title}</h3>
                    <p className="text-slate-400 text-xs leading-relaxed text-center">{step.description}</p>

                    <div className="mt-3 h-1 bg-slate-700 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full bg-gradient-to-r ${step.color}`}
                        initial={{ width: "0%" }}
                        whileInView={{ width: "100%" }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.08 + 0.3, duration: 0.8 }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <p className="text-center text-slate-500 text-sm mt-4">
            💡 Use zoom controls and drag to explore the complete workflow
          </p>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16 md:mt-20"
        >
          <p className="text-slate-400 mb-6 text-base md:text-lg">Ready to transform your career?</p>
          <a
            href="#features"
            className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-bold text-base md:text-lg hover:from-blue-700 hover:to-purple-700 transition-all hover:shadow-2xl hover:shadow-blue-500/50 hover:scale-105 transform"
          >
            Explore All Features
          </a>
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes gridMove {
          0% { background-position: 0 0; }
          100% { background-position: 50px 50px; }
        }
      `}</style>
    </section>
  );
};

export default HowItWorks;