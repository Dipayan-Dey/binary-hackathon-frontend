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

class Particle {
  constructor(x1, y1, x2, y2, color) {
    this.x1 = x1; this.y1 = y1; this.x2 = x2; this.y2 = y2;
    this.color = color; this.t = Math.random();
    this.speed = 0.0018 + Math.random() * 0.0025;
    this.size  = 1.8 + Math.random() * 1.8;
  }
  update() { this.t = (this.t + this.speed) % 1; }
  draw(ctx, ox, oy) {
    const x = ox + this.x1 + (this.x2 - this.x1) * this.t;
    const y = oy + this.y1 + (this.y2 - this.y1) * this.t;
    ctx.beginPath(); ctx.arc(x, y, this.size, 0, TAU);
    ctx.fillStyle = this.color;
    ctx.globalAlpha = 0.9 * (1 - Math.abs(this.t - 0.5) * 1.7);
    ctx.fill(); ctx.globalAlpha = 1;
  }
}

// ─── DETAIL PANEL ────────────────────────────────────────────────────────────
const DetailPanel = ({ item, onClose, isMobile }) => {
  if (!item) return null;
  const { node, depth } = item;
  const proficiency = getProficiency(node, depth);
  const tier = depth <= 1 ? null : getTier(proficiency);
  const tierInfo = tier ? TIER[tier] : null;
  const pct = Math.round(proficiency * 100);

  const tips = {
    weak:     ["Dedicate 30–60 min daily to this skill", "Follow a structured beginner course", "Build 1–2 small projects applying it"],
    moderate: ["Review advanced patterns and edge cases", "Contribute to open source using this skill", "Practice mock interviews / code challenges"],
    strong:   ["Mentor others to deepen mastery", "Explore adjacent advanced topics", "Document your expertise in a portfolio"],
  };

  const inner = (
    <div className={isMobile ? "rounded-t-2xl p-4" : "rounded-2xl p-5"} style={{
      background: "rgba(6,6,24,0.98)",
      border: `1px solid ${tierInfo ? tierInfo.orb + "55" : "#a78bfa55"}`,
      boxShadow: isMobile ? `0 -4px 40px ${tierInfo ? tierInfo.orb + "20" : "#a78bfa20"}` : `0 0 40px ${tierInfo ? tierInfo.orb + "20" : "#a78bfa20"}`,
      backdropFilter: "blur(20px)",
    }}>
      <button onClick={onClose} className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center"
        style={{ color: "#64748b", background: "rgba(255,255,255,0.08)" }}>
        <X size={14} />
      </button>
      <div className="mb-4 pr-8">
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
            <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-2 rounded-full"
              style={{ background: `linear-gradient(90deg,${tierInfo.orb}88,${tierInfo.orb})`, boxShadow: `0 0 8px ${tierInfo.orb}80` }} />
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
      {node.children?.length > 0 && (
        <p className="mt-3 text-xs" style={{ color: "#334155" }}>
          {node.children.length} sub-skill{node.children.length > 1 ? "s" : ""} attached
        </p>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <motion.div initial={{ opacity: 0, y: 80 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 80 }}
        transition={{ duration: 0.25 }} className="absolute bottom-0 left-0 right-0 z-40 relative"
        style={{ fontFamily: "Outfit, sans-serif" }}>
        {inner}
      </motion.div>
    );
  }
  return (
    <motion.div initial={{ opacity: 0, x: 30, scale: 0.96 }} animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 30, scale: 0.96 }} transition={{ duration: 0.22 }}
      className="absolute top-4 right-4 z-40 w-72" style={{ fontFamily: "Outfit, sans-serif" }}>
      {inner}
    </motion.div>
  );
};

// ─── ZOOM CONTROLS ───────────────────────────────────────────────────────────
const ZoomControls = ({ scale, onZoomIn, onZoomOut, onReset, accent = "#a78bfa" }) => (
  <div className="absolute bottom-12 right-2 z-30 flex flex-col items-center gap-1.5">
    {[{ icon: <Plus size={13}/>, fn: onZoomIn, title: "Zoom In" },
      { icon: <Minus size={13}/>, fn: onZoomOut, title: "Zoom Out" },
      { icon: <RotateCcw size={12}/>, fn: onReset, title: "Reset" }
    ].map((b, i) => (
      <motion.button key={i} title={b.title} onClick={b.fn} whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.88 }}
        className="w-8 h-8 rounded-xl flex items-center justify-center"
        style={{ background: `${accent}12`, border: `1px solid ${accent}35`, color: accent, boxShadow: `0 0 10px ${accent}15` }}>
        {b.icon}
      </motion.button>
    ))}
    <div className="text-[9px] font-mono mt-0.5" style={{ color: `${accent}55` }}>{Math.round(scale * 100)}%</div>
  </div>
);

// ─── CONSTELLATION MAP ───────────────────────────────────────────────────────
const ConstellationMap = ({ data }) => {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const particlesRef = useRef([]);
  const containerRef = useRef(null);
  const frameRef = useRef(0);
  const touchStartRef = useRef(null);

  const [hoveredId, setHoveredId] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [collapsed, setCollapsed] = useState({});
  const [size, setSize] = useState({ w: 400, h: 400 });
  const [isMobile, setIsMobile] = useState(false);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const zoomIn  = () => setScale(s => Math.min(3, +(s + 0.15).toFixed(2)));
  const zoomOut = () => setScale(s => Math.max(0.25, +(s - 0.15).toFixed(2)));
  const resetView = () => { setScale(1); setOffset({ x: 0, y: 0 }); };

  useEffect(() => {
    const obs = new ResizeObserver(([e]) => {
      const w = Math.floor(e.contentRect.width);
      const h = Math.floor(e.contentRect.height);
      setSize({ w, h }); setIsMobile(w < 640);
    });
    if (containerRef.current) obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  const cx = size.w / 2, cy = size.h / 2;
  const R = Math.min(size.w, size.h) * (isMobile ? 0.2 : 0.285);

  const filterCollapsed = node => {
    if (collapsed[node.id]) return { ...node, children: [] };
    if (!node.children) return node;
    return { ...node, children: node.children.map(filterCollapsed) };
  };

  const root = useMemo(() => filterCollapsed(data.nodes[0]), [collapsed, data]);
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
    walk(root); return result;
  }, [layout, root]);

  useEffect(() => {
    const particles = [];
    edges.forEach(({ from, to }) => {
      const c = nodeColor(to.node, to.depth);
      for (let i = 0; i < 4; i++) particles.push(new Particle(from.x, from.y, to.x, to.y, c.orb));
    });
    particlesRef.current = particles;
  }, [edges]);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d");
    function loop() {
      frameRef.current++;
      canvas.width = size.w; canvas.height = size.h;
      ctx.clearRect(0, 0, size.w, size.h);
      ctx.save(); ctx.translate(cx + offset.x, cy + offset.y); ctx.scale(scale, scale);
      edges.forEach(({ from, to }) => {
        const c = nodeColor(to.node, to.depth);
        const isH = hoveredId === from.node.id || hoveredId === to.node.id;
        const grad = ctx.createLinearGradient(from.x, from.y, to.x, to.y);
        grad.addColorStop(0, nodeColor(from.node, from.depth).orb + (isH ? "50" : "18"));
        grad.addColorStop(1, c.orb + (isH ? "80" : "40"));
        ctx.beginPath(); ctx.moveTo(from.x, from.y); ctx.lineTo(to.x, to.y);
        ctx.strokeStyle = grad; ctx.lineWidth = isH ? 1.8 : 1; ctx.stroke();
      });
      particlesRef.current.forEach(p => { p.update(); p.draw(ctx, 0, 0); });
      layout.forEach(({ node, x, y, depth }) => {
        const c = nodeColor(node, depth);
        const r = depth === 0 ? 30 : depth === 1 ? 22 : 15;
        const pulse = 1 + 0.06 * Math.sin(frameRef.current * 0.033 + x * 0.012);
        const halo = ctx.createRadialGradient(x, y, 0, x, y, r * 3 * pulse);
        halo.addColorStop(0, c.orb + "22"); halo.addColorStop(1, "transparent");
        ctx.beginPath(); ctx.arc(x, y, r * 3 * pulse, 0, TAU); ctx.fillStyle = halo; ctx.fill();
      });
      ctx.restore(); animRef.current = requestAnimationFrame(loop);
    }
    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, [layout, edges, size, cx, cy, hoveredId, scale, offset]);

  useEffect(() => {
    const el = containerRef.current; if (!el) return;
    const h = e => { e.preventDefault(); setScale(s => Math.min(3, Math.max(0.25, +(s - e.deltaY * 0.001).toFixed(3)))); };
    el.addEventListener("wheel", h, { passive: false });
    return () => el.removeEventListener("wheel", h);
  }, []);

  const onDown = e => { if (e.target.closest(".cnode")) return; setDragging(true); setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y }); };
  const onMove = e => { if (!dragging) return; setOffset({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y }); };
  const onUp   = () => setDragging(false);
  const onTouchStart = e => { if (e.touches.length === 1) touchStartRef.current = { x: e.touches[0].clientX - offset.x, y: e.touches[0].clientY - offset.y }; };
  const onTouchMove  = e => { if (e.touches.length === 1 && touchStartRef.current) { e.preventDefault(); setOffset({ x: e.touches[0].clientX - touchStartRef.current.x, y: e.touches[0].clientY - touchStartRef.current.y }); } };
  const onTouchEnd   = () => { touchStartRef.current = null; };

  const orbR = d => d === 0 ? (isMobile ? 20 : 30) : d === 1 ? (isMobile ? 15 : 21) : (isMobile ? 10 : 14);
  const screenPos = (x, y) => ({ sx: cx + offset.x + x * scale, sy: cy + offset.y + y * scale });

  const skillNodes  = layout.filter(l => l.depth >= 2);
  const weakCount   = skillNodes.filter(l => getTier(getProficiency(l.node, l.depth)) === "weak").length;
  const modCount    = skillNodes.filter(l => getTier(getProficiency(l.node, l.depth)) === "moderate").length;
  const strongCount = skillNodes.filter(l => getTier(getProficiency(l.node, l.depth)) === "strong").length;

  return (
    <div ref={containerRef} className="relative w-full h-full select-none"
      style={{ cursor: dragging ? "grabbing" : "grab", touchAction: "none" }}
      onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp}
      onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>

      <div className="absolute inset-0 pointer-events-none z-10"
        style={{ background: "repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.04) 3px,rgba(0,0,0,0.04) 4px)" }} />

      {/* Stats */}
      <div className="absolute top-2 left-2 z-30 flex gap-1 flex-wrap" style={{ fontFamily: "Outfit" }}>
        {[
          { count: weakCount,   color: "#f87171", bg: "rgba(248,113,113,0.1)", border: "rgba(248,113,113,0.3)", label: "Improve"  },
          { count: modCount,    color: "#fbbf24", bg: "rgba(251,191,36,0.1)",  border: "rgba(251,191,36,0.3)",  label: "Progress" },
          { count: strongCount, color: "#34d399", bg: "rgba(52,211,153,0.1)",  border: "rgba(52,211,153,0.3)",  label: "Strong"   },
        ].map((s, i) => (
          <div key={i} className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold"
            style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.color }}>
            <span className="font-bold">{s.count}</span><span className="opacity-75">{s.label}</span>
          </div>
        ))}
      </div>

      <canvas ref={canvasRef} width={size.w} height={size.h} className="absolute inset-0" style={{ mixBlendMode: "screen" }} />

      <svg width={size.w} height={size.h} className="absolute inset-0" style={{ overflow: "visible" }}>
        <defs>
          {["root","branch","strong","moderate","weak"].map((id, i) => {
            const c = [ROOT_COL, BRANCH_COL, TIER.strong, TIER.moderate, TIER.weak][i];
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
          <filter id="txtF"><feDropShadow dx="0" dy="0" stdDeviation="3.5" floodColor="#000" floodOpacity="1" /></filter>
          <filter id="weakGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="5" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {layout.map(({ node, x, y, depth }) => {
          const c = nodeColor(node, depth);
          const r = orbR(depth) * scale;
          const isHov = hoveredId === node.id;
          const isSel = selectedItem?.node.id === node.id;
          const hasKids = node.children && node.children.length > 0;
          const isCol = collapsed[node.id];
          const { sx: px, sy: py } = screenPos(x, y);
          const sc = isHov || isSel ? 1.3 : 1;
          const above = py > cy + offset.y + 20;
          const prof = depth >= 2 ? getProficiency(node, depth) : null;
          const tier = prof ? getTier(prof) : null;
          const gradId = depth === 0 ? "og_root" : depth === 1 ? "og_branch" : `og_${tier}`;
          const fs = (depth === 0 ? (isMobile ? 9 : 13) : depth === 1 ? (isMobile ? 8 : 11.5) : (isMobile ? 7 : 10)) * scale;

          return (
            <g key={node.id} className="cnode" transform={`translate(${px},${py})`} style={{ cursor: "pointer" }}
              onMouseEnter={() => setHoveredId(node.id)} onMouseLeave={() => setHoveredId(null)}
              onClick={e => { e.stopPropagation(); setSelectedItem(selectedItem?.node.id === node.id ? null : { node, depth }); if (hasKids && depth > 0) setCollapsed(p => ({ ...p, [node.id]: !p[node.id] })); }}>
              {depth >= 2 && prof !== null && (() => {
                const arcR = r * sc + 8 * scale, arcLen = TAU * arcR, filled = arcLen * prof;
                return <circle r={arcR} fill="none" stroke={c.orb} strokeWidth={2.5}
                  strokeDasharray={`${filled} ${arcLen - filled}`} strokeDashoffset={arcLen * 0.25}
                  strokeLinecap="round" strokeOpacity={isHov || isSel ? 0.9 : 0.55} transform="rotate(-90)" />;
              })()}
              {isSel && <circle r={r * sc + 14 * scale} fill="none" stroke={c.ring} strokeWidth={1.5} strokeOpacity={0.5} strokeDasharray="4 3" />}
              <circle r={r * sc + 5 * scale} fill="none" stroke={c.ring} strokeWidth={isHov ? 1.5 : 0.7} strokeOpacity={isHov ? 0.75 : 0.2} style={{ transition: "all 0.2s" }} />
              <circle r={r * sc} fill={`url(#${gradId})`} filter={tier === "weak" ? "url(#weakGlow)" : "url(#orbF)"} style={{ transition: "r 0.2s" }} />
              {hasKids && isCol && <text x={0} y={4} textAnchor="middle" fill="#fff" fontSize={9 * scale} fontWeight="700" style={{ pointerEvents: "none" }}>+</text>}
              <text x={0} y={above ? -(r * sc + 8 * scale) : r * sc + 14 * scale}
                textAnchor="middle" fill={c.label} fontSize={fs}
                fontWeight={depth === 0 ? 700 : depth === 1 ? 600 : 500}
                fontFamily="Outfit, sans-serif" filter="url(#txtF)" style={{ pointerEvents: "none" }}>
                {node.label.length > (isMobile ? 12 : 22) ? node.label.slice(0, isMobile ? 10 : 20) + "…" : node.label}
              </text>
              {depth >= 2 && prof !== null && (isHov || isSel) && (
                <text x={0} y={4} textAnchor="middle" fill="#fff" fontSize={(depth === 2 ? 9 : 8) * scale} fontWeight="700" style={{ pointerEvents: "none" }}>
                  {Math.round(prof * 100)}%
                </text>
              )}
            </g>
          );
        })}
      </svg>

      <AnimatePresence>
        {selectedItem && <DetailPanel key={selectedItem.node.id} item={selectedItem} onClose={() => setSelectedItem(null)} isMobile={isMobile} />}
      </AnimatePresence>

      <AnimatePresence>
        {hoveredId && !selectedItem && !isMobile && (() => {
          const item = layout.find(l => l.node.id === hoveredId); if (!item) return null;
          const c = nodeColor(item.node, item.depth);
          const { sx: px, sy: py } = screenPos(item.x, item.y);
          const prof = item.depth >= 2 ? getProficiency(item.node, item.depth) : null;
          const tier = prof ? getTier(prof) : null;
          const tierInfo = tier ? TIER[tier] : null;
          return (
            <motion.div key={hoveredId} initial={{ opacity: 0, scale: 0.88 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.88 }}
              transition={{ duration: 0.1 }} className="absolute z-30 pointer-events-none"
              style={{ left: Math.min(px + 26, size.w - 200), top: Math.max(py - 50, 8) }}>
              <div className="px-3 py-2.5 rounded-xl border text-xs font-medium"
                style={{ background: "rgba(4,4,18,0.95)", borderColor: c.orb + "60", color: "#e2e8f0", boxShadow: `0 0 20px ${c.orb}30`, backdropFilter: "blur(12px)", fontFamily: "Outfit, sans-serif", maxWidth: 180 }}>
                <div className="font-semibold text-white mb-0.5">{item.node.label}</div>
                {tierInfo && <div className="flex items-center gap-1" style={{ color: c.orb }}><span>{tierInfo.icon}</span><span>{tierInfo.text} · {Math.round(getProficiency(item.node, item.depth) * 100)}%</span></div>}
                <div className="mt-1 opacity-40 text-[10px]">Click for action plan</div>
              </div>
            </motion.div>
          );
        })()}
      </AnimatePresence>

      <ZoomControls scale={scale} onZoomIn={zoomIn} onZoomOut={zoomOut} onReset={resetView} accent="#a78bfa" />

      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex flex-wrap justify-center gap-2 z-20 px-2" style={{ fontFamily: "Outfit" }}>
        {[{ color: "#f87171", label: "Needs Improvement" }, { color: "#fbbf24", label: "In Progress" }, { color: "#34d399", label: "Strong" }, { color: "#a78bfa", label: "Domain" }]
          .map((l, i) => (
            <span key={i} className="flex items-center gap-1 text-[9px]" style={{ color: "rgba(255,255,255,0.35)" }}>
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: l.color, boxShadow: `0 0 5px ${l.color}` }} />{l.label}
            </span>
          ))}
      </div>
    </div>
  );
};

// ─── ZOOMABLE ROADMAP ────────────────────────────────────────────────────────
const ZoomableRoadmap = ({ children }) => {
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const zoomIn  = () => setScale(s => Math.min(2, +(s + 0.15).toFixed(2)));
  const zoomOut = () => setScale(s => Math.max(0.4, +(s - 0.15).toFixed(2)));
  const resetView = () => { setScale(1); setOffset({ x: 0, y: 0 }); };

  useEffect(() => {
    const el = containerRef.current; if (!el) return;
    const h = e => { e.preventDefault(); setScale(s => Math.min(2, Math.max(0.4, +(s - e.deltaY * 0.001).toFixed(3)))); };
    el.addEventListener("wheel", h, { passive: false }); return () => el.removeEventListener("wheel", h);
  }, []);

  const onDown = e => { if (e.target.closest(".roadmap-card")) return; setDragging(true); setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y }); };
  const onMove = e => { if (!dragging) return; setOffset({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y }); };
  const onUp   = () => setDragging(false);

  return (
    <div className="relative" style={{ minHeight: 400 }}>
      <div ref={containerRef} className="overflow-hidden rounded-2xl" style={{ minHeight: 400, cursor: dragging ? "grabbing" : "default" }}
        onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp}>
        <div style={{ transform: `translate(${offset.x}px,${offset.y}px) scale(${scale})`, transformOrigin: "top left", willChange: "transform" }}>
          {children}
        </div>
      </div>
      <ZoomControls scale={scale} onZoomIn={zoomIn} onZoomOut={zoomOut} onReset={resetView} accent="#38bdf8" />
    </div>
  );
};

// ─── MAIN PAGE ───────────────────────────────────────────────────────────────
const CareerMap = () => {
  const [activeTab,   setActiveTab]   = useState("mindmap");
  const [loading,     setLoading]     = useState(false);
  const [mindMapData, setMindMapData] = useState(null);
  const [roadmapData, setRoadmapData] = useState(null);
  const [techInput,   setTechInput]   = useState("");
  const [expLevel,    setExpLevel]    = useState("beginner");

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
    <div className="dashboard-page w-full min-h-screen overflow-x-hidden" style={{ margin: 0, padding: 0 }}>
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 80% 60% at 70% 20%,rgba(100,60,255,0.07) 0%,transparent 60%),radial-gradient(ellipse 60% 50% at 20% 80%,rgba(0,180,255,0.05) 0%,transparent 60%)" }} />
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{ backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')" }} />

      {/* ── HEADER: padded ── */}
      <div className="relative z-10 px-4 pt-5 sm:px-8 sm:pt-8">
        <h1 className="text-2xl sm:text-4xl font-black text-white flex items-center gap-2 tracking-tighter">
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(90deg,#fff,#aaa)" }}>Career</span>
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(90deg,#a78bfa,#38bdf8)" }}>ReadyNx</span>
        </h1>
        <p className="mt-1 text-sm sm:text-base" style={{ color: "#94a3b8" }}>
          AI-Powered Neural Pathways ensuring your career growth.
        </p>
      </div>

      {/* ── TABS: flush / no side gap on mobile ── */}
      <div className="relative z-10 flex mt-5 sm:mt-6 sm:px-8 sm:gap-3">
        {[
          { id: "mindmap", icon: <GitBranch size={16} />, label: "Skill Constellation", active: "#a78bfa", glow: "rgba(167,139,250,0.3)" },
          { id: "roadmap", icon: <Map size={16} />,       label: "Tech Roadmap",         active: "#38bdf8", glow: "rgba(56,189,248,0.3)"  },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 py-3 sm:py-3 sm:px-7 font-bold text-sm transition-all"
            style={activeTab === tab.id
              ? { borderBottom: `2px solid ${tab.active}`, color: "#fff", background: `${tab.active}10` }
              : { borderBottom: "2px solid rgba(255,255,255,0.07)", color: "#64748b", background: "transparent" }
            }>
            <span style={activeTab === tab.id ? { color: tab.active } : {}}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── CONTENT ── */}
      <div className="relative z-10 mt-4 pb-8 px-4 sm:px-8">
        {loading && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center"
            style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(16px)" }}>
            <div className="relative w-16 h-16 mb-4">
              {[0,1,2].map(i => (
                <div key={i} className="absolute inset-0 rounded-full border-2 animate-ping"
                  style={{ borderColor: "#a78bfa", animationDelay: `${i*0.3}s`, animationDuration: "1.4s", opacity: 0.35 - i*0.08 }} />
              ))}
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="w-7 h-7 animate-spin" style={{ color: "#a78bfa" }} />
              </div>
            </div>
            <span className="font-medium tracking-widest uppercase text-xs animate-pulse" style={{ color: "#a78bfa", fontFamily: "Outfit" }}>
              Mapping Neural Pathways…
            </span>
          </div>
        )}

        <AnimatePresence mode="wait">

          {/* ── MIND MAP ── */}
          {activeTab === "mindmap" && (
            <motion.div key="mindmap" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.4 }}>
              {!mindMapData ? (
                <div className="text-center relative overflow-hidden rounded-2xl sm:rounded-3xl py-12 px-6 sm:px-16"
                  style={{ background: "linear-gradient(135deg,#0d0a1f,#0c1220)", border: "1px solid rgba(167,139,250,0.2)" }}>
                  <style>{`@keyframes orbitSpin{from{transform:translate(-50%,-50%) rotate(0deg)}to{transform:translate(-50%,-50%) rotate(360deg)}}`}</style>
                  {[80,145,205].map((r, i) => (
                    <div key={i} className="absolute rounded-full border pointer-events-none"
                      style={{ width:r*2, height:r*2, left:"50%", top:"50%", borderColor:"rgba(167,139,250,0.1)", animation:`orbitSpin ${14+i*9}s linear infinite ${i%2?"reverse":""}` }} />
                  ))}
                  <div className="relative z-10">
                    <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full flex items-center justify-center mx-auto mb-6"
                      style={{ background:"rgba(167,139,250,0.1)", border:"1px solid rgba(167,139,250,0.3)", boxShadow:"0 0 60px rgba(167,139,250,0.2)" }}>
                      <GitBranch className="w-10 h-10 sm:w-14 sm:h-14" style={{ color:"#a78bfa" }} />
                    </div>
                    <h2 className="text-xl sm:text-3xl font-bold text-white mb-3 tracking-tight">Your Skill Constellation</h2>
                    <p className="mb-5 max-w-md mx-auto text-sm sm:text-base leading-relaxed" style={{ color:"#64748b" }}>
                      See exactly which skills need improvement, which are progressing, and which are mastered — in one interactive star map.
                    </p>
                    <div className="flex items-center justify-center gap-4 mb-8 flex-wrap">
                      {[{ c:"#f87171",l:"Needs Work"},{ c:"#fbbf24",l:"In Progress"},{ c:"#34d399",l:"Strong"}].map((item,i)=>(
                        <span key={i} className="flex items-center gap-2 text-xs sm:text-sm" style={{ color:"#64748b" }}>
                          <span className="w-2.5 h-2.5 rounded-full" style={{ background:item.c, boxShadow:`0 0 8px ${item.c}` }} />{item.l}
                        </span>
                      ))}
                    </div>
                    <motion.button whileHover={{ scale:1.05 }} whileTap={{ scale:0.97 }}
                      onClick={fetchMindMap} disabled={loading}
                      className="px-8 py-3 text-white font-bold rounded-xl flex items-center gap-3 mx-auto text-sm sm:text-base"
                      style={{ background:"linear-gradient(135deg,#a78bfa,#7c3aed)", boxShadow:"0 0 24px rgba(167,139,250,0.45)" }}>
                      <Sparkles size={18} /> Generate My Skill Map
                    </motion.button>
                  </div>
                </div>
              ) : (
                <div className="relative flex flex-col overflow-hidden rounded-2xl sm:rounded-3xl"
                  style={{ height: "calc(100dvh - 210px)", minHeight: 420, maxHeight: 740, background: "#04040e", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <div className="relative flex justify-between items-center px-4 py-3 flex-shrink-0 z-20"
                    style={{ background:"linear-gradient(to bottom,rgba(0,0,0,0.85),transparent)" }}>
                    <h3 className="text-sm sm:text-xl font-bold text-white flex items-center gap-2" style={{ fontFamily:"Outfit" }}>
                      <span className="p-1.5 rounded-lg" style={{ background:"rgba(167,139,250,0.14)", border:"1px solid rgba(167,139,250,0.35)" }}>
                        <GitBranch size={15} style={{ color:"#a78bfa" }} />
                      </span>
                      <span className="truncate max-w-[160px] sm:max-w-none">{mindMapData.title}</span>
                    </h3>
                    <button onClick={fetchMindMap}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs shrink-0"
                      style={{ color:"#64748b", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.06)" }}>
                      <Sparkles size={11} />
                      <span className="hidden sm:inline">Regenerate</span><span className="sm:hidden">Redo</span>
                    </button>
                  </div>
                  <div className="flex-1 min-h-0"><ConstellationMap data={mindMapData} /></div>
                </div>
              )}
            </motion.div>
          )}

          {/* ── ROADMAP ── */}
          {activeTab === "roadmap" && (
            <motion.div key="roadmap" initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
              exit={{ opacity:0, y:-20 }} transition={{ duration:0.5 }}
              className="flex flex-col lg:grid lg:grid-cols-3 gap-4 sm:gap-8">

              <div className="lg:col-span-1">
                <div className="rounded-2xl p-4 sm:p-8 lg:sticky lg:top-8" style={{ background:"#0f121d", border:"1px solid rgba(255,255,255,0.08)" }}>
                  <h2 className="text-base sm:text-xl font-bold text-white mb-4 sm:mb-8 flex items-center gap-3">
                    <span className="p-1.5 rounded-lg" style={{ background:"rgba(56,189,248,0.1)", color:"#38bdf8" }}><Search size={16}/></span>
                    Initialize Roadmap
                  </h2>
                  <form onSubmit={handleGenerateRoadmap} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color:"#475569" }}>Target Technology</label>
                      <input type="text" value={techInput} onChange={e=>setTechInput(e.target.value)} placeholder="e.g. React"
                        className="w-full rounded-xl px-4 py-3 text-white font-medium placeholder-gray-600 focus:outline-none text-sm"
                        style={{ background:"rgba(0,0,0,0.4)", border:"1px solid rgba(255,255,255,0.1)" }}
                        onFocus={e=>(e.target.style.borderColor="#38bdf8")} onBlur={e=>(e.target.style.borderColor="rgba(255,255,255,0.1)")} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color:"#475569" }}>Current Proficiency</label>
                      <div className="relative">
                        <select value={expLevel} onChange={e=>setExpLevel(e.target.value)}
                          className="w-full rounded-xl px-4 py-3 text-white appearance-none cursor-pointer focus:outline-none text-sm"
                          style={{ background:"rgba(0,0,0,0.4)", border:"1px solid rgba(255,255,255,0.1)" }}>
                          <option value="beginner">Beginner Assessment</option>
                          <option value="intermediate">Intermediate Proficiency</option>
                          <option value="advanced">Advanced Mastery</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" size={15} style={{ color:"#475569" }} />
                      </div>
                    </div>
                    <button type="submit" disabled={loading}
                      className="w-full py-3 font-bold rounded-xl flex items-center justify-center gap-2 text-sm"
                      style={{ background:"#38bdf8", color:"#0f172a", boxShadow:"0 0 20px rgba(56,189,248,0.3)" }}>
                      <Zap size={16}/> Compute Path
                    </button>
                  </form>
                  <div className="mt-5 pt-5" style={{ borderTop:"1px solid rgba(255,255,255,0.05)" }}>
                    <h4 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color:"#475569" }}>Trending Modules</h4>
                    <div className="flex flex-wrap gap-2">
                      {["React","Node.js","Python","AWS","Go"].map(tech=>(
                        <button key={tech} onClick={()=>setTechInput(tech)}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
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
                    <div className="rounded-2xl p-4 sm:p-10 min-h-[400px] flex flex-col" style={{ background:"#0f121d", border:"1px solid rgba(255,255,255,0.08)" }}>
                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-6 sm:mb-10">
                          <div>
                            <span className="text-xs font-bold tracking-widest uppercase mb-1 block" style={{ color:"#38bdf8" }}>Generated Path</span>
                            <h2 className="text-xl sm:text-4xl font-bold text-white capitalize">{roadmapData.technology}</h2>
                          </div>
                          <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0"
                            style={{ background:"rgba(56,189,248,0.1)", border:"1px solid rgba(56,189,248,0.3)" }}>
                            <Map style={{ color:"#38bdf8" }} size={20}/>
                          </div>
                        </div>
                        <div className="space-y-5 sm:space-y-10 relative">
                          <div className="absolute left-8 top-4 bottom-4 w-0.5 hidden md:block"
                            style={{ background:"linear-gradient(to bottom,#38bdf8,rgba(56,189,248,0.2),transparent)" }}/>
                          {roadmapData.phases.map((phase, index) => (
                            <motion.div initial={{ opacity:0,x:20 }} animate={{ opacity:1,x:0 }} transition={{ delay:index*0.2 }}
                              key={index} className="relative md:pl-24">
                              <div className="absolute left-[26px] top-6 w-4 h-4 rounded-full hidden md:flex items-center justify-center z-10"
                                style={{ background:"#0f172a", border:"2px solid #38bdf8", boxShadow:"0 0 15px #38bdf8" }}>
                                <div className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] animate-pulse"/>
                              </div>
                              <div className="roadmap-card rounded-2xl p-4 sm:p-6 transition-all duration-300"
                                style={{ background:"rgba(0,0,0,0.4)", border:"1px solid rgba(255,255,255,0.05)" }}
                                onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(56,189,248,0.4)";}}
                                onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,0.05)";}}>
                                <div className="flex justify-between items-start mb-3 gap-2">
                                  <h3 className="text-base sm:text-xl font-bold text-white">{phase.phase}</h3>
                                  <div className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg shrink-0"
                                    style={{ color:"#38bdf8", background:"rgba(56,189,248,0.1)", border:"1px solid rgba(56,189,248,0.2)" }}>
                                    <Clock size={11}/> {phase.duration}
                                  </div>
                                </div>
                                <div className="mb-3">
                                  <h4 className="text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2" style={{ color:"#475569" }}>
                                    <Layers size={12}/> Core Modules
                                  </h4>
                                  <div className="flex flex-wrap gap-1.5">
                                    {phase.topics.map((topic,i)=>(
                                      <span key={i} className="text-xs px-2.5 py-1 rounded-lg"
                                        style={{ color:"#cbd5e1", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)" }}>
                                        {topic}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                                <div>
                                  <h4 className="text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2" style={{ color:"#475569" }}>
                                    <BookOpen size={12}/> Data Sources
                                  </h4>
                                  <div className="grid gap-1.5">
                                    {phase.resources.map((res,i)=>(
                                      <a key={i} href="#" className="flex items-center gap-2 p-2 rounded-xl transition-all"
                                        style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.05)", color:"#64748b" }}
                                        onMouseEnter={e=>(e.currentTarget.style.color="#38bdf8")}
                                        onMouseLeave={e=>(e.currentTarget.style.color="#64748b")}>
                                        <div className="p-1.5 rounded-lg shrink-0" style={{ background:"rgba(0,0,0,0.5)", color:"#38bdf8" }}>
                                          <ExternalLink size={11}/>
                                        </div>
                                        <span className="text-xs font-medium truncate flex-1">{res}</span>
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
                  <div className="flex flex-col items-center justify-center p-8 rounded-2xl text-center"
                    style={{ background:"#0f121d", border:"1px dashed rgba(255,255,255,0.07)", color:"#475569", minHeight:280 }}>
                    <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4 animate-pulse"
                      style={{ background:"rgba(255,255,255,0.03)" }}>
                      <Map className="w-7 h-7 opacity-20"/>
                    </div>
                    <h3 className="text-base font-bold mb-1" style={{ color:"#334155" }}>Awaiting Parameters</h3>
                    <p className="text-xs">Initiate the sequence to visualize your learning trajectory.</p>
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