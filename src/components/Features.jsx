import React, { useRef, useState, useEffect } from 'react';
import { motion, useAnimationFrame, useMotionValue, AnimatePresence } from 'framer-motion';
import { GridPattern } from './BackgroundPatterns';

/* ─── DATA ─────────────────────────────────────────────────── */
const features = [
  {
    id: 0,
    title: "GitHub Analyzer",
    category: "Code Intelligence",
    desc: "Deep-scan repositories for vulnerabilities, anti-patterns, and quality signals across 50+ engineering metrics.",
    accent: "#6EE7F7",
    accentDim: "rgba(110,231,247,0.12)",
    accentGlow: "rgba(110,231,247,0.25)",
    number: "01",
    stat: "50+",
    statLabel: "Metrics",
    tag: "Analysis",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
      </svg>
    ),
  },
  {
    id: 1,
    title: "Resume Match",
    category: "ATS Intelligence",
    desc: "Compare your profile against live job postings. Identify skill gaps and optimize for applicant tracking instantly.",
    accent: "#A78BFA",
    accentDim: "rgba(167,139,250,0.12)",
    accentGlow: "rgba(167,139,250,0.25)",
    number: "02",
    stat: "ATS",
    statLabel: "Optimized",
    tag: "Matching",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/>
      </svg>
    ),
  },
  {
    id: 2,
    title: "Mock Interviews",
    category: "AI Roleplay Engine",
    desc: "Practice with a calibrated AI interviewer across 100+ technical and behavioral scenarios with structured feedback.",
    accent: "#6EE7B7",
    accentDim: "rgba(110,231,183,0.12)",
    accentGlow: "rgba(110,231,183,0.25)",
    number: "03",
    stat: "100+",
    statLabel: "Questions",
    tag: "Practice",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"/>
      </svg>
    ),
  },
  {
    id: 3,
    title: "Learning Roadmap",
    category: "Adaptive Planning",
    desc: "Week-by-week curriculum tailored to your target role, current skill level, and preferred learning pace.",
    accent: "#FCD34D",
    accentDim: "rgba(252,211,77,0.12)",
    accentGlow: "rgba(252,211,77,0.22)",
    number: "04",
    stat: "7-day",
    statLabel: "Sprints",
    tag: "Planning",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z"/>
      </svg>
    ),
  },
  {
    id: 4,
    title: "Progress Tracker",
    category: "Performance Analytics",
    desc: "Monitor skill development over time. Intelligent alerts surface patterns and opportunities before you miss them.",
    accent: "#F9A8D4",
    accentDim: "rgba(249,168,212,0.12)",
    accentGlow: "rgba(249,168,212,0.22)",
    number: "05",
    stat: "Live",
    statLabel: "Insights",
    tag: "Analytics",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zm9.75-9.75c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v16.5c0 .621-.504 1.125-1.125 1.125h-2.25A1.125 1.125 0 0112.75 19.5V3.375zm-7.5 7.5c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v9c0 .621-.504 1.125-1.125 1.125h-2.25A1.125 1.125 0 015.25 19.875v-9z"/>
      </svg>
    ),
  },
  {
    id: 5,
    title: "Career Advisor",
    category: "24 / 7 AI Mentor",
    desc: "Ask anything — salary negotiation, career transitions, technical concepts. Expert-level guidance around the clock.",
    accent: "#FBA87B",
    accentDim: "rgba(251,168,123,0.12)",
    accentGlow: "rgba(251,168,123,0.22)",
    number: "06",
    stat: "24/7",
    statLabel: "Available",
    tag: "Guidance",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"/>
      </svg>
    ),
  },
];

/* ─── CARD ──────────────────────────────────────────────────── */
function FeatureCard({ feature, onPause, onResume }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      className="relative flex-shrink-0 w-[330px] cursor-default select-none"
      onMouseEnter={() => { setHovered(true); onPause(); }}
      onMouseLeave={() => { setHovered(false); onResume(); }}
      animate={{ y: hovered ? -8 : 0, scale: hovered ? 1.02 : 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
    >
      {/* Outer glow bloom */}
      <motion.div
        className="absolute -inset-2 rounded-2xl pointer-events-none"
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        style={{
          background: `radial-gradient(ellipse at 50% 20%, ${feature.accentGlow} 0%, transparent 70%)`,
          filter: 'blur(16px)',
        }}
      />

      {/* Card shell */}
      <div
        className="relative rounded-2xl overflow-hidden h-full"
        style={{
          background: hovered
            ? `linear-gradient(145deg, rgba(15,18,35,0.92) 0%, rgba(10,13,28,0.96) 100%)`
            : `linear-gradient(145deg, rgba(12,14,28,0.85) 0%, rgba(8,11,22,0.90) 100%)`,
          border: `1px solid ${hovered ? feature.accent + '55' : 'rgba(255,255,255,0.08)'}`,
          backdropFilter: 'blur(24px)',
          boxShadow: hovered
            ? `0 24px 60px rgba(0,0,0,0.5), 0 0 0 1px ${feature.accent}22, inset 0 1px 0 rgba(255,255,255,0.07)`
            : '0 4px 24px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.03)',
          transition: 'background 0.4s, border-color 0.4s, box-shadow 0.4s',
        }}
      >
        {/* Top shimmer line */}
        <motion.div
          className="absolute top-0 left-8 right-8 h-px pointer-events-none"
          animate={{ opacity: hovered ? 1 : 0, scaleX: hovered ? 1 : 0.2 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{
            background: `linear-gradient(90deg, transparent, ${feature.accent}CC, transparent)`,
            transformOrigin: 'center',
          }}
        />

        {/* Sweep animation */}
        {hovered && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.06, 0] }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            style={{ background: `linear-gradient(135deg, ${feature.accent}33, transparent 60%)` }}
          />
        )}

        <div className="p-6">
          {/* Top row */}
          <div className="flex items-start justify-between mb-5">
            {/* Number + Icon */}
            <div className="flex items-center gap-3">
              <span
                className="text-xs font-semibold tabular-nums"
                style={{ color: feature.accent, opacity: 0.65 }}
              >
                {feature.number}
              </span>

              <motion.div
                className="w-9 h-9 rounded-xl flex items-center justify-center relative"
                animate={{
                  background: hovered ? feature.accentDim : 'rgba(255,255,255,0.04)',
                  borderColor: hovered ? feature.accent + '50' : 'rgba(255,255,255,0.07)',
                }}
                transition={{ duration: 0.3 }}
                style={{
                  border: '1px solid',
                  color: hovered ? feature.accent : 'rgba(255,255,255,0.35)',
                }}
              >
                {/* Pulse ring on hover */}
                {hovered && (
                  <motion.div
                    className="absolute inset-0 rounded-xl"
                    animate={{ scale: [1, 1.6], opacity: [0.5, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    style={{ border: `1px solid ${feature.accent}` }}
                  />
                )}
                {feature.icon}
              </motion.div>
            </div>

            {/* Tag + Stat */}
            <div className="text-right">
              <motion.div
                className="text-xl font-black tabular-nums leading-none"
                animate={{ color: hovered ? feature.accent : 'rgba(255,255,255,0.6)' }}
                transition={{ duration: 0.3 }}
                // style={{ fontFamily: "'Syne', sans-serif" }}
              >
                {feature.stat}
              </motion.div>
              <div className="text-xs mt-0.5 opacity-35 text-white" >
                {feature.statLabel}
              </div>
            </div>
          </div>

          {/* Category + tag pill */}
          <div className="flex items-center gap-2 mb-2">
            <p className="text-xs tracking-[0.18em] uppercase"
              style={{ color: feature.accent, opacity: hovered ? 0.75 : 0.45, transition: 'opacity 0.3s' }}>
              {feature.category}
            </p>
            <motion.span
              className="text-xs px-2 py-0.5 rounded-full font-medium"
              animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.8 }}
              transition={{ duration: 0.25 }}
              style={{
                background: feature.accentDim,
                color: feature.accent,
                border: `1px solid ${feature.accent}30`,
                // fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              {feature.tag}
            </motion.span>
          </div>

          {/* Title */}
          <h3
            className="text-lg font-bold text-white mb-2.5"
            style={{  letterSpacing: '-0.02em' }}
          >
            {feature.title}
          </h3>

          {/* Description */}
          <p
            className="text-sm leading-relaxed"
            style={{
              color: hovered ? 'rgba(255,255,255,0.52)' : 'rgba(255,255,255,0.28)',
              // fontFamily: "'DM Sans', sans-serif",
              transition: 'color 0.35s',
            }}
          >
            {feature.desc}
          </p>

          {/* Progress bar row */}
          <div className="mt-5 space-y-1.5">
            <div className="w-full h-0.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <motion.div
                className="h-full rounded-full"
                animate={{ width: hovered ? '100%' : '28%', opacity: hovered ? 1 : 0.4 }}
                transition={{ duration: 0.55, ease: 'easeOut' }}
                style={{ background: `linear-gradient(90deg, ${feature.accent}, ${feature.accent}88)` }}
              />
            </div>
            <div className="flex justify-between">
              <motion.span
                className="text-xs"
                animate={{ color: hovered ? feature.accent : 'rgba(255,255,255,0.2)' }}
                transition={{ duration: 0.3 }}
                style={{  fontSize: '10px' }}
              >
                {hovered ? '● ACTIVE' : '○ IDLE'}
              </motion.span>
              <span className="text-xs opacity-20 text-white" style={{  fontSize: '10px' }}>
                v2.0
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── MARQUEE ROW ───────────────────────────────────────────── */
function MarqueeRow({ items, direction = 1, speed = 28 }) {
  const x = useMotionValue(0);
  const [paused, setPaused] = useState(false);
  const SLOT = 348;
  const total = items.length * SLOT;

  useAnimationFrame((_, delta) => {
    if (paused) return;
    let nx = x.get() - (speed * delta / 1000) * direction;
    if (direction > 0 && nx <= -total) nx += total;
    if (direction < 0 && nx >= 0) nx -= total;
    x.set(nx);
  });

  const displayed = [...items, ...items, ...items];

  return (
    <div className="overflow-hidden">
      <motion.div
        style={{ x, display: 'flex', gap: '18px', width: 'max-content', paddingTop: '12px', paddingBottom: '12px' }}
      >
        {displayed.map((f, i) => (
          <FeatureCard
            key={`${f.id}-${i}`}
            feature={f}
            onPause={() => setPaused(true)}
            onResume={() => setPaused(false)}
          />
        ))}
      </motion.div>
    </div>
  );
}

/* ─── ANIMATED COUNTER ──────────────────────────────────────── */
function Counter({ value, label, color }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);
  const done = useRef(false);
  const num = parseInt(value) || 0;

  useEffect(() => {
    if (!num) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !done.current) {
        done.current = true;
        let cur = 0;
        const t = setInterval(() => {
          cur = Math.min(cur + num / 35, num);
          setDisplay(Math.floor(cur));
          if (cur >= num) clearInterval(t);
        }, 28);
      }
    });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [num]);

  // return (
  //   <div ref={ref} className="text-center">
  //     <motion.div
  //       className="text-3xl font-black leading-none"
  //       // style={{ fontFamily: "'Syne', sans-serif", color }}
  //     >
  //       {num ? display : value}{num ? '+' : ''}
  //     </motion.div>
  //     <div className="text-xs mt-1.5 tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.3)', fontFamily: "'JetBrains Mono', monospace" }}>
  //       {label}
  //     </div>
  //   </div>
  // );
}

/* ─── FLOATING ACCENT ORBS ──────────────────────────────────── */
function AccentOrbs() {
  const orbs = [
    { color: '#6EE7F7', x: '8%',  y: '20%', size: 480, dur: 10 },
    { color: '#A78BFA', x: '78%', y: '60%', size: 420, dur: 13 },
    { color: '#6EE7B7', x: '52%', y: '5%',  size: 340, dur: 9  },
    { color: '#FCD34D', x: '88%', y: '18%', size: 300, dur: 12 },
    { color: '#F9A8D4', x: '18%', y: '78%', size: 360, dur: 11 },
  ];
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {orbs.map((o, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: o.size, height: o.size,
            left: o.x, top: o.y,
            transform: 'translate(-50%,-50%)',
            background: `radial-gradient(circle, ${o.color}10 0%, transparent 68%)`,
            filter: 'blur(55px)',
          }}
          animate={{ scale: [1, 1.25, 0.92, 1], x: [0, 35, -20, 0], y: [0, -28, 18, 0] }}
          transition={{ duration: o.dur, repeat: Infinity, ease: 'easeInOut', delay: i * 1.8 }}
        />
      ))}
    </div>
  );
}

/* ─── TICKER BAR ────────────────────────────────────────────── */
function Ticker() {
  const items = [
    { text: "GitHub Analyzer", color: "#6EE7F7" },
    { text: "Resume Match", color: "#A78BFA" },
    { text: "Mock Interviews", color: "#6EE7B7" },
    { text: "Learning Roadmap", color: "#FCD34D" },
    { text: "Progress Tracker", color: "#F9A8D4" },
    { text: "Career Advisor", color: "#FBA87B" },
  ];
  const x = useMotionValue(0);
  useAnimationFrame((_, delta) => {
    let nx = x.get() - (48 * delta) / 1000;
    if (nx < -720) nx += 720;
    x.set(nx);
  });
  const all = [...items, ...items, ...items, ...items];
  return (
    <div
      className="overflow-hidden py-3"
      style={{ borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.015)' }}
    >
      <motion.div style={{ x, display: 'flex', gap: '40px', width: 'max-content', alignItems: 'center' }}>
        {all.map((item, i) => (
          <span
            key={i}
            className="text-xs whitespace-nowrap flex items-center gap-2.5 font-medium"
            style={{ color: item.color, opacity: 0.55, letterSpacing: '0.08em' }}
          >
            <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: item.color, opacity: 0.8 }} />
            {item.text}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ─── MAIN EXPORT ───────────────────────────────────────────── */
export default function Features() {
  const topRow = features.slice(0, 3);
  const botRow = features.slice(3);

  return (
    <section
      id="features"
      className="relative overflow-hidden"
      style={{ background: '#080B18', paddingTop: '96px', paddingBottom: '96px' }}
    >
      {/* <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=JetBrains+Mono:wght@400;500&family=DM+Sans:wght@300;400&display=swap');
      `}</style> */}

      {/* ── GridPattern background (unchanged, imported as-is) ── */}
      <GridPattern />

      {/* ── Colored ambient orbs layer over the grid ── */}
      <AccentOrbs />

      {/* ── Vignette so content reads cleanly ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, transparent 20%, rgba(8,11,24,0.55) 100%)',
        }}
      />

      <div className="relative z-10">
        {/* ─── HEADER ─── */}
        <div className="max-w-5xl mx-auto px-8 mb-12">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            {/* Left */}
            <div>
              <motion.div
                initial={{ opacity: 0, x: -18 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex items-center gap-3 mb-5"
              >
                <motion.div
                  className="w-2 h-2 rounded-full"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{ background: '#6EE7F7' }}
                />
                <div className="w-6 h-px" style={{ background: 'linear-gradient(90deg, #6EE7F7, #A78BFA)' }} />
                <span
                  className="text-xs tracking-[0.25em] uppercase"
                  style={{ color: 'rgba(110,231,247,0.7)',  }}
                >
                  Platform Features
                </span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.08, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                className="text-4xl md:text-5xl font-bold "
                style={{  letterSpacing: '-0.03em' }}
              >
                <span className="text-white">Everything required</span>
                <br />
                <span
                  style={{
                    background: 'linear-gradient(90deg, #6EE7F7, #A78BFA, #6EE7B7)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  to get hired.
                </span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-sm mt-4 max-w-sm"
                style={{ color: 'rgba(255,255,255,0.35)', lineHeight: 1.7 }}
              >
                Six AI-powered modules. Hover any card to pause the scroll and explore.
              </motion.p>
            </div>

            {/* Right — counters */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex gap-10"
            >
              <Counter value="50" label="Metrics" color="#6EE7F7" />
              <Counter value="100" label="Questions" color="#A78BFA" />
              <Counter value="6" label="Modules" color="#6EE7B7" />
            </motion.div>
          </div>

          {/* Divider */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mt-10 h-px"
            style={{
              background: 'linear-gradient(90deg, rgba(110,231,247,0.4), rgba(167,139,250,0.3), rgba(110,231,183,0.2), transparent)',
              transformOrigin: 'left',
            }}
          />
        </div>

        {/* ─── TICKER ─── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          {/* <Ticker /> */}
        </motion.div>

        {/* ─── ROW 1 → left ─── */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="mb-4 pl-6"
        >
          <MarqueeRow items={topRow} direction={1} speed={26} />
        </motion.div>

        {/* Row separator */}
        <div className="flex items-center gap-5 px-10 my-1">
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(110,231,247,0.15), transparent)' }} />
          <div className="flex gap-1.5 items-center">
            {['#6EE7F7', '#A78BFA', '#6EE7B7'].map((c, i) => (
              <motion.div
                key={i}
                className="w-1 h-1 rounded-full"
                animate={{ scale: [1, 1.8, 1], opacity: [0.3, 0.9, 0.3] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                style={{ background: c }}
              />
            ))}
          </div>
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(167,139,250,0.15), transparent)' }} />
        </div>

        {/* ─── ROW 2 ← right ─── */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="mt-4 pr-6"
        >
          <MarqueeRow items={botRow} direction={-1} speed={20} />
        </motion.div>

        {/* ─── CTA ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.25 }}
          className="max-w-5xl mx-auto px-8 mt-14"
        >
          {/* Bottom divider */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.75 }}
            className="h-px mb-10"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(110,231,183,0.2), rgba(167,139,250,0.3), rgba(110,231,247,0.4))',
              transformOrigin: 'right',
            }}
          />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <p className="font-bold text-white mb-1" style={{  fontSize: '1.05rem' }}>
                Ready to begin?
              </p>
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.3)', }}>
                No credit card required · Instant access · AI-powered
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Ghost button */}
              <motion.button
                className="px-6 py-2.5 rounded-xl text-sm font-medium"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.09)',
                  color: 'rgba(255,255,255,0.45)',
                  // fontFamily: "'DM Sans', sans-serif",
                }}
                whileHover={{ borderColor: 'rgba(110,231,247,0.3)', color: 'rgba(110,231,247,0.9)' }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.2 }}
              >
                View Demo
              </motion.button>

              {/* Primary button */}
              <motion.button
                className="relative px-7 py-2.5 rounded-xl text-sm font-bold overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #6EE7F7, #A78BFA)',
                  color: '#080B18',
                  // fontFamily: "'Syne', sans-serif",
                  letterSpacing: '0.02em',
                  boxShadow: '0 4px 24px rgba(110,231,247,0.25)',
                }}
                whileHover={{ scale: 1.04, boxShadow: '0 8px 36px rgba(110,231,247,0.4)' }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 360, damping: 22 }}
              >
                {/* Shimmer */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.22) 50%, transparent 100%)' }}
                  animate={{ x: ['-100%', '220%'] }}
                  transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 2 }}
                />
                <span className="relative z-10"><a href="/dashboard">Get Started →</a></span>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}