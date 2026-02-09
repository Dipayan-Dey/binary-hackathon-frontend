import React from 'react';
import { motion } from 'framer-motion';
import { DotPattern } from './BackgroundPatterns';
import {
  SiMongodb,
  SiExpress,
  SiReact,
  SiNodedotjs,
  SiOpenai,
  SiTailwindcss,
  SiFramer,
  SiGithub,
} from 'react-icons/si';
const TechStack = () => {
  const technologies = [
    { name: 'MongoDB', gradient: 'from-green-500 to-emerald-500', position: { top: '15%', left: '10%' } },
    { name: 'Express.js', gradient: 'from-slate-400 to-slate-600', position: { top: '25%', left: '75%' } },
    { name: 'React', gradient: 'from-blue-400 to-cyan-400', position: { top: '45%', left: '15%' } },
    { name: 'Node.js', gradient: 'from-green-600 to-green-400', position: { top: '55%', left: '80%' } },
    { name: 'OpenAI', gradient: 'from-purple-500 to-pink-500', position: { top: '70%', left: '25%' } },
    { name: 'TailwindCSS', gradient: 'from-cyan-500 to-blue-500', position: { top: '35%', left: '85%' } },
    { name: 'Framer Motion', gradient: 'from-pink-500 to-rose-500', position: { top: '75%', left: '70%' } },
    { name: 'GitHub API', gradient: 'from-slate-600 to-slate-800', position: { top: '20%', left: '45%' } },
  ];

  // Tech logos as SVG paths
const techLogos = {
  'MongoDB': <SiMongodb />,
  'Express.js': <SiExpress />,
  'React': <SiReact />,
  'Node.js': <SiNodedotjs />,
  'OpenAI': <SiOpenai />,
  'TailwindCSS': <SiTailwindcss />,
  'Framer Motion': <SiFramer />,
  'GitHub API': <SiGithub />,
};




  return (
    <section className="relative py-24 md:py-32 bg-slate-950 overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-950"></div>
      <DotPattern />
      
      {/* Glowing Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 font-semibold tracking-wider uppercase text-sm mb-4"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
              <line x1="8" y1="21" x2="16" y2="21"/>
              <line x1="12" y1="17" x2="12" y2="21"/>
            </svg>
            Technologies
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mt-2 mb-4"
          >
            Built with <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Modern Tech</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-400 max-w-2xl mx-auto"
          >
            Powered by the MERN stack and cutting-edge AI technologies
          </motion.p>
        </div>

        {/* Floating Tech Icons - Desktop */}
        <div className="hidden md:block relative h-[500px] max-w-4xl mx-auto">
          {/* Center Circle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30 backdrop-blur-sm flex items-center justify-center">
            <div className="text-center">
              <svg className="w-16 h-16 mx-auto mb-2 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5"/>
                <path d="M2 12l10 5 10-5"/>
              </svg>
              <div className="text-white font-bold">MERN + AI</div>
              <div className="text-slate-400 text-sm">Full Stack</div>
            </div>
          </div>

          {/* Floating Tech Icons */}
          {technologies.map((tech, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, type: 'spring' }}
              style={{
                position: 'absolute',
                top: tech.position.top,
                left: tech.position.left,
              }}
              className="group"
            >
              <motion.div
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: index * 0.2,
                }}
                className="relative"
              >
                {/* Glow Effect */}
                <div className={`absolute inset-0 bg-gradient-to-r ${tech.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-300`}></div>
                
                {/* Icon Card */}
                <div className={`relative w-20 h-20 rounded-2xl bg-gradient-to-r ${tech.gradient} flex items-center justify-center shadow-lg border border-white/10 group-hover:scale-110 transition-transform cursor-pointer overflow-hidden`}>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
               <div className="w-10 h-10 text-white relative z-10 text-4xl flex items-center justify-center">
  {techLogos[tech.name]}
</div>

                </div>
                
                {/* Label */}
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-slate-800/90 backdrop-blur-sm px-3 py-1 rounded-lg text-white text-xs font-semibold border border-slate-700">
                    {tech.name}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Mobile Grid View */}
        <div className="md:hidden grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-lg mx-auto">
          {technologies.map((tech, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div className="relative">
                <div className={`absolute inset-0 bg-gradient-to-r ${tech.gradient} rounded-2xl blur-lg opacity-30 group-hover:opacity-60 transition-opacity`}></div>
                <div className={`relative bg-gradient-to-r ${tech.gradient} rounded-2xl p-6 flex flex-col items-center justify-center gap-2 border border-white/10`}>
                  <svg className="w-10 h-10 text-white" viewBox="0 0 24 24">
                    {techLogos[tech.name] || <circle cx="12" cy="12" r="10" fill="currentColor"/>}
                  </svg>
                  <div className="text-white text-xs font-semibold text-center">{tech.name}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tech Stack Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 grid md:grid-cols-3 gap-6 max-w-4xl mx-auto"
        >
          {[
            { icon: '🗄️', title: 'MERN Stack', desc: 'MongoDB, Express, React, Node.js for robust full-stack development' },
            { icon: '🤖', title: 'AI Integration', desc: 'OpenAI API for intelligent analysis and personalized recommendations' },
            { icon: '🎨', title: 'Modern UI', desc: 'TailwindCSS & Framer Motion for stunning, animated interfaces' }
          ].map((item, i) => (
            <div key={i} className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/50 backdrop-blur-sm hover:border-slate-700 transition-all group">
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{item.icon}</div>
              <h3 className="text-white font-bold mb-2">{item.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TechStack;
