import React from 'react';
import { motion } from 'framer-motion';
import { FeatureIcons } from './Logo';
import { GridPattern } from './BackgroundPatterns';

const features = [
  {
    Icon: FeatureIcons.GitHub,
    title: "GitHub Project Analyzer",
    description: "Deep scan your code for best practices, security, and quality metrics.",
    gradient: "from-blue-500 to-cyan-500",
    stats: "50+ metrics"
  },
  {
    Icon: FeatureIcons.Resume,
    title: "Resume Skill Analyzer",
    description: "Match your resume against real job descriptions to find gaps instantly.",
    gradient: "from-purple-500 to-pink-500",
    stats: "ATS optimized"
  },
  {
    Icon: FeatureIcons.Interview,
    title: "AI Mock Interviews",
    description: "Practice technical and behavioral questions with an AI interviewer.",
    gradient: "from-green-500 to-emerald-500",
    stats: "100+ questions"
  },
  {
    Icon: FeatureIcons.Roadmap,
    title: "Personalized Roadmap",
    description: "Get a week-by-week learning plan tailored to your career goals.",
    gradient: "from-orange-500 to-red-500",
    stats: "Custom path"
  },
  {
    Icon: FeatureIcons.AI,
    title: "Weekly Progress Alerts",
    description: "Stay consistent with smart reminders and detailed progress tracking.",
    gradient: "from-red-500 to-rose-500",
    stats: "Auto tracking"
  },
  {
    Icon: FeatureIcons.Chat,
    title: "Career Guidance Chatbot",
    description: "24/7 AI mentor answering your career and technical questions.",
    gradient: "from-indigo-500 to-purple-500",
    stats: "Always online"
  }
];

const Features = () => {
  return (
    <section id="features" className="relative py-24 bg-slate-950 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950"></div>
      <GridPattern />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-semibold tracking-wider uppercase text-sm mb-4"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5"/>
              <path d="M2 12l10 5 10-5"/>
            </svg>
            Features
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mt-2 mb-4"
          >
            Everything You Need to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Get Hired</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-400 max-w-2xl mx-auto"
          >
            Our AI-powered toolkit covers every aspect of your job preparation journey
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative"
            >
              {/* Glow Effect on Hover */}
              <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500`}></div>
              
              {/* Card */}
              <div className="relative p-8 rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm hover:border-slate-700 transition-all duration-300 group-hover:scale-105 h-full flex flex-col">
                {/* Icon Container */}
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  <feature.Icon className="w-8 h-8 relative z-10" />
                </div>
                
                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-white">{feature.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full bg-gradient-to-r ${feature.gradient} text-white font-semibold`}>
                      {feature.stats}
                    </span>
                  </div>
                  <p className="text-slate-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Decorative Corner */}
                <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${feature.gradient} opacity-10 rounded-bl-full`}></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
