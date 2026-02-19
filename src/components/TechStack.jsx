import React, { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { DotPattern } from "./BackgroundPatterns";
import {
  SiMongodb,
  SiExpress,
  SiReact,
  SiNodedotjs,
  SiOpenai,
  SiTailwindcss,
  SiFramer,
  SiGithub,
} from "react-icons/si";
import { Linkedin, LinkedinIcon } from "lucide-react";

const technologies = [
  {
    name: "MongoDB",
    icon: <SiMongodb />,
    color: "#00ED64",
    label: "DATABASE",
    desc: "NoSQL · Document Store",
  },
  {
    name: "Express.js",
    icon: <SiExpress />,
    color: "#94a3b8",
    label: "BACKEND",
    desc: "REST · Middleware",
  },
  {
    name: "React",
    icon: <SiReact />,
    color: "#61DAFB",
    label: "FRONTEND",
    desc: "SPA · Component UI",
  },
  {
    name: "Node.js",
    icon: <SiNodedotjs />,
    color: "#8CC84B",
    label: "RUNTIME",
    desc: "V8 · Event Loop",
  },
  {
    name: "OpenAI",
    icon: <SiOpenai />,
    color: "#c084fc",
    label: "AI ENGINE",
    desc: "GPT-4 · Embeddings",
  },
  {
    name: "TailwindCSS",
    icon: <SiTailwindcss />,
    color: "#38BDF8",
    label: "STYLING",
    desc: "Utility · Design System",
  },
  {
    name: "Framer Motion",
    icon: <SiFramer />,
    color: "#f472b6",
    label: "ANIMATION",
    desc: "Spring · Gesture",
  },
  {
    name: "GitHub API",
    icon: <SiGithub />,
    color: "#e2e8f0",
    label: "VERSION",
    desc: "CI/CD · Source Control",
  },
{
  name: 'Linked API',
  icon: <LinkedinIcon />,
  color: '#0A66C2',
  label: 'LINKEDIN',
  desc: 'Post achievements, milestones',
}

];

const HexCard = ({ tech, index, total, isActive, onHover, onLeave }) => {
  const angle = (index / total) * 360 - 90;
  const rad = (angle * Math.PI) / 180;
  const radius = 210;
  const x = Math.cos(rad) * radius;
  const y = Math.sin(rad) * radius;

  return (
    <div
      className="absolute"
      style={{
        left: "50%",
        top: "50%",
        transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{
          delay: index * 0.09,
          duration: 0.5,
          type: "spring",
          stiffness: 200,
        }}
        onMouseEnter={() => onHover(index)}
        onMouseLeave={onLeave}
        whileHover={{ scale: 1.2, zIndex: 30 }}
        className="relative cursor-pointer"
        style={{ width: 80, height: 80 }}
      >
        {/* Outer glow bloom */}
        <div
          className="absolute inset-0 rounded-full blur-2xl transition-all duration-500"
          style={{
            background: tech.color,
            opacity: isActive ? 0.35 : 0,
            transform: "scale(2)",
          }}
        />

        {/* SVG hex */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 80 80"
          fill="none"
        >
          <polygon
            points="40,3 77,21.5 77,58.5 40,77 3,58.5 3,21.5"
            stroke={tech.color}
            strokeWidth={isActive ? 1.5 : 0.7}
            strokeOpacity={isActive ? 1 : 0.3}
            fill={isActive ? `${tech.color}18` : "rgba(255,255,255,0.02)"}
            style={{ transition: "all 0.4s ease" }}
          />
          {isActive && (
            <polygon
              points="40,3 77,21.5 77,58.5 40,77 3,58.5 3,21.5"
              stroke={tech.color}
              strokeWidth="1"
              strokeOpacity="0.5"
              fill="none"
              strokeDasharray="6 4"
              style={{ animation: "hexDash 3s linear infinite" }}
            />
          )}
        </svg>

        {/* Icon + label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 z-10">
          <div
            className="text-xl transition-all duration-300"
            style={{
              color: isActive ? tech.color : `${tech.color}70`,
              filter: isActive ? `drop-shadow(0 0 6px ${tech.color})` : "none",
            }}
          >
            {tech.icon}
          </div>
          <div
            className="text-[6px] font-black tracking-[0.12em]"
            style={{
              color: isActive ? tech.color : `${tech.color}50`,
              fontFamily: "'Orbitron', sans-serif",
              transition: "color 0.3s ease",
            }}
          >
            {tech.label}
          </div>
        </div>

        {/* Tooltip */}
        <motion.div
          initial={false}
          animate={
            isActive
              ? { opacity: 1, y: -8, scale: 1 }
              : { opacity: 0, y: 4, scale: 0.92 }
          }
          transition={{ duration: 0.2 }}
          className="absolute -top-16 left-1/2 -translate-x-1/2 pointer-events-none z-50 whitespace-nowrap"
        >
          <div
            className="px-3 py-2 rounded-xl text-center"
            style={{
              background: "rgba(6,6,18,0.97)",
              border: `1px solid ${tech.color}40`,
              boxShadow: `0 0 24px ${tech.color}25, 0 8px 24px rgba(0,0,0,0.6)`,
            }}
          >
            <div className="text-white text-xs font-bold">{tech.name}</div>
            <div className="text-[9px] mt-0.5" style={{ color: tech.color }}>
              {tech.desc}
            </div>
          </div>
          {/* Arrow */}
          <div
            className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-2 h-2 rotate-45"
            style={{
              background: `${tech.color}40`,
              border: `1px solid ${tech.color}40`,
            }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

const TechStack = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [userHovering, setUserHovering] = useState(false);
  const containerRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    if (userHovering) return;
    const t = setInterval(
      () => setActiveIdx((i) => (i + 1) % technologies.length),
      2000,
    );
    return () => clearInterval(t);
  }, [userHovering]);

  const activeTech = technologies[activeIdx];

  const handleMouseMove = (e) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  const rotX = useSpring(useTransform(mouseY, [-260, 260], [7, -7]), {
    stiffness: 180,
    damping: 30,
  });
  const rotY = useSpring(useTransform(mouseX, [-260, 260], [-7, 7]), {
    stiffness: 180,
    damping: 30,
  });

  return (
    <section className="relative py-24 md:py-32 bg-slate-950 overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');

        @keyframes hexDash {
          to { stroke-dashoffset: -40; }
        }
        @keyframes coreRingCW {
          from { transform: translate(-50%,-50%) rotate(0deg); }
          to   { transform: translate(-50%,-50%) rotate(360deg); }
        }
        @keyframes coreRingCCW {
          from { transform: translate(-50%,-50%) rotate(0deg); }
          to   { transform: translate(-50%,-50%) rotate(-360deg); }
        }
        @keyframes corePulse {
          0%,100% { box-shadow: 0 0 30px rgba(168,85,247,0.5), 0 0 80px rgba(168,85,247,0.15), inset 0 0 30px rgba(168,85,247,0.12); }
          50%     { box-shadow: 0 0 60px rgba(168,85,247,0.7), 0 0 120px rgba(168,85,247,0.25), inset 0 0 50px rgba(168,85,247,0.2); }
        }
        @keyframes beamTravel {
          0%   { left: 0%;   opacity: 0; }
          8%   { opacity: 1; }
          92%  { opacity: 1; }
          100% { left: 100%; opacity: 0; }
        }
        @keyframes scanLine {
          0%   { top: 0%;   opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes floatPt {
          0%,100% { transform: translateY(0)   scale(1);   opacity: 0.4; }
          50%     { transform: translateY(-22px) scale(1.3); opacity: 0.8; }
        }
        @keyframes ringPing {
          0%   { transform: translate(-50%,-50%) scale(1);   opacity: 0.7; }
          100% { transform: translate(-50%,-50%) scale(2.2); opacity: 0;   }
        }

        .core-pulse { animation: corePulse 3.5s ease-in-out infinite; }
        .ring-cw  { animation: coreRingCW  14s linear infinite; }
        .ring-ccw { animation: coreRingCCW  9s linear infinite; }
        .ring-ping-el { animation: ringPing 2.8s ease-out infinite; }
        .beam-dot { animation: beamTravel 2s ease-in-out infinite; position: absolute; top: 50%; transform: translateY(-50%); width: 7px; height: 7px; border-radius: 50%; left: 0; }
        .scan-el  { animation: scanLine 3.5s linear infinite; position: absolute; left: 0; right: 0; height: 1px; }
      `}</style>

      {/* ── Background (unchanged) ── */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-950" />
      <DotPattern />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />

      {/* Ambient particles */}
      {[...Array(14)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 rounded-full pointer-events-none"
          style={{
            left: `${8 + i * 6.5}%`,
            top: `${15 + (i % 6) * 13}%`,
            background: technologies[i % 8].color,
            animation: `floatPt ${3.5 + (i % 4) * 0.7}s ease-in-out infinite`,
            animationDelay: `${i * 0.35}s`,
            opacity: 0.3,
          }}
        />
      ))}

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* ── Header (unchanged) ── */}
        <div className="text-center mb-20">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 font-semibold tracking-wider uppercase text-sm mb-4"
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
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
            Built with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              Modern Tech
            </span>
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

        {/* ════════════════════════════════════════════
            DESKTOP — Two-column: Orbital + Info Panel
        ════════════════════════════════════════════ */}
        <div className="hidden md:grid grid-cols-[1fr_420px] gap-10 items-center max-w-6xl mx-auto">
          {/* LEFT — Orbital System */}
          <motion.div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => {
              mouseX.set(0);
              mouseY.set(0);
            }}
            style={{
              rotateX: rotX,
              rotateY: rotY,
              transformPerspective: 1000,
              height: 560,
            }}
            className="relative flex items-center justify-center"
            // style={{ height: 560 }}
          >
            {/* Beam lines */}
            {technologies.map((tech, i) => {
              const ang = (i / technologies.length) * 360 - 90;
              const active = activeIdx === i;
              return (
                <div
                  key={i}
                  className="absolute top-1/2 left-1/2 pointer-events-none"
                  style={{
                    width: 210,
                    height: 2,
                    transformOrigin: "0 50%",
                    transform: `rotate(${ang}deg) translateY(-50%)`,
                  }}
                >
                  <div
                    className="absolute inset-0 transition-opacity duration-500"
                    style={{
                      background: `linear-gradient(90deg, ${tech.color}90, transparent)`,
                      opacity: active ? 0.8 : 0.1,
                    }}
                  />
                  {active && (
                    <div
                      className="beam-dot"
                      style={{
                        background: tech.color,
                        boxShadow: `0 0 10px 4px ${tech.color}`,
                        animationDelay: "0s",
                      }}
                    />
                  )}
                </div>
              );
            })}

            {/* Outer track ring */}
            <div
              className="absolute rounded-full pointer-events-none"
              style={{
                width: 460,
                height: 460,
                top: "50%",
                left: "50%",
                transform: "translate(-50%,-50%)",
                border: "1px solid rgba(255,255,255,0.04)",
              }}
            />
            {/* Spinning dashed ring */}
            <div
              className="ring-cw absolute rounded-full pointer-events-none"
              style={{
                width: 460,
                height: 460,
                top: "50%",
                left: "50%",
                border: "1px dashed rgba(168,85,247,0.14)",
              }}
            />
            {/* Ping ring on active color */}
            <div
              key={activeIdx}
              className="ring-ping-el absolute rounded-full pointer-events-none"
              style={{
                width: 120,
                height: 120,
                top: "50%",
                left: "50%",
                border: `1.5px solid ${activeTech.color}`,
              }}
            />

            {/* Hex Icons */}
            {technologies.map((tech, i) => (
              <HexCard
                key={i}
                tech={tech}
                index={i}
                total={technologies.length}
                isActive={activeIdx === i}
                onHover={(idx) => {
                  setActiveIdx(idx);
                  setUserHovering(true);
                }}
                onLeave={() => setUserHovering(false)}
              />
            ))}

            {/* CORE */}
            <div
              className="absolute top-1/2 left-1/2 z-20"
              style={{ transform: "translate(-50%,-50%)" }}
            >
              {/* CW outer ring */}
              <div
                className="ring-cw absolute rounded-full"
                style={{
                  width: 128,
                  height: 128,
                  top: "50%",
                  left: "50%",
                  border: "1px solid rgba(168,85,247,0.2)",
                }}
              />
              {/* CCW dashed ring */}
              <div
                className="ring-ccw absolute rounded-full"
                style={{
                  width: 108,
                  height: 108,
                  top: "50%",
                  left: "50%",
                  border: "1px dashed rgba(168,85,247,0.35)",
                }}
              />

              {/* Sphere */}
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{
                  duration: 3.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="core-pulse w-24 h-24 rounded-full flex items-center justify-center relative overflow-hidden"
                style={{
                  background:
                    "radial-gradient(circle at 32% 28%, rgba(192,132,252,0.55), rgba(99,102,241,0.3) 42%, rgba(6,6,18,0.95))",
                  border: "1px solid rgba(168,85,247,0.45)",
                }}
              >
                {/* Scanline sweep */}
                <div
                  className="scan-el"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)",
                  }}
                />
                {/* Latitude rings */}
                <div className="absolute inset-4 rounded-full border border-purple-400/10 pointer-events-none" />
                <div className="absolute inset-7 rounded-full border border-purple-400/10 pointer-events-none" />

                <div className="text-center relative z-10">
                  <div
                    className="font-black text-sm leading-tight"
                    style={{
                      fontFamily: "'Orbitron', sans-serif",
                      background: "linear-gradient(135deg, #e879f9, #818cf8)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    MERN
                  </div>
                  <div
                    className="text-[7px] tracking-[0.25em] mt-0.5"
                    style={{
                      color: "rgba(196,181,253,0.6)",
                      fontFamily: "'Orbitron', sans-serif",
                    }}
                  >
                    + AI
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* RIGHT — Live Info Panel */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-4"
          >
            {/* Active tech hero card */}
            <motion.div
              key={activeIdx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="relative rounded-2xl overflow-hidden p-6"
              style={{
                background: "rgba(255,255,255,0.025)",
                border: `1px solid ${activeTech.color}35`,
                boxShadow: `0 0 50px ${activeTech.color}12, inset 0 0 30px ${activeTech.color}05`,
              }}
            >
              {/* Top glow bar */}
              <div
                className="absolute top-0 left-0 right-0 h-0.5"
                style={{
                  background: `linear-gradient(90deg, transparent, ${activeTech.color}, transparent)`,
                }}
              />
              {/* BG watermark icon */}
              <div
                className="absolute -right-4 -bottom-4 text-9xl opacity-[0.04] pointer-events-none select-none"
                style={{ color: activeTech.color }}
              >
                {activeTech.icon}
              </div>

              <div className="flex items-start gap-4 relative z-10">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0"
                  style={{
                    background: `${activeTech.color}15`,
                    border: `1px solid ${activeTech.color}35`,
                    color: activeTech.color,
                    boxShadow: `0 0 25px ${activeTech.color}20`,
                  }}
                >
                  {activeTech.icon}
                </div>
                <div className="flex-1">
                  <div
                    className="text-[9px] font-black tracking-[0.3em] mb-1"
                    style={{
                      color: activeTech.color,
                      fontFamily: "'Orbitron', sans-serif",
                    }}
                  >
                    {activeTech.label}
                  </div>
                  <div className="text-white text-2xl font-black leading-tight mb-1">
                    {activeTech.name}
                  </div>
                  <div className="text-slate-500 text-xs">
                    {activeTech.desc}
                  </div>
                </div>
              </div>

              {/* Signal / EQ bars */}
              <div className="flex items-end gap-1 h-10 mt-5 relative z-10">
                {[35, 55, 78, 92, 100, 88, 70, 55, 40, 28].map((h, i) => (
                  <motion.div
                    key={`${activeIdx}-${i}`}
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{
                      delay: i * 0.04,
                      duration: 0.4,
                      ease: "backOut",
                    }}
                    className="flex-1 rounded-sm origin-bottom"
                    style={{
                      height: `${h}%`,
                      background: `linear-gradient(to top, ${activeTech.color}, ${activeTech.color}30)`,
                    }}
                  />
                ))}
              </div>
            </motion.div>

            {/* Tech list */}
            <div
              className="rounded-2xl overflow-hidden"
              style={{ border: "1px solid rgba(255,255,255,0.05)" }}
            >
              {technologies.map((tech, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  onMouseEnter={() => {
                    setActiveIdx(i);
                    setUserHovering(true);
                  }}
                  onMouseLeave={() => setUserHovering(false)}
                  className="flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-all duration-250 relative"
                  style={{
                    background:
                      activeIdx === i ? `${tech.color}10` : "transparent",
                    borderBottom:
                      i < technologies.length - 1
                        ? "1px solid rgba(255,255,255,0.04)"
                        : "none",
                  }}
                >
                  {/* Active left bar */}
                  <div
                    className="absolute left-0 top-0 bottom-0 w-0.5 rounded-r transition-all duration-300"
                    style={{
                      background: tech.color,
                      opacity: activeIdx === i ? 1 : 0,
                    }}
                  />

                  <div
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0 transition-all duration-300"
                    style={{
                      background: tech.color,
                      boxShadow:
                        activeIdx === i ? `0 0 6px ${tech.color}` : "none",
                    }}
                  />
                  <div
                    className="text-sm flex-shrink-0 transition-all duration-300"
                    style={{
                      color: activeIdx === i ? tech.color : `${tech.color}55`,
                    }}
                  >
                    {tech.icon}
                  </div>
                  <span
                    className="text-sm font-medium flex-1 transition-colors duration-300"
                    style={{
                      color:
                        activeIdx === i ? "rgba(255,255,255,0.95)" : "#475569",
                    }}
                  >
                    {tech.name}
                  </span>
                  <span
                    className="text-[8px] font-black tracking-[0.15em] px-2 py-0.5 rounded transition-all duration-300"
                    style={{
                      fontFamily: "'Orbitron', sans-serif",
                      color: activeIdx === i ? tech.color : "transparent",
                      background:
                        activeIdx === i ? `${tech.color}15` : "transparent",
                      border: `1px solid ${activeIdx === i ? tech.color + "30" : "transparent"}`,
                    }}
                  >
                    {tech.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ════════════════════════════════════════
            MOBILE — Hex grid cards
        ════════════════════════════════════════ */}
        <div className="md:hidden grid grid-cols-2 gap-3 max-w-sm mx-auto">
          {technologies.map((tech, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
            >
              <div
                className="relative rounded-2xl p-5 flex flex-col items-center gap-2.5 border overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${tech.color}12, rgba(6,6,18,0.95))`,
                  border: `1px solid ${tech.color}28`,
                  boxShadow: `0 4px 24px ${tech.color}10`,
                }}
              >
                <div
                  className="absolute top-0 left-4 right-4 h-px"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${tech.color}70, transparent)`,
                  }}
                />
                <div
                  className="text-3xl"
                  style={{
                    color: tech.color,
                    filter: `drop-shadow(0 0 8px ${tech.color}70)`,
                  }}
                >
                  {tech.icon}
                </div>
                <div className="text-white text-xs font-bold text-center">
                  {tech.name}
                </div>
                <div
                  className="text-[8px] tracking-[0.15em] font-black"
                  style={{
                    color: `${tech.color}80`,
                    fontFamily: "'Orbitron', sans-serif",
                  }}
                >
                  {tech.label}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ════════════════════════════════════════
            BOTTOM CARDS
        ════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="mt-20 grid md:grid-cols-3 gap-5 max-w-5xl mx-auto"
        >
          {[
            {
              emoji: "🗄️",
              title: "MERN Stack",
              desc: "MongoDB, Express, React, Node.js for robust full-stack development",
              color: "#10b981",
              label: "CORE STACK",
            },
            {
              emoji: "🤖",
              title: "AI Integration",
              desc: "OpenAI API for intelligent analysis and personalized recommendations",
              color: "#a855f7",
              label: "AI ENGINE",
            },
            {
              emoji: "🎨",
              title: "Modern UI",
              desc: "TailwindCSS & Framer Motion for stunning, animated interfaces",
              color: "#38bdf8",
              label: "DESIGN SYS",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="group relative rounded-2xl overflow-hidden cursor-default"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div
                className="absolute top-0 left-0 right-0 h-0.5"
                style={{
                  background: `linear-gradient(90deg, transparent, ${item.color}, transparent)`,
                }}
              />
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: `radial-gradient(ellipse at 50% 0%, ${item.color}15, transparent 65%)`,
                }}
              />
              <div
                className="absolute top-0 right-0 w-20 h-20 opacity-15 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at 100% 0%, ${item.color}, transparent 70%)`,
                }}
              />
              <div className="relative p-6 z-10">
                <div
                  className="text-[8px] font-black tracking-[0.28em] mb-4"
                  style={{
                    color: item.color,
                    fontFamily: "'Orbitron', sans-serif",
                  }}
                >
                  {item.label}
                </div>
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4"
                  style={{
                    background: `${item.color}15`,
                    border: `1px solid ${item.color}28`,
                    boxShadow: `0 0 20px ${item.color}15`,
                  }}
                >
                  {item.emoji}
                </div>
                <h3 className="text-white font-bold text-lg mb-2">
                  {item.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {item.desc}
                </p>
                <div className="mt-5 h-px w-full bg-white/5 relative overflow-hidden">
                  <div
                    className="absolute top-0 left-0 h-full w-3/4 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                    style={{
                      background: `linear-gradient(90deg, ${item.color}, transparent)`,
                    }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TechStack;
