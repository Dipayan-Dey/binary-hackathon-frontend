import React from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  TrendingUp,
  Award,
  Zap,
  Star,
  Rocket,
  Target,
} from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  const developers = [
    {
      id: 1,
      image:
        "https://ideogram.ai/assets/image/balanced/response/WQARCc9IRlaJlaUKvv8Vzg@2k",
      name: "Dipayan Dey",
      role: "DevOps Engineer | Lead Developer | Full Stack Developer | Data Analyst",
      tech: ["AWS", "Docker", "React", "Node.js", "Python", "AI/ML"],
      color: "from-[#00d9ff] to-[#a855f7]",
      position: { angle: 0, radius: 0 },
    },
  ];

  const getPosition = (angle, radius) => {
    const radian = (angle * Math.PI) / 180;
    return {
      x: radius * Math.cos(radian),
      y: radius * Math.sin(radian),
    };
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 pt-20">
      {/* Modern Geometric Background */}
      <div className="absolute inset-0">
        {/* Diagonal stripes pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 50px,
            rgba(255, 255, 255, 0.1) 50px,
            rgba(255, 255, 255, 0.1) 51px
          )`,
          }}
        ></div>

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
              AI-powered skill analysis, personalized roadmaps, and career
              guidance – Bridge the gap between where you are and where you want
              to be!
            </motion.p>

            {/* Stats Row - Redesigned */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-3 gap-4 mb-8"
            >
              {[
                {
                  icon: <Target className="w-5 h-5" />,
                  value: "95%",
                  label: "Success",
                },
                {
                  icon: <Rocket className="w-5 h-5" />,
                  value: "20K+",
                  label: "Users",
                },
                {
                  icon: <Star className="w-5 h-5" />,
                  value: "4.9",
                  label: "Rating",
                },
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
                    <div className="text-2xl font-bold text-white">
                      {stat.value}
                    </div>
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
                <ArrowRight
                  size={20}
                  className="relative group-hover:translate-x-1 transition-transform"
                />
              </Link>
              <a
                href="#workflow"
                className="px-8 py-4 bg-slate-800/50 backdrop-blur-sm border-2 border-slate-700 text-white rounded-full font-semibold text-lg hover:bg-slate-800 hover:border-slate-600 transition-all flex items-center justify-center gap-2"
              >
                See How It Works
              </a>
            </motion.div>
          </motion.div>

          {/* Right Side - Hero Banner */}
          {/* Right Side - Floating Interface (Option 2) */}
          <div className="relative hidden lg:flex items-center justify-center h-[600px] perspective-2000">
            <motion.div
              initial={{ opacity: 0, rotateY: -15, rotateX: 5 }}
              animate={{ opacity: 1, rotateY: -5, rotateX: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative w-full max-w-[600px] z-20 preserve-3d"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* 3D Floating Tablet Container - Simplified */}
              <motion.div
                animate={{
                  y: [0, -15, 0],
                  rotateZ: [0, 1, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative group"
                style={{ transform: "translateZ(20px)" }}
              >
                {/* Inner Frame */}
                <div className="relative rounded-[1.5rem] overflow-hidden border border-slate-600/30 bg-slate-950/50 p-10 m-20 shadow-2xl">
                  {/* <div className="absolute inset-0 bg-gradient-to-br from-[#00d9ff]/10 to-[#a855f7]/10 opacity-60 z-10 mix-blend-overlay"></div> */}

                  <img
                    src={developers[0].image}
                    alt="Hero Interface"
                    className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105 rounded-2xl"
                  />

                  {/* HUD Overlay Elements - purely decorative */}
                  <div className="absolute top-4 right-4 flex gap-1 z-20">
                    <div className="w-2 h-2 rounded-full bg-red-500/80"></div>
                    <div className="w-2 h-2 rounded-full bg-yellow-500/80"></div>
                    <div className="w-2 h-2 rounded-full bg-green-500/80"></div>
                  </div>

                  <div className="absolute bottom-4 left-4 z-20">
                    <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#00f5a0] animate-pulse"></div>
                      <span className="text-[10px] text-[#00f5a0] font-mono tracking-wider">
                        SYSTEM ONLINE
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
