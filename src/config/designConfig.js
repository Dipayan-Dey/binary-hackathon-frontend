// Design Configuration
// Modify these values to customize the look and feel of your application

export const designConfig = {
  // Background Colors
  backgrounds: {
    hero: 'bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900',
    workflow: 'bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900',
    features: 'bg-slate-900',
    benefits: 'bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900',
    targetAudience: 'bg-slate-900',
    techStack: 'bg-gradient-to-b from-slate-900 via-purple-950 to-slate-900',
    cta: 'bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600',
    login: 'bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900',
    signup: 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900',
  },

  // Gradient Colors for Cards/Elements
  gradients: {
    primary: 'from-blue-500 to-cyan-500',
    secondary: 'from-purple-500 to-pink-500',
    success: 'from-green-500 to-emerald-500',
    warning: 'from-yellow-500 to-orange-500',
    danger: 'from-red-500 to-rose-500',
    info: 'from-indigo-500 to-blue-500',
    teal: 'from-teal-500 to-cyan-500',
    violet: 'from-violet-500 to-purple-500',
  },

  // Glow/Orb Colors
  glowOrbs: {
    blue: 'bg-blue-500/10',
    purple: 'bg-purple-500/10',
    pink: 'bg-pink-500/10',
  },

  // Particle Settings
  particles: {
    enabled: true,
    color: '#3b82f6',
    linkColor: '#3b82f6',
    count: 80,
    speed: 1,
  },

  // Animation Settings
  animations: {
    enableParticles: true,
    enableFloatingOrbs: true,
    enableGridBackground: true,
    enableHoverGlow: true,
  },

  // Typography
  fonts: {
    heading: 'font-bold',
    body: 'font-normal',
  },
};

export default designConfig;
