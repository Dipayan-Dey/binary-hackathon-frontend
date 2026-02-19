import React, { useState } from 'react';
import { CheckCircle2, XCircle, Zap } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const withoutItems = [
  "Unsure what skills to learn next",
  "Resume gets rejected by ATS systems",
  "No feedback on project code quality",
  "Nervous & unprepared for interviews",
  "Inconsistent study habits",
];

const withItems = [
  "Custom roadmap based on your goals",
  "ATS-optimized resume insights",
  "AI code review & refactoring tips",
  "Confidence from mock interviews",
  "Daily reminders & progress tracking",
];

// Animated X icon with strike-through line effect
const XItem = ({ text, index }) => (
  <motion.li
    initial={{ opacity: 0, x: -30 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.12, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    className="group flex items-start gap-3 relative"
  >
    {/* Animated strikethrough */}
    <div className="relative flex-shrink-0 mt-0.5">
      <div className="w-6 h-6 rounded-full flex items-center justify-center"
        style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.25)" }}>
        <XCircle className="w-4 h-4 text-red-400" />
      </div>
    </div>
    <div className="relative">
      <span className="text-slate-400 text-sm leading-relaxed">{text}</span>
      {/* Strikethrough line that animates in */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.12 + 0.3, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="absolute top-1/2 left-0 right-0 h-px origin-left"
        style={{ background: "rgba(239,68,68,0.35)" }}
      />
    </div>
  </motion.li>
);

// Animated check item with glow trail
const CheckItem = ({ text, index }) => (
  <motion.li
    initial={{ opacity: 0, x: 30 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.12, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    className="group flex items-start gap-3"
  >
    <div className="relative flex-shrink-0 mt-0.5">
      {/* Ping ring */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.12 + 0.2 }}
        className="absolute inset-0 rounded-full"
        style={{ background: "rgba(52,211,153,0.2)", animation: `itemPing ${1.5 + index * 0.3}s ease-out ${index * 0.12 + 0.4}s both` }}
      />
      <div className="w-6 h-6 rounded-full flex items-center justify-center relative z-10"
        style={{ background: "rgba(52,211,153,0.12)", border: "1px solid rgba(52,211,153,0.3)" }}>
        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
      </div>
    </div>
    <span className="text-white text-sm leading-relaxed group-hover:text-emerald-50 transition-colors duration-300">{text}</span>
  </motion.li>
);

const Benefits = () => {
  const ref = useRef(null);

  return (
    <section
      id="benefits"
      ref={ref}
      className="relative py-28 text-white overflow-hidden"
      style={{ background: "linear-gradient(160deg, #020209 0%, #06061a 40%, #0a0614 70%, #020209 100%)" }}
    >
      <style>{`
        @keyframes itemPing {
          0%   { transform: scale(1);   opacity: 0.6; }
          100% { transform: scale(2.4); opacity: 0; }
        }
        @keyframes gridDrift {
          from { background-position: 0 0; }
          to   { background-position: 40px 40px; }
        }
        @keyframes vsGlow {
          0%,100% { box-shadow: 0 0 20px rgba(168,85,247,0.5), 0 0 50px rgba(168,85,247,0.2); }
          50%     { box-shadow: 0 0 35px rgba(168,85,247,0.8), 0 0 80px rgba(168,85,247,0.35); }
        }
        @keyframes lineBeam {
          0%   { opacity: 0; top: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { opacity: 0; top: 100%; }
        }
        @keyframes cornerBlink {
          0%,100% { opacity: 0.4; }
          50%     { opacity: 1; }
        }
        @keyframes floatOrb {
          0%,100% { transform: translate(0, 0) scale(1); }
          33%     { transform: translate(20px, -30px) scale(1.1); }
          66%     { transform: translate(-15px, 20px) scale(0.95); }
        }
        @keyframes badgeShimmer {
          0%   { left: -100%; }
          100% { left: 200%; }
        }

        .grid-drift {
          background-image: linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px);
          background-size: 40px 40px;
          animation: gridDrift 20s linear infinite;
        }
        .vs-glow { animation: vsGlow 3s ease-in-out infinite; }
        .scan-beam {
          animation: lineBeam 4s linear infinite;
          position: absolute; left: 0; right: 0; height: 1px; pointer-events: none;
        }
        .orb-float { animation: floatOrb 12s ease-in-out infinite; }
        .badge-shimmer { animation: badgeShimmer 3s ease-in-out infinite; }
      `}</style>

      {/* ── Background ── */}
      <div className="absolute inset-0 grid-drift opacity-70" />
      <div className="absolute inset-0"
        // style={{ background: "radial-gradient(ellipse 70% 60% at 50% 50%, transparent 30%, #020209 100%)" }}
         />

      {/* Orbs */}
      <div className="orb-float absolute top-20 left-10 w-80 h-80 rounded-full blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(59,130,246,0.12), transparent 70%)" }} />
      <div className="orb-float absolute bottom-20 right-10 w-80 h-80 rounded-full blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(168,85,247,0.12), transparent 70%)", animationDelay: "4s" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(0,217,255,0.04), transparent 70%)" }} />

      <div className="container mx-auto px-4 md:px-6 relative z-10">

        {/* ── Header ── */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 10 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative inline-flex items-center gap-2 px-5 py-2.5 rounded-full mb-6 overflow-hidden"
            style={{
              background: "rgba(59,130,246,0.08)",
              border: "1px solid rgba(59,130,246,0.22)",
            }}
          >
            {/* Shimmer */}
            <div className="badge-shimmer absolute top-0 bottom-0 w-16 blur-sm"
              style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)" }} />
            <Zap className="w-4 h-4 text-blue-400 relative z-10" />
            <span className="text-blue-400 text-sm font-semibold relative z-10 tracking-wide">Why Choose Us</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.7 }}
            className="text-4xl md:text-5xl font-bold mb-4 leading-tight"
          >
            Stop Guessing.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              Start Knowing.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-slate-400 max-w-xl mx-auto leading-relaxed"
          >
            Focused preparation yields better results than random learning.
          </motion.p>

          {/* Decorative glow line below header */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.35, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto mt-8 h-px w-32 origin-center"
            style={{ background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.7), transparent)" }}
          />
        </div>

        {/* ── Two column comparison ── */}
        <div className="relative grid md:grid-cols-[1fr_auto_1fr] gap-6 md:gap-8 items-start max-w-5xl mx-auto">

          {/* ════════════ LEFT — Without ════════════ */}
          <motion.div
            initial={{ opacity: 0, x: -50, rotateY: 8 }}
            whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative rounded-3xl overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(239,68,68,0.15)",
            }}
          >
            {/* Scan beam */}
            <div className="scan-beam" style={{ background: "linear-gradient(90deg, transparent, rgba(239,68,68,0.15), transparent)", animationDelay: "0s" }} />

            {/* Corner brackets */}
            {[["top-2 left-2","border-t border-l"], ["top-2 right-2","border-t border-r"], ["bottom-2 left-2","border-b border-l"], ["bottom-2 right-2","border-b border-r"]].map(([pos, border], i) => (
              <div key={i} className={`absolute ${pos} w-4 h-4 ${border} pointer-events-none`}
                style={{ borderColor: "rgba(239,68,68,0.35)", animation: `cornerBlink ${2 + i * 0.5}s ease-in-out infinite` }} />
            ))}

            {/* Top label */}
            <div className="relative px-6 pt-6 pb-0">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl mb-5"
                style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
                <div className="w-1.5 h-1.5 rounded-full bg-red-400" style={{ animation: "cornerBlink 1.5s ease-in-out infinite" }} />
                <span className="text-red-400 text-xs font-bold tracking-wider">TRADITIONAL WAY</span>
              </div>

              <div className="relative mb-6">
                <h3 className="text-2xl font-black text-slate-300">Without Readynx</h3>
                {/* Underline accent */}
                <div className="mt-1.5 h-px w-24"
                  style={{ background: "linear-gradient(90deg, rgba(239,68,68,0.6), transparent)" }} />
              </div>
            </div>

            <div className="px-6 pb-8">
              <ul className="space-y-5">
                {withoutItems.map((item, i) => (
                  <XItem key={i} text={item} index={i} />
                ))}
              </ul>
            </div>

            {/* Bottom status bar */}
            <div className="mx-6 mb-6 rounded-xl px-4 py-3 flex items-center gap-3"
              style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.12)" }}>
              <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span className="text-xs text-red-400/70 font-medium">Slower career growth · Higher burnout risk</span>
            </div>
          </motion.div>

          {/* ════════════ CENTER — VS ════════════ */}
          <div className="hidden md:flex flex-col items-center justify-center self-center gap-4 py-4">
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6, type: "spring", stiffness: 200 }}
              className="vs-glow w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-lg"
              style={{
                background: "linear-gradient(135deg, rgba(168,85,247,0.25), rgba(99,102,241,0.15))",
                border: "1px solid rgba(168,85,247,0.4)",
              }}
            >
              VS
            </motion.div>
            {/* vertical connector dots */}
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + i * 0.08 }}
                className="w-1 h-1 rounded-full"
                style={{ background: "rgba(168,85,247,0.4)", animation: `cornerBlink ${1.5 + i * 0.3}s ease-in-out infinite` }}
              />
            ))}
          </div>

          {/* Mobile VS divider */}
          <div className="md:hidden flex items-center gap-3">
            <div className="flex-1 h-px" style={{ background: "rgba(168,85,247,0.2)" }} />
            <div className="px-4 py-1.5 rounded-full text-purple-400 text-xs font-black"
              style={{ background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.25)" }}>VS</div>
            <div className="flex-1 h-px" style={{ background: "rgba(168,85,247,0.2)" }} />
          </div>

          {/* ════════════ RIGHT — With ════════════ */}
          <motion.div
            initial={{ opacity: 0, x: 50, rotateY: -8 }}
            whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative rounded-3xl overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(0,217,255,0.04) 0%, rgba(168,85,247,0.04) 50%, rgba(52,211,153,0.04) 100%)",
              border: "1px solid rgba(52,211,153,0.2)",
            }}
          >
            {/* Glow blobs inside card */}
            <div className="absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl pointer-events-none"
              style={{ background: "rgba(0,217,255,0.08)" }} />
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full blur-3xl pointer-events-none"
              style={{ background: "rgba(168,85,247,0.08)" }} />

            {/* Scan beam */}
            <div className="scan-beam" style={{ background: "linear-gradient(90deg, transparent, rgba(52,211,153,0.15), transparent)", animationDelay: "2s" }} />

            {/* Corner brackets */}
            {[["top-2 left-2","border-t border-l"], ["top-2 right-2","border-t border-r"], ["bottom-2 left-2","border-b border-l"], ["bottom-2 right-2","border-b border-r"]].map(([pos, border], i) => (
              <div key={i} className={`absolute ${pos} w-4 h-4 ${border} pointer-events-none`}
                style={{ borderColor: "rgba(52,211,153,0.4)", animation: `cornerBlink ${2 + i * 0.5}s ease-in-out infinite`, animationDelay: `${i * 0.3}s` }} />
            ))}

            {/* Top label */}
            <div className="relative z-10 px-6 pt-6 pb-0">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl mb-5"
                style={{ background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.25)" }}>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-emerald-400 text-xs font-bold tracking-wider">SMART WAY ✦</span>
              </div>

              <div className="relative mb-6">
                <h3 className="text-2xl font-black text-white">With Readynx</h3>
                <div className="mt-1.5 h-px w-24"
                  style={{ background: "linear-gradient(90deg, rgba(52,211,153,0.7), transparent)" }} />
              </div>
            </div>

            <div className="relative z-10 px-6 pb-8">
              <ul className="space-y-5">
                {withItems.map((item, i) => (
                  <CheckItem key={i} text={item} index={i} />
                ))}
              </ul>
            </div>

            {/* Bottom status bar */}
            <div className="relative z-10 mx-6 mb-6 rounded-xl px-4 py-3 flex items-center gap-3"
              style={{ background: "rgba(52,211,153,0.06)", border: "1px solid rgba(52,211,153,0.15)" }}>
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span className="text-xs text-emerald-400/70 font-medium">3× faster career growth · Proven results</span>
            </div>
          </motion.div>
        </div>

        {/* ── Bottom CTA strip ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="mt-16 max-w-2xl mx-auto text-center"
        >
          <div
            className="relative rounded-2xl px-8 py-6 overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            {/* Shimmer sweep */}
            <div className="badge-shimmer absolute top-0 bottom-0 w-32 blur-xl pointer-events-none"
              style={{ background: "linear-gradient(90deg, transparent, rgba(168,85,247,0.08), transparent)", animationDuration: "5s" }} />

            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-left">
                <div className="text-white font-black text-lg">Ready to make the switch?</div>
                <div className="text-slate-400 text-sm mt-0.5">Join 20,000+ developers already on Readynx</div>
              </div>
              <motion.a
                href="/signup"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="flex-shrink-0 px-6 py-3 rounded-full font-bold text-sm text-white flex items-center gap-2 transition-all"
                style={{
                  background: "linear-gradient(135deg, #00d9ff, #a855f7)",
                  boxShadow: "0 0 25px rgba(0,217,255,0.25), 0 0 50px rgba(168,85,247,0.12)",
                }}
              >
                <Zap className="w-4 h-4" />
                Get Started Free
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Benefits;