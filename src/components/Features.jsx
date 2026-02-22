import React, { useRef, useState, useEffect } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  AnimatePresence,
} from "framer-motion";

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
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        style={{ width: 20, height: 20 }}
      >
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
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
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        style={{ width: 20, height: 20 }}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
        />
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
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        style={{ width: 20, height: 20 }}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
        />
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
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        style={{ width: 20, height: 20 }}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z"
        />
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
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        style={{ width: 20, height: 20 }}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zm9.75-9.75c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v16.5c0 .621-.504 1.125-1.125 1.125h-2.25A1.125 1.125 0 0112.75 19.5V3.375zm-7.5 7.5c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v9c0 .621-.504 1.125-1.125 1.125h-2.25A1.125 1.125 0 015.25 19.875v-9z"
        />
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
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        style={{ width: 20, height: 20 }}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
        />
      </svg>
    ),
  },
];

/* ─── MOBILE FEATURE CARD ───────────────────────────────────── */
function MobileFeatureCard({ feature }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <motion.div
      onClick={() => setExpanded(!expanded)}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      style={{
        borderRadius: 14,
        border: `1px solid ${expanded ? feature.accent + "55" : "rgba(255,255,255,0.08)"}`,
        background: expanded
          ? `linear-gradient(135deg, ${feature.accentDim} 0%, rgba(12,14,28,0.92) 100%)`
          : "rgba(12,14,28,0.7)",
        backdropFilter: "blur(16px)",
        padding: "14px 16px",
        cursor: "pointer",
        transition: "border-color 0.3s, background 0.3s",
        position: "relative",
        overflow: "hidden",
        boxShadow: expanded
          ? `0 0 0 1px ${feature.accent}22, 0 8px 32px rgba(0,0,0,0.4)`
          : "0 2px 12px rgba(0,0,0,0.3)",
      }}
    >
      {/* Top shimmer on expanded */}
      {expanded && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 24,
            right: 24,
            height: 1,
            background: `linear-gradient(90deg, transparent, ${feature.accent}BB, transparent)`,
          }}
        />
      )}

      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        {/* Number */}
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: feature.accent,
            opacity: 0.6,
            flexShrink: 0,
            minWidth: 18,
          }}
        >
          {feature.number}
        </span>

        {/* Icon */}
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: expanded ? feature.accentDim : "rgba(255,255,255,0.05)",
            border: `1px solid ${expanded ? feature.accent + "44" : "rgba(255,255,255,0.07)"}`,
            color: expanded ? feature.accent : "rgba(255,255,255,0.4)",
            transition: "all 0.3s",
          }}
        >
          {feature.icon}
        </div>

        {/* Title + category */}
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: expanded ? "#fff" : "rgba(255,255,255,0.8)",
              lineHeight: 1.2,
            }}
          >
            {feature.title}
          </div>
          <div
            style={{
              fontSize: 10,
              color: feature.accent,
              opacity: expanded ? 0.7 : 0.4,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginTop: 2,
            }}
          >
            {feature.category}
          </div>
        </div>

        {/* Stat */}
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div
            style={{
              fontSize: 15,
              fontWeight: 900,
              color: expanded ? feature.accent : "rgba(255,255,255,0.5)",
              lineHeight: 1,
            }}
          >
            {feature.stat}
          </div>
          <div
            style={{
              fontSize: 9,
              color: "rgba(255,255,255,0.3)",
              marginTop: 2,
            }}
          >
            {feature.statLabel}
          </div>
        </div>

        {/* Expand chevron */}
        <motion.div
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          style={{
            color: "rgba(255,255,255,0.25)",
            marginLeft: 4,
            flexShrink: 0,
            fontSize: 14,
          }}
        >
          ▾
        </motion.div>
      </div>

      {/* Expanded description */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: "hidden" }}
          >
            <div
              style={{
                paddingTop: 12,
                borderTop: `1px solid ${feature.accent}22`,
                marginTop: 12,
              }}
            >
              <p
                style={{
                  fontSize: 12,
                  color: "rgba(255,255,255,0.5)",
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {feature.desc}
              </p>
              {/* Mini progress bar */}
              <div
                style={{
                  marginTop: 10,
                  height: 2,
                  borderRadius: 99,
                  background: "rgba(255,255,255,0.07)",
                  overflow: "hidden",
                }}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  style={{
                    height: "100%",
                    borderRadius: 99,
                    background: `linear-gradient(90deg, ${feature.accent}, ${feature.accent}88)`,
                  }}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: 6,
                }}
              >
                <span
                  style={{
                    fontSize: 9,
                    color: feature.accent,
                    letterSpacing: "0.1em",
                  }}
                >
                  ● ACTIVE
                </span>
                <span style={{ fontSize: 9, color: "rgba(255,255,255,0.2)" }}>
                  v2.0
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── DESKTOP CARD ──────────────────────────────────────────── */
function FeatureCard({ feature, onPause, onResume }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      style={{
        position: "relative",
        flexShrink: 0,
        width: 330,
        cursor: "default",
      }}
      onMouseEnter={() => {
        setHovered(true);
        onPause();
      }}
      onMouseLeave={() => {
        setHovered(false);
        onResume();
      }}
      animate={{ y: hovered ? -8 : 0, scale: hovered ? 1.02 : 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
    >
      <motion.div
        style={{
          position: "absolute",
          inset: -8,
          borderRadius: 24,
          pointerEvents: "none",
          background: `radial-gradient(ellipse at 50% 20%, ${feature.accentGlow} 0%, transparent 70%)`,
          filter: "blur(16px)",
        }}
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.4 }}
      />
      <div
        style={{
          position: "relative",
          borderRadius: 20,
          overflow: "hidden",
          height: "100%",
          background: hovered
            ? "linear-gradient(145deg, rgba(15,18,35,0.92), rgba(10,13,28,0.96))"
            : "linear-gradient(145deg, rgba(12,14,28,0.85), rgba(8,11,22,0.90))",
          border: `1px solid ${hovered ? feature.accent + "55" : "rgba(255,255,255,0.08)"}`,
          backdropFilter: "blur(24px)",
          boxShadow: hovered
            ? `0 24px 60px rgba(0,0,0,0.5), 0 0 0 1px ${feature.accent}22`
            : "0 4px 24px rgba(0,0,0,0.35)",
          transition: "background 0.4s, border-color 0.4s, box-shadow 0.4s",
        }}
      >
        <motion.div
          style={{
            position: "absolute",
            top: 0,
            left: 32,
            right: 32,
            height: 1,
            background: `linear-gradient(90deg, transparent, ${feature.accent}CC, transparent)`,
            transformOrigin: "center",
          }}
          animate={{ opacity: hovered ? 1 : 0, scaleX: hovered ? 1 : 0.2 }}
          transition={{ duration: 0.5 }}
        />
        <div style={{ padding: 24 }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              marginBottom: 20,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  color: feature.accent,
                  opacity: 0.65,
                }}
              >
                {feature.number}
              </span>
              <motion.div
                animate={{
                  background: hovered
                    ? feature.accentDim
                    : "rgba(255,255,255,0.04)",
                  borderColor: hovered
                    ? feature.accent + "50"
                    : "rgba(255,255,255,0.07)",
                }}
                transition={{ duration: 0.3 }}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 12,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid",
                  color: hovered ? feature.accent : "rgba(255,255,255,0.35)",
                  position: "relative",
                }}
              >
                {hovered && (
                  <motion.div
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: 12,
                      border: `1px solid ${feature.accent}`,
                    }}
                    animate={{ scale: [1, 1.6], opacity: [0.5, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                )}
                {feature.icon}
              </motion.div>
            </div>
            <div style={{ textAlign: "right" }}>
              <motion.div
                animate={{
                  color: hovered ? feature.accent : "rgba(255,255,255,0.6)",
                }}
                transition={{ duration: 0.3 }}
                style={{ fontSize: 20, fontWeight: 900, lineHeight: 1 }}
              >
                {feature.stat}
              </motion.div>
              <div
                style={{
                  fontSize: 10,
                  color: "rgba(255,255,255,0.3)",
                  marginTop: 2,
                }}
              >
                {feature.statLabel}
              </div>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 8,
            }}
          >
            <p
              style={{
                fontSize: 10,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: feature.accent,
                opacity: hovered ? 0.75 : 0.45,
                margin: 0,
                transition: "opacity 0.3s",
              }}
            >
              {feature.category}
            </p>
            <motion.span
              animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.8 }}
              transition={{ duration: 0.25 }}
              style={{
                fontSize: 10,
                padding: "2px 8px",
                borderRadius: 99,
                fontWeight: 600,
                background: feature.accentDim,
                color: feature.accent,
                border: `1px solid ${feature.accent}30`,
              }}
            >
              {feature.tag}
            </motion.span>
          </div>
          <h3
            style={{
              fontSize: 17,
              fontWeight: 700,
              color: "#fff",
              marginBottom: 10,
              letterSpacing: "-0.02em",
              margin: "0 0 10px",
            }}
          >
            {feature.title}
          </h3>
          <p
            style={{
              fontSize: 13,
              lineHeight: 1.6,
              color: hovered
                ? "rgba(255,255,255,0.52)"
                : "rgba(255,255,255,0.28)",
              margin: 0,
              transition: "color 0.35s",
            }}
          >
            {feature.desc}
          </p>
          <div style={{ marginTop: 20 }}>
            <div
              style={{
                height: 2,
                borderRadius: 99,
                background: "rgba(255,255,255,0.05)",
                overflow: "hidden",
              }}
            >
              <motion.div
                animate={{
                  width: hovered ? "100%" : "28%",
                  opacity: hovered ? 1 : 0.4,
                }}
                transition={{ duration: 0.55 }}
                style={{
                  height: "100%",
                  borderRadius: 99,
                  background: `linear-gradient(90deg, ${feature.accent}, ${feature.accent}88)`,
                }}
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 6,
              }}
            >
              <motion.span
                animate={{
                  color: hovered ? feature.accent : "rgba(255,255,255,0.2)",
                }}
                style={{ fontSize: 10 }}
              >
                {hovered ? "● ACTIVE" : "○ IDLE"}
              </motion.span>
              <span style={{ fontSize: 10, color: "rgba(255,255,255,0.2)" }}>
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
    let nx = x.get() - ((speed * delta) / 1000) * direction;
    if (direction > 0 && nx <= -total) nx += total;
    if (direction < 0 && nx >= 0) nx -= total;
    x.set(nx);
  });
  const displayed = [...items, ...items, ...items];
  return (
    <div style={{ overflow: "hidden" }}>
      <motion.div
        style={{
          x,
          display: "flex",
          gap: 18,
          width: "max-content",
          padding: "12px 0",
        }}
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

/* ─── AMBIENT ORBS ──────────────────────────────────────────── */
function AccentOrbs({ isMobile }) {
  const orbs = [
    {
      color: "#6EE7F7",
      x: "8%",
      y: "20%",
      size: isMobile ? 220 : 480,
      dur: 10,
    },
    {
      color: "#A78BFA",
      x: "78%",
      y: "60%",
      size: isMobile ? 200 : 420,
      dur: 13,
    },
    { color: "#6EE7B7", x: "52%", y: "5%", size: isMobile ? 180 : 340, dur: 9 },
    {
      color: "#FCD34D",
      x: "88%",
      y: "18%",
      size: isMobile ? 160 : 300,
      dur: 12,
    },
    {
      color: "#F9A8D4",
      x: "18%",
      y: "78%",
      size: isMobile ? 180 : 360,
      dur: 11,
    },
  ];
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {orbs.map((o, i) => (
        <motion.div
          key={i}
          style={{
            position: "absolute",
            width: o.size,
            height: o.size,
            left: o.x,
            top: o.y,
            transform: "translate(-50%,-50%)",
            background: `radial-gradient(circle, ${o.color}10 0%, transparent 68%)`,
            filter: "blur(45px)",
            borderRadius: "50%",
          }}
          animate={{
            scale: [1, 1.25, 0.92, 1],
            x: [0, 25, -15, 0],
            y: [0, -20, 12, 0],
          }}
          transition={{
            duration: o.dur,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 1.8,
          }}
        />
      ))}
    </div>
  );
}

/* ─── MAIN EXPORT ───────────────────────────────────────────── */
export default function Features() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const topRow = features.slice(0, 3);
  const botRow = features.slice(3);

  return (
    <section
      id="features"
      style={{
        position: "relative",
        overflow: "hidden",
        background: "#080B18",
        paddingTop: isMobile ? 56 : 96,
        paddingBottom: isMobile ? 56 : 96,
      }}
    >
      <AccentOrbs isMobile={isMobile} />
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse at 50% 50%, transparent 20%, rgba(8,11,24,0.55) 100%)",
        }}
      />
      {/* Dot grid texture */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          opacity: 0.4,
        }}
      />

      <div style={{ position: "relative", zIndex: 10 }}>
        {/* ─── HEADER ─── */}
        <div
          style={{
            maxWidth: isMobile ? "100%" : 900,
            margin: "0 auto",
            padding: isMobile ? "0 16px 28px" : "0 32px 48px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              alignItems: isMobile ? "flex-start" : "flex-end",
              justifyContent: "space-between",
              gap: isMobile ? 20 : 32,
            }}
          >
            <div>
              <motion.div
                initial={{ opacity: 0, x: -18 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 16,
                }}
              >
                <motion.div
                  animate={{ scale: [1, 1.5, 1], opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "#6EE7F7",
                    flexShrink: 0,
                  }}
                />
                <div
                  style={{
                    width: 24,
                    height: 1,
                    background: "linear-gradient(90deg, #6EE7F7, #A78BFA)",
                  }}
                />
                <span
                  style={{
                    fontSize: 10,
                    letterSpacing: "0.25em",
                    textTransform: "uppercase",
                    color: "rgba(110,231,247,0.7)",
                  }}
                >
                  Platform Features
                </span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.08, duration: 0.65 }}
                style={{
                  fontSize: isMobile ? 28 : 46,
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  margin: 0,
                  lineHeight: 1.1,
                }}
              >
                <span style={{ color: "#fff" }}>Everything required</span>
                <br />
                <span
                  style={{
                    background:
                      "linear-gradient(90deg, #6EE7F7, #A78BFA, #6EE7B7)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
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
                style={{
                  fontSize: 13,
                  marginTop: 12,
                  color: "rgba(255,255,255,0.35)",
                  lineHeight: 1.7,
                  maxWidth: 320,
                }}
              >
                {isMobile
                  ? "Tap any card to explore each AI-powered module."
                  : "Six AI-powered modules. Hover any card to pause the scroll and explore."}
              </motion.p>
            </div>

            {/* Stats row */}
            {!isMobile && (
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                style={{ display: "flex", gap: 32 }}
              >
                {[
                  ["50+", "Metrics", "#6EE7F7"],
                  ["100+", "Questions", "#A78BFA"],
                  ["6", "Modules", "#6EE7B7"],
                ].map(([val, label, color]) => (
                  <div key={label} style={{ textAlign: "center" }}>
                    <div
                      style={{
                        fontSize: 28,
                        fontWeight: 900,
                        color,
                        lineHeight: 1,
                      }}
                    >
                      {val}
                    </div>
                    <div
                      style={{
                        fontSize: 10,
                        color: "rgba(255,255,255,0.3)",
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        marginTop: 4,
                      }}
                    >
                      {label}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </div>

          {/* Mobile stats */}
          {isMobile && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              style={{ display: "flex", gap: 20, marginTop: 16 }}
            >
              {[
                ["50+", "Metrics", "#6EE7F7"],
                ["100+", "Questions", "#A78BFA"],
                ["6", "Modules", "#6EE7B7"],
              ].map(([val, label, color]) => (
                <div key={label} style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontSize: 20,
                      fontWeight: 900,
                      color,
                      lineHeight: 1,
                    }}
                  >
                    {val}
                  </div>
                  <div
                    style={{
                      fontSize: 9,
                      color: "rgba(255,255,255,0.3)",
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      marginTop: 2,
                    }}
                  >
                    {label}
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* Divider */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
            style={{
              marginTop: isMobile ? 20 : 40,
              height: 1,
              background:
                "linear-gradient(90deg, rgba(110,231,247,0.4), rgba(167,139,250,0.3), rgba(110,231,183,0.2), transparent)",
              transformOrigin: "left",
            }}
          />
        </div>

        {/* ─── MOBILE: accordion list ─── */}
        {isMobile && (
          <div
            style={{
              padding: "0 16px",
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            {features.map((feature, i) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ delay: i * 0.06 }}
              >
                <MobileFeatureCard feature={feature} />
              </motion.div>
            ))}
          </div>
        )}

        {/* ─── DESKTOP: marquee rows ─── */}
        {!isMobile && (
          <>
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.75 }}
              style={{ marginBottom: 16, paddingLeft: 24 }}
            >
              <MarqueeRow items={topRow} direction={1} speed={26} />
            </motion.div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 20,
                padding: "4px 40px",
              }}
            >
              <div
                style={{
                  flex: 1,
                  height: 1,
                  background:
                    "linear-gradient(90deg, transparent, rgba(110,231,247,0.15), transparent)",
                }}
              />
              <div style={{ display: "flex", gap: 6 }}>
                {["#6EE7F7", "#A78BFA", "#6EE7B7"].map((c, i) => (
                  <motion.div
                    key={i}
                    style={{
                      width: 4,
                      height: 4,
                      borderRadius: "50%",
                      background: c,
                    }}
                    animate={{ scale: [1, 1.8, 1], opacity: [0.3, 0.9, 0.3] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.5,
                    }}
                  />
                ))}
              </div>
              <div
                style={{
                  flex: 1,
                  height: 1,
                  background:
                    "linear-gradient(90deg, transparent, rgba(167,139,250,0.15), transparent)",
                }}
              />
            </div>
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.75, delay: 0.1 }}
              style={{ marginTop: 16, paddingRight: 24 }}
            >
              <MarqueeRow items={botRow} direction={-1} speed={20} />
            </motion.div>
          </>
        )}

        {/* ─── CTA ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.25 }}
          style={{
            maxWidth: isMobile ? "100%" : 900,
            margin: "0 auto",
            padding: isMobile ? "32px 16px 0" : "0 32px",
            marginTop: isMobile ? 0 : 56,
          }}
        >
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.75 }}
            style={{
              height: 1,
              marginBottom: isMobile ? 24 : 40,
              background:
                "linear-gradient(90deg, transparent, rgba(110,231,183,0.2), rgba(167,139,250,0.3), rgba(110,231,247,0.4))",
              transformOrigin: "right",
            }}
          />

          <div
            style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              alignItems: isMobile ? "stretch" : "center",
              justifyContent: "space-between",
              gap: isMobile ? 20 : 24,
            }}
          >
            <div>
              <p
                style={{
                  fontWeight: 700,
                  color: "#fff",
                  marginBottom: 4,
                  fontSize: isMobile ? 16 : 17,
                }}
              >
                Ready to begin?
              </p>
              <p
                style={{
                  fontSize: 12,
                  color: "rgba(255,255,255,0.3)",
                  margin: 0,
                }}
              >
                No credit card required · Instant access · AI-powered
              </p>
            </div>
            <div
              style={{
                display: "flex",
                gap: 10,
                flexDirection: isMobile ? "column" : "row",
              }}
            >
              <motion.button
                style={{
                  padding: isMobile ? "12px 20px" : "10px 24px",
                  borderRadius: 12,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.09)",
                  color: "rgba(255,255,255,0.45)",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
                whileHover={{
                  borderColor: "rgba(110,231,247,0.3)",
                  color: "rgba(110,231,247,0.9)",
                }}
                whileTap={{ scale: 0.97 }}
              >
                View Demo
              </motion.button>
              <motion.button
                style={{
                  position: "relative",
                  padding: isMobile ? "12px 20px" : "10px 28px",
                  borderRadius: 12,
                  background: "linear-gradient(135deg, #6EE7F7, #A78BFA)",
                  color: "#080B18",
                  fontSize: 13,
                  fontWeight: 800,
                  cursor: "pointer",
                  border: "none",
                  letterSpacing: "0.02em",
                  boxShadow: "0 4px 24px rgba(110,231,247,0.25)",
                  overflow: "hidden",
                }}
                whileHover={{
                  scale: 1.04,
                  boxShadow: "0 8px 36px rgba(110,231,247,0.4)",
                }}
                whileTap={{ scale: 0.97 }}
              >
                <motion.div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent)",
                    pointerEvents: "none",
                  }}
                  animate={{ x: ["-100%", "220%"] }}
                  transition={{
                    duration: 2.2,
                    repeat: Infinity,
                    repeatDelay: 2,
                  }}
                />
                <span style={{ position: "relative", zIndex: 1 }}>
                  Get Started →
                </span>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
