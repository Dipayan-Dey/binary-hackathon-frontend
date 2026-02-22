import { useRef, useState } from "react";
import { motion } from "framer-motion";

// ============================================================
// ✏️  EDIT YOUR TESTIMONIALS HERE
// Add as many as you want — they'll auto-loop infinitely
// ============================================================
const TESTIMONIALS_LEFT = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "Senior Software Engineer",
    company: "Google",
    avatar: "SC",
    avatarColor: "#6366f1",
    rating: 5,
    quote:
      "The AI resume analysis completely changed my job search. Readynx highlighted missing impact metrics and ATS gaps I had overlooked for years. After optimizing my resume and practicing with AI mock interviews, I secured a Senior Engineer role at Google.",
    highlight: "Optimized resume → Senior @ Google",
  },
  {
    id: 2,
    name: "Marcus Johnson",
    role: "Tech Lead",
    company: "Stripe",
    avatar: "MJ",
    avatarColor: "#ec4899",
    rating: 5,
    quote:
      "The GitHub project analysis was mind-blowing. It automatically extracted my strongest technical skills and showed me exactly what to improve for leadership roles. Within months, I was promoted to Tech Lead at Stripe.",
    highlight: "GitHub insights → Tech Lead",
  },
  {
    id: 3,
    name: "Priya Patel",
    role: "Engineering Manager",
    company: "Airbnb",
    avatar: "PP",
    avatarColor: "#f59e0b",
    rating: 5,
    quote:
      "The AI interview simulator felt incredibly real. The feedback on clarity, structure, and technical depth helped me refine my communication skills. That preparation gave me the confidence to transition into Engineering Management.",
    highlight: "AI Mock Interviews → EM role",
  },
  {
    id: 4,
    name: "David Kim",
    role: "Principal Engineer",
    company: "Netflix",
    avatar: "DK",
    avatarColor: "#10b981",
    rating: 5,
    quote:
      "The personalized quiz engine and skill reports revealed gaps I didn’t even realize I had. Readynx’s AI roadmap focused my preparation strategically. It was like having a 24/7 career strategist.",
    highlight: "Skill reports → Principal @ Netflix",
  },
  {
    id: 5,
    name: "Emma Rodriguez",
    role: "Staff Engineer",
    company: "Shopify",
    avatar: "ER",
    avatarColor: "#8b5cf6",
    rating: 5,
    quote:
      "The Gemini-powered career assistant gave actionable, specific guidance based on my resume and GitHub data. It wasn’t generic advice — it felt personalized to my exact career trajectory.",
    highlight: "AI Career Assistant impact",
  },
];

const TESTIMONIALS_RIGHT = [
  {
    id: 6,
    name: "Alex Turner",
    role: "Solutions Architect",
    company: "AWS",
    avatar: "AT",
    avatarColor: "#f97316",
    rating: 5,
    quote:
      "The ATS score breakdown and resume suggestions helped me tailor my applications precisely. Combined with mock interviews, I walked into my AWS interviews fully prepared.",
    highlight: "ATS Optimization → AWS",
  },
  {
    id: 7,
    name: "Lena Hoffman",
    role: "VP of Engineering",
    company: "Figma",
    avatar: "LH",
    avatarColor: "#14b8a6",
    rating: 5,
    quote:
      "What impressed me most was the depth of personalization. The AI used my experience, projects, and goals to generate a focused career strategy. It’s far beyond a typical learning platform.",
    highlight: "AI-driven career strategy",
  },
  {
    id: 8,
    name: "James Park",
    role: "Senior Architect",
    company: "Microsoft",
    avatar: "JP",
    avatarColor: "#a855f7",
    rating: 5,
    quote:
      "The combination of technical quizzes, project analytics, and AI feedback made my preparation structured and measurable. I could literally track my growth week by week.",
    highlight: "Measured growth → Microsoft",
  },
  {
    id: 9,
    name: "Nadia Ali",
    role: "Platform Lead",
    company: "Uber",
    avatar: "NA",
    avatarColor: "#ef4444",
    rating: 5,
    quote:
      "The Cyber Aurora interface made the experience feel premium, but the real magic was the data-driven feedback. Every suggestion was specific and actionable.",
    highlight: "Data-driven preparation",
  },
  {
    id: 10,
    name: "Chris Wang",
    role: "Engineering Director",
    company: "LinkedIn",
    avatar: "CW",
    avatarColor: "#0ea5e9",
    rating: 5,
    quote:
      "Readynx identified patterns in my career progression and recommended precise leadership skills to develop. Two promotions later, I’m leading engineering teams at scale.",
    highlight: "AI leadership insights",
  },
];
// ============================================================

const StarRating = ({ count }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: count }).map((_, i) => (
      <svg key={i} className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

const TestimonialCard = ({ t }) => (
  <div
    className="w-full rounded-2xl p-5 mb-4 relative overflow-hidden flex-shrink-0"
    style={{
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.07)",
      backdropFilter: "blur(12px)",
    }}
  >
    {/* Top accent line */}
    <div
      className="absolute top-0 left-8 right-8 h-px"
      style={{
        background: `linear-gradient(90deg, transparent, ${t.avatarColor}70, transparent)`,
      }}
    />

    {/* Highlight chip */}
    <div
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full mb-4"
      style={{
        background: `${t.avatarColor}15`,
        border: `1px solid ${t.avatarColor}30`,
      }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: t.avatarColor }} />
      <span className="text-xs font-medium" style={{ color: t.avatarColor }}>
        {t.highlight}
      </span>
    </div>

    {/* Stars */}
    <div className="mb-3">
      <StarRating count={t.rating} />
    </div>

    {/* Quote */}
    <p className="text-gray-400 text-sm leading-relaxed mb-5 font-light">
      "{t.quote}"
    </p>

    {/* Divider */}
    <div className="w-full h-px bg-white/5 mb-4" />

    {/* Author */}
    <div className="flex items-center gap-3">
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
        style={{
          backgroundColor: t.avatarColor,
          boxShadow: `0 0 0 2px ${t.avatarColor}40`,
        }}
      >
        {t.avatar}
      </div>
      <div>
        <p className="text-white text-sm font-semibold leading-tight">{t.name}</p>
        <p className="text-gray-600 text-xs mt-0.5">
          {t.role} · {t.company}
        </p>
      </div>
    </div>
  </div>
);

// Infinite scroll column — direction: "up" or "down"
const ScrollColumn = ({ testimonials, direction, paused }) => {
  // Duplicate for seamless loop
  const items = [...testimonials, ...testimonials, ...testimonials];
  const duration = testimonials.length * 8; // seconds

  const upKeyframes = {
    y: ["0%", "-33.333%"],
  };
  const downKeyframes = {
    y: ["-33.333%", "0%"],
  };

  return (
    <div className="relative overflow-hidden" style={{ height: "600px" }}>
      {/* Top fade */}
      <div
        className="absolute top-0 left-0 right-0 h-24 z-10 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, #0a0a0f 0%, transparent 100%)",
        }}
      />
      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-24 z-10 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, #0a0a0f 0%, transparent 100%)",
        }}
      />

      <motion.div
        animate={direction === "up" ? upKeyframes : downKeyframes}
        transition={{
          duration,
          ease: "linear",
          repeat: Infinity,
          repeatType: "loop",
        }}
        style={{ animationPlayState: paused ? "paused" : "running" }}
        {...(paused
          ? { animate: direction === "up" ? upKeyframes : downKeyframes, transition: { duration: 0, ease: "linear" } }
          : {})}
      >
        {/* We use CSS animation for smoother pause behavior */}
        <style>{`
          @keyframes scrollUp {
            0% { transform: translateY(0); }
            100% { transform: translateY(-33.333%); }
          }
          @keyframes scrollDown {
            0% { transform: translateY(-33.333%); }
            100% { transform: translateY(0); }
          }
          .col-up {
            animation: scrollUp ${duration}s linear infinite;
          }
          .col-down {
            animation: scrollDown ${duration}s linear infinite;
          }
          .col-up.paused,
          .col-down.paused {
            animation-play-state: paused;
          }
        `}</style>
      </motion.div>

      {/* Actual CSS-animated content */}
      <div className={`${direction === "up" ? "col-up" : "col-down"} ${paused ? "paused" : ""}`}>
        {items.map((t, i) => (
          <TestimonialCard key={`${t.id}-${i}`} t={t} />
        ))}
      </div>
    </div>
  );
};

export default function TestimonialScrollColumns() {
  const [paused, setPaused] = useState(false);

  return (
    <section
      className="min-h-screen py-20 px-4"
      style={{
        background: "linear-gradient(160deg, #0a0a0f 0%, #0d0d1a 50%, #0a0a0f 100%)",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
        
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=Playfair+Display:ital,wght@0,700;1,500&display=swap');
        body { background: #0a0a0f; }
      `}</style>

      {/* Header */}
      <div className="text-center mb-16 max-w-2xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-xs font-semibold tracking-[0.3em] text-indigo-400 uppercase mb-4"
        >
          Wall of Love
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl md:text-5xl font-bold text-white mb-5 leading-tight"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Developers Who{" "}
          <span className="italic text-indigo-400">Made the Leap</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-gray-500 text-base font-light"
        >
          Join thousands of engineers who transformed their careers with AI-powered guidance.
        </motion.p>
        {/* Glow line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mx-auto mt-8 h-px w-28"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.7), transparent)",
          }}
        />
      </div>

      {/* Two-column scroll */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 px-2 md:px-6"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Left column — scrolls UP */}
        <div>
          <style>{`
            @keyframes scrollUp {
              0% { transform: translateY(0); }
              100% { transform: translateY(-33.333%); }
            }
            @keyframes scrollDown {
              0% { transform: translateY(-33.333%); }
              100% { transform: translateY(0%); }
            }
            .col-up {
              animation: scrollUp ${TESTIMONIALS_LEFT.length * 8}s linear infinite;
            }
            .col-down {
              animation: scrollDown ${TESTIMONIALS_RIGHT.length * 8}s linear infinite;
            }
            .col-up.paused, .col-down.paused {
              animation-play-state: paused !important;
            }
          `}</style>
          <ColumnWrapper testimonials={TESTIMONIALS_LEFT} direction="up" paused={paused} />
        </div>

        {/* Right column — scrolls DOWN, hidden on mobile */}
        <div className="hidden md:block">
          <ColumnWrapper testimonials={TESTIMONIALS_RIGHT} direction="down" paused={paused} />
        </div>
      </motion.div>

      {/* Pause indicator */}
      <motion.div
        animate={{ opacity: paused ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="text-center mt-8"
      >
        <span
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs text-indigo-400"
          style={{
            background: "rgba(99,102,241,0.1)",
            border: "1px solid rgba(99,102,241,0.2)",
          }}
        >
          <span className="w-2 h-2 rounded-full bg-indigo-400" />
          Paused — move mouse away to resume
        </span>
      </motion.div>
    </section>
  );
}

// Separated to avoid style duplication
function ColumnWrapper({ testimonials, direction, paused }) {
  const items = [...testimonials, ...testimonials, ...testimonials];

  return (
    <div className="relative overflow-hidden" style={{ height: "600px" }}>
      {/* Fades */}
      <div
        className="absolute top-0 left-0 right-0 h-20 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, #0a0a0f, transparent)" }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-20 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to top, #0a0a0f, transparent)" }}
      />

      <div className={`${direction === "up" ? "col-up" : "col-down"} ${paused ? "paused" : ""}`}>
        {items.map((t, i) => (
          <TestimonialCard key={`${t.id}-col-${direction}-${i}`} t={t} />
        ))}
      </div>
    </div>
  );
}