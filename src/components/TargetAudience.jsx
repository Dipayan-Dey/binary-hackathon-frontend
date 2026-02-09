import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Code2, Briefcase } from 'lucide-react';

const TargetAudience = () => {
    const audiences = [
        {
            icon: <GraduationCap className="w-12 h-12" />,
            title: "College Students",
            description: "Bridge the gap between academic theory and industry demands. Build a portfolio that gets you hired.",
            gradient: "from-blue-500 to-cyan-500"
        },
        {
            icon: <Code2 className="w-12 h-12" />,
            title: "Self-Taught Devs",
            description: "Validate your skills against professional standards. Stop guessing if you're ready for a job.",
            gradient: "from-purple-500 to-pink-500"
        },
        {
            icon: <Briefcase className="w-12 h-12" />,
            title: "Job Switchers",
            description: "Pivot to tech with confidence. Identify transferable skills and close the gaps efficiently.",
            gradient: "from-green-500 to-emerald-500"
        }
    ];

    return (
        <section className="relative py-24 bg-slate-900 overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f0a_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f0a_1px,transparent_1px)] bg-[size:40px_40px]"></div>
            
            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-4xl font-bold text-white mb-4"
                    >
                        Who Is This <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">For?</span>
                    </motion.h2>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {audiences.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 }}
                            className="group relative"
                        >
                            {/* Glow Effect */}
                            <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500`}></div>
                            
                            {/* Card */}
                            <div className="relative flex flex-col items-center text-center p-8 rounded-2xl bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 hover:border-slate-600 transition-all duration-300 group-hover:scale-105 h-full">
                                <div className={`mb-6 p-5 bg-gradient-to-r ${item.gradient} rounded-2xl text-white shadow-lg group-hover:scale-110 transition-transform`}>
                                    {item.icon}
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                                <p className="text-slate-400 leading-relaxed">{item.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TargetAudience;
