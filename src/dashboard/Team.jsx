import React, { useState } from "react";

const developer = {
  name: "Dipayan Dey",
  role: "Full-Stack Developer",
  tagline: "Building ideas into reality — one commit at a time.",
  photo: "https://scontent.fccu13-3.fna.fbcdn.net/v/t39.30808-1/611302821_1173249978354507_1165675431353820693_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=108&ccb=1-7&_nc_sid=e99d92&_nc_ohc=HBTyTSKTNjwQ7kNvwH6wD1y&_nc_oc=Adk0QOQFr08ygzAHZofc79Id8l4Qz1kY_bsUeVAzP6rADeF-8WqKCki961FAuyzI1Q6EomMJZki9WC49eA1ATdrM&_nc_zt=24&_nc_ht=scontent.fccu13-3.fna&_nc_gid=hrzVMx5Ks1O2Q8X7QtGOQQ&oh=00_Afs0FiVKQQveraFE1NjaX-i2YbN86AdiMDqFLLQyO9uZHg&oe=69A28F8A",
  phone: "919876543210",
  email: "dipayan@example.com",
  location: "West Bengal, India",
  experience: "3+ Years",
  projects: "40+",
  clients: "25+",
  skills: ["React", "Node.js", "Tailwind CSS", "MongoDB", "Next.js", "TypeScript"],
  socials: [
    {
      name: "GitHub",
      href: "https://github.com/dipayandey",
      hoverBg: "#e2e8f0",
      hoverText: "#0f172a",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
        </svg>
      ),
    },
    {
      name: "LinkedIn",
      href: "https://linkedin.com/in/dipayandey",
      hoverBg: "#0A66C2",
      hoverText: "#fff",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
    },
    {
      name: "Facebook",
      href: "https://facebook.com/dipayandey",
      hoverBg: "#1877F2",
      hoverText: "#fff",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
    {
      name: "Instagram",
      href: "https://instagram.com/dipayandey",
      hoverBg: "#E1306C",
      hoverText: "#fff",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
        </svg>
      ),
    },
    {
      name: "Fiverr",
      href: "https://fiverr.com/dipayandey",
      hoverBg: "#1DBF73",
      hoverText: "#fff",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M23.004 15.588a.96.96 0 10.001-1.92.96.96 0 000 1.92zm-1.04-4.591c0-1.507.55-2.047 1.657-2.047.43 0 .74.066.997.165V7.688a5.678 5.678 0 00-.85-.066c-2.33 0-3.65 1.31-3.65 3.773v.38h-1.311v1.837h1.311V20h1.847v-6.388h1.9l.274-1.837h-2.175v-.778zm-5.074-3.264c-.833 0-1.508-.476-1.508-1.35 0-.695.501-1.292 1.508-1.292.986 0 1.492.597 1.492 1.292 0 .874-.676 1.35-1.492 1.35zM15.002 20h1.849V9.352H15.002V20zm-3.763-1.837c-1.49 0-2.362-1.014-2.362-2.683 0-1.683.872-2.697 2.362-2.697 1.476 0 2.362 1.014 2.362 2.697 0 1.669-.886 2.683-2.362 2.683zm0-7.154c-2.593 0-4.224 1.67-4.224 4.47 0 2.784 1.631 4.454 4.224 4.454s4.224-1.67 4.224-4.454c0-2.8-1.631-4.47-4.224-4.47zm-8.33 5.56l-.597 2.43H1L3.814 9.352H6.46l2.812 9.647H7.897l-.598-2.43H2.91zm1.992-6.327l-1.56 4.714h3.118l-1.558-4.714z" />
        </svg>
      ),
    },
    {
      name: "X (Twitter)",
      href: "https://x.com/dipayandey",
      hoverBg: "#fff",
      hoverText: "#000",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.722-8.82L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
  ],
};

const Stat = ({ value, label }) => (
  <div className="flex flex-col items-center gap-1">
    <span className="text-2xl sm:text-3xl font-black text-white">{value}</span>
    <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</span>
  </div>
);

const SocialBtn = ({ s }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={s.href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: hovered ? s.hoverBg : "transparent",
        color: hovered ? s.hoverText : "#94a3b8",
        borderColor: hovered ? s.hoverBg : "#1e293b",
        transform: hovered ? "scale(1.05)" : "scale(1)",
        transition: "all 0.2s ease",
      }}
      className="flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-semibold"
    >
      {s.icon}
      <span>{s.name}</span>
    </a>
  );
};

const Team = () => {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 sm:p-8"
      // style={{ background: "#020817" }}
    >
      {/* Ambient glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-[-20%] left-[50%] -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, #6366f1, transparent 70%)" }}
        />
        <div
          className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full opacity-10 blur-3xl"
          style={{ background: "radial-gradient(circle, #06b6d4, transparent 70%)" }}
        />
      </div>

      <div className="relative w-full max-w-xl z-10">
        {/* ── Card ── */}
        <div
          className="rounded-3xl overflow-hidden"
          style={{
            background: "linear-gradient(145deg, #0f172a 0%, #0d1526 100%)",
            border: "1px solid #1e293b",
            boxShadow: "0 0 0 1px rgba(99,102,241,0.08), 0 25px 60px rgba(0,0,0,0.6)",
          }}
        >
          {/* Cover banner */}
          <div
            className="relative h-36 sm:h-30"
            style={{
              background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #1e3a5f 80%, #0c4a6e 100%)",
            }}
          >
            {/* Grid overlay texture */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }}
            />

           
            <div
              className="absolute top-4 right-8 w-32 h-32 rounded-full blur-2xl opacity-30"
              style={{ background: "radial-gradient(circle,#818cf8,transparent)" }}
            />
            <div
              className="absolute bottom-0 left-12 w-24 h-24 rounded-full blur-2xl opacity-20"
              style={{ background: "radial-gradient(circle,#38bdf8,transparent)" }}
            />

         
            <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-emerald-300"
              style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.25)" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Available for hire
            </div>

            {/* Avatar */}
            <div
              className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden z-10"
              style={{
                border: "3px solid #1e293b",
                boxShadow: "0 0 0 1px rgba(99,102,241,0.3), 0 8px 32px rgba(0,0,0,0.5)",
              }}
            >
              {!imgError ? (
                <img src={developer.photo} alt={developer.name} onError={() => setImgError(true)} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl font-black text-white"
                  style={{ background: "linear-gradient(135deg,#4f46e5,#0ea5e9)" }}>
                  DD
                </div>
              )}
            </div>
          </div>

          {/* Body */}
          <div className="pt-16 pb-8 px-5 sm:px-10 flex flex-col items-center gap-6">

            {/* Name + role */}
            <div className="text-center">
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight" style={{ fontFamily: "'Georgia', serif" }}>
                {developer.name}
              </h1>
              <p className="mt-1 text-xs font-bold uppercase tracking-[0.25em] text-indigo-400">{developer.role}</p>
              <p className="mt-2.5 text-sm leading-relaxed max-w-xs mx-auto" style={{ color: "#64748b" }}>{developer.tagline}</p>
            </div>

            {/* Info pills */}
            <div className="flex flex-wrap justify-center gap-2">
              {[
                {
                  icon: <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" />,
                  text: developer.location,
                },
                {
                  icon: <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />,
                  text: developer.email,
                },
              ].map(({ icon, text }) => (
                <span
                  key={text}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
                  style={{ background: "#0f172a", border: "1px solid #1e293b", color: "#94a3b8" }}
                >
                  <svg className="w-3.5 h-3.5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>{icon}</svg>
                  {text}
                </span>
              ))}
            </div>

            {/* Divider */}
            <div className="w-full h-px" style={{ background: "linear-gradient(90deg,transparent,#1e293b,transparent)" }} />

            {/* Stats */}
            <div className="flex justify-around w-full">
              <Stat value={developer.experience} label="Experience" />
              <div className="w-px self-stretch" style={{ background: "#1e293b" }} />
              <Stat value={developer.projects} label="Projects" />
              <div className="w-px self-stretch" style={{ background: "#1e293b" }} />
              <Stat value={developer.clients} label="Clients" />
            </div>

            {/* Divider */}
            <div className="w-full h-px" style={{ background: "linear-gradient(90deg,transparent,#1e293b,transparent)" }} />

            {/* Skills */}
            <div className="w-full">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-3" style={{ color: "#334155" }}>Tech Stack</p>
              <div className="flex flex-wrap gap-2">
                {developer.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 text-xs font-semibold rounded-full"
                    style={{
                      background: "rgba(99,102,241,0.1)",
                      border: "1px solid rgba(99,102,241,0.2)",
                      color: "#a5b4fc",
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="w-full h-px" style={{ background: "linear-gradient(90deg,transparent,#1e293b,transparent)" }} />

            {/* WhatsApp CTA */}
            <a
              href={`https://wa.me/${developer.phone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-bold text-white text-base transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5"
              style={{
                background: "linear-gradient(135deg,#128C7E,#25D366)",
                boxShadow: "0 4px 24px rgba(37,211,102,0.25)",
              }}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Message on WhatsApp
            </a>

            {/* Social links */}
            <div className="w-full">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-3" style={{ color: "#334155" }}>Find me on</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {developer.socials.map((s) => (
                  <SocialBtn key={s.name} s={s} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        {/* <p className="text-center text-xs mt-5" style={{ color: "#334155" }}>
          © {new Date().getFullYear()} {developer.name} · Open for projects
        </p> */}
      </div>
    </div>
  );
};

export default Team;