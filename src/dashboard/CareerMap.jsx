import React, { useState, useEffect, useRef, useMemo } from "react";
import { getCVMindMap, generateTechRoadmap } from "../api/userApi";
import {
  GitBranch, Map, BookOpen, ChevronDown, Sparkles,
  Search, Layers, Clock, ExternalLink, Loader2, Zap,
  X, TrendingUp, Plus, Minus, RotateCcw,
} from "lucide-react";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import "./styles/DashboardPages.css";

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
const TAU = Math.PI * 2;

function countLeaves(node) {
  if (!node.children || node.children.length === 0) return 1;
  return node.children.reduce((s, c) => s + countLeaves(c), 0);
}

function assignRadial(node, cx, cy, r, startAngle, endAngle, depth) {
  const angle = (startAngle + endAngle) / 2;
  const x = depth === 0 ? cx : cx + Math.cos(angle) * r * depth;
  const y = depth === 0 ? cy : cy + Math.sin(angle) * r * depth;
  const result = [{ node, x, y, depth, angle }];
  if (node.children && node.children.length > 0) {
    const total = countLeaves(node);
    let cursor = startAngle;
    for (const child of node.children) {
      const leaves = countLeaves(child);
      const span = ((endAngle - startAngle) * leaves) / total;
      result.push(...assignRadial(child, cx, cy, r, cursor, cursor + span, depth + 1));
      cursor += span;
    }
  }
  return result;
}

function getProficiency(node, depth) {
  if (depth === 0) return 1;
  let hash = 0;
  for (let i = 0; i < node.label.length; i++) hash = (hash * 31 + node.label.charCodeAt(i)) & 0xffffffff;
  return 0.2 + (Math.abs(hash) % 80) / 100;
}

function getTier(p) {
  if (p >= 0.75) return "strong";
  if (p >= 0.45) return "moderate";
  return "weak";
}

const TIER = {
  strong:   { orb: "#34d399", glow: "rgba(52,211,153,0.7)",   ring: "#34d399", label: "#a7f3d0", text: "Strong",     icon: "✓" },
  moderate: { orb: "#fbbf24", glow: "rgba(251,191,36,0.7)",   ring: "#fbbf24", label: "#fef3c7", text: "Needs Work", icon: "~" },
  weak:     { orb: "#f87171", glow: "rgba(248,113,113,0.75)", ring: "#f87171", label: "#fecaca", text: "Improve!",   icon: "!" },
};

const ROOT_COL   = { orb: "#ffffff", glow: "rgba(255,255,255,0.9)", ring: "#ffffff", label: "#ffffff" };
const BRANCH_COL = { orb: "#a78bfa", glow: "rgba(167,139,250,0.7)", ring: "#a78bfa", label: "#ddd6fe" };

function nodeColor(node, depth) {
  if (depth === 0) return ROOT_COL;
  if (depth === 1) return BRANCH_COL;
  return TIER[getTier(getProficiency(node, depth))];
}

// ─────────────────────────────────────────────────────────────────────────────
// PARTICLE
// ─────────────────────────────────────────────────────────────────────────────
class Particle {
  constructor(x1, y1, x2, y2, color) {
    this.x1 = x1; this.y1 = y1; this.x2 = x2; this.y2 = y2;
    this.color = color;
    this.t = Math.random();
    this.speed = 0.0018 + Math.random() * 0.0025;
    this.size  = 1.8 + Math.random() * 1.8;
  }
  update() { this.t = (this.t + this.speed) % 1; }
  draw(ctx, ox, oy) {
    const x = ox + this.x1 + (this.x2 - this.x1) * this.t;
    const y = oy + this.y1 + (this.y2 - this.y1) * this.t;
    ctx.beginPath();
    ctx.arc(x, y, this.size, 0, TAU);
    ctx.fillStyle = this.color;
    ctx.globalAlpha = 0.9 * (1 - Math.abs(this.t - 0.5) * 1.7);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// DETAIL PANEL
// ─────────────────────────────────────────────────────────────────────────────
const DetailPanel = ({ item, onClose }) => {
  if (!item) return null;
  const { node, depth } = item;
  const proficiency = getProficiency(node, depth);
  const tier     = depth <= 1 ? null : getTier(proficiency);
  const tierInfo = tier ? TIER[tier] : null;
  const pct      = Math.round(proficiency * 100);

  const tips = {
    weak:     ["Dedicate 30–60 min daily to this skill", "Follow a structured beginner course", "Build 1–2 small projects applying it"],
    moderate: ["Review advanced patterns and edge cases", "Contribute to open source using this skill", "Practice mock interviews / code challenges"],
    strong:   ["Mentor others to deepen mastery", "Explore adjacent advanced topics", "Document your expertise in a portfolio"],
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 30, scale: 0.96 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 30, scale: 0.96 }}
      transition={{ duration: 0.22 }}
      className="absolute top-4 right-4 z-40 w-72"
      style={{ fontFamily: "Outfit, sans-serif" }}
    >
      <div className="rounded-2xl p-5 relative overflow-hidden"
        style={{
          background: "rgba(6,6,24,0.96)",
          border: `1px solid ${tierInfo ? tierInfo.orb + "55" : "#a78bfa55"}`,
          boxShadow: `0 0 40px ${tierInfo ? tierInfo.orb + "20" : "#a78bfa20"}`,
          backdropFilter: "blur(20px)",
        }}>
        <button onClick={onClose}
          className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center"
          style={{ color: "#64748b", background: "rgba(255,255,255,0.06)" }}>
          <X size={12} />
        </button>
        <div className="mb-4 pr-6">
          <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "#475569" }}>
            {depth === 0 ? "Root" : depth === 1 ? "Domain" : "Skill Node"}
          </p>
          <h3 className="text-white font-bold text-base leading-tight">{node.label}</h3>
        </div>
        {tier && tierInfo && (
          <>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs font-semibold" style={{ color: tierInfo.orb }}>{tierInfo.icon} {tierInfo.text}</span>
              <span className="text-xs font-bold text-white">{pct}%</span>
            </div>
            <div className="w-full rounded-full h-2 mb-4" style={{ background: "rgba(255,255,255,0.08)" }}>
              <motion.div
                initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-2 rounded-full"
                style={{ background: `linear-gradient(90deg,${tierInfo.orb}88,${tierInfo.orb})`, boxShadow: `0 0 8px ${tierInfo.orb}80` }}
              />
            </div>
            <div className="rounded-xl p-3" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <p className="text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5" style={{ color: tierInfo.orb }}>
                <TrendingUp size={11} /> Action Steps
              </p>
              <ul className="space-y-1.5">
                {tips[tier].map((tip, i) => (
                  <li key={i} className="flex gap-2 text-xs leading-snug" style={{ color: "#94a3b8" }}>
                    <span className="mt-0.5 shrink-0" style={{ color: tierInfo.orb }}>›</span>{tip}
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
        {node.children && node.children.length > 0 && (
          <p className="mt-3 text-xs" style={{ color: "#334155" }}>
            {node.children.length} sub-skill{node.children.length > 1 ? "s" : ""} attached
          </p>
        )}
      </div>
    </motion.div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SHARED ZOOM CONTROLS WIDGET
// ─────────────────────────────────────────────────────────────────────────────
const ZoomControls = ({ scale, onZoomIn, onZoomOut, onReset, accent = "#a78bfa" }) => (
  <div className="absolute bottom-12 right-4 z-30 flex flex-col items-center gap-1.5">
    {[
      { icon: <Plus size={13} />,      fn: onZoomIn,  title: "Zoom In"  },
      { icon: <Minus size={13} />,     fn: onZoomOut, title: "Zoom Out" },
      { icon: <RotateCcw size={12} />, fn: onReset,   title: "Reset"    },
    ].map((b, i) => (
      <motion.button
        key={i}
        title={b.title}
        onClick={b.fn}
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.88 }}
        className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors"
        style={{
          background: `${accent}12`,
          border: `1px solid ${accent}35`,
          color: accent,
          boxShadow: `0 0 10px ${accent}15`,
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background   = `${accent}25`;
          e.currentTarget.style.borderColor  = `${accent}70`;
          e.currentTarget.style.boxShadow    = `0 0 18px ${accent}45`;
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background   = `${accent}12`;
          e.currentTarget.style.borderColor  = `${accent}35`;
          e.currentTarget.style.boxShadow    = `0 0 10px ${accent}15`;
        }}
      >
        {b.icon}
      </motion.button>
    ))}
    <div className="text-[9px] font-mono mt-0.5" style={{ color: `${accent}55` }}>
      {Math.round(scale * 100)}%
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// CONSTELLATION MAP  (radial, canvas-backed, SVG nodes)
// ─────────────────────────────────────────────────────────────────────────────
const ConstellationMap = ({ data }) => {
  const canvasRef    = useRef(null);
  const animRef      = useRef(null);
  const particlesRef = useRef([]);
  const containerRef = useRef(null);
  const frameRef     = useRef(0);

  const [hoveredId,    setHoveredId]    = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [collapsed,    setCollapsed]    = useState({});
  const [size,         setSize]         = useState({ w: 900, h: 560 });

  // Zoom + pan state
  const [scale,     setScale]     = useState(1);
  const [offset,    setOffset]    = useState({ x: 0, y: 0 });
  const [dragging,  setDragging]  = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const zoomIn    = () => setScale(s => Math.min(3,    +(s + 0.15).toFixed(2)));
  const zoomOut   = () => setScale(s => Math.max(0.25, +(s - 0.15).toFixed(2)));
  const resetView = () => { setScale(1); setOffset({ x: 0, y: 0 }); };

  // Resize observer
  useEffect(() => {
    const obs = new ResizeObserver(([e]) =>
      setSize({ w: Math.floor(e.contentRect.width), h: Math.floor(e.contentRect.height) })
    );
    if (containerRef.current) obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  const cx = size.w / 2;
  const cy = size.h / 2;
  const R  = Math.min(size.w, size.h) * 0.285;

  const filterCollapsed = (node) => {
    if (collapsed[node.id]) return { ...node, children: [] };
    if (!node.children) return node;
    return { ...node, children: node.children.map(filterCollapsed) };
  };

  const root   = useMemo(() => filterCollapsed(data.nodes[0]), [collapsed, data]);
  const layout = useMemo(() => assignRadial(root, 0, 0, R, -Math.PI / 2, Math.PI * 1.5, 0), [root, R]);

  const edges = useMemo(() => {
    const map = {};
    layout.forEach(n => (map[n.node.id] = n));
    const result = [];
    function walk(node) {
      if (!node.children) return;
      for (const child of node.children) {
        const p = map[node.id], c = map[child.id];
        if (p && c) result.push({ from: p, to: c });
        walk(child);
      }
    }
    walk(root);
    return result;
  }, [layout, root]);

  useEffect(() => {
    const particles = [];
    edges.forEach(({ from, to }) => {
      const c = nodeColor(to.node, to.depth);
      for (let i = 0; i < 4; i++)
        particles.push(new Particle(from.x, from.y, to.x, to.y, c.orb));
    });
    particlesRef.current = particles;
  }, [edges]);

  // Canvas animation loop — respects scale/offset
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    function loop() {
      frameRef.current++;
      canvas.width  = size.w;
      canvas.height = size.h;
      ctx.clearRect(0, 0, size.w, size.h);

      ctx.save();
      ctx.translate(cx + offset.x, cy + offset.y);
      ctx.scale(scale, scale);

      // Edges
      edges.forEach(({ from, to }) => {
        const c   = nodeColor(to.node, to.depth);
        const isH = hoveredId === from.node.id || hoveredId === to.node.id;
        const grad = ctx.createLinearGradient(from.x, from.y, to.x, to.y);
        grad.addColorStop(0, nodeColor(from.node, from.depth).orb + (isH ? "50" : "18"));
        grad.addColorStop(1, c.orb + (isH ? "80" : "40"));
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth   = isH ? 1.8 : 1;
        ctx.stroke();
      });

      // Particles
      particlesRef.current.forEach(p => { p.update(); p.draw(ctx, 0, 0); });

      // Halos
      layout.forEach(({ node, x, y, depth }) => {
        const c = nodeColor(node, depth);
        const r = depth === 0 ? 30 : depth === 1 ? 22 : 15;
        const pulse = 1 + 0.06 * Math.sin(frameRef.current * 0.033 + x * 0.012);
        const halo = ctx.createRadialGradient(x, y, 0, x, y, r * 3 * pulse);
        halo.addColorStop(0, c.orb + "22");
        halo.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.arc(x, y, r * 3 * pulse, 0, TAU);
        ctx.fillStyle = halo;
        ctx.fill();
      });

      ctx.restore();
      animRef.current = requestAnimationFrame(loop);
    }
    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, [layout, edges, size, cx, cy, hoveredId, scale, offset]);

  // Wheel zoom
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const h = e => {
      e.preventDefault();
      setScale(s => Math.min(3, Math.max(0.25, +(s - e.deltaY * 0.001).toFixed(3))));
    };
    el.addEventListener("wheel", h, { passive: false });
    return () => el.removeEventListener("wheel", h);
  }, []);

  // Drag-to-pan
  const onDown = e => {
    if (e.target.closest(".cnode")) return;
    setDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };
  const onMove = e => {
    if (!dragging) return;
    setOffset({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };
  const onUp = () => setDragging(false);

  const orbR      = d => (d === 0 ? 30 : d === 1 ? 21 : 14);
  const screenPos = (x, y) => ({ sx: cx + offset.x + x * scale, sy: cy + offset.y + y * scale });

  const skillNodes  = layout.filter(l => l.depth >= 2);
  const weakCount   = skillNodes.filter(l => getTier(getProficiency(l.node, l.depth)) === "weak").length;
  const modCount    = skillNodes.filter(l => getTier(getProficiency(l.node, l.depth)) === "moderate").length;
  const strongCount = skillNodes.filter(l => getTier(getProficiency(l.node, l.depth)) === "strong").length;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full select-none"
      style={{ minHeight: 520, cursor: dragging ? "grabbing" : "grab" }}
      onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp}
    >
      {/* Scanlines + radial vignette */}
      <div className="absolute inset-0 pointer-events-none z-10"
        style={{ background: "repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.04) 3px,rgba(0,0,0,0.04) 4px)" }} />
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 55% 55% at 50% 50%,rgba(80,40,180,0.07) 0%,transparent 70%)" }} />

      {/* Skill stats */}
      <div className="absolute top-3 left-4 z-30 flex gap-2" style={{ fontFamily: "Outfit" }}>
        {[
          { count: weakCount,   color: "#f87171", bg: "rgba(248,113,113,0.1)", border: "rgba(248,113,113,0.3)", label: "Need Improvement" },
          { count: modCount,    color: "#fbbf24", bg: "rgba(251,191,36,0.1)",  border: "rgba(251,191,36,0.3)",  label: "In Progress"      },
          { count: strongCount, color: "#34d399", bg: "rgba(52,211,153,0.1)",  border: "rgba(52,211,153,0.3)",  label: "Strong"           },
        ].map((s, i) => (
          <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
            style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.color }}>
            <span className="text-sm font-bold">{s.count}</span>
            <span className="opacity-75 font-normal hidden sm:inline">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Canvas */}
      <canvas ref={canvasRef} width={size.w} height={size.h}
        className="absolute inset-0" style={{ mixBlendMode: "screen" }} />

      {/* SVG node layer */}
      <svg width={size.w} height={size.h} className="absolute inset-0" style={{ overflow: "visible" }}>
        <defs>
          {["root","branch","strong","moderate","weak"].map((id, i) => {
            const cols = [ROOT_COL, BRANCH_COL, TIER.strong, TIER.moderate, TIER.weak];
            const c = cols[i];
            return (
              <radialGradient key={id} id={`og_${id}`} cx="38%" cy="32%" r="65%">
                <stop offset="0%"   stopColor="#fff"  stopOpacity="0.9"  />
                <stop offset="40%"  stopColor={c.orb} stopOpacity="0.85" />
                <stop offset="100%" stopColor={c.orb} stopOpacity="0.2"  />
              </radialGradient>
            );
          })}
          <filter id="orbF" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="txtF">
            <feDropShadow dx="0" dy="0" stdDeviation="3.5" floodColor="#000" floodOpacity="1" />
          </filter>
          <filter id="weakGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="5" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {layout.map(({ node, x, y, depth }) => {
          const c       = nodeColor(node, depth);
          const r       = orbR(depth) * scale;
          const isHov   = hoveredId === node.id;
          const isSel   = selectedItem?.node.id === node.id;
          const hasKids = node.children && node.children.length > 0;
          const isCol   = collapsed[node.id];
          const { sx: px, sy: py } = screenPos(x, y);
          const sc      = isHov || isSel ? 1.3 : 1;
          const above   = py > cy + offset.y + 20;
          const prof    = depth >= 2 ? getProficiency(node, depth) : null;
          const tier    = prof ? getTier(prof) : null;
          const gradId  = depth === 0 ? "og_root" : depth === 1 ? "og_branch" : `og_${tier}`;

          return (
            <g key={node.id} className="cnode"
              transform={`translate(${px},${py})`}
              style={{ cursor: "pointer" }}
              onMouseEnter={() => setHoveredId(node.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={e => {
                e.stopPropagation();
                setSelectedItem(selectedItem?.node.id === node.id ? null : { node, depth });
                if (hasKids && depth > 0) setCollapsed(p => ({ ...p, [node.id]: !p[node.id] }));
              }}
            >
              {/* Proficiency arc */}
              {depth >= 2 && prof !== null && (() => {
                const arcR   = r * sc + 8 * scale;
                const arcLen = TAU * arcR;
                const filled = arcLen * prof;
                return (
                  <circle r={arcR} fill="none" stroke={c.orb} strokeWidth={2.5}
                    strokeDasharray={`${filled} ${arcLen - filled}`}
                    strokeDashoffset={arcLen * 0.25} strokeLinecap="round"
                    strokeOpacity={isHov || isSel ? 0.9 : 0.55} transform="rotate(-90)" />
                );
              })()}

              {isSel && <circle r={r * sc + 14 * scale} fill="none" stroke={c.ring} strokeWidth={1.5} strokeOpacity={0.5} strokeDasharray="4 3" />}
              <circle r={r * sc + 5 * scale} fill="none" stroke={c.ring}
                strokeWidth={isHov ? 1.5 : 0.7} strokeOpacity={isHov ? 0.75 : 0.2}
                style={{ transition: "all 0.2s" }} />
              <circle r={r * sc} fill={`url(#${gradId})`}
                filter={tier === "weak" ? "url(#weakGlow)" : "url(#orbF)"}
                style={{ transition: "r 0.2s" }} />

              {hasKids && isCol && (
                <text x={0} y={4} textAnchor="middle" fill="#fff"
                  fontSize={9 * scale} fontWeight="700" style={{ pointerEvents: "none" }}>+</text>
              )}

              <text x={0} y={above ? -(r * sc + 10 * scale) : r * sc + 18 * scale}
                textAnchor="middle" fill={c.label}
                fontSize={(depth === 0 ? 13 : depth === 1 ? 11.5 : 10) * scale}
                fontWeight={depth === 0 ? 700 : depth === 1 ? 600 : 500}
                fontFamily="Outfit, sans-serif" filter="url(#txtF)"
                style={{ pointerEvents: "none" }}>
                {node.label.length > 22 ? node.label.slice(0, 20) + "…" : node.label}
              </text>

              {depth >= 2 && prof !== null && (isHov || isSel) && (
                <text x={0} y={4} textAnchor="middle" fill="#fff"
                  fontSize={(depth === 2 ? 9 : 8) * scale} fontWeight="700"
                  style={{ pointerEvents: "none" }}>
                  {Math.round(prof * 100)}%
                </text>
              )}
            </g>
          );
        })}
      </svg>

      <AnimatePresence>
        {selectedItem && (
          <DetailPanel key={selectedItem.node.id} item={selectedItem} onClose={() => setSelectedItem(null)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {hoveredId && !selectedItem && (() => {
          const item = layout.find(l => l.node.id === hoveredId);
          if (!item) return null;
          const c    = nodeColor(item.node, item.depth);
          const { sx: px, sy: py } = screenPos(item.x, item.y);
          const prof = item.depth >= 2 ? getProficiency(item.node, item.depth) : null;
          const tier = prof ? getTier(prof) : null;
          const tierInfo = tier ? TIER[tier] : null;
          return (
            <motion.div key={hoveredId}
              initial={{ opacity: 0, scale: 0.88 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.88 }}
              transition={{ duration: 0.1 }}
              className="absolute z-30 pointer-events-none"
              style={{ left: Math.min(px + 26, size.w - 200), top: Math.max(py - 50, 8) }}>
              <div className="px-3 py-2.5 rounded-xl border text-xs font-medium"
                style={{ background: "rgba(4,4,18,0.95)", borderColor: c.orb + "60", color: "#e2e8f0", boxShadow: `0 0 20px ${c.orb}30`, backdropFilter: "blur(12px)", fontFamily: "Outfit, sans-serif", maxWidth: 180 }}>
                <div className="font-semibold text-white mb-0.5">{item.node.label}</div>
                {tierInfo && (
                  <div className="flex items-center gap-1" style={{ color: c.orb }}>
                    <span>{tierInfo.icon}</span>
                    <span>{tierInfo.text} · {Math.round(getProficiency(item.node, item.depth) * 100)}%</span>
                  </div>
                )}
                <div className="mt-1 opacity-40 text-[10px]">Click for action plan</div>
              </div>
            </motion.div>
          );
        })()}
      </AnimatePresence>

      {/* ── ZOOM CONTROLS (purple accent) ── */}
      <ZoomControls scale={scale} onZoomIn={zoomIn} onZoomOut={zoomOut} onReset={resetView} accent="#a78bfa" />

      {/* Legend */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-5 z-20" style={{ fontFamily: "Outfit" }}>
        {[
          { color: "#f87171", label: "Needs Improvement" },
          { color: "#fbbf24", label: "In Progress"       },
          { color: "#34d399", label: "Strong"            },
          { color: "#a78bfa", label: "Domain"            },
        ].map((l, i) => (
          <span key={i} className="flex items-center gap-1.5 text-[10px]" style={{ color: "rgba(255,255,255,0.35)" }}>
            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: l.color, boxShadow: `0 0 5px ${l.color}` }} />
            {l.label}
          </span>
        ))}
        <span className="text-[10px] opacity-30">· Scroll to zoom · Drag to pan</span>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// ZOOMABLE ROADMAP WRAPPER
// ─────────────────────────────────────────────────────────────────────────────
const ZoomableRoadmap = ({ children }) => {
  const containerRef = useRef(null);
  const [scale,     setScale]     = useState(1);
  const [offset,    setOffset]    = useState({ x: 0, y: 0 });
  const [dragging,  setDragging]  = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const zoomIn    = () => setScale(s => Math.min(2,   +(s + 0.15).toFixed(2)));
  const zoomOut   = () => setScale(s => Math.max(0.4, +(s - 0.15).toFixed(2)));
  const resetView = () => { setScale(1); setOffset({ x: 0, y: 0 }); };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const h = e => {
      e.preventDefault();
      setScale(s => Math.min(2, Math.max(0.4, +(s - e.deltaY * 0.001).toFixed(3))));
    };
    el.addEventListener("wheel", h, { passive: false });
    return () => el.removeEventListener("wheel", h);
  }, []);

  const onDown = e => {
    if (e.target.closest(".roadmap-card")) return;
    setDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };
  const onMove = e => { if (!dragging) return; setOffset({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y }); };
  const onUp   = () => setDragging(false);

  return (
    <div className="relative" style={{ minHeight: 600 }}>
      <div
        ref={containerRef}
        className="overflow-hidden rounded-3xl"
        style={{ minHeight: 600, cursor: dragging ? "grabbing" : "default" }}
        onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp}
      >
        <div style={{
          transform: `translate(${offset.x}px,${offset.y}px) scale(${scale})`,
          transformOrigin: "top left",
          willChange: "transform",
        }}>
          {children}
        </div>
      </div>
      {/* ── ZOOM CONTROLS (cyan accent) ── */}
      <ZoomControls scale={scale} onZoomIn={zoomIn} onZoomOut={zoomOut} onReset={resetView} accent="#38bdf8" />
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE  (all original logic preserved)
// ─────────────────────────────────────────────────────────────────────────────
const CareerMap = () => {
  const [activeTab, setActiveTab] = useState("mindmap");
  const [loading, setLoading]     = useState(false);
  const [mindMapData, setMindMapData] = useState(null);
  const [roadmapData, setRoadmapData] = useState(null);
  const [techInput, setTechInput] = useState("");
  const [expLevel,  setExpLevel]  = useState("beginner");

  const fetchMindMap = async () => {
    setLoading(true);
    try {
      const res = await getCVMindMap();
      if (res.data.success) setMindMapData(res.data.data);
      else toast.error(res.data.message || "Failed to generate mind map");
    } catch (e) { console.error(e); toast.error("Failed to fetch Mind Map."); }
    finally { setLoading(false); }
  };

  const handleGenerateRoadmap = async (e) => {
    e.preventDefault();
    if (!techInput.trim()) { toast.warning("Please enter a technology name"); return; }
    setLoading(true); setRoadmapData(null);
    try {
      const res = await generateTechRoadmap({ technology: techInput, experienceLevel: expLevel });
      if (res.data.success) setRoadmapData(res.data.data);
      else toast.error(res.data.message || "Failed to generate roadmap");
    } catch (e) { console.error(e); toast.error("Failed to generate roadmap."); }
    finally { setLoading(false); }
  };

  return (
    <div className="dashboard-page min-h-screen ">
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 80% 60% at 70% 20%,rgba(100,60,255,0.07) 0%,transparent 60%),radial-gradient(ellipse 60% 50% at 20% 80%,rgba(0,180,255,0.05) 0%,transparent 60%)" }} />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] pointer-events-none" />

      <div className="page-header mb-8 relative z-10">
        <h1 className="text-4xl font-black text-white flex items-center gap-3 tracking-tighter">
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(90deg,#fff,#aaa)" }}>Career</span>
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(90deg,#a78bfa,#38bdf8)" }}>ReadyNx</span>
        </h1>
        <p className="page-subtitle mt-2" style={{ color: "#94a3b8" }}>AI-Powered Neural Pathways ensuring your career growth.</p>
      </div>

      <div className="flex gap-4 mb-10 relative z-10">
        {[
          { id: "mindmap", icon: <GitBranch size={18} />, label: "Skill Constellation", active: "#a78bfa", glow: "rgba(167,139,250,0.3)" },
          { id: "roadmap", icon: <Map size={18} />,       label: "Tech Roadmap",         active: "#38bdf8", glow: "rgba(56,189,248,0.3)"  },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className="px-8 py-4 rounded-2xl font-bold transition-all flex items-center gap-3 border"
            style={activeTab === tab.id
              ? { background: tab.active + "18", borderColor: tab.active, color: "#fff", boxShadow: `0 0 20px ${tab.glow}` }
              : { background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.06)", color: "#64748b" }}>
            <span style={activeTab === tab.id ? { color: tab.active } : {}}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="relative z-10 min-h-[600px]">
        {loading && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center rounded-3xl border border-white/10"
            style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(16px)" }}>
            <div className="relative w-20 h-20 mb-6">
              {[0,1,2].map(i => (
                <div key={i} className="absolute inset-0 rounded-full border-2 animate-ping"
                  style={{ borderColor: "#a78bfa", animationDelay: `${i*0.3}s`, animationDuration: "1.4s", opacity: 0.35 - i*0.08 }} />
              ))}
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin" style={{ color: "#a78bfa" }} />
              </div>
            </div>
            <span className="font-medium tracking-widest uppercase text-xs animate-pulse"
              style={{ color: "#a78bfa", fontFamily: "Outfit" }}>Mapping Neural Pathways…</span>
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* ── MIND MAP TAB ── */}
          {activeTab === "mindmap" && (
            <motion.div key="mindmap" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.4 }}>
              {!mindMapData ? (
                <div className="rounded-3xl p-16 text-center relative overflow-hidden"
                  style={{ background: "linear-gradient(135deg,#0d0a1f,#0c1220)", border: "1px solid rgba(167,139,250,0.2)" }}>
                  <style>{`@keyframes orbitSpin{from{transform:translate(-50%,-50%) rotate(0deg)}to{transform:translate(-50%,-50%) rotate(360deg)}}`}</style>
                  {[110,195,275].map((r, i) => (
                    <div key={i} className="absolute rounded-full border pointer-events-none"
                      style={{ width:r*2, height:r*2, left:"50%", top:"50%", borderColor:"rgba(167,139,250,0.1)", animation:`orbitSpin ${14+i*9}s linear infinite ${i%2?"reverse":""}` }} />
                  ))}
                  <div className="relative z-10">
                    <div className="w-28 h-28 rounded-full flex items-center justify-center mx-auto mb-8"
                      style={{ background:"rgba(167,139,250,0.1)", border:"1px solid rgba(167,139,250,0.3)", boxShadow:"0 0 60px rgba(167,139,250,0.2)" }}>
                      <GitBranch className="w-14 h-14" style={{ color:"#a78bfa" }} />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">Your Skill Constellation</h2>
                    <p className="mb-4 max-w-xl mx-auto text-lg leading-relaxed" style={{ color:"#64748b" }}>
                      See exactly which skills you need to improve, which are progressing, and which are mastered — all in one interactive star map.
                    </p>
                    <div className="flex items-center justify-center gap-6 mb-10">
                      {[{ c:"#f87171",l:"Needs Work"},{ c:"#fbbf24",l:"In Progress"},{ c:"#34d399",l:"Strong"}].map((item,i)=>(
                        <span key={i} className="flex items-center gap-2 text-sm" style={{ color:"#64748b" }}>
                          <span className="w-3 h-3 rounded-full" style={{ background:item.c, boxShadow:`0 0 8px ${item.c}` }} />{item.l}
                        </span>
                      ))}
                    </div>
                    <motion.button whileHover={{ scale:1.05, boxShadow:"0 0 40px rgba(167,139,250,0.7)" }} whileTap={{ scale:0.97 }}
                      onClick={fetchMindMap} disabled={loading}
                      className="px-10 py-4 text-white font-bold rounded-xl flex items-center gap-3 mx-auto"
                      style={{ background:"linear-gradient(135deg,#a78bfa,#7c3aed)", boxShadow:"0 0 24px rgba(167,139,250,0.45)" }}>
                      <Sparkles size={20} /> Generate My Skill Map
                    </motion.button>
                  </div>
                </div>
              ) : (
                <div className="rounded-3xl overflow-hidden relative flex flex-col"
                  style={{ height:680, background:"#04040e", border:"1px solid rgba(255,255,255,0.07)" }}>
                  <div className="relative flex justify-between items-center px-6 py-4 flex-shrink-0 z-20"
                    style={{ background:"linear-gradient(to bottom,rgba(0,0,0,0.85),transparent)" }}>
                    <h3 className="text-xl font-bold text-white flex items-center gap-3" style={{ fontFamily:"Outfit" }}>
                      <span className="p-2 rounded-lg" style={{ background:"rgba(167,139,250,0.14)", border:"1px solid rgba(167,139,250,0.35)" }}>
                        <GitBranch size={18} style={{ color:"#a78bfa" }} />
                      </span>
                      {mindMapData.title}
                    </h3>
                    <button onClick={fetchMindMap}
                      className="text-sm flex items-center gap-2 px-4 py-2 rounded-lg transition-all"
                      style={{ color:"#64748b", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.06)" }}>
                      <Sparkles size={14} /> Regenerate
                    </button>
                  </div>
                  <div className="flex-1 min-h-0">
                    <ConstellationMap data={mindMapData} />
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* ── ROADMAP TAB ── */}
          {activeTab === "roadmap" && (
            <motion.div key="roadmap" initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
              exit={{ opacity:0, y:-20 }} transition={{ duration:0.5 }} className="grid lg:grid-cols-3 gap-8">

              <div className="lg:col-span-1">
                <div className="rounded-3xl p-8 sticky top-8 shadow-2xl"
                  style={{ background:"#0f121d", border:"1px solid rgba(255,255,255,0.08)" }}>
                  <h2 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
                    <span className="p-2 rounded-lg" style={{ background:"rgba(56,189,248,0.1)", color:"#38bdf8" }}><Search size={20}/></span>
                    Initialize Roadmap
                  </h2>
                  <form onSubmit={handleGenerateRoadmap} className="space-y-6">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest mb-3" style={{ color:"#475569" }}>Target Technology</label>
                      <input type="text" value={techInput} onChange={e=>setTechInput(e.target.value)} placeholder="e.g. React"
                        className="w-full rounded-xl px-5 py-4 text-white transition-all font-medium placeholder-gray-600 focus:outline-none"
                        style={{ background:"rgba(0,0,0,0.4)", border:"1px solid rgba(255,255,255,0.1)" }}
                        onFocus={e=>(e.target.style.borderColor="#38bdf8")} onBlur={e=>(e.target.style.borderColor="rgba(255,255,255,0.1)")} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest mb-3" style={{ color:"#475569" }}>Current Proficiency</label>
                      <div className="relative">
                        <select value={expLevel} onChange={e=>setExpLevel(e.target.value)}
                          className="w-full rounded-xl px-5 py-4 text-white transition-all appearance-none cursor-pointer focus:outline-none"
                          style={{ background:"rgba(0,0,0,0.4)", border:"1px solid rgba(255,255,255,0.1)" }}>
                          <option value="beginner">Beginner Assessment</option>
                          <option value="intermediate">Intermediate Proficiency</option>
                          <option value="advanced">Advanced Mastery</option>
                        </select>
                        <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none" size={16} style={{ color:"#475569" }} />
                      </div>
                    </div>
                    <button type="submit" disabled={loading}
                      className="w-full py-4 font-bold rounded-xl transition-all flex items-center justify-center gap-2 mt-4"
                      style={{ background:"#38bdf8", color:"#0f172a", boxShadow:"0 0 20px rgba(56,189,248,0.3)" }}>
                      <Zap size={20}/> Compute Path
                    </button>
                  </form>
                  <div className="mt-10 pt-8" style={{ borderTop:"1px solid rgba(255,255,255,0.05)" }}>
                    <h4 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color:"#475569" }}>Trending Modules</h4>
                    <div className="flex flex-wrap gap-2">
                      {["React","Node.js","Python","AWS","Go"].map(tech=>(
                        <button key={tech} onClick={()=>setTechInput(tech)}
                          className="px-4 py-2 rounded-lg text-xs font-medium transition-all"
                          style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.06)", color:"#64748b" }}
                          onMouseEnter={e=>{e.target.style.background="rgba(56,189,248,0.15)";e.target.style.color="#38bdf8";e.target.style.borderColor="rgba(56,189,248,0.3)";}}
                          onMouseLeave={e=>{e.target.style.background="rgba(255,255,255,0.04)";e.target.style.color="#64748b";e.target.style.borderColor="rgba(255,255,255,0.06)";}}>
                          {tech}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2">
                {roadmapData ? (
                  <ZoomableRoadmap>
                    <div className="rounded-3xl p-10 min-h-[600px] relative overflow-hidden flex flex-col"
                      style={{ background:"#0f121d", border:"1px solid rgba(255,255,255,0.08)" }}>
                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-12">
                          <div>
                            <span className="text-sm font-bold tracking-widest uppercase mb-2 block" style={{ color:"#38bdf8" }}>Generated Path</span>
                            <h2 className="text-4xl font-bold text-white capitalize">{roadmapData.technology}</h2>
                          </div>
                          <div className="w-16 h-16 rounded-full flex items-center justify-center"
                            style={{ background:"rgba(56,189,248,0.1)", border:"1px solid rgba(56,189,248,0.3)", boxShadow:"0 0 20px rgba(56,189,248,0.2)" }}>
                            <Map style={{ color:"#38bdf8" }} size={32}/>
                          </div>
                        </div>
                        <div className="space-y-12 relative pl-4">
                          <div className="absolute left-8 top-4 bottom-4 w-0.5 hidden md:block"
                            style={{ background:"linear-gradient(to bottom,#38bdf8,rgba(56,189,248,0.2),transparent)" }}/>
                          {roadmapData.phases.map((phase, index) => (
                            <motion.div initial={{ opacity:0,x:20 }} animate={{ opacity:1,x:0 }} transition={{ delay:index*0.2 }}
                              key={index} className="relative pl-0 md:pl-24">
                              <div className="absolute left-[26px] top-8 w-4 h-4 rounded-full hidden md:flex items-center justify-center z-10"
                                style={{ background:"#0f172a", border:"2px solid #38bdf8", boxShadow:"0 0 15px #38bdf8" }}>
                                <div className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] animate-pulse"/>
                              </div>
                              <div className="roadmap-card rounded-2xl p-8 relative overflow-hidden transition-all duration-300"
                                style={{ background:"rgba(0,0,0,0.4)", border:"1px solid rgba(255,255,255,0.05)" }}
                                onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(56,189,248,0.4)";e.currentTarget.style.transform="translateX(8px)";}}
                                onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,0.05)";e.currentTarget.style.transform="translateX(0)";}}>
                                <div className="flex justify-between items-start mb-6">
                                  <h3 className="text-2xl font-bold text-white">{phase.phase}</h3>
                                  <div className="flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-lg"
                                    style={{ color:"#38bdf8", background:"rgba(56,189,248,0.1)", border:"1px solid rgba(56,189,248,0.2)" }}>
                                    <Clock size={14}/> {phase.duration}
                                  </div>
                                </div>
                                <div className="mb-6">
                                  <h4 className="text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2" style={{ color:"#475569" }}>
                                    <Layers size={14}/> Core Modules
                                  </h4>
                                  <div className="flex flex-wrap gap-3">
                                    {phase.topics.map((topic,i)=>(
                                      <span key={i} className="text-sm px-4 py-2 rounded-lg"
                                        style={{ color:"#cbd5e1", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)" }}>
                                        {topic}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                                <div>
                                  <h4 className="text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2" style={{ color:"#475569" }}>
                                    <BookOpen size={14}/> Data Sources
                                  </h4>
                                  <div className="grid gap-3">
                                    {phase.resources.map((res,i)=>(
                                      <a key={i} href="#" className="flex items-center gap-3 p-3 rounded-xl transition-all"
                                        style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.05)", color:"#64748b" }}
                                        onMouseEnter={e=>(e.currentTarget.style.color="#38bdf8")}
                                        onMouseLeave={e=>(e.currentTarget.style.color="#64748b")}>
                                        <div className="p-2 rounded-lg" style={{ background:"rgba(0,0,0,0.5)", color:"#38bdf8" }}>
                                          <ExternalLink size={14}/>
                                        </div>
                                        <span className="text-sm font-medium truncate flex-1">{res}</span>
                                      </a>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </ZoomableRoadmap>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center p-12 rounded-3xl border-dashed text-center relative overflow-hidden"
                    style={{ background:"#0f121d", border:"1px dashed rgba(255,255,255,0.07)", color:"#475569", minHeight:600 }}>
                    <div className="w-24 h-24 rounded-full flex items-center justify-center mb-6 animate-pulse"
                      style={{ background:"rgba(255,255,255,0.03)" }}>
                      <Map className="w-10 h-10 opacity-20"/>
                    </div>
                    <h3 className="text-xl font-bold mb-2" style={{ color:"#334155" }}>Awaiting Parameters</h3>
                    <p className="text-sm">Initiate the sequence to visualize your learning trajectory.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CareerMap;