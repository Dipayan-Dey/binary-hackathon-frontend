import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Star, Send, CheckCircle, ChevronDown, Zap } from 'lucide-react';

const categories = [
  'General Feedback',
  'Bug Report',
  'Feature Request',
  'Career Roadmap',
  'AI Analysis',
  'UI / Design',
];

const moods = [
  { emoji: '😤', label: 'Frustrated', color: '#ef4444' },
  { emoji: '😐', label: 'Neutral',    color: '#94a3b8' },
  { emoji: '🙂', label: 'Good',       color: '#38bdf8' },
  { emoji: '🤩', label: 'Loving it',  color: '#a855f7' },
];

const StarRating = ({ value, onChange }) => (
  <div className="flex items-center gap-1.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <motion.button
        key={star}
        type="button"
        whileHover={{ scale: 1.25 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => onChange(star)}
        className="relative"
      >
        <Star
          className="w-7 h-7 transition-all duration-200"
          style={{
            fill: star <= value ? '#f59e0b' : 'transparent',
            color: star <= value ? '#f59e0b' : 'rgba(255,255,255,0.15)',
            filter: star <= value ? 'drop-shadow(0 0 6px rgba(245,158,11,0.6))' : 'none',
          }}
        />
      </motion.button>
    ))}
    {value > 0 && (
      <motion.span
        key={value}
        initial={{ opacity: 0, x: -6 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-xs font-bold ml-1"
        style={{ color: '#f59e0b' }}
      >
        {['', 'Poor', 'Fair', 'Good', 'Great', 'Amazing'][value]}
      </motion.span>
    )}
  </div>
);

const InputField = ({ label, tag, children, required }) => (
  <div className="space-y-2">
    <div className="flex items-center gap-2">
      <span className="text-[9px] font-black tracking-[0.2em]" style={{ color: 'rgba(0,217,255,0.6)' }}>
        {tag}
      </span>
      <div className="flex-1 h-px" style={{ background: 'rgba(0,217,255,0.1)' }} />
      {required && <span className="text-[9px] text-red-400">REQUIRED</span>}
    </div>
    <label className="text-sm font-semibold text-slate-200">{label}</label>
    {children}
  </div>
);

const FeedbackForm = () => {
  const [form, setForm]       = useState({ name: '', email: '', category: '', message: '' });
  const [rating, setRating]   = useState(0);
  const [mood, setMood]       = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dropOpen, setDropOpen]   = useState(false);
  const [errors, setErrors]   = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim())     e.name = 'Name is required';
    if (!form.email.trim())    e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
    if (!form.category)        e.category = 'Select a category';
    if (!form.message.trim())  e.message = 'Message is required';
    if (rating === 0)          e.rating = 'Please rate your experience';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1800));
    setLoading(false);
    setSubmitted(true);
  };

  const set = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }));
    setErrors(er => ({ ...er, [field]: undefined }));
  };

  // ── Success state ────────────────────────────────────────
  if (submitted) {
    return (
      <section className="relative min-h-screen flex items-center justify-center py-20 px-4 overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #020209 0%, #06060f 50%, #020209 100%)' }}>
        <style>{sharedStyles}</style>
        <div className="absolute inset-0 mobile-grid opacity-40 pointer-events-none" />

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="relative rounded-3xl p-10 text-center max-w-md w-full overflow-hidden"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(52,211,153,0.3)',
            boxShadow: '0 0 60px rgba(52,211,153,0.1)',
          }}
        >
          <div className="absolute top-0 left-8 right-8 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(52,211,153,0.7), transparent)' }} />

          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6"
            style={{
              background: 'rgba(52,211,153,0.12)',
              border: '1px solid rgba(52,211,153,0.3)',
              boxShadow: '0 0 40px rgba(52,211,153,0.2)',
            }}
          >
            <CheckCircle className="w-10 h-10 text-emerald-400" />
          </motion.div>

          <h3 className="text-2xl font-black text-white mb-3">Feedback Received!</h3>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            Thank you for helping us improve. Our team will review your feedback and reach out if needed.
          </p>

          <div className="grid grid-cols-3 gap-3 mb-8">
            {[['⭐', `${rating}/5`, 'Rating'], ['💬', form.category, 'Category'], ['🎭', moods[mood]?.label || '—', 'Mood']].map(([icon, val, lbl], i) => (
              <div key={i} className="rounded-xl py-3 px-2 text-center"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="text-lg mb-1">{icon}</div>
                <div className="text-white text-xs font-bold truncate">{val}</div>
                <div className="text-slate-600 text-[9px] mt-0.5">{lbl}</div>
              </div>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => { setSubmitted(false); setForm({ name:'',email:'',category:'',message:'' }); setRating(0); setMood(null); }}
            className="w-full py-3 rounded-2xl font-bold text-white text-sm"
            style={{ background: 'linear-gradient(135deg, #34d399, #06b6d4)', boxShadow: '0 0 24px rgba(52,211,153,0.25)' }}
          >
            Submit Another
          </motion.button>
        </motion.div>
      </section>
    );
  }

  // ── Main form ────────────────────────────────────────────
  return (
    <section
      className="relative min-h-screen flex items-center justify-center py-20 px-4 overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #020209 0%, #06060f 50%, #020209 100%)' }}
    >
      <style>{sharedStyles}</style>

      {/* Background */}
      <div className="absolute inset-0 mobile-grid opacity-40 pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 50%, transparent 35%, #020209 100%)' }} />
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(0,217,255,0.07), transparent 70%)' }} />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.07), transparent 70%)' }} />

      <div className="relative z-10 w-full max-w-xl">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-5 overflow-hidden relative"
            style={{ background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.22)' }}>
            <div className="badge-shimmer absolute top-0 bottom-0 w-12 blur-sm"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)' }} />
            <MessageSquare className="w-3.5 h-3.5 text-purple-400 relative z-10" />
            <span className="text-purple-400 text-xs font-bold tracking-[0.18em] relative z-10">SHARE YOUR FEEDBACK</span>
          </div>

          <h2 className="text-4xl font-black text-white mb-3 leading-tight">
            We'd Love to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
              Hear From You
            </span>
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed max-w-sm mx-auto">
            Your feedback shapes what we build next. Every word counts.
          </p>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.4, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto mt-6 h-px w-24 origin-center"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(168,85,247,0.7), transparent)' }}
          />
        </motion.div>

        {/* ── Form card ── */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-3xl overflow-hidden p-7 space-y-7"
          style={{
            background: 'rgba(255,255,255,0.025)',
            border: '1px solid rgba(255,255,255,0.08)',
            backdropFilter: 'blur(20px)',
          }}
        >
          {/* Scan line */}
          <div className="scan-line pointer-events-none"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(0,217,255,0.12), transparent)' }} />

          {/* Corner brackets */}
          {[
            'top-3 left-3 border-t border-l',
            'top-3 right-3 border-t border-r',
            'bottom-3 left-3 border-b border-l',
            'bottom-3 right-3 border-b border-r',
          ].map((cls, i) => (
            <div key={i} className={`absolute ${cls} w-4 h-4 pointer-events-none`}
              style={{ borderColor: 'rgba(0,217,255,0.2)' }} />
          ))}

          {/* Top accent */}
          <div className="absolute top-0 left-10 right-10 h-px pointer-events-none"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(0,217,255,0.4), transparent)' }} />

          {/* ── Name + Email ── */}
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Your Name" tag="01 // IDENTITY" required>
              <input
                type="text"
                value={form.name}
                onChange={set('name')}
                placeholder="John Doe"
                className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-slate-600 outline-none transition-all duration-300"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: `1px solid ${errors.name ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.08)'}`,
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(0,217,255,0.4)'}
                onBlur={e => e.target.style.borderColor = errors.name ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.08)'}
              />
              {errors.name && <p className="text-red-400 text-[10px] mt-1">{errors.name}</p>}
            </InputField>

            <InputField label="Email Address" tag="02 // CONTACT" required>
              <input
                type="email"
                value={form.email}
                onChange={set('email')}
                placeholder="you@email.com"
                className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-slate-600 outline-none transition-all duration-300"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: `1px solid ${errors.email ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.08)'}`,
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(0,217,255,0.4)'}
                onBlur={e => e.target.style.borderColor = errors.email ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.08)'}
              />
              {errors.email && <p className="text-red-400 text-[10px] mt-1">{errors.email}</p>}
            </InputField>
          </div>

          {/* ── Category dropdown ── */}
          <InputField label="Category" tag="03 // TYPE" required>
            <div className="relative">
              <button
                type="button"
                onClick={() => setDropOpen(o => !o)}
                className="w-full px-4 py-3 rounded-xl text-sm text-left flex items-center justify-between transition-all duration-300"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: `1px solid ${errors.category ? 'rgba(239,68,68,0.5)' : dropOpen ? 'rgba(0,217,255,0.4)' : 'rgba(255,255,255,0.08)'}`,
                  color: form.category ? '#fff' : 'rgba(100,116,139,0.9)',
                }}
              >
                {form.category || 'Select a category…'}
                <motion.div animate={{ rotate: dropOpen ? 180 : 0 }} transition={{ duration: 0.25 }}>
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                </motion.div>
              </button>

              <AnimatePresence>
                {dropOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.97 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-0 right-0 top-full mt-2 rounded-2xl overflow-hidden z-20"
                    style={{
                      background: 'rgba(8,8,22,0.98)',
                      border: '1px solid rgba(0,217,255,0.2)',
                      boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
                    }}
                  >
                    {categories.map((cat, i) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => { setForm(f => ({ ...f, category: cat })); setDropOpen(false); setErrors(er => ({ ...er, category: undefined })); }}
                        className="w-full px-4 py-3 text-sm text-left flex items-center gap-3 transition-all duration-200 group"
                        style={{
                          color: form.category === cat ? '#00d9ff' : 'rgba(148,163,184,0.9)',
                          background: form.category === cat ? 'rgba(0,217,255,0.08)' : 'transparent',
                          borderBottom: i < categories.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,217,255,0.06)'; e.currentTarget.style.color = '#fff'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = form.category === cat ? 'rgba(0,217,255,0.08)' : 'transparent'; e.currentTarget.style.color = form.category === cat ? '#00d9ff' : 'rgba(148,163,184,0.9)'; }}
                      >
                        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ background: form.category === cat ? '#00d9ff' : 'rgba(255,255,255,0.15)' }} />
                        {cat}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {errors.category && <p className="text-red-400 text-[10px] mt-1">{errors.category}</p>}
          </InputField>

          {/* ── Star rating ── */}
          <InputField label="Overall Experience" tag="04 // RATING" required>
            <div className="px-4 py-3 rounded-xl"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: `1px solid ${errors.rating ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.07)'}`,
              }}>
              <StarRating value={rating} onChange={(v) => { setRating(v); setErrors(er => ({ ...er, rating: undefined })); }} />
            </div>
            {errors.rating && <p className="text-red-400 text-[10px] mt-1">{errors.rating}</p>}
          </InputField>

          {/* ── Mood selector ── */}
          <InputField label="How are you feeling?" tag="05 // MOOD">
            <div className="grid grid-cols-4 gap-2">
              {moods.map((m, i) => (
                <motion.button
                  key={i}
                  type="button"
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => setMood(mood === i ? null : i)}
                  className="flex flex-col items-center gap-1.5 py-3 rounded-xl transition-all duration-300"
                  style={{
                    background: mood === i ? `${m.color}18` : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${mood === i ? m.color + '50' : 'rgba(255,255,255,0.07)'}`,
                    boxShadow: mood === i ? `0 0 20px ${m.color}20` : 'none',
                  }}
                >
                  <span className="text-2xl">{m.emoji}</span>
                  <span className="text-[10px] font-semibold transition-colors duration-300"
                    style={{ color: mood === i ? m.color : 'rgba(100,116,139,0.9)' }}>
                    {m.label}
                  </span>
                </motion.button>
              ))}
            </div>
          </InputField>

          {/* ── Message ── */}
          <InputField label="Your Message" tag="06 // DETAILS" required>
            <div className="relative">
              <textarea
                value={form.message}
                onChange={set('message')}
                placeholder="Tell us what you think, what's broken, or what you'd love to see…"
                rows={4}
                className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-slate-600 outline-none resize-none transition-all duration-300"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: `1px solid ${errors.message ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.08)'}`,
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(0,217,255,0.4)'}
                onBlur={e => e.target.style.borderColor = errors.message ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.08)'}
              />
              <div className="absolute bottom-3 right-3 text-[10px]"
                style={{ color: form.message.length > 400 ? '#f59e0b' : 'rgba(100,116,139,0.6)' }}>
                {form.message.length}/500
              </div>
            </div>
            {errors.message && <p className="text-red-400 text-[10px] mt-1">{errors.message}</p>}
          </InputField>

          {/* ── Submit ── */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            disabled={loading}
            className="w-full py-4 rounded-2xl font-bold text-white text-base flex items-center justify-center gap-3 relative overflow-hidden group transition-all"
            style={{
              background: loading
                ? 'rgba(255,255,255,0.06)'
                : 'linear-gradient(135deg, #00d9ff, #a855f7)',
              boxShadow: loading ? 'none' : '0 0 35px rgba(0,217,255,0.25), 0 0 70px rgba(168,85,247,0.12)',
              border: loading ? '1px solid rgba(255,255,255,0.1)' : 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {/* Shimmer on hover */}
            {!loading && (
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)' }} />
            )}

            {loading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-5 h-5 rounded-full border-2 border-white/20 border-t-white/80"
                />
                <span className="text-slate-300">Sending Feedback…</span>
              </>
            ) : (
              <>
                <Zap className="w-5 h-5 relative z-10" />
                <span className="relative z-10">Send Feedback</span>
                <Send className="w-4 h-4 relative z-10 group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform" />
              </>
            )}
          </motion.button>

          {/* Privacy note */}
          <p className="text-center text-[10px]" style={{ color: 'rgba(100,116,139,0.6)' }}>
            🔒 Your feedback is confidential and will only be used to improve our product.
          </p>
        </motion.form>
      </div>
    </section>
  );
};

// ── Shared CSS ────────────────────────────────────────────────
const sharedStyles = `
  @keyframes scanBeam {
    0%   { top: 0%;   opacity: 0; }
    8%   { opacity: 1; }
    92%  { opacity: 1; }
    100% { top: 100%; opacity: 0; }
  }
  @keyframes mobileGridDrift {
    from { background-position: 0 0; }
    to   { background-position: 40px 40px; }
  }
  @keyframes badgeShimmer {
    0%   { left: -80%; }
    100% { left: 200%; }
  }
  .scan-line {
    animation: scanBeam 5s linear infinite;
    position: absolute; left: 0; right: 0; height: 1px; pointer-events: none; z-index: 5;
  }
  .mobile-grid {
    background-image: linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px);
    background-size: 40px 40px;
    animation: mobileGridDrift 18s linear infinite;
  }
  .badge-shimmer {
    animation: badgeShimmer 3s ease-in-out infinite;
    position: absolute; top: 0; bottom: 0; width: 40%;
  }
  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  textarea:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 1000px rgba(255,255,255,0.04) inset !important;
    -webkit-text-fill-color: #fff !important;
    caret-color: #fff;
  }
`;

export default FeedbackForm;