import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserPlus,
  Link2,
  FolderGit2,
  Sparkles,
  GraduationCap,
  MessageSquare,
  Video,
  Mail,
  Share2,
} from "lucide-react";
import { DotPattern } from "./BackgroundPatterns";

const STEPS = [
  {
    id: 1,
    icon: UserPlus,
    title: "Register / Login",
    desc: "Create your account in seconds and unlock access to your personalized AI-powered career dashboard.",
    color: "#a78bfa",
  },
  {
    id: 2,
    icon: Link2,
    title: "Connect Profiles",
    desc: "Securely link your GitHub and LinkedIn profiles to allow our AI to deeply understand your skills.",
    color: "#38bdf8",
  },
  {
    id: 3,
    icon: FolderGit2,
    title: "Select Repository",
    desc: "Choose a GitHub repository so our AI can analyze your coding style, architecture decisions, and approach.",
    color: "#34d399",
  },
  {
    id: 4,
    icon: Sparkles,
    title: "AI Analysis",
    desc: "Our advanced AI engine scans your codebase to identify strengths, detect gaps, and generate your skill fingerprint.",
    color: "#fbbf24",
  },
  {
    id: 5,
    icon: GraduationCap,
    title: "Skills Evaluation",
    desc: "Benchmark your readiness against real-world job market expectations and discover what to improve.",
    color: "#f472b6",
  },
  {
    id: 6,
    icon: MessageSquare,
    title: "AI Mentor Chat",
    desc: "Interact with your intelligent AI mentor to ask questions and get step-by-step recommendations.",
    color: "#60a5fa",
  },
  {
    id: 7,
    icon: Video,
    title: "Mock Interview",
    desc: "Practice with realistic AI-powered interview simulations that test your technical knowledge and confidence.",
    color: "#fb923c",
  },
  {
    id: 8,
    icon: Mail,
    title: "Weekly Alerts",
    desc: "Stay ahead with curated job alerts, personalized improvement tips, and progress reminders.",
    color: "#4ade80",
  },
  {
    id: 9,
    icon: Share2,
    title: "LinkedIn Share",
    desc: "Showcase your milestones by sharing verified progress updates with your professional network.",
    color: "#f87171",
  },
];

/* ── Desktop zigzag constants ── */
const CARD_W = 300;
const CARD_H = 130;
const STEP_Y = 220;
const LEFT_X = 40;
const RIGHT_X = 520;
const CENTER_X = (LEFT_X + RIGHT_X + CARD_W) / 2;
const SVG_W = RIGHT_X + CARD_W + 60;
const SVG_H = STEPS.length * STEP_Y + CARD_H + 40;

function getPos(index) {
  return { x: index % 2 === 0 ? LEFT_X : RIGHT_X, y: index * STEP_Y + 20 };
}

function buildZigPath(fromIdx, toIdx) {
  const a = getPos(fromIdx),
    b = getPos(toIdx);
  const ax = a.x + CARD_W / 2,
    ay = a.y + CARD_H;
  const bx = b.x + CARD_W / 2,
    by = b.y;
  const my = (ay + by) / 2;
  return `M ${ax} ${ay} C ${ax} ${my}, ${bx} ${my}, ${bx} ${by}`;
}

function TravelDot({ pathD, color }) {
  return (
    <circle
      r={5}
      fill={color}
      style={{ filter: `drop-shadow(0 0 6px ${color})` }}
    >
      <animateMotion dur="1.8s" repeatCount="indefinite" path={pathD} />
      <animate
        attributeName="opacity"
        values="0;1;1;0"
        dur="1.8s"
        repeatCount="indefinite"
      />
    </circle>
  );
}

/* ── Mobile vertical step card ── */
function MobileStepCard({ step, index, isActive, isCompleted, onClick }) {
  const Icon = step.icon;
  return (
    <motion.div
      onClick={() => onClick(step.id)}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      style={{
        display: "flex",
        gap: 12,
        alignItems: "flex-start",
        position: "relative",
        cursor: "pointer",
      }}
    >
      {/* Left timeline */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          flexShrink: 0,
        }}
      >
        <motion.div
          animate={{
            background: isActive || isCompleted ? step.color : "#1e1e2e",
            boxShadow: isActive ? `0 0 16px ${step.color}` : "none",
            border: `2px solid ${isActive ? step.color : isCompleted ? step.color + "88" : "rgba(255,255,255,0.15)"}`,
          }}
          transition={{ duration: 0.3 }}
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 10,
            fontWeight: 900,
            color: isActive ? "#000" : "#fff",
            zIndex: 1,
            position: "relative",
          }}
        >
          {isCompleted && !isActive ? "✓" : index + 1}
          {isActive && (
            <motion.div
              style={{
                position: "absolute",
                inset: -4,
                borderRadius: "50%",
                border: `2px solid ${step.color}`,
              }}
              animate={{ scale: [1, 1.5], opacity: [0.8, 0] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            />
          )}
        </motion.div>
        {index < STEPS.length - 1 && (
          <motion.div
            animate={{
              background: isCompleted ? step.color : "rgba(255,255,255,0.1)",
            }}
            style={{ width: 2, flex: 1, minHeight: 20, marginTop: 4 }}
          />
        )}
      </div>

      {/* Card */}
      <motion.div
        animate={{
          borderColor: isActive
            ? step.color
            : isCompleted
              ? step.color + "55"
              : "rgba(255,255,255,0.08)",
          background: isActive
            ? `linear-gradient(135deg, ${step.color}15 0%, rgba(255,255,255,0.03) 100%)`
            : "rgba(255,255,255,0.035)",
          boxShadow: isActive
            ? `0 0 0 1px ${step.color}, 0 0 20px ${step.color}22`
            : "none",
        }}
        transition={{ duration: 0.3 }}
        style={{
          flex: 1,
          borderRadius: 14,
          border: "1px solid",
          backdropFilter: "blur(12px)",
          padding: "12px 14px",
          display: "flex",
          gap: 10,
          alignItems: "center",
          marginBottom: index < STEPS.length - 1 ? 12 : 0,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <motion.div
          style={{
            position: "absolute",
            left: 0,
            top: 8,
            bottom: 8,
            width: 3,
            borderRadius: "0 4px 4px 0",
            background: step.color,
            opacity: isActive ? 1 : isCompleted ? 0.5 : 0.2,
          }}
        />
        <motion.div
          animate={{
            background: isActive ? `${step.color}22` : "rgba(255,255,255,0.05)",
          }}
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon
            size={16}
            color={
              isActive || isCompleted ? step.color : "rgba(255,255,255,0.35)"
            }
          />
        </motion.div>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: isActive ? "#fff" : "rgba(255,255,255,0.75)",
              marginBottom: 3,
            }}
          >
            {step.title}
          </div>
          <div
            style={{
              fontSize: 10,
              color: "rgba(255,255,255,0.32)",
              lineHeight: 1.4,
            }}
          >
            {step.desc}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Desktop SVG card ── */
function DesktopStepCard({ step, index, isActive, isCompleted, onClick }) {
  const { x, y } = getPos(index);
  const isLeft = index % 2 === 0;
  const activeIndex = isActive ? index : -1;
  return (
    <motion.g
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.08 }}
    >
      <motion.line
        x1={isLeft ? x + CARD_W : x}
        y1={y + CARD_H / 2}
        x2={CENTER_X}
        y2={y + CARD_H / 2}
        stroke={isActive || isCompleted ? step.color : "rgba(255,255,255,0.08)"}
        strokeWidth={isActive ? 2 : 1}
        strokeDasharray={isCompleted || isActive ? "none" : "4 4"}
        animate={{ opacity: isActive ? 1 : isCompleted ? 0.6 : 0.3 }}
      />
      <motion.circle
        cx={CENTER_X}
        cy={y + CARD_H / 2}
        r={16}
        animate={{
          fill: isActive || isCompleted ? step.color : "#1e1e2e",
          stroke: isActive
            ? step.color
            : isCompleted
              ? step.color + "88"
              : "rgba(255,255,255,0.15)",
          filter: isActive ? `drop-shadow(0 0 12px ${step.color})` : "none",
        }}
        transition={{ duration: 0.3 }}
        strokeWidth={2}
      />
      <text
        x={CENTER_X}
        y={y + CARD_H / 2 + 5}
        textAnchor="middle"
        fontSize={11}
        fontWeight={900}
        fill={
          isActive || isCompleted
            ? isActive
              ? "#000"
              : "#fff"
            : "rgba(255,255,255,0.4)"
        }
        style={{ fontFamily: "Inter, sans-serif" }}
      >
        {index + 1}
      </text>
      {isActive && (
        <motion.circle
          cx={CENTER_X}
          cy={y + CARD_H / 2}
          r={16}
          fill="none"
          stroke={step.color}
          strokeWidth={2}
          animate={{ r: [16, 28, 16], opacity: [0.8, 0, 0.8] }}
          transition={{ duration: 1.6, repeat: Infinity }}
        />
      )}
    </motion.g>
  );
}

function DesktopCardOverlay({ step, index, isActive, isCompleted, onClick }) {
  const Icon = step.icon;
  const { x, y } = getPos(index);
  return (
    <motion.div
      onClick={() => onClick(step.id)}
      initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        delay: index * 0.08,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ scale: 1.03, y: -3 }}
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: CARD_W,
        height: CARD_H,
        cursor: "pointer",
        zIndex: isActive ? 20 : 5,
      }}
    >
      {isActive && (
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            position: "absolute",
            inset: -8,
            borderRadius: 20,
            background: `radial-gradient(ellipse, ${step.color}22 0%, transparent 70%)`,
            pointerEvents: "none",
          }}
        />
      )}
      <motion.div
        animate={{
          borderColor: isActive
            ? step.color
            : isCompleted
              ? step.color + "55"
              : "rgba(255,255,255,0.08)",
          boxShadow: isActive
            ? `0 0 0 1px ${step.color}, 0 0 30px ${step.color}33`
            : isCompleted
              ? `0 0 0 1px ${step.color}33`
              : "0 4px 24px rgba(0,0,0,0.4)",
          background: isActive
            ? `linear-gradient(135deg, ${step.color}15 0%, rgba(255,255,255,0.03) 100%)`
            : "rgba(255,255,255,0.035)",
        }}
        transition={{ duration: 0.35 }}
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 16,
          border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(18px)",
          padding: "14px 18px",
          display: "flex",
          gap: 14,
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <motion.div
          animate={{
            background: step.color,
            opacity: isActive ? 1 : isCompleted ? 0.5 : 0.2,
          }}
          style={{
            position: "absolute",
            left: 0,
            top: 12,
            bottom: 12,
            width: 3,
            borderRadius: "0 4px 4px 0",
          }}
        />
        <motion.div
          animate={{
            background: isActive ? `${step.color}22` : "rgba(255,255,255,0.05)",
            boxShadow: isActive ? `0 0 20px ${step.color}44` : "none",
          }}
          style={{
            width: 44,
            height: 44,
            borderRadius: 13,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon
            size={20}
            color={
              isActive || isCompleted ? step.color : "rgba(255,255,255,0.35)"
            }
          />
        </motion.div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: isActive ? "#fff" : "rgba(255,255,255,0.75)",
              marginBottom: 5,
              lineHeight: 1.2,
            }}
          >
            {step.title}
          </div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.32)" }}>
            {step.desc}
          </div>
        </div>
        {isCompleted && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            style={{
              width: 20,
              height: 20,
              borderRadius: "50%",
              background: step.color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              fontSize: 11,
              fontWeight: 900,
              color: "#000",
            }}
          >
            ✓
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(1);
  const [autoplay, setAutoplay] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (!autoplay) return;
    const t = setInterval(
      () => setActiveStep((p) => (p % STEPS.length) + 1),
      2400,
    );
    return () => clearInterval(t);
  }, [autoplay]);

  const handleClick = (id) => {
    setActiveStep(id);
    setAutoplay(false);
  };
  const active = STEPS.find((s) => s.id === activeStep);
  const activeIndex = activeStep - 1;

  return (
    <div
      className="bg-[#020209]"
      style={{
        minHeight: "100vh",
        fontFamily: "'Inter', sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: isMobile ? "32px 16px 48px" : "52px 24px 80px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <DotPattern />
      {/* Ambient glow */}
      <motion.div
        animate={{
          background: `radial-gradient(ellipse 600px 300px at 50% -10%, ${active?.color}18 0%, transparent 70%)`,
        }}
        transition={{ duration: 0.8 }}
        style={{ position: "fixed", inset: 0, pointerEvents: "none" }}
      />
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.011) 2px, rgba(255,255,255,0.011) 4px)",
        }}
      />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          textAlign: "center",
          marginBottom: isMobile ? 28 : 52,
          position: "relative",
          zIndex: 2,
          width: "100%",
        }}
      >
        <motion.div
          animate={{
            borderColor: `${active?.color}66`,
            background: `${active?.color}0e`,
          }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "5px 16px",
            borderRadius: 100,
            marginBottom: 12,
            border: "1px solid",
          }}
        >
          <motion.div
            animate={{
              background: active?.color,
              boxShadow: `0 0 10px ${active?.color}`,
            }}
            transition={{ duration: 0.4 }}
            style={{ width: 8, height: 8, borderRadius: "50%" }}
          />
          <motion.span
            animate={{ color: active?.color }}
            style={{
              fontSize: isMobile ? 10 : 11,
              fontWeight: 700,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
            }}
          >
            Step {activeStep} — {active?.title}
          </motion.span>
        </motion.div>
        <h2
          style={{
            fontSize: isMobile ? 26 : 40,
            fontWeight: 900,
            color: "#fff",
            margin: "0 0 8px",
            letterSpacing: "-0.03em",
          }}
        >
          Your Career{" "}
          <motion.span
            animate={{
              color: active?.color,
              textShadow: `0 0 28px ${active?.color}66`,
            }}
            transition={{ duration: 0.4 }}
          >
            Roadmap
          </motion.span>
        </h2>
        <p
          style={{
            fontSize: isMobile ? 12 : 14,
            color: "rgba(255,255,255,0.3)",
            margin: 0,
          }}
        >
          9 steps from signup to dream job · tap any step
        </p>
      </motion.div>

      {/* ── MOBILE: vertical list ── */}
      {isMobile && (
        <div
          style={{
            width: "100%",
            maxWidth: 420,
            position: "relative",
            zIndex: 2,
          }}
        >
          {STEPS.map((step, index) => (
            <MobileStepCard
              key={step.id}
              step={step}
              index={index}
              isActive={activeStep === step.id}
              isCompleted={activeStep > step.id}
              onClick={handleClick}
            />
          ))}
        </div>
      )}

      {/* ── DESKTOP: zigzag SVG ── */}
      {!isMobile && (
        <div
          style={{
            position: "relative",
            zIndex: 2,
            width: SVG_W,
            maxWidth: "100%",
          }}
        >
          <div style={{ position: "relative", width: SVG_W, height: SVG_H }}>
            <svg
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                overflow: "visible",
                pointerEvents: "none",
                zIndex: 1,
              }}
              viewBox={`0 0 ${SVG_W} ${SVG_H}`}
            >
              <defs>
                <filter id="glow2">
                  <feGaussianBlur stdDeviation="3" result="b" />
                  <feMerge>
                    <feMergeNode in="b" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                {STEPS.slice(0, -1).map((step, i) => (
                  <linearGradient
                    key={i}
                    id={`zg${i}`}
                    x1="0%"
                    y1="0%"
                    x2="0%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor={step.color} />
                    <stop offset="100%" stopColor={STEPS[i + 1].color} />
                  </linearGradient>
                ))}
              </defs>
              <line
                x1={CENTER_X}
                y1={20 + CARD_H / 2}
                x2={CENTER_X}
                y2={SVG_H - 40}
                stroke="rgba(255,255,255,0.06)"
                strokeWidth={2}
                strokeDasharray="3 6"
              />
              {STEPS.slice(0, -1).map((step, i) => {
                const pathD = buildZigPath(i, i + 1);
                const done = i < activeIndex;
                const isNear = i === activeIndex - 1 || i === activeIndex;
                return (
                  <g key={i}>
                    <path
                      d={pathD}
                      fill="none"
                      stroke={done ? step.color : "rgba(255,255,255,0.07)"}
                      strokeWidth={done ? 2 : 1.5}
                      strokeDasharray={done ? "none" : "5 5"}
                      strokeLinecap="round"
                      opacity={done ? 0.65 : 1}
                    />
                    {isNear && (
                      <motion.path
                        d={pathD}
                        fill="none"
                        stroke={`url(#zg${i})`}
                        strokeWidth={3}
                        strokeLinecap="round"
                        filter="url(#glow2)"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 0.55 }}
                      />
                    )}
                    {done && <TravelDot pathD={pathD} color={step.color} />}
                  </g>
                );
              })}
              {STEPS.map((step, index) => (
                <DesktopStepCard
                  key={step.id}
                  step={step}
                  index={index}
                  isActive={activeStep === step.id}
                  isCompleted={activeStep > step.id}
                  onClick={handleClick}
                />
              ))}
            </svg>
            {STEPS.map((step, index) => (
              <DesktopCardOverlay
                key={step.id}
                step={step}
                index={index}
                isActive={activeStep === step.id}
                isCompleted={activeStep > step.id}
                onClick={handleClick}
              />
            ))}
          </div>
        </div>
      )}

      {/* Bottom progress panel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeStep}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
          style={{
            marginTop: isMobile ? 28 : 48,
            width: "100%",
            maxWidth: isMobile ? 420 : 580,
            background: "rgba(255,255,255,0.035)",
            backdropFilter: "blur(24px)",
            borderRadius: 20,
            padding: isMobile ? "14px 16px" : "20px 24px",
            border: `1px solid ${active?.color}44`,
            boxShadow: `0 0 40px ${active?.color}18, 0 16px 48px rgba(0,0,0,0.5)`,
            position: "relative",
            zIndex: 2,
          }}
        >
          {/* Progress bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 14,
            }}
          >
            <motion.span
              animate={{ color: active?.color }}
              style={{
                fontSize: 11,
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                flexShrink: 0,
              }}
            >
              {activeStep} / {STEPS.length}
            </motion.span>
            <div
              style={{
                flex: 1,
                height: 4,
                borderRadius: 99,
                background: "rgba(255,255,255,0.07)",
                overflow: "hidden",
              }}
            >
              <motion.div
                animate={{
                  width: `${(activeStep / STEPS.length) * 100}%`,
                  background: active?.color,
                  boxShadow: `0 0 10px ${active?.color}`,
                }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                style={{ height: "100%", borderRadius: 99 }}
              />
            </div>
            <span
              style={{
                fontSize: 11,
                color: "rgba(255,255,255,0.25)",
                flexShrink: 0,
              }}
            >
              {Math.round((activeStep / STEPS.length) * 100)}%
            </span>
          </div>

          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <motion.div
              animate={{
                background: `${active?.color}22`,
                borderColor: `${active?.color}55`,
                boxShadow: `0 0 20px ${active?.color}33`,
              }}
              style={{
                width: isMobile ? 40 : 48,
                height: isMobile ? 40 : 48,
                borderRadius: 14,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                border: "1px solid",
              }}
            >
              {active && (
                <active.icon size={isMobile ? 18 : 22} color={active.color} />
              )}
            </motion.div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: isMobile ? 13 : 16,
                  fontWeight: 800,
                  color: "#fff",
                  marginBottom: 4,
                }}
              >
                {active?.title}
              </div>
              <div
                style={{
                  fontSize: isMobile ? 11 : 12.5,
                  color: "rgba(255,255,255,0.42)",
                  lineHeight: 1.6,
                }}
              >
                {active?.desc}
              </div>
            </div>
            {activeStep < STEPS.length && (
              <motion.button
                onClick={() => handleClick(activeStep + 1)}
                animate={{
                  background: active?.color,
                  boxShadow: `0 4px 20px ${active?.color}55`,
                }}
                whileHover={{ scale: 1.07 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  marginLeft: "auto",
                  padding: isMobile ? "8px 12px" : "10px 16px",
                  borderRadius: 12,
                  color: "#000",
                  fontWeight: 800,
                  fontSize: isMobile ? 12 : 13,
                  border: "none",
                  cursor: "pointer",
                  flexShrink: 0,
                }}
              >
                Next →
              </motion.button>
            )}
          </div>

          {/* Step dots */}
          <div
            style={{
              display: "flex",
              gap: 4,
              marginTop: 14,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            {STEPS.map((s) => (
              <motion.button
                key={s.id}
                onClick={() => handleClick(s.id)}
                animate={{
                  width: s.id === activeStep ? 20 : 6,
                  background:
                    s.id <= activeStep ? s.color : "rgba(255,255,255,0.12)",
                  boxShadow:
                    s.id === activeStep ? `0 0 8px ${s.color}` : "none",
                }}
                transition={{ duration: 0.28 }}
                style={{
                  height: 6,
                  borderRadius: 99,
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                }}
              />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      <motion.button
        onClick={() => setAutoplay(!autoplay)}
        animate={{
          borderColor: autoplay ? active?.color : "rgba(255,255,255,0.1)",
          color: autoplay ? active?.color : "rgba(255,255,255,0.25)",
        }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        style={{
          marginTop: 14,
          padding: "6px 18px",
          borderRadius: 100,
          border: "1.5px solid",
          background: "transparent",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          cursor: "pointer",
          position: "relative",
          zIndex: 2,
        }}
      >
        {autoplay ? "⏸ Pause" : "▶ Resume"} Autoplay
      </motion.button>
    </div>
  );
}
