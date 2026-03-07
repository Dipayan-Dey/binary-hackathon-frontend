import { useState } from "react";
import { DotPattern } from "./BackgroundPatterns";

// function DotPattern() {
//   return (
//     <>
//       <svg style={{ position: "fixed", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0, opacity: 0.12 }}>
//         <defs>
//           <pattern id="dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
//             <circle cx="1.5" cy="1.5" r="1.5" fill="rgba(255,255,255,0.4)" />
//           </pattern>
//         </defs>
//         <rect width="100%" height="100%" fill="url(#dots)" />
//       </svg>
//       <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
//         <div style={{ position: "absolute", width: 700, height: 700, borderRadius: "50%", top: "-200px", left: "-150px", background: "radial-gradient(circle, #a78bfa28 0%, transparent 70%)", filter: "blur(48px)" }} />
//         <div style={{ position: "absolute", width: 600, height: 600, borderRadius: "50%", top: "15%", right: "-180px", background: "radial-gradient(circle, #38bdf825 0%, transparent 70%)", filter: "blur(48px)" }} />
//         <div style={{ position: "absolute", width: 500, height: 500, borderRadius: "50%", top: "42%", left: "18%", background: "radial-gradient(circle, #f472b620 0%, transparent 70%)", filter: "blur(56px)" }} />
//         <div style={{ position: "absolute", width: 600, height: 600, borderRadius: "50%", bottom: "-120px", right: "8%", background: "radial-gradient(circle, #34d39920 0%, transparent 70%)", filter: "blur(48px)" }} />
//         <div style={{ position: "absolute", width: 400, height: 400, borderRadius: "50%", bottom: "18%", left: "-60px", background: "radial-gradient(circle, #fbbf2418 0%, transparent 70%)", filter: "blur(48px)" }} />
//         <div style={{ position: "absolute", width: 350, height: 350, borderRadius: "50%", top: "60%", right: "30%", background: "radial-gradient(circle, #60a5fa18 0%, transparent 70%)", filter: "blur(48px)" }} />
//       </div>
//     </>
//   );
// }

const icons = {
  register: (color) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
      <line x1="19" y1="8" x2="19" y2="14"/>
      <line x1="22" y1="11" x2="16" y2="11"/>
    </svg>
  ),
  connect: (color) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
    </svg>
  ),
  repo: (color) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
      <path d="M9 18c-4.51 2-5-2-7-2"/>
    </svg>
  ),
  analysis: (color) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/>
      <path d="m21 21-4.35-4.35"/>
      <path d="M11 8v3l2 2"/>
    </svg>
  ),
  skills: (color) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  ),
  chat: (color) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      <line x1="9" y1="10" x2="15" y2="10"/>
      <line x1="9" y1="14" x2="13" y2="14"/>
    </svg>
  ),
  interview: (color) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="23 7 16 12 23 17 23 7"/>
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
    </svg>
  ),
  alerts: (color) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  ),
  share: (color) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
      <rect x="2" y="9" width="4" height="12"/>
      <circle cx="4" cy="4" r="2"/>
    </svg>
  ),
};

const STEPS = [
  { id: 1, icon: "register",  title: "Register / Login",    desc: "Create your account and unlock your personalized AI-powered career dashboard.",            color: "#a78bfa" },
  { id: 2, icon: "connect",   title: "Connect Profiles",    desc: "Link your GitHub and LinkedIn so our AI deeply understands your skills and background.",   color: "#38bdf8" },
  { id: 3, icon: "repo",      title: "Select Repository",   desc: "Pick a GitHub repo so our AI can analyze your coding style and architecture decisions.",    color: "#34d399" },
  { id: 4, icon: "analysis",  title: "AI Analysis",         desc: "Our engine scans your codebase to identify strengths and generate your skill fingerprint.", color: "#fbbf24" },
  { id: 5, icon: "skills",    title: "Skills Evaluation",   desc: "Benchmark your readiness against real-world job market expectations.",                      color: "#f472b6" },
  { id: 6, icon: "chat",      title: "AI Mentor Chat",      desc: "Chat with your AI mentor for personalized, step-by-step career recommendations.",           color: "#60a5fa" },
  { id: 7, icon: "interview", title: "Mock Interview",      desc: "Practice with AI-powered simulations that test your technical knowledge and confidence.",   color: "#fb923c" },
  { id: 8, icon: "alerts",    title: "Weekly Alerts",       desc: "Get curated job alerts, improvement tips, and progress reminders every week.",             color: "#4ade80" },
  { id: 9, icon: "share",     title: "LinkedIn Share",      desc: "Share verified milestones and progress updates directly to your professional network.",     color: "#f87171" },
];

function StepCard({ step, index, hovered, setHovered, isMobile }) {
  const isLeft = index % 2 === 0;
  const isHovered = hovered === step.id;

  const card = (
    <div
      onMouseEnter={() => setHovered(step.id)}
      onMouseLeave={() => setHovered(null)}
      style={{
        flex: isMobile ? "unset" : 1,
        width: isMobile ? "100%" : "auto",
        maxWidth: isMobile ? "100%" : 340,
        borderRadius: 14,
        border: `1px solid ${isHovered ? step.color + "55" : "rgba(255,255,255,0.08)"}`,
        background: isHovered
          ? `linear-gradient(135deg, ${step.color}12 0%, rgba(255,255,255,0.03) 100%)`
          : "rgba(255,255,255,0.03)",
        padding: "22px 24px",
        cursor: "default",
        transition: "border-color 0.25s ease, background 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease",
        transform: isHovered ? "translateY(-3px)" : "translateY(0)",
        boxShadow: isHovered
          ? `0 8px 32px ${step.color}18, 0 0 0 1px ${step.color}22`
          : "0 2px 12px rgba(0,0,0,0.3)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Top accent line */}
      <div style={{
        position: "absolute", top: 0, left: 16, right: 16, height: 2,
        borderRadius: "0 0 4px 4px",
        background: isHovered ? step.color : "transparent",
        transition: "background 0.25s ease",
      }} />

      {/* Icon + step number */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: `${step.color}15`,
          border: `1px solid ${step.color}${isHovered ? "44" : "25"}`,
          transition: "border-color 0.25s ease, background 0.25s ease",
        }}>
          {icons[step.icon](step.color)}
        </div>
        <span style={{
          fontSize: 11, fontWeight: 800, letterSpacing: "0.12em",
          color: isHovered ? step.color : "rgba(255,255,255,0.2)",
          textTransform: "uppercase",
          transition: "color 0.25s ease",
        }}>
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <div style={{
        fontSize: 14, fontWeight: 650, color: isHovered ? "#fff" : "rgba(255,255,255,0.78)",
        marginBottom: 8, letterSpacing: "-0.01em", lineHeight: 1.3,
        transition: "color 0.25s ease",
      }}>
        {step.title}
      </div>
      <div style={{
        fontSize: 12.5, color: "rgba(255,255,255,0.35)",
        lineHeight: 1.65,
        transition: "color 0.25s ease",
      }}>
        {step.desc}
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
        {/* Mobile timeline node */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
          <div style={{
            width: 32, height: 32, borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            background: `${step.color}18`,
            border: `1.5px solid ${step.color}50`,
            fontSize: 11, fontWeight: 800, color: step.color,
          }}>
            {index + 1}
          </div>
          {index < STEPS.length - 1 && (
            <div style={{
              width: 1, flex: 1, minHeight: 24,
              background: `linear-gradient(to bottom, ${step.color}30, ${STEPS[index + 1].color}20)`,
              margin: "4px 0",
            }} />
          )}
        </div>
        <div style={{ flex: 1, paddingBottom: index < STEPS.length - 1 ? 16 : 0 }}>
          {card}
        </div>
      </div>
    );
  }

  return card;
}

export default function HowItWorks() {
  const [hovered, setHovered] = useState(null);
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );

  // responsive listener
  if (typeof window !== "undefined") {
    window.onresize = () => setIsMobile(window.innerWidth < 768);
  }

  const leftSteps  = STEPS.filter((_, i) => i % 2 === 0); // 1,3,5,7,9
  const rightSteps = STEPS.filter((_, i) => i % 2 === 1); // 2,4,6,8

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #060612 0%, #0a0618 40%, #060e18 70%, #05100d 100%)",
      fontFamily: "'Inter', system-ui, sans-serif",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: isMobile ? "56px 16px 72px" : "88px 24px 108px",
      position: "relative",
    }}>
      <DotPattern />

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: isMobile ? 48 : 72, position: "relative", zIndex: 2 }}>
        <p style={{
          fontSize: 10, fontWeight: 700, letterSpacing: "0.22em",
          textTransform: "uppercase", color: "rgba(255,255,255,0.25)",
          margin: "0 0 14px",
        }}>
          How It Works
        </p>
        <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontStyle:"italic",
              // letterSpacing:"5px",
          fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 700,
          color: "#fff", margin: "0 0 12px", letterSpacing: "-0.03em", lineHeight: 1.2,
        }}>
          From signup to dream job
        </h2>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.28)", margin: 0 }}>
          Nine steps powered by AI
        </p>
      </div>

      {/* ── DESKTOP: zigzag two-column ── */}
      {!isMobile && (
        <div style={{
          width: "100%", maxWidth: 860,
          position: "relative", zIndex: 2,
        }}>
          {/* Center spine */}
          <div style={{
            position: "absolute",
            left: "50%", top: 0, bottom: 0,
            width: 1,
            transform: "translateX(-50%)",
            background: "rgba(255,255,255,0.07)",
          }} />

          {STEPS.map((step, i) => {
            const isLeft = i % 2 === 0;
            return (
              <div
                key={step.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: i < STEPS.length - 1 ? 20 : 0,
                  gap: 0,
                }}
              >
                {/* Left slot */}
                <div style={{ flex: 1, display: "flex", justifyContent: "flex-end", paddingRight: 32 }}>
                  {isLeft && (
                    <StepCard step={step} index={i} hovered={hovered} setHovered={setHovered} isMobile={false} />
                  )}
                </div>

                {/* Center node */}
                <div style={{
                  width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: hovered === step.id ? step.color : `${step.color}18`,
                  border: `1.5px solid ${step.color}55`,
                  fontSize: 11, fontWeight: 800,
                  color: hovered === step.id ? "#000" : step.color,
                  transition: "all 0.25s ease",
                  zIndex: 1,
                  boxShadow: hovered === step.id ? `0 0 0 5px ${step.color}18` : "none",
                }}>
                  {i + 1}
                </div>

                {/* Right slot */}
                <div style={{ flex: 1, paddingLeft: 32 }}>
                  {!isLeft && (
                    <StepCard step={step} index={i} hovered={hovered} setHovered={setHovered} isMobile={false} />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── MOBILE: all right side with timeline ── */}
      {isMobile && (
        <div style={{
          width: "100%", maxWidth: 480,
          position: "relative", zIndex: 2,
        }}>
          {STEPS.map((step, i) => (
            <StepCard
              key={step.id}
              step={step}
              index={i}
              hovered={hovered}
              setHovered={setHovered}
              isMobile={true}
            />
          ))}
        </div>
      )}

      <style>{`* { box-sizing: border-box; }`}</style>
    </div>
  );
}