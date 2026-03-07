import React, { useState, useEffect } from "react";
import {
  SiMongodb, SiExpress, SiReact, SiNodedotjs,
  SiOpenai, SiTailwindcss, SiFramer, SiGithub,
} from "react-icons/si";
import { LinkedinIcon } from "lucide-react";

const technologies = [
  { name: "MongoDB",       icon: <SiMongodb />,     color: "#00ED64", label: "Database",  desc: "Flexible NoSQL document store built for modern, scalable applications.",     group: "Backend",  index: "01" },
  { name: "Express.js",    icon: <SiExpress />,     color: "#94a3b8", label: "Backend",   desc: "Minimal, unopinionated Node.js framework for fast REST API development.",     group: "Backend",  index: "02" },
  { name: "React",         icon: <SiReact />,       color: "#61DAFB", label: "Frontend",  desc: "Component-driven UI library powering declarative, reactive interfaces.",      group: "Frontend", index: "03" },
  { name: "Node.js",       icon: <SiNodedotjs />,   color: "#8CC84B", label: "Runtime",   desc: "Non-blocking, event-driven server runtime on Chrome's V8 engine.",           group: "Backend",  index: "04" },
  { name: "OpenAI",        icon: <SiOpenai />,      color: "#c084fc", label: "AI Engine", desc: "GPT-4 completions and embeddings bringing intelligence to every feature.",    group: "AI",       index: "05" },
  { name: "TailwindCSS",   icon: <SiTailwindcss />, color: "#38BDF8", label: "Styling",   desc: "Utility-first CSS framework enabling a fully custom design system.",         group: "Frontend", index: "06" },
  { name: "Framer Motion", icon: <SiFramer />,      color: "#f472b6", label: "Animation", desc: "Production-ready motion library with spring physics and gesture support.",   group: "Frontend", index: "07" },
  { name: "GitHub API",    icon: <SiGithub />,      color: "#e2e8f0", label: "DevOps",    desc: "Seamless CI/CD automation and version control via the GitHub REST API.",     group: "DevOps",   index: "08" },
  { name: "LinkedIn API",  icon: <LinkedinIcon />,  color: "#0A66C2", label: "Social",    desc: "Automated publishing of achievements and milestones to LinkedIn.",           group: "DevOps",   index: "09" },
];

export default function TechStack() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    if (hovering) return;
    const t = setInterval(() => setActiveIdx(i => (i + 1) % technologies.length), 2400);
    return () => clearInterval(t);
  }, [hovering]);

  const active = technologies[activeIdx];

  return (
    <section style={{
      minHeight: "100vh",
      background: "#050709",
      fontFamily: "'Outfit', sans-serif",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "60px 28px",
      position: "relative",
      overflow: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,700;1,700&display=swap');
        * { box-sizing: border-box; }

        .titem {
          transition: all 0.18s ease;
          cursor: pointer;
        }
        .titem:hover {
          background: rgba(255,255,255,0.04) !important;
        }

        @keyframes rotate-slow {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to   { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .featured-content {
          animation: fade-in-up 0.35s ease;
        }

        .ring1 {
          position: absolute;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.03);
          pointer-events: none;
          animation: rotate-slow 30s linear infinite;
        }
        .ring2 {
          position: absolute;
          border-radius: 50%;
          border: 1px dashed rgba(255,255,255,0.04);
          pointer-events: none;
          animation: rotate-slow 20s linear infinite reverse;
        }
      `}</style>

      {/* ── DOT GRID BACKGROUND ── */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)",
        backgroundSize: "28px 28px",
        maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)",
        WebkitMaskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)",
      }} />

      {/* ── GRADIENT OVERLAYS ── */}
      {/* Top-left purple blob */}
      <div style={{
        position: "absolute", top: "-10%", left: "-5%",
        width: 560, height: 560, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(139,92,246,0.18) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      {/* Bottom-right indigo blob */}
      <div style={{
        position: "absolute", bottom: "-10%", right: "-5%",
        width: 480, height: 480, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(99,102,241,0.14) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      {/* Active tech color glow — center-left */}
      <div style={{
        position: "absolute", top: "35%", left: "8%",
        width: 380, height: 380, borderRadius: "50%",
        background: `radial-gradient(circle, ${active.color}14, transparent 70%)`,
        transition: "background 0.6s ease",
        pointerEvents: "none",
      }} />
      {/* Horizontal gradient vignette top */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 160,
        background: "linear-gradient(to bottom, #050709 0%, transparent 100%)",
        pointerEvents: "none",
      }} />
      {/* Horizontal gradient vignette bottom */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: 160,
        background: "linear-gradient(to top, #050709 0%, transparent 100%)",
        pointerEvents: "none",
      }} />

      {/* Decorative rings */}
      <div className="ring1" style={{ width: 700, height: 700, top: "50%", left: "25%", transform: "translate(-50%,-50%)" }} />
      <div className="ring2" style={{ width: 500, height: 500, top: "50%", left: "25%", transform: "translate(-50%,-50%)" }} />

      {/* ── CONTENT ── */}
      <div style={{ width: "100%", maxWidth: 980, position: "relative", zIndex: 2 }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 52, flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <div style={{ width: 28, height: 1, background: active.color, transition: "background 0.4s" }} />
              <span style={{ fontSize: 11, fontWeight: 600, color: active.color, letterSpacing: "0.2em", textTransform: "uppercase", transition: "color 0.4s" }}>
                Tech Stack
              </span>
            </div>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(28px, 4.5vw, 46px)",
              fontWeight: 700,
              color: "#f8fafc",
              lineHeight: 1.15,
              letterSpacing: "-0.01em",
              margin: 0,
            }}>
              Engineered with<br />
              <span style={{ fontStyle: "italic", color: active.color, transition: "color 0.4s" }}>
                precision.
              </span>
            </h2>
          </div>

          {/* Counter */}
          <div style={{
            padding: "16px 24px",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 14,
            background: "rgba(255,255,255,0.02)",
            backdropFilter: "blur(12px)",
            textAlign: "center",
          }}>
            <div style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 40, fontWeight: 900,
              color: active.color, lineHeight: 1,
              transition: "color 0.4s",
            }}>
              {active.index}
            </div>
            <div style={{ fontSize: 9, color: "#1e293b", letterSpacing: "0.2em", marginTop: 6 }}>of 09</div>
          </div>
        </div>

        {/* Split layout */}
        <div style={{ display: "grid", gridTemplateColumns: "380px 1fr", gap: 16, alignItems: "start" }}>

          {/* LEFT — Featured panel */}
          <div style={{
            borderRadius: 20,
            border: `1px solid ${active.color}20`,
            background: "rgba(255,255,255,0.015)",
            overflow: "hidden",
            backdropFilter: "blur(16px)",
            transition: "border-color 0.4s",
            position: "relative",
          }}>
            {/* Gradient hero zone */}
            <div style={{
              height: 120,
              background: `linear-gradient(135deg, ${active.color}25, ${active.color}08)`,
              transition: "background 0.4s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              overflow: "hidden",
            }}>
              <div style={{
                position: "absolute",
                fontSize: 130, color: active.color, opacity: 0.08,
                lineHeight: 1, transition: "color 0.4s",
              }}>
                {active.icon}
              </div>
              <div
                key={`icon-${activeIdx}`}
                className="featured-content"
                style={{
                  fontSize: 52, color: active.color,
                  filter: `drop-shadow(0 0 20px ${active.color}60)`,
                  position: "relative", zIndex: 1,
                  transition: "color 0.4s, filter 0.4s",
                }}
              >
                {active.icon}
              </div>
            </div>

            <div style={{ padding: "24px 26px 28px" }} key={`info-${activeIdx}`} className="featured-content">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                <div>
                  <div style={{ fontSize: 9, fontWeight: 700, color: active.color, letterSpacing: "0.22em", marginBottom: 6, transition: "color 0.4s" }}>
                    {active.label.toUpperCase()}
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "#f8fafc", letterSpacing: "-0.02em" }}>
                    {active.name}
                  </div>
                </div>
                <div style={{
                  padding: "4px 10px", borderRadius: 6,
                  background: `${active.color}15`,
                  border: `1px solid ${active.color}25`,
                  fontSize: 10, fontWeight: 600,
                  color: active.color,
                  transition: "all 0.4s",
                  whiteSpace: "nowrap",
                }}>
                  {active.group}
                </div>
              </div>

              <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.75, margin: "0 0 22px" }}>
                {active.desc}
              </p>

              {/* Progress */}
              <div style={{ height: 2, background: "rgba(255,255,255,0.05)", borderRadius: 2, overflow: "hidden" }}>
                <div style={{
                  height: "100%",
                  width: `${((activeIdx + 1) / technologies.length) * 100}%`,
                  background: active.color,
                  transition: "width 0.4s ease, background 0.4s",
                  borderRadius: 2,
                }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                <span style={{ fontSize: 9, color: "#1e293b" }}>01</span>
                <span style={{ fontSize: 9, color: active.color, transition: "color 0.4s" }}>{active.index} / 09</span>
              </div>
            </div>
          </div>

          {/* RIGHT — Tech grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {technologies.map((tech, i) => {
              const isActive = activeIdx === i;
              return (
                <div
                  key={i}
                  className="titem"
                  onMouseEnter={() => { setActiveIdx(i); setHovering(true); }}
                  onMouseLeave={() => setHovering(false)}
                  style={{
                    padding: "16px 18px",
                    borderRadius: 14,
                    border: isActive ? `1px solid ${tech.color}35` : "1px solid rgba(255,255,255,0.05)",
                    background: isActive ? `${tech.color}0a` : "rgba(255,255,255,0.015)",
                    backdropFilter: "blur(8px)",
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {/* Left bar */}
                  <div style={{
                    position: "absolute", left: 0, top: 0, bottom: 0, width: 2,
                    background: tech.color,
                    opacity: isActive ? 1 : 0,
                    transition: "opacity 0.2s",
                    borderRadius: "0 1px 1px 0",
                  }} />

                  <div style={{
                    fontSize: 22, flexShrink: 0,
                    color: isActive ? tech.color : `${tech.color}40`,
                    transition: "color 0.2s",
                    filter: isActive ? `drop-shadow(0 0 8px ${tech.color}60)` : "none",
                  }}>
                    {tech.icon}
                  </div>

                  <div style={{ minWidth: 0 }}>
                    <div style={{
                      fontSize: 13, fontWeight: 700,
                      color: isActive ? "#f1f5f9" : "#334155",
                      transition: "color 0.2s",
                      marginBottom: 2,
                      whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                    }}>
                      {tech.name}
                    </div>
                    <div style={{
                      fontSize: 9, fontWeight: 600,
                      color: isActive ? tech.color : "#1e293b",
                      letterSpacing: "0.12em",
                      transition: "color 0.2s",
                    }}>
                      {tech.label.toUpperCase()}
                    </div>
                  </div>

                  <div style={{
                    marginLeft: "auto", flexShrink: 0,
                    fontSize: 11, fontWeight: 700,
                    color: isActive ? tech.color : "#1e293b",
                    transition: "color 0.2s",
                    fontVariantNumeric: "tabular-nums",
                  }}>
                    {tech.index}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dot nav */}
        <div style={{ display: "flex", gap: 6, marginTop: 20, justifyContent: "center" }}>
          {technologies.map((tech, i) => (
            <div
              key={i}
              onClick={() => { setActiveIdx(i); setHovering(true); setTimeout(() => setHovering(false), 3500); }}
              style={{
                width: activeIdx === i ? 24 : 6,
                height: 6, borderRadius: 3,
                background: activeIdx === i ? tech.color : "#1e293b",
                transition: "width 0.25s ease, background 0.25s",
                cursor: "pointer",
              }}
            />
          ))}
        </div>

      </div>
    </section>
  );
}