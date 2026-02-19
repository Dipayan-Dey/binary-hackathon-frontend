import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Code2, Briefcase } from 'lucide-react';

const audiences = [
  {
    icon: GraduationCap,
    title: "College Students",
    tag: "ACADEMIC → INDUSTRY",
    description: "Bridge the gap between academic theory and industry demands. Build a portfolio that gets you hired before you graduate.",
    color: "#00d9ff",
    colorB: "#6366f1",
    stat: { value: "85%", label: "placement rate" },
    features: ["Portfolio builder", "Internship roadmap", "Interview prep"],
  },
  {
    icon: Code2,
    title: "Self-Taught Devs",
    tag: "VALIDATE YOUR SKILLS",
    description: "Validate your skills against professional standards. Stop guessing if you're ready — know exactly where you stand.",
    color: "#a855f7",
    colorB: "#f472b6",
    stat: { value: "3×", label: "faster job offers" },
    features: ["Skill benchmarking", "Gap analysis", "Project reviews"],
  },
  {
    icon: Briefcase,
    title: "Job Switchers",
    tag: "CAREER PIVOT",
    description: "Pivot to tech with confidence. Identify transferable skills and close the gaps efficiently — no wasted effort.",
    color: "#34d399",
    colorB: "#06b6d4",
    stat: { value: "60d", label: "avg. to first offer" },
    features: ["Skill mapping", "Transition plan", "Resume rewrite"],
  },
];

const CardParticles = ({ color }) => (
  <>
    {[...Array(6)].map((_, i) => (
      <div
        key={i}
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 3 + (i % 3),
          height: 3 + (i % 3),
          left: `${15 + i * 14}%`,
          top: `${10 + (i % 4) * 22}%`,
          background: color,
          opacity: 0.25,
          animation: `ptFloat ${3 + i * 0.7}s ease-in-out infinite`,
          animationDelay: `${i * 0.4}s`,
        }}
      />
    ))}
  </>
);

const TargetAudience = () => {
  const [hovered, setHovered] = useState(null);

  return (
    <section
      className="relative py-28 overflow-hidden"
      style={{ background: "linear-gradient(160deg, #020209 0%, #06060f 50%, #020209 100%)" }}
    >
      <style>{`
        @keyframes ptFloat {
          0%,100% { transform: translateY(0) scale(1); opacity: 0.25; }
          50%      { transform: translateY(-18px) scale(1.4); opacity: 0.55; }
        }
        @keyframes scanBeam {
          0%   { top: 0%;   opacity: 0; }
          8%   { opacity: 1; }
          92%  { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes borderPulse {
          0%,100% { opacity: 0.35; }
          50%     { opacity: 0.9; }
        }
        @keyframes gridDrift {
          from { background-position: 0 0; }
          to   { background-position: 40px 40px; }
        }
        @keyframes orbFloat {
          0%,100% { transform: translate(0,0) scale(1); }
          50%     { transform: translate(15px,-25px) scale(1.08); }
        }
        @keyframes tagShimmer {
          0%   { left: -80%; }
          100% { left: 200%; }
        }
        @keyframes countUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .section-grid {
          background-image: linear-gradient(rgba(99,102,241,0.035) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(99,102,241,0.035) 1px, transparent 1px);
          background-size: 40px 40px;
          animation: gridDrift 18s linear infinite;
        }
        .scan-line {
          animation: scanBeam 5s linear infinite;
          position: absolute; left: 0; right: 0; height: 1px; pointer-events: none; z-index: 5;
        }
        .orb-drift { animation: orbFloat 10s ease-in-out infinite; }
        .tag-shimmer { animation: tagShimmer 3s ease-in-out infinite; }
      `}</style>

      {/* ── BG Layers ── */}
      <div className="absolute inset-0 section-grid opacity-60" />
      <div className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse 75% 60% at 50% 50%, transparent 35%, #020209 100%)" }} />

      {/* Orbs */}
      <div className="orb-drift absolute -top-20 -left-20 w-96 h-96 rounded-full blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(0,217,255,0.09), transparent 70%)" }} />
      <div className="orb-drift absolute -bottom-20 -right-20 w-96 h-96 rounded-full blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(168,85,247,0.09), transparent 70%)", animationDelay: "5s" }} />

      <div className="container mx-auto px-4 md:px-6 relative z-10">

        {/* ── Header ── */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-5 overflow-hidden relative"
            style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)" }}
          >
            <div className="tag-shimmer absolute top-0 bottom-0 w-12 blur-sm"
              style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)" }} />
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            <span className="text-indigo-400 text-xs font-bold tracking-[0.18em] relative z-10">WHO IS THIS FOR</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.7 }}
            className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight"
          >
            Built For Every{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
              Developer
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 max-w-xl mx-auto leading-relaxed"
          >
            Whether you're just starting out or making a bold pivot — we have a path for you.
          </motion.p>

          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.35, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto mt-7 h-px w-28 origin-center"
            style={{ background: "linear-gradient(90deg, transparent, rgba(168,85,247,0.7), transparent)" }}
          />
        </div>

        {/* ── Cards ── */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {audiences.map((item, index) => {
            const Icon = item.icon;
            const isHovered = hovered === index;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                onMouseEnter={() => setHovered(index)}
                onMouseLeave={() => setHovered(null)}
                className="group relative cursor-default"
              >
                {/* Outer glow */}
                <motion.div
                  animate={{ opacity: isHovered ? 1 : 0 }}
                  transition={{ duration: 0.4 }}
                  className="absolute -inset-2 rounded-3xl blur-2xl pointer-events-none"
                  style={{
                    background: `radial-gradient(ellipse at 50% 50%, ${item.color}25, transparent 70%)`,
                  }}
                />

                {/* Card */}
                <motion.div
                  animate={{ y: isHovered ? -8 : 0 }}
                  transition={{ type: "spring", stiffness: 280, damping: 22 }}
                  className="relative rounded-3xl overflow-hidden h-full flex flex-col"
                  style={{
                    background: isHovered
                      ? `linear-gradient(145deg, ${item.color}0c, rgba(255,255,255,0.02))`
                      : "rgba(255,255,255,0.025)",
                    border: `1px solid ${isHovered ? item.color + "45" : "rgba(255,255,255,0.07)"}`,
                    transition: "background 0.4s ease, border-color 0.4s ease",
                  }}
                >
                  {/* Particles */}
                  <AnimatePresence>
                    {isHovered && <CardParticles color={item.color} />}
                  </AnimatePresence>

                  {/* Scan line */}
                  <div
                    className="scan-line"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${item.color}25, transparent)`,
                      animationDelay: `${index * 1.6}s`,
                    }}
                  />

                  {/* Top accent bar */}
                  <motion.div
                    animate={{ opacity: isHovered ? 1 : 0.3, scaleX: isHovered ? 1 : 0.4 }}
                    transition={{ duration: 0.4 }}
                    className="absolute top-0 left-8 right-8 h-px origin-left"
                    style={{ background: `linear-gradient(90deg, transparent, ${item.color}, transparent)` }}
                  />

                  {/* Corner brackets */}
                  {[["top-3 left-3","border-t border-l"], ["top-3 right-3","border-t border-r"], ["bottom-3 left-3","border-b border-l"], ["bottom-3 right-3","border-b border-r"]].map(([pos, bdr], ci) => (
                    <div
                      key={ci}
                      className={`absolute ${pos} w-3 h-3 ${bdr} pointer-events-none transition-all duration-500`}
                      style={{
                        borderColor: isHovered ? `${item.color}70` : "rgba(255,255,255,0.1)",
                      }}
                    />
                  ))}

                  <div className="relative z-10 p-7 flex flex-col h-full">

                    {/* Tag */}
                    <div className="flex items-center gap-2 mb-6">
                      <div
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0 transition-all duration-500"
                        style={{
                          background: item.color,
                          boxShadow: isHovered ? `0 0 8px ${item.color}` : "none",
                          animation: isHovered ? "borderPulse 1.5s ease-in-out infinite" : "none",
                        }}
                      />
                      <span
                        className="text-[9px] font-black tracking-[0.2em] transition-colors duration-400"
                        style={{ color: isHovered ? item.color : "rgba(255,255,255,0.3)" }}
                      >
                        {item.tag}
                      </span>
                    </div>

                    {/* Icon */}
                    <motion.div
                      animate={{ scale: isHovered ? 1.1 : 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 relative"
                      style={{
                        background: isHovered
                          ? `linear-gradient(135deg, ${item.color}28, ${item.colorB}18)`
                          : "rgba(255,255,255,0.04)",
                        border: `1px solid ${isHovered ? item.color + "40" : "rgba(255,255,255,0.08)"}`,
                        boxShadow: isHovered ? `0 0 24px ${item.color}25` : "none",
                        transition: "all 0.4s ease",
                      }}
                    >
                      <Icon
                        className="w-8 h-8 transition-all duration-400"
                        style={{ color: isHovered ? item.color : "rgba(255,255,255,0.4)" }}
                      />
                    </motion.div>

                    {/* Title */}
                    <h3 className="text-xl font-black text-white mb-3 leading-tight">{item.title}</h3>

                    {/* Description */}
                    <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-1">{item.description}</p>

                    {/* Stat */}
                    <motion.div
                      animate={{ opacity: isHovered ? 1 : 0.4 }}
                      transition={{ duration: 0.35 }}
                      className="flex items-end gap-2 mb-5"
                    >
                      <span
                        className="text-3xl font-black leading-none transition-all duration-400"
                        style={{ color: isHovered ? item.color : "rgba(255,255,255,0.5)" }}
                      >
                        {item.stat.value}
                      </span>
                      <span className="text-slate-500 text-xs mb-1">{item.stat.label}</span>
                    </motion.div>

                    {/* Divider */}
                    <div
                      className="h-px mb-5 transition-all duration-500"
                      style={{
                        background: isHovered
                          ? `linear-gradient(90deg, ${item.color}50, transparent)`
                          : "rgba(255,255,255,0.06)",
                      }}
                    />

                    {/* Feature chips */}
                    <div className="flex flex-wrap gap-2">
                      {item.features.map((feat, fi) => (
                        <motion.span
                          key={fi}
                          initial={{ opacity: 0, scale: 0.85 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: fi * 0.06 }}
                          className="px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wide transition-all duration-400"
                          style={{
                            background: isHovered ? `${item.color}15` : "rgba(255,255,255,0.04)",
                            border: `1px solid ${isHovered ? item.color + "35" : "rgba(255,255,255,0.07)"}`,
                            color: isHovered ? item.color : "rgba(255,255,255,0.35)",
                          }}
                        >
                          {feat}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* ── Bottom connector row ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-14 flex items-center justify-center gap-8 flex-wrap"
        >
          {["No experience needed", "Personalized for you", "Results in 60 days"].map((text, i) => (
            <div key={i} className="flex items-center gap-2">
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  background: ["#00d9ff", "#a855f7", "#34d399"][i],
                  boxShadow: `0 0 8px ${["#00d9ff", "#a855f7", "#34d399"][i]}80`,
                }}
              />
              <span className="text-slate-400 text-sm font-medium">{text}</span>
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default TargetAudience;