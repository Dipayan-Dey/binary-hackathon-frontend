import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, TrendingUp, Award, Zap, Star, Rocket, Target } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  // Four featured developers with tech stacks
  const developers = [
    {
      id: 1,
      image: ' https://media.licdn.com/dms/image/v2/D4E35AQFVVb5HOneheQ/profile-framedphoto-shrink_400_400/B4EZYHIyOZHkAk-/0/1743876465831?e=1771268400&v=beta&t=kKDfe2fApUloTfMUZs5bjQiV4bgJPr1iHpxN613w8_8',
      name: 'Purnima Panda',
      role: 'UI Designer',
      tech: ['Figma', 'Photoshop', 'Illustrator'],
      color: 'from-blue-500 to-cyan-500',
      position: { angle: 45, radius: 200 }
    },
    {
      id: 2,
      image: 'https://res.cloudinary.com/dlsuycdfj/image/upload/v1754842811/profile_photos/63baf4af-088b-467d-adfe-ae5f7f9de544.jpg',
      name: 'Dipa Mondal',
      role: 'AI/ML Engineer',
      tech: ['Python', 'TensorFlow', 'PyTorch'],
      color: 'from-purple-500 to-pink-500',
      position: { angle: 135, radius: 200 }
    },
    {
      id: 3,
      image: 'https://media.licdn.com/dms/image/v2/D4D35AQEEBIrp796hBQ/profile-framedphoto-shrink_400_400/profile-framedphoto-shrink_400_400/0/1736313749444?e=1771272000&v=beta&t=xXKhkDsQw6ov-YkIj9VJvKLNU8yud-HoqHBvnSrfTuM',
      name: 'Dipayan Dey',
      role: 'DevOps Engineer | Lead Developer | Full Stack Developer | Data Analyst',
      tech: ['AWS', 'Docker', 'Backend'],
      color: 'from-green-500 to-emerald-500',
      position: { angle: 225, radius: 200 }
    },
    {
      id: 4,
      image: 'https://media.licdn.com/dms/image/v2/D4D35AQEjfXV1w7dZhA/profile-framedphoto-shrink_400_400/B4DZtwUiUbHwAc-/0/1767115990556?e=1771268400&v=beta&t=1eZNOW3cctQiy5h5_xdyrzcjy_9PR6Bb3I-qig-woE0',
      name: 'Ayan Sen',
      role: 'ML Enthusiast',
      tech: ['Python', 'TensorFlow', 'PyTorch'],
      color: 'from-orange-500 to-red-500',
      position: { angle: 315, radius: 200 }
    }
  ];

  const getPosition = (angle, radius) => {
    const radian = (angle * Math.PI) / 180;
    return {
      x: radius * Math.cos(radian),
      y: radius * Math.sin(radian)
    };
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 pt-20">
      {/* Modern Geometric Background */}
      <div className="absolute inset-0">
        {/* Diagonal stripes pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 50px,
            rgba(255, 255, 255, 0.1) 50px,
            rgba(255, 255, 255, 0.1) 51px
          )`
        }}></div>
        
        {/* Large gradient orbs - positioned differently */}
        <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] bg-gradient-to-br from-blue-600/20 to-cyan-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-32 w-[500px] h-[500px] bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-br from-emerald-600/10 to-teal-600/10 rounded-full blur-3xl"></div>
      </div>

      {/* Animated stars/dots background */}
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,black,transparent)]"></div>
      
      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[calc(100vh-80px)] py-12 lg:py-0">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-left"
          >
            {/* Badge */}
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 py-2.5 px-5 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm text-white text-sm font-semibold mb-6 border border-blue-500/20"
            >
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                AI-Powered Career Intelligence
              </span>
            </motion.div>
            
            {/* Main Heading */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-[1.1]"
            >
              <span className="text-white">Transform Your</span>
              <br />
              <span className="text-white">Career From </span>
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
                Developer
              </span>
              <br />
              <span className="text-white">to </span>
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 bg-clip-text text-transparent">
                Industry Leader
              </span>
            </motion.h1>
            
            {/* Description */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg md:text-xl text-slate-300 mb-8 max-w-xl leading-relaxed"
            >
              AI-powered skill analysis, personalized roadmaps, and career guidance – Bridge the gap between where you are and where you want to be!
            </motion.p>

            {/* Stats Row - Redesigned */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-3 gap-4 mb-8"
            >
              {[
                { icon: <Target className="w-5 h-5" />, value: '95%', label: 'Success' },
                { icon: <Rocket className="w-5 h-5" />, value: '20K+', label: 'Users' },
                { icon: <Star className="w-5 h-5" />, value: '4.9', label: 'Rating' }
              ].map((stat, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-3 hover:border-slate-600 transition-colors">
                    <div className="text-cyan-400 mb-1">{stat.icon}</div>
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-xs text-slate-400">{stat.label}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
            
            {/* CTA Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link
                to="/signup"
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-bold text-lg overflow-hidden hover:shadow-2xl hover:shadow-blue-500/50 flex items-center justify-center gap-2 transition-all"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <span className="relative">Start Your Journey</span>
                <ArrowRight size={20} className="relative group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#workflow"
                className="px-8 py-4 bg-slate-800/50 backdrop-blur-sm border-2 border-slate-700 text-white rounded-full font-semibold text-lg hover:bg-slate-800 hover:border-slate-600 transition-all flex items-center justify-center gap-2"
              >
                See How It Works
              </a>
            </motion.div>
          </motion.div>

          {/* Right Side - 4 Developer Orbital System */}
          <div className="relative hidden lg:flex items-center justify-center h-[600px]">
            {/* Main orbital ring */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="absolute w-[500px] h-[500px]"
            >
              {/* Rotating outer ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border-2 border-dashed border-blue-500/20"
              />
              
              {/* Inner decorative ring */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                className="absolute inset-12 rounded-full border border-purple-500/20"
              />

              {/* Connection lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
                <motion.line
                  x1="250" y1="250" x2="250" y2="50"
                  stroke="url(#lineGradient1)" strokeWidth="1"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: 1 }}
                />
                <motion.line
                  x1="250" y1="250" x2="450" y2="250"
                  stroke="url(#lineGradient2)" strokeWidth="1"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: 1.2 }}
                />
                <motion.line
                  x1="250" y1="250" x2="250" y2="450"
                  stroke="url(#lineGradient3)" strokeWidth="1"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: 1.4 }}
                />
                <motion.line
                  x1="250" y1="250" x2="50" y2="250"
                  stroke="url(#lineGradient4)" strokeWidth="1"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: 1.6 }}
                />
                <defs>
                  <linearGradient id="lineGradient1" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                  <linearGradient id="lineGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                  <linearGradient id="lineGradient3" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#14b8a6" />
                  </linearGradient>
                  <linearGradient id="lineGradient4" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#f97316" />
                    <stop offset="100%" stopColor="#ef4444" />
                  </linearGradient>
                </defs>
              </svg>
            </motion.div>

            {/* Center Hub */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, type: 'spring', stiffness: 200 }}
              className="absolute w-[200px] h-[200px] z-20"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-full blur-2xl"></div>
              <div className="absolute inset-3 bg-gradient-to-br from-slate-800 to-slate-900 rounded-full border-2 border-slate-700 shadow-2xl">
                <div className="absolute inset-4 bg-gradient-to-br from-slate-900 to-slate-950 rounded-full flex flex-col items-center justify-center">
                  <motion.div 
                    className="text-5xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-1"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    20k+
                  </motion.div>
                  <div className="text-slate-400 text-xs font-bold tracking-wide">DEVELOPERS</div>
                  <motion.div 
                    className="mt-2 flex gap-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                  >
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    ))}
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Four Developer Cards */}
            {developers.map((dev, index) => {
              const pos = getPosition(dev.position.angle, dev.position.radius);
              return (
                <motion.div
                  key={dev.id}
                  initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1,
                    x: pos.x,
                    y: pos.y,
                  }}
                  transition={{ 
                    delay: 1 + index * 0.15,
                    type: 'spring',
                    stiffness: 200,
                    damping: 20
                  }}
                  className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="relative group cursor-pointer"
                  >
                    {/* Glow effect */}
                    <div className={`absolute -inset-2 bg-gradient-to-r ${dev.color} rounded-2xl blur-xl opacity-0 group-hover:opacity-60 transition-opacity`}></div>
                    
                    {/* Card */}
                    <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-4 w-[180px] border border-slate-700 group-hover:border-slate-600 shadow-xl transition-all">
                      {/* Avatar */}
                      <div className="relative mb-3">
                        <div className={`absolute inset-0 bg-gradient-to-r ${dev.color} rounded-full blur-md opacity-50`}></div>
                        <img 
                          src={dev.image} 
                          alt={dev.name}
                          className="relative w-16 h-16 rounded-full border-2 border-slate-700 mx-auto object-cover"
                        />
                        {/* Status indicator */}
                        <div className="absolute bottom-0 right-12 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-900"></div>
                      </div>

                      {/* Info */}
                      <h3 className="text-white font-bold text-sm text-center mb-1">{dev.name}</h3>
                      <p className="text-slate-400 text-xs text-center mb-3">{dev.role}</p>

                      {/* Tech Stack */}
                      <div className="flex flex-wrap gap-1 justify-center">
                        {dev.tech.map((tech, i) => (
                          <span 
                            key={i}
                            className={`px-2 py-0.5 bg-gradient-to-r ${dev.color} text-white text-[9px] font-semibold rounded-full`}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      {/* Progress bar */}
                      <div className="mt-3 h-1 bg-slate-700 rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full bg-gradient-to-r ${dev.color}`}
                          initial={{ width: "0%" }}
                          animate={{ width: "100%" }}
                          transition={{ delay: 1.5 + index * 0.2, duration: 1 }}
                        ></motion.div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}

            {/* Orbital particles */}
            {[...Array(20)].map((_, i) => {
              const angle = (360 / 20) * i;
              const pos = getPosition(angle, 250);
              return (
                <motion.div
                  key={`particle-${i}`}
                  className="absolute left-1/2 top-1/2 w-1 h-1 bg-blue-400 rounded-full"
                  style={{
                    x: pos.x,
                    y: pos.y,
                  }}
                  animate={{
                    opacity: [0.2, 0.8, 0.2],
                    scale: [1, 1.5, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.1,
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;