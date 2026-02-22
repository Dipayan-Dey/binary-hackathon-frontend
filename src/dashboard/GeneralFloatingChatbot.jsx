import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { generalchatbot } from "../api/userApi";
// import { chatbotService } from "../api/userApi";
import "./styles/generalchatbot.css"
// ── Holographic noise SVG filter ──
const NoiseFilter = () => (
  <svg style={{ position: "absolute", width: 0, height: 0 }}>
    <defs>
      <filter id="noise">
        <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
        <feBlend in="SourceGraphic" mode="overlay" result="blend" />
        <feComposite in="blend" in2="SourceGraphic" operator="in" />
      </filter>
    </defs>
  </svg>
);

// ── Particle field background ──
const ParticleField = () => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const particles = Array.from({ length: 40 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.3,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.6 + 0.1,
    }));
    let raf;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(168,230,255,${p.opacity})`;
        ctx.fill();
      });
      // draw connection lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 80) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(120,200,255,${0.15 * (1 - dist / 80)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(raf);
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-50 pointer-events-none" />;
};

// ── Orbiting rings launcher button ──
const LaunchOrb = ({ isOpen, onClick, hasNotif, notifCount }) => (
  <button
    onClick={onClick}
    className="fixed bottom-8 right-8 z-[9999] group focus:outline-none"
    style={{ width: 72, height: 72 }}
    aria-label="Toggle chat"
  >
    {/* Beacon pulse */}
    {!isOpen && (
      <>
        <span className="absolute inset-0 rounded-full bg-cyan-400/20 animate-ping" style={{ animationDuration: "2s" }} />
        <span className="absolute inset-0 rounded-full bg-indigo-400/10 animate-ping" style={{ animationDuration: "3s", animationDelay: "0.5s" }} />
      </>
    )}

    {/* Orbital rings */}
    <span className={`absolute inset-0 rounded-full border border-cyan-400/40 ${!isOpen ? "animate-spin" : ""}`} style={{ animationDuration: "6s" }} />
    <span className={`absolute inset-[6px] rounded-full border border-violet-400/30 ${!isOpen ? "animate-spin" : ""}`} style={{ animationDuration: "4s", animationDirection: "reverse" }} />
    <span className={`absolute inset-[13px] rounded-full border border-emerald-400/20 ${!isOpen ? "animate-spin" : ""}`} style={{ animationDuration: "8s" }} />

    {/* Core */}
    <span
      className="absolute inset-[8px] rounded-full flex items-center justify-center text-white transition-all duration-500 group-hover:scale-110 group-active:scale-95"
      style={{
        background: isOpen
          ? "linear-gradient(135deg,#1e1b4b,#0c4a6e)"
          : "linear-gradient(135deg,#0891b2,#6366f1,#8b5cf6)",
        boxShadow: isOpen
          ? "0 0 20px rgba(99,102,241,0.5), inset 0 1px 0 rgba(255,255,255,0.15)"
          : "0 0 30px rgba(34,211,238,0.6), 0 0 60px rgba(139,92,246,0.3), inset 0 1px 0 rgba(255,255,255,0.2)",
      }}
    >
      {isOpen ? (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      ) : (
        /* Logo from public folder */
        <img src="/logo.png" alt="Readynx" className="w-7 h-7 object-contain drop-shadow-lg" onError={e => {
          e.currentTarget.style.display = 'none';
          e.currentTarget.nextSibling.style.display = 'flex';
        }} />
      )}
      {/* Fallback icon */}
      <span style={{ display: 'none' }} className="items-center justify-center">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          <circle cx="9" cy="10" r="1" fill="currentColor" /><circle cx="12" cy="10" r="1" fill="currentColor" /><circle cx="15" cy="10" r="1" fill="currentColor" />
        </svg>
      </span>
    </span>

    {/* Notification badge */}
    {!isOpen && hasNotif && (
      <span
        className="absolute top-0.5 right-0.5 z-10 min-w-[18px] h-[18px] rounded-full text-[9px] font-black text-white flex items-center justify-center px-1"
        style={{
          background: "linear-gradient(135deg,#f43f5e,#ec4899)",
          boxShadow: "0 0 10px rgba(244,63,94,0.7)",
          animation: "popIn 0.4s cubic-bezier(0.34,1.56,0.64,1)",
        }}
      >
        {notifCount}
      </span>
    )}
  </button>
);

// ── Animated typing dots ──
const TypingDots = () => (
  <div className="flex gap-2.5 items-end">
    <div className="w-7 h-7 rounded-xl flex items-center justify-center text-[11px] font-black text-white flex-shrink-0"
      style={{ background: "linear-gradient(135deg,#0891b2,#6366f1)", boxShadow: "0 0 12px rgba(34,211,238,0.4)" }}>
      <img src="/logo.png" alt="R" className="w-4 h-4 object-contain" onError={e => { e.currentTarget.outerHTML = 'R'; }} />
    </div>
    <div className="px-4 py-3 rounded-2xl rounded-tl-sm flex gap-1.5 items-center"
      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(34,211,238,0.12)", backdropFilter: "blur(12px)" }}>
      {[0, 150, 300].map(delay => (
        <span key={delay} className="block w-1.5 h-1.5 rounded-full bg-cyan-400"
          style={{ animation: `bounceUp 1s ease infinite`, animationDelay: `${delay}ms` }} />
      ))}
    </div>
  </div>
);

const GeneralFloatingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([{
    role: "bot",
    text: "👋 Hi! I'm **Readynx AI**.\n\nI can help you with:\n-  Resume analysis & ATS scoring\n-  Mock interview prep\n-  Skill quizzes & evaluations\n-  Career insights\n\nWhat would you like to explore?",
  }]);
  console.log(chat)
  const [loading, setLoading] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const [panelMounted, setPanelMounted] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chat, loading]);
  useEffect(() => {
    if (isOpen) {
      setPanelMounted(true);
      setTimeout(() => inputRef.current?.focus(), 500);
    } else {
      setTimeout(() => setPanelMounted(false), 300);
    }
  }, [isOpen]);

  const sendMessage = async () => {
    if (!message.trim() || loading) return;
    const userMessage = message.trim();
    setChat(prev => [...prev, { role: "user", text: userMessage }]);
    setMessage("");
    setLoading(true);
    try {
      const res = await generalchatbot(userMessage);
      setChat(prev => [...prev, { role: "bot", text: res.data.message }]);
    } catch {
      setChat(prev => [...prev, { role: "bot", text: "⚠️ Something went wrong. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  const chips = ["How Use ?", "Tech Stack Use ? ", "Take a Quiz", "My Reports"];
  const notifCount = Math.min(chat.filter(m => m.role === "bot").length - 1, 9);

  return (
    <>
      <NoiseFilter />
   

      <div className="chat-font">
        {/* Launcher Button */}
        <LaunchOrb
          isOpen={isOpen}
          onClick={() => setIsOpen(p => !p)}
          hasNotif={!isOpen && notifCount > 0}
          notifCount={notifCount}
        />

        {/* Chat Panel */}
        {panelMounted && (
          <div
            className={`fixed bottom-[104px] right-8 z-[9998] flex flex-col overflow-hidden rounded-3xl scanline-effect ${isOpen ? "panel-enter" : "panel-exit"}`}
            style={{
              width: 380,
              height: 580,
              background: "linear-gradient(160deg,#060b18 0%,#0a1020 40%,#060c1a 70%,#080d1f 100%)",
              boxShadow: "0 0 0 1px rgba(34,211,238,0.12), 0 40px 100px rgba(0,0,0,0.7), 0 0 80px rgba(34,211,238,0.06), 0 0 120px rgba(99,102,241,0.04)",
              animation: isOpen ? "borderGlow 4s ease-in-out infinite" : undefined,
            }}
          >
            {/* Particle canvas */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
              <ParticleField />
            </div>

            {/* Top gradient accent */}
            <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-3xl"
              style={{ background: "linear-gradient(90deg,transparent,#22d3ee,#818cf8,#34d399,transparent)" }} />

            {/* ── HEADER ── */}
            <div
              className="relative flex items-center gap-3 px-5 py-4 z-10 flex-shrink-0"
              style={{
                background: "linear-gradient(90deg,rgba(8,145,178,0.12),rgba(99,102,241,0.08),rgba(52,211,153,0.05))",
                borderBottom: "1px solid rgba(34,211,238,0.08)",
                backdropFilter: "blur(20px)",
              }}
            >
              <div className="header-shimmer" />

              {/* Logo avatar */}
              <div
                className="logo-ring w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: "linear-gradient(135deg,#0891b2,#6366f1)",
                  boxShadow: "0 0 20px rgba(34,211,238,0.5), inset 0 1px 0 rgba(255,255,255,0.15)",
                }}
              >
                <img
                  src="/logo.png"
                  alt="Readynx"
                  className="w-7 h-7 object-contain drop-shadow"
                  onError={e => { e.currentTarget.outerHTML = '<span style="font-family:Space Mono,monospace;font-weight:700;color:white;font-size:13px">R</span>'; }}
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="mono text-[13px] font-bold tracking-widest gradient-text uppercase">
                 Readynx AI Assistant
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" style={{ boxShadow: "0 0 6px #34d399", animation: "holoPulse 2s ease-in-out infinite" }} />
                  <span className="text-[10px] text-slate-500 mono tracking-wider"> POWERED BY <a href="https://www.dipayandey.site">DIPAYAN DEY</a></span>
                </div>
              </div>

              {/* Header actions */}
              <div className="flex gap-1">
                <button
                  onClick={() => setChat([chat[0]])}
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-500 hover:text-cyan-400 hover:bg-white/5 transition-all duration-200"
                  title="Clear conversation"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 .49-4.72" />
                  </svg>
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-500 hover:text-rose-400 hover:bg-rose-500/5 transition-all duration-200"
                  title="Close"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Session info strip */}
            <div className="flex items-center justify-between px-5 py-2 flex-shrink-0"
              style={{ background: "rgba(34,211,238,0.02)", borderBottom: "1px solid rgba(255,255,255,0.02)" }}>
              <span className="mono text-[9px] text-slate-600 tracking-widest uppercase">Session Active</span>
              <span className="mono text-[9px] text-slate-600 tracking-widest">{chat.length - 1} messages</span>
            </div>

            {/* ── MESSAGES ── */}
            <div className="flex-1 overflow-y-auto glass-scrollbar p-4 flex flex-col gap-3 relative z-10">
              {chat.map((msg, i) => (
                <div key={i} className={`flex gap-2.5 items-end ${msg.role === "user" ? "flex-row-reverse msg-user" : "msg-bot"}`}>
                  {msg.role === "bot" && (
                    <div
                      className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 mb-0.5"
                      style={{
                        background: "linear-gradient(135deg,#0891b2,#6366f1)",
                        boxShadow: "0 0 10px rgba(34,211,238,0.35)",
                      }}
                    >
                      <img src="/logo.png" alt="R" className="w-4 h-4 object-contain"
                        onError={e => { e.currentTarget.outerHTML = '<span style="font-family:Space Mono,monospace;font-weight:700;color:white;font-size:10px">R</span>'; }} />
                    </div>
                  )}

                  <div
                    className={`max-w-[82%] px-4 py-3 text-[13px] leading-relaxed ${
                      msg.role === "bot"
                        ? "msg-bubble-bot rounded-2xl rounded-tl-sm"
                        : "rounded-2xl rounded-tr-sm"
                    }`}
                    style={msg.role === "bot" ? {
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(34,211,238,0.1)",
                      color: "#c8d5e8",
                      backdropFilter: "blur(20px)",
                    } : {
                      background: "linear-gradient(135deg,#0891b2,#6366f1)",
                      color: "white",
                      boxShadow: "0 4px 20px rgba(99,102,241,0.35), 0 0 30px rgba(34,211,238,0.1)",
                    }}
                  >
                    {msg.role === "bot" ? (
                      <div className="prose-sm prose-invert max-w-none
                        [&_p]:m-0 [&_p]:mb-2 [&_p:last-child]:mb-0
                        [&_strong]:text-cyan-300 [&_strong]:font-semibold
                        [&_em]:text-violet-300
                        [&_ul]:mt-1.5 [&_ul]:pl-4 [&_li]:my-1 [&_li]:text-slate-300
                        [&_code]:bg-cyan-400/10 [&_code]:text-cyan-300 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-xs
                        [&_h1]:text-slate-200 [&_h1]:font-bold [&_h1]:text-sm [&_h1]:mt-2 [&_h1]:mb-1
                        [&_h2]:text-slate-200 [&_h2]:font-semibold [&_h2]:text-[13px]
                        [&_h3]:text-slate-300 [&_h3]:font-medium">
                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                      </div>
                    ) : msg.text}
                  </div>
                </div>
              ))}

              {loading && <TypingDots />}
              <div ref={messagesEndRef} />
            </div>

            {/* ── INPUT ── */}
            <div
              className="relative z-10 p-4 flex-shrink-0"
              style={{
                background: "rgba(0,0,0,0.3)",
                borderTop: "1px solid rgba(34,211,238,0.06)",
                backdropFilter: "blur(20px)",
              }}
            >
              {/* Quick chips */}
              {chat.length <= 1 && (
                <div className="flex gap-1.5 flex-wrap mb-3">
                  {chips.map(chip => (
                    <button
                      key={chip}
                      onClick={() => { setMessage(chip); inputRef.current?.focus(); }}
                      className="chip-btn text-[11px] px-3 py-1.5 rounded-xl mono tracking-wide text-cyan-400"
                      style={{
                        background: "rgba(34,211,238,0.05)",
                        border: "1px solid rgba(34,211,238,0.2)",
                      }}
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              )}

              {/* Input row */}
              <div
                className={`input-glow flex items-end gap-2 rounded-2xl px-4 py-3 transition-all duration-300 ${inputFocused ? "bg-white/[0.04]" : "bg-white/[0.02]"}`}
                style={{ border: `1px solid ${inputFocused ? "rgba(34,211,238,0.3)" : "rgba(34,211,238,0.1)"}` }}
              >
                <input
                  ref={inputRef}
                  type="text"
                  className="flex-1 bg-transparent border-none outline-none text-[13px] text-slate-200 placeholder-slate-600"
                  style={{ fontFamily: "Outfit, sans-serif" }}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                  onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage()}
                  placeholder="Ask Readynx AI anything..."
                />
                <button
                  onClick={sendMessage}
                  disabled={loading || !message.trim()}
                  className="send-ripple w-9 h-9 rounded-xl flex items-center justify-center text-white flex-shrink-0 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
                  style={{
                    background: message.trim() && !loading
                      ? "linear-gradient(135deg,#0891b2,#6366f1)"
                      : "rgba(255,255,255,0.05)",
                    boxShadow: message.trim() && !loading
                      ? "0 4px 16px rgba(99,102,241,0.5), 0 0 20px rgba(34,211,238,0.2)"
                      : "none",
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              </div>

              <div className="mono text-[9px] text-slate-700 text-center mt-2 tracking-widest uppercase">
                ↵ Enter to send · Readynx AI v2.0
              </div>
            </div>

            {/* Bottom gradient accent */}
            <div className="absolute bottom-0 left-0 right-0 h-[1px] rounded-b-3xl"
              style={{ background: "linear-gradient(90deg,transparent,rgba(99,102,241,0.3),transparent)" }} />
          </div>
        )}
      </div>
    </>
  );
};

export default GeneralFloatingChatbot;