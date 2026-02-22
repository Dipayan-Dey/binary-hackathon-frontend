import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import {
  Mic,
  Square,
  Volume2,
  RotateCcw,
  ArrowRight,
  Trophy,
  Trash2,
  History,
  PlusCircle,
  Star,
  CheckCircle,
  Clock,
  ChevronRight,
  Rocket,
  Play,
} from "lucide-react";
import {
  startInterview,
  submitInterviewAnswer,
  completeInterview,
  getInterviewHistory,
  deleteInterview,
} from "../api/userApi";
import LoadingScreen from "../components/LoadingScreen";
import RefreshButton from "../components/RefreshButton";
import "./styles/DashboardPages.css";

const LadyAvatar = ({ isTalking, isListening }) => {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const frameRef = useRef(0);
  const blinkCountRef = useRef(0);
  const nextBlinkRef = useRef(90);
  const mouthPhaseRef = useRef(0);
  const mouthStepRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = 320,
      H = 400;
    canvas.width = W;
    canvas.height = H;

    const draw = () => {
      frameRef.current += 1;
      const fr = frameRef.current;

      ctx.clearRect(0, 0, W, H);

      // ── Background ──
      const bg = ctx.createRadialGradient(
        W / 2,
        H * 0.45,
        20,
        W / 2,
        H * 0.45,
        250,
      );
      bg.addColorStop(0, "#1e1035");
      bg.addColorStop(0.7, "#100818");
      bg.addColorStop(1, "#080410");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // Talking glow halo
      if (isTalking) {
        const halo = ctx.createRadialGradient(W / 2, 175, 40, W / 2, 175, 170);
        halo.addColorStop(0, "rgba(0,217,255,0.07)");
        halo.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = halo;
        ctx.fillRect(0, 0, W, H);
      }

      // ── Shoulders / Blazer ──
      const shoulderGrad = ctx.createLinearGradient(
        W / 2 - 120,
        320,
        W / 2 + 120,
        400,
      );
      shoulderGrad.addColorStop(0, "#180930");
      shoulderGrad.addColorStop(0.5, "#28145a");
      shoulderGrad.addColorStop(1, "#180930");
      ctx.fillStyle = shoulderGrad;
      ctx.beginPath();
      ctx.moveTo(0, H);
      ctx.lineTo(W / 2 - 105, 320);
      ctx.bezierCurveTo(W / 2 - 65, 303, W / 2 - 28, 298, W / 2, 300);
      ctx.bezierCurveTo(W / 2 + 28, 298, W / 2 + 65, 303, W / 2 + 105, 320);
      ctx.lineTo(W, H);
      ctx.closePath();
      ctx.fill();

      // Blazer lapel detail
      ctx.strokeStyle = "rgba(0,217,255,0.25)";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.moveTo(W / 2 - 28, 308);
      ctx.lineTo(W / 2, 335);
      ctx.lineTo(W / 2 + 28, 308);
      ctx.stroke();

      // ── Neck ──
      const neckG = ctx.createLinearGradient(W / 2 - 16, 270, W / 2 + 16, 270);
      neckG.addColorStop(0, "#b86030");
      neckG.addColorStop(0.4, "#d48848");
      neckG.addColorStop(1, "#a85020");
      ctx.fillStyle = neckG;
      ctx.beginPath();
      ctx.moveTo(W / 2 - 16, 280);
      ctx.lineTo(W / 2 + 16, 280);
      ctx.lineTo(W / 2 + 12, 308);
      ctx.lineTo(W / 2 - 12, 308);
      ctx.closePath();
      ctx.fill();

      // ── Hair back layer ──
      const hairG = ctx.createRadialGradient(W / 2, 155, 8, W / 2, 155, 130);
      hairG.addColorStop(0, "#3a1500");
      hairG.addColorStop(0.7, "#180800");
      hairG.addColorStop(1, "#0c0400");
      ctx.fillStyle = hairG;

      // Left hair flow
      ctx.beginPath();
      ctx.moveTo(W / 2 - 78, 135);
      ctx.bezierCurveTo(W / 2 - 108, 160, W / 2 - 118, 230, W / 2 - 105, 285);
      ctx.bezierCurveTo(W / 2 - 90, 310, W / 2 - 72, 315, W / 2 - 62, 310);
      ctx.bezierCurveTo(W / 2 - 50, 285, W / 2 - 48, 255, W / 2 - 58, 220);
      ctx.bezierCurveTo(W / 2 - 68, 185, W / 2 - 66, 150, W / 2 - 62, 128);
      ctx.closePath();
      ctx.fill();

      // Right hair flow
      ctx.beginPath();
      ctx.moveTo(W / 2 + 78, 135);
      ctx.bezierCurveTo(W / 2 + 108, 160, W / 2 + 118, 230, W / 2 + 105, 285);
      ctx.bezierCurveTo(W / 2 + 90, 310, W / 2 + 72, 315, W / 2 + 62, 310);
      ctx.bezierCurveTo(W / 2 + 50, 285, W / 2 + 48, 255, W / 2 + 58, 220);
      ctx.bezierCurveTo(W / 2 + 68, 185, W / 2 + 66, 150, W / 2 + 62, 128);
      ctx.closePath();
      ctx.fill();

      // ── Face ──
      const faceG = ctx.createRadialGradient(
        W / 2 - 8,
        178,
        12,
        W / 2,
        188,
        85,
      );
      faceG.addColorStop(0, "#eebc78");
      faceG.addColorStop(0.5, "#d08858");
      faceG.addColorStop(1, "#b06838");
      ctx.fillStyle = faceG;
      ctx.beginPath();
      ctx.ellipse(W / 2, 188, 78, 96, 0, 0, Math.PI * 2);
      ctx.fill();

      // Face side shadow
      ctx.fillStyle = "rgba(110,50,15,0.13)";
      ctx.beginPath();
      ctx.ellipse(W / 2 - 52, 192, 22, 58, -0.15, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(W / 2 + 52, 192, 22, 58, 0.15, 0, Math.PI * 2);
      ctx.fill();

      // ── Hair front / top ──
      const hairFront = ctx.createLinearGradient(
        W / 2 - 75,
        75,
        W / 2 + 75,
        145,
      );
      hairFront.addColorStop(0, "#220a00");
      hairFront.addColorStop(0.5, "#441400");
      hairFront.addColorStop(1, "#180600");
      ctx.fillStyle = hairFront;
      ctx.beginPath();
      ctx.moveTo(W / 2 - 78, 152);
      ctx.bezierCurveTo(W / 2 - 88, 112, W / 2 - 72, 80, W / 2, 74);
      ctx.bezierCurveTo(W / 2 + 72, 80, W / 2 + 88, 112, W / 2 + 78, 152);
      ctx.bezierCurveTo(W / 2 + 55, 140, W / 2 + 25, 136, W / 2, 134);
      ctx.bezierCurveTo(W / 2 - 25, 136, W / 2 - 55, 140, W / 2 - 78, 152);
      ctx.closePath();
      ctx.fill();

      // Hair highlight
      ctx.strokeStyle = "rgba(90,35,0,0.35)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(W / 2 - 15, 82);
      ctx.bezierCurveTo(W / 2 - 35, 106, W / 2 - 58, 128, W / 2 - 78, 152);
      ctx.stroke();

      // ── Ears ──
      ctx.fillStyle = "#c07840";
      [W / 2 - 78, W / 2 + 78].forEach((ex) => {
        ctx.beginPath();
        ctx.ellipse(ex, 198, 9, 13, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "rgba(160,85,35,0.45)";
        ctx.beginPath();
        ctx.ellipse(ex, 198, 4.5, 7, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#c07840";
      });
      // Earrings
      ctx.fillStyle = "#ffd700";
      ctx.shadowColor = "#ffd700";
      ctx.shadowBlur = 5;
      [
        [W / 2 - 78, 210],
        [W / 2 + 78, 210],
      ].forEach(([ex, ey]) => {
        ctx.beginPath();
        ctx.arc(ex, ey, 4, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.shadowBlur = 0;

      // ── Eyebrows ──
      ctx.strokeStyle = "#280c00";
      ctx.lineWidth = 2.8;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(W / 2 - 44, 146);
      ctx.quadraticCurveTo(W / 2 - 24, 140, W / 2 - 8, 144);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(W / 2 + 8, 144);
      ctx.quadraticCurveTo(W / 2 + 24, 140, W / 2 + 44, 146);
      ctx.stroke();

      // ── Eyes with blink ──
      blinkCountRef.current++;
      if (blinkCountRef.current >= nextBlinkRef.current) {
        blinkCountRef.current = 0;
        nextBlinkRef.current = 85 + Math.random() * 130;
      }
      const blinkP = blinkCountRef.current;
      const isBlinking = blinkP < 7;
      const eyeSY = isBlinking ? Math.max(0.04, 1 - blinkP / 3.5) : 1;

      [-26, 26].forEach((xOff) => {
        const ex = W / 2 + xOff;
        const ey = 172;

        ctx.save();
        ctx.translate(ex, ey);
        ctx.scale(1, eyeSY);

        // White
        ctx.fillStyle = "#f4ede6";
        ctx.beginPath();
        ctx.ellipse(0, 0, 17, 11, 0, 0, Math.PI * 2);
        ctx.fill();

        // Iris
        const irisG = ctx.createRadialGradient(0, 0, 1, 0, 0, 8);
        irisG.addColorStop(0, "#7a3a0a");
        irisG.addColorStop(0.6, "#4e2000");
        irisG.addColorStop(1, "#220e00");
        ctx.fillStyle = irisG;
        ctx.beginPath();
        ctx.arc(0, 0, 8.5, 0, Math.PI * 2);
        ctx.fill();

        // Pupil
        ctx.fillStyle = "#080300";
        ctx.beginPath();
        ctx.arc(0, 0, 4, 0, Math.PI * 2);
        ctx.fill();

        // Highlights
        ctx.fillStyle = "rgba(255,255,255,0.88)";
        ctx.beginPath();
        ctx.arc(3, -3, 2.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "rgba(255,255,255,0.4)";
        ctx.beginPath();
        ctx.arc(-2, 2, 1.1, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();

        // Upper eyelid line
        ctx.save();
        ctx.translate(ex, ey);
        ctx.scale(1, eyeSY);
        ctx.strokeStyle = "#160600";
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(-17, 0);
        ctx.quadraticCurveTo(0, -12, 17, 0);
        ctx.stroke();
        ctx.restore();

        // Lashes
        ctx.strokeStyle = "#100400";
        ctx.lineWidth = 1.4;
        for (let l = 0; l < 7; l++) {
          const lx = ex - 14 + l * 4.7;
          const angle = -Math.PI / 2 - 0.25 + l * 0.08;
          ctx.save();
          ctx.translate(lx, ey - 9 * eyeSY);
          ctx.rotate(angle);
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(0, -6);
          ctx.stroke();
          ctx.restore();
        }

        // Lower lash line
        ctx.strokeStyle = "rgba(70,25,0,0.35)";
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(ex - 14, ey + 10);
        ctx.quadraticCurveTo(ex, ey + 13, ex + 14, ey + 10);
        ctx.stroke();
      });

      // ── Nose ──
      ctx.strokeStyle = "rgba(140,70,25,0.45)";
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(W / 2 - 3, 188);
      ctx.lineTo(W / 2 - 7, 212);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(W / 2 + 3, 188);
      ctx.lineTo(W / 2 + 7, 212);
      ctx.stroke();
      ctx.fillStyle = "rgba(110,48,16,0.45)";
      ctx.beginPath();
      ctx.ellipse(W / 2 - 11, 218, 7, 4.5, -0.25, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(W / 2 + 11, 218, 7, 4.5, 0.25, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(185,110,50,0.28)";
      ctx.beginPath();
      ctx.ellipse(W / 2, 217, 9, 6, 0, 0, Math.PI * 2);
      ctx.fill();

      // ── Mouth / Lips with human animation ──
      if (isTalking) {
        mouthStepRef.current++;
        if (mouthStepRef.current >= 6) {
          mouthStepRef.current = 0;
          mouthPhaseRef.current = (mouthPhaseRef.current + 1) % 10;
        }
      } else {
        mouthPhaseRef.current = 0;
        mouthStepRef.current = 0;
      }
      // Jaw open amount 0–1 for each phase frame
      const jawSeq = [0, 0.25, 0.6, 1.0, 0.75, 0.4, 0.8, 0.5, 0.2, 0.05];
      const jaw = isTalking ? jawSeq[mouthPhaseRef.current] : 0;
      const jd = jaw * 20; // max 20px jaw drop

      const mY = 244;
      const mCx = W / 2;

      // Dark mouth cavity
      if (jd > 1) {
        const cavity = ctx.createRadialGradient(
          mCx,
          mY + jd / 2,
          2,
          mCx,
          mY + jd / 2,
          25,
        );
        cavity.addColorStop(0, "#160005");
        cavity.addColorStop(1, "#2e0012");
        ctx.fillStyle = cavity;
        ctx.beginPath();
        ctx.ellipse(mCx, mY + jd / 2, 24, 5 + jd / 2, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      // Top teeth
      if (jd > 4) {
        ctx.fillStyle = "#f2ede7";
        ctx.beginPath();
        ctx.roundRect(mCx - 19, mY - 1, 38, 8, 3);
        ctx.fill();
        ctx.strokeStyle = "rgba(195,185,172,0.5)";
        ctx.lineWidth = 0.7;
        for (let ti = 1; ti < 5; ti++) {
          ctx.beginPath();
          ctx.moveTo(mCx - 19 + ti * 7.6, mY - 1);
          ctx.lineTo(mCx - 19 + ti * 7.6, mY + 7);
          ctx.stroke();
        }
      }
      // Bottom teeth
      if (jd > 9) {
        ctx.fillStyle = "#ece8e1";
        ctx.beginPath();
        ctx.roundRect(mCx - 16, mY + jd - 7, 32, 7, 3);
        ctx.fill();
      }
      // Tongue
      if (jd > 13) {
        const tG = ctx.createRadialGradient(
          mCx,
          mY + jd - 1,
          2,
          mCx,
          mY + jd,
          13,
        );
        tG.addColorStop(0, "#de6878");
        tG.addColorStop(1, "#bc3858");
        ctx.fillStyle = tG;
        ctx.beginPath();
        ctx.ellipse(mCx, mY + jd - 1, 13, 7, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      const lipC = "#c04860",
        lipD = "#8a2232";

      // Upper lip shape (cupid's bow)
      ctx.fillStyle = lipC;
      ctx.beginPath();
      ctx.moveTo(mCx - 28, mY);
      ctx.bezierCurveTo(mCx - 18, mY - 5, mCx - 10, mY - 9, mCx - 4, mY - 7);
      ctx.bezierCurveTo(mCx - 1, mY - 10, mCx + 1, mY - 10, mCx + 4, mY - 7);
      ctx.bezierCurveTo(mCx + 10, mY - 9, mCx + 18, mY - 5, mCx + 28, mY);
      ctx.bezierCurveTo(mCx + 20, mY + 3, mCx, mY + 4.5, mCx - 20, mY + 3);
      ctx.closePath();
      ctx.fill();
      // Cupid's bow highlight
      ctx.fillStyle = "rgba(255,185,175,0.4)";
      ctx.beginPath();
      ctx.ellipse(mCx, mY - 4, 9, 2.8, 0, 0, Math.PI * 2);
      ctx.fill();

      // Lower lip
      const lyBase = mY + jd;
      ctx.fillStyle = lipC;
      ctx.beginPath();
      ctx.moveTo(mCx - 28, mY);
      ctx.bezierCurveTo(mCx - 20, mY + 3, mCx, mY + 4.5, mCx + 20, mY + 3);
      ctx.bezierCurveTo(
        mCx + 32,
        mY + 1,
        mCx + 32,
        lyBase + 6,
        mCx + 26,
        lyBase + 11,
      );
      ctx.bezierCurveTo(
        mCx + 14,
        lyBase + 16,
        mCx,
        lyBase + 17,
        mCx - 14,
        lyBase + 16,
      );
      ctx.bezierCurveTo(mCx - 32, lyBase + 6, mCx - 32, mY + 1, mCx - 28, mY);
      ctx.closePath();
      ctx.fill();
      // Lower lip highlight
      ctx.fillStyle = "rgba(255,185,175,0.38)";
      ctx.beginPath();
      ctx.ellipse(mCx, lyBase + 10, 12, 5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Lip outline
      ctx.strokeStyle = lipD;
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      ctx.moveTo(mCx - 28, mY);
      ctx.bezierCurveTo(mCx - 18, mY - 5, mCx - 10, mY - 9, mCx - 4, mY - 7);
      ctx.bezierCurveTo(mCx - 1, mY - 10, mCx + 1, mY - 10, mCx + 4, mY - 7);
      ctx.bezierCurveTo(mCx + 10, mY - 9, mCx + 18, mY - 5, mCx + 28, mY);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(mCx - 28, mY);
      ctx.bezierCurveTo(
        mCx - 20,
        lyBase + 6,
        mCx - 14,
        lyBase + 17,
        mCx,
        lyBase + 17,
      );
      ctx.bezierCurveTo(
        mCx + 14,
        lyBase + 17,
        mCx + 20,
        lyBase + 6,
        mCx + 28,
        mY,
      );
      ctx.stroke();

      // ── Cheek blush ──
      ctx.fillStyle = "rgba(215,95,95,0.1)";
      ctx.beginPath();
      ctx.ellipse(W / 2 - 52, 208, 26, 17, -0.18, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(W / 2 + 52, 208, 26, 17, 0.18, 0, Math.PI * 2);
      ctx.fill();

      // ── Glowing ring ──
      const ringColor = isTalking
        ? "#00d9ff"
        : isListening
          ? "#00f5a0"
          : "#a855f7";
      ctx.strokeStyle = ringColor;
      ctx.shadowColor = ringColor;
      ctx.shadowBlur = isTalking ? 18 : 7;
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 6]);
      ctx.beginPath();
      ctx.ellipse(W / 2, 188, 96, 112, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.shadowBlur = 0;

      // ── Sound / listen bars ──
      const barColor = isTalking
        ? "0,217,255"
        : isListening
          ? "0,245,160"
          : null;
      if (barColor) {
        const bars = 16;
        for (let i = 0; i < bars; i++) {
          const bx = W / 2 - 72 + i * 9.5;
          const bh = (Math.sin(fr * 0.14 + i * 0.75) * 0.5 + 0.5) * 20 + 4;
          const alpha = 0.35 + (Math.sin(fr * 0.14 + i) * 0.5 + 0.5) * 0.65;
          ctx.fillStyle = `rgba(${barColor},${alpha})`;
          ctx.beginPath();
          ctx.roundRect(bx - 2.5, 362 - bh / 2, 5, bh, 3);
          ctx.fill();
        }
      }

      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [isTalking, isListening]);

  return (
    <div className="relative flex flex-col items-center">
      <div
        style={{
          filter: `drop-shadow(0 0 ${isTalking ? "22px" : "10px"} ${
            isTalking
              ? "rgba(0,217,255,0.45)"
              : isListening
                ? "rgba(0,245,160,0.35)"
                : "rgba(168,85,247,0.28)"
          })`,
          transition: "filter 0.3s ease",
          borderRadius: "20px",
          overflow: "hidden",
        }}
      >
        <canvas
          ref={canvasRef}
          style={{ width: 260, height: 325, display: "block" }}
        />
      </div>
      <div className="mt-3 text-sm font-medium tracking-wider uppercase">
        {isTalking ? (
          <span className="text-[#00d9ff] animate-pulse flex items-center gap-1.5">
            <Volume2 size={14} /> Speaking...
          </span>
        ) : isListening ? (
          <span className="text-[#00f5a0] animate-pulse flex items-center gap-1.5">
            <Mic size={14} /> Listening to you...
          </span>
        ) : (
          <span className="text-[#a855f7] flex items-center gap-1.5">
            <Star size={14} /> AI Interviewer
          </span>
        )}
      </div>
    </div>
  );
};

const Interview = () => {
  const [loading, setLoading] = useState(false);
  const [startingInterview, setStartingInterview] = useState(false);
  const [history, setHistory] = useState([]);
  const [session, setSession] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [view, setView] = useState("start");
  const [isListening, setIsListening] = useState(false);
  const [isTalking, setIsTalking] = useState(false);
  const [questionRead, setQuestionRead] = useState(false);

  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);
  const utteranceRef = useRef(null);

  useEffect(() => {
    loadHistory();
    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
      if (synthRef.current) synthRef.current.cancel();
    };
  }, []);

  useEffect(() => {
    if (view === "interview" && session && !feedback) {
      setQuestionRead(false);
      readQuestion(session.questions[currentQuestionIndex]);
    }
  }, [currentQuestionIndex, view, session]);

  useEffect(() => {
    if (feedback) {
      synthRef.current?.cancel();
      setIsTalking(false);
    }
  }, [feedback]);

  const readQuestion = (text) => {
    if (!synthRef.current) return;
    synthRef.current.cancel();
    setIsTalking(true);
    setQuestionRead(false);
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 0.88;
    utter.pitch = 1.15;
    utter.volume = 1;
    const voices = synthRef.current.getVoices();
    const femaleVoice =
      voices.find((v) => v.name.includes("Samantha")) ||
      voices.find((v) => v.name.includes("Victoria")) ||
      voices.find((v) => v.name.includes("Karen")) ||
      voices.find((v) => v.name.includes("Moira")) ||
      voices.find((v) => v.name.toLowerCase().includes("zira")) ||
      voices.find((v) => v.name.includes("Google UK English Female")) ||
      voices.find((v) => v.lang === "en-GB") ||
      voices.find((v) => v.lang === "en-US");
    if (femaleVoice) utter.voice = femaleVoice;
    utter.onstart = () => setIsTalking(true);
    utter.onend = () => {
      setIsTalking(false);
      setQuestionRead(true);
    };
    utter.onerror = () => {
      setIsTalking(false);
      setQuestionRead(true);
    };
    utteranceRef.current = utter;
    synthRef.current.speak(utter);
  };

  const startListening = () => {
    if (
      !("webkitSpeechRecognition" in window) &&
      !("SpeechRecognition" in window)
    ) {
      toast.error("Browser does not support speech recognition.");
      return;
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SR();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = "en-US";
    recognitionRef.current.onstart = () => setIsListening(true);
    recognitionRef.current.onresult = (event) => {
      let final = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) final += event.results[i][0].transcript;
      }
      if (final) setAnswer((prev) => prev + " " + final);
    };
    recognitionRef.current.onerror = (event) => {
      setIsListening(false);
      const msgs = {
        "not-allowed": "Microphone access denied.",
        "no-speech": "No speech detected.",
        network: "Network error.",
      };
      toast.error(msgs[event.error] || `Voice error: ${event.error}`);
    };
    recognitionRef.current.onend = () => setIsListening(false);
    recognitionRef.current.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };
  const toggleListening = () => {
    if (isTalking) {
      toast.info("Please wait for the question to finish.");
      return;
    }
    isListening ? stopListening() : startListening();
  };

  const loadHistory = async () => {
    try {
      setLoading(true);
      const r = await getInterviewHistory();
      if (r.data.success) setHistory(r.data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleStartInterview = async () => {
    try {
      setStartingInterview(true);
      await new Promise((r) => setTimeout(r, 1500));
      const response = await startInterview({});
      if (response.data.success) {
        setSession(response.data.data);
        setView("interview");
        setCurrentQuestionIndex(0);
        setAnswer("");
        setFeedback(null);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to start interview");
    } finally {
      setStartingInterview(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!answer.trim()) {
      toast.warning("Please enter an answer");
      return;
    }
    try {
      setSubmitting(true);
      stopListening();
      const response = await submitInterviewAnswer(session.sessionId, {
        questionIndex: currentQuestionIndex,
        answer,
      });
      if (response.data.success) setFeedback(response.data.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit answer");
    } finally {
      setSubmitting(false);
    }
  };

  const handleNextQuestion = async () => {
    const next = currentQuestionIndex + 1;
    if (next < session.questions.length) {
      setCurrentQuestionIndex(next);
      setAnswer("");
      setFeedback(null);
    } else {
      await finishInterview();
    }
  };

  const finishInterview = async () => {
    try {
      setLoading(true);
      stopListening();
      synthRef.current?.cancel();
      const response = await completeInterview(session.sessionId);
      if (response.data.success) {
        setSession(response.data.data);
        setView("result");
        loadHistory();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to complete interview",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteInterview = async (sessionId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });
    if (!result.isConfirmed) return;
    try {
      const response = await deleteInterview(sessionId);
      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          timer: 1500,
          showConfirmButton: false,
        });
        loadHistory();
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: error.response?.data?.message || "Failed to delete",
      });
    }
  };

  if (loading && view !== "history")
    return (
      <div className="dashboard-page flex items-center justify-center h-screen">
        <div className="spinner"></div>
      </div>
    );

  return (
    <>
      {startingInterview && (
        <LoadingScreen message="Preparing your interview questions..." />
      )}
      <div className="dashboard-page">
        <RefreshButton onClick={loadHistory} />

        <div className="page-header flex justify-between items-center">
          <div>
            <h1 className="page-title">Mock Interview</h1>
            <p className="page-subtitle">
              Practice technical questions tailored to your profile
            </p>
          </div>
          {view !== "interview" && (
            <button
              onClick={() => setView(view === "history" ? "start" : "history")}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-[#00d9ff] border border-[#00d9ff]/30 hover:shadow-[0_0_10px_rgba(0,217,255,0.2)] transition-all flex items-center gap-2"
            >
              {view === "history" ? (
                <>
                  <PlusCircle size={16} /> Start New Interview
                </>
              ) : (
                <>
                  <History size={16} /> View History
                </>
              )}
            </button>
          )}
        </div>

        {/* START */}
        {view === "start" && (
          <div className="max-w-3xl mx-auto mt-10">
            <div className="bg-gradient-to-br from-[#2d1b69]/80 to-[#1a103c]/90 rounded-2xl p-10 border border-[#a855f7]/30 text-center shadow-[0_0_30px_rgba(168,85,247,0.2)] relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#a855f7] to-transparent opacity-50"></div>
              <LadyAvatar isTalking={false} isListening={false} />
              <h2 className="text-3xl font-bold text-white mb-4 mt-4 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]">
                Meet Your AI Interviewer
              </h2>
              <p className="text-gray-300 text-lg mb-8 max-w-xl mx-auto">
                She will <strong className="text-[#00d9ff]">speak</strong> each
                question aloud. Answer by voice or text and get instant
                feedback.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 text-left">
                <div className="bg-white/5 p-4 rounded-xl border border-[#00d9ff]/20 hover:border-[#00d9ff]/50 transition-all group">
                  <div className="text-[#00d9ff] font-bold text-lg mb-1 group-hover:text-white transition-colors flex items-center gap-2">
                    <Volume2 size={18} /> AI Voice
                  </div>
                  <p className="text-gray-400 text-sm">
                    Questions are read aloud by your AI interviewer in real
                    time.
                  </p>
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-[#a855f7]/20 hover:border-[#a855f7]/50 transition-all group">
                  <div className="text-[#a855f7] font-bold text-lg mb-1 group-hover:text-white transition-colors flex items-center gap-2">
                    <Mic size={18} /> Speak to Answer
                  </div>
                  <p className="text-gray-400 text-sm">
                    Use voice recognition to answer hands-free like a real
                    interview.
                  </p>
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-[#ff006e]/20 hover:border-[#ff006e]/50 transition-all group">
                  <div className="text-[#ff006e] font-bold text-lg mb-1 group-hover:text-white transition-colors flex items-center gap-2">
                    <Star size={18} /> Instant Feedback
                  </div>
                  <p className="text-gray-400 text-sm">
                    Get scored and reviewed after every answer.
                  </p>
                </div>
              </div>
              <button
                onClick={handleStartInterview}
                className="px-8 py-4 bg-gradient-to-r from-[#667eea] via-[#a855f7] to-[#ff006e] hover:from-[#5a6fd6] hover:via-[#9333ea] hover:to-[#e11d48] text-white font-bold rounded-xl transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(168,85,247,0.5)] text-lg flex items-center justify-center gap-3 mx-auto"
              >
                <Rocket size={20} /> Start Interview Session
              </button>
            </div>
          </div>
        )}

        {/* INTERVIEW */}
        {view === "interview" && session && (
          <div className="max-w-6xl mx-auto mt-6">
            <div className="flex justify-between items-center mb-6">
              <div className="text-gray-400">
                Question {currentQuestionIndex + 1} of{" "}
                {session.questions.length}
              </div>
              <div className="w-1/2 bg-gray-700 rounded-full h-2">
                <div
                  className="bg-[#00f5a0] h-2 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(0,245,160,0.5)]"
                  style={{
                    width: `${((currentQuestionIndex + 1) / session.questions.length) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              {/* LEFT */}
              <div className="bg-gradient-to-br from-[#1a0a3c]/90 to-[#0d0620]/95 rounded-2xl p-8 border border-[#a855f7]/30 shadow-[0_0_30px_rgba(168,85,247,0.15)] flex flex-col items-center">
                <LadyAvatar isTalking={isTalking} isListening={isListening} />
                <div className="mt-6 w-full">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-2 h-2 rounded-full bg-[#a855f7] shadow-[0_0_6px_#a855f7]"></span>
                    <span className="text-xs uppercase tracking-widest text-[#a855f7] font-semibold">
                      Question
                    </span>
                  </div>
                  <div
                    className={`bg-black/30 rounded-xl p-5 border transition-all duration-500 ${isTalking ? "border-[#00d9ff]/60 shadow-[0_0_20px_rgba(0,217,255,0.15)]" : "border-white/10"}`}
                  >
                    <p className="text-white text-lg leading-relaxed font-medium">
                      {session.questions[currentQuestionIndex]}
                    </p>
                  </div>
                  {!isTalking && (
                    <button
                      onClick={() =>
                        readQuestion(session.questions[currentQuestionIndex])
                      }
                      className="mt-3 inline-flex items-center gap-2 text-xs font-medium 
             text-[#a855f7] hover:text-white
             bg-[#a855f7]/10 hover:bg-[#a855f7]/20
             px-3 py-2 rounded-lg
             transition-all duration-200"
                    >
                      <RotateCcw size={14} />
                      Replay Question
                    </button>
                  )}
                </div>
              </div>
              {/* RIGHT */}
              <div className="bg-gradient-to-br from-[#0d1a2e]/90 to-[#060d1a]/95 rounded-2xl p-8 border border-[#00d9ff]/20 shadow-[0_0_30px_rgba(0,217,255,0.1)] flex flex-col">
                {!feedback ? (
                  <>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-2 h-2 rounded-full bg-[#00d9ff] shadow-[0_0_6px_#00d9ff]"></span>
                      <span className="text-xs uppercase tracking-widest text-[#00d9ff] font-semibold">
                        Your Answer
                      </span>
                      {isListening && (
                        <span className="ml-auto text-xs text-[#00f5a0] font-medium animate-pulse flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#00f5a0] animate-ping inline-block"></span>
                          Listening...
                        </span>
                      )}
                    </div>
                    <div
                      className={`relative flex-1 min-h-[200px] bg-black/30 rounded-xl border transition-all duration-300 ${isListening ? "border-[#00f5a0]/60 shadow-[0_0_15px_rgba(0,245,160,0.1)]" : "border-white/10"}`}
                    >
                      <textarea
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        placeholder={
                          isTalking
                            ? "AI is reading the question..."
                            : questionRead
                              ? "Click the microphone to speak your answer, or type here..."
                              : "Waiting for question to finish..."
                        }
                        className="w-full h-full bg-transparent p-4 text-white placeholder-gray-500 focus:outline-none resize-none min-h-[220px]"
                      />
                    </div>
                    <div className="flex items-center gap-3 mt-4">
                      <button
                        onClick={toggleListening}
                        disabled={isTalking}
                        className={`relative p-4 rounded-2xl font-bold transition-all flex items-center gap-2 ${isListening ? "bg-[#ff006e] text-white shadow-[0_0_20px_rgba(255,0,110,0.5)] animate-pulse" : isTalking ? "bg-gray-700 text-gray-500 cursor-not-allowed" : "bg-[#a855f7]/20 hover:bg-[#a855f7]/40 text-[#a855f7] border border-[#a855f7]/30"}`}
                      >
                        {isListening ? (
                          <>
                            <Square size={18} /> Stop
                          </>
                        ) : (
                          <>
                            <Mic size={18} /> Speak
                          </>
                        )}
                      </button>
                      {answer && (
                        <button
                          onClick={() => setAnswer("")}
                          className="px-4 py-3 rounded-xl text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-sm"
                        >
                          Clear
                        </button>
                      )}
                      <button
                        onClick={handleSubmitAnswer}
                        disabled={submitting || !answer.trim()}
                        className="ml-auto px-6 py-3 bg-gradient-to-r from-[#00d9ff]/20 to-[#00d9ff]/10 hover:from-[#00d9ff]/40 hover:to-[#00d9ff]/20 text-[#00d9ff] font-bold rounded-xl border border-[#00d9ff]/30 hover:shadow-[0_0_15px_rgba(0,217,255,0.3)] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {submitting ? (
                          <div className="spinner w-4 h-4 border-[#00d9ff]"></div>
                        ) : (
                          <>
                            Submit Answer <ChevronRight size={16} />
                          </>
                        )}
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="animate-fade-in flex flex-col gap-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-2 h-2 rounded-full bg-[#00f5a0] shadow-[0_0_6px_#00f5a0]"></span>
                      <span className="text-xs uppercase tracking-widest text-[#00f5a0] font-semibold">
                        Feedback
                      </span>
                    </div>
                    <div className="bg-black/30 rounded-xl p-4 border border-white/10">
                      <h4 className="text-gray-400 text-xs mb-2 uppercase tracking-wider">
                        Your Answer
                      </h4>
                      <p className="text-gray-300 italic text-sm leading-relaxed">
                        {answer}
                      </p>
                    </div>
                    <div
                      className={`rounded-xl p-5 border ${feedback.score >= 7 ? "bg-[#00f5a0]/10 border-[#00f5a0]/30" : feedback.score >= 4 ? "bg-[#ffd700]/10 border-[#ffd700]/30" : "bg-[#ff006e]/10 border-[#ff006e]/30"}`}
                    >
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-bold text-white text-base">
                          AI Feedback
                        </h4>
                        <div
                          className={`px-3 py-1 rounded-full font-bold text-sm ${feedback.score >= 7 ? "bg-[#00f5a0]/20 text-[#00f5a0]" : feedback.score >= 4 ? "bg-[#ffd700]/20 text-[#ffd700]" : "bg-[#ff006e]/20 text-[#ff006e]"}`}
                        >
                          Score:{" "}
                          {feedback?.score != null
                            ? Math.round(feedback.score / 10)
                            : "-"}{" "}
                          /10
                        </div>
                      </div>
                      <p className="text-gray-200 leading-relaxed text-sm">
                        {feedback.feedback}
                      </p>
                    </div>
                    <button
                      onClick={handleNextQuestion}
                      className="w-full py-3 bg-white text-indigo-900 font-bold rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 mt-2"
                    >
                      {currentQuestionIndex < session.questions.length - 1 ? (
                        <>
                          Next Question <ArrowRight size={16} />
                        </>
                      ) : (
                        <>
                          Finish Interview <CheckCircle size={16} />
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* RESULT */}
        {view === "result" && session && (
          <div className="max-w-2xl mx-auto mt-10 text-center">
            <div className="bg-gradient-to-br from-[#2d1b69]/80 to-[#1a103c]/90 rounded-3xl p-10 border border-[#a855f7]/30 backdrop-blur-sm shadow-[0_0_30px_rgba(168,85,247,0.2)]">
              <div className="w-24 h-24 bg-[#00f5a0]/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce shadow-[0_0_20px_rgba(0,245,160,0.4)]">
                <Trophy size={48} className="text-[#00f5a0]" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">
                Interview Completed!
              </h2>
              <p className="text-gray-400 mb-8">
                Great job on completing the session.
              </p>
              <div className="flex justify-center gap-8 mb-10">
                <div className="text-center">
                  <div className="text-4xl font-bold text-white mb-1">
                    {session.performanceMetrics.averageScore}
                  </div>
                  <div className="text-sm text-gray-400 uppercase tracking-wider">
                    Avg Score
                  </div>
                </div>
                <div className="w-px bg-white/10"></div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-white mb-1">
                    {session.performanceMetrics.totalQuestions}
                  </div>
                  <div className="text-sm text-gray-400 uppercase tracking-wider">
                    Questions
                  </div>
                </div>
                <div className="w-px bg-white/10"></div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-white mb-1">
                    {Math.floor(session.performanceMetrics.averageScore / 2)}
                  </div>
                  <div className="text-sm text-gray-400 uppercase tracking-wider">
                    Rating
                  </div>
                </div>
              </div>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setView("history")}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-colors flex items-center gap-2"
                >
                  <History size={16} /> View History
                </button>
                <button
                  onClick={handleStartInterview}
                  className="px-6 py-3 bg-gradient-to-r from-[#667eea] to-[#a855f7] hover:from-[#5a6fd6] hover:to-[#9333ea] text-white font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(168,85,247,0.4)] flex items-center gap-2"
                >
                  <Play size={16} /> Start New Session
                </button>
              </div>
            </div>
          </div>
        )}

        {/* HISTORY */}
        {view === "history" && (
          <div className="mt-8">
            {history.length === 0 ? (
              <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10">
                <p className="text-gray-400 text-lg mb-4">
                  No interview history found.
                </p>
                <button
                  onClick={() => setView("start")}
                  className="text-[#a855f7] hover:text-[#9333ea] underline"
                >
                  Start your first interview
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {history.map((item) => (
                  <div
                    key={item._id}
                    className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-indigo-500/50 transition-colors group"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="text-gray-400 text-sm flex items-center gap-1">
                        <Clock size={13} />{" "}
                        {new Date(item.startedAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className={`px-2 py-1 rounded text-xs font-bold flex items-center gap-1 ${item.status === "completed" ? "bg-[#00f5a0]/20 text-[#00f5a0]" : "bg-[#ffd700]/20 text-[#ffd700]"}`}
                        >
                          {item.status === "completed" ? (
                            <>
                              <CheckCircle size={11} /> Completed
                            </>
                          ) : (
                            "In Progress"
                          )}
                        </div>
                        <button
                          onClick={() => handleDeleteInterview(item._id)}
                          className="p-1.5 rounded hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                    <div className="mb-4">
                      <div className="text-3xl font-bold text-white mb-1">
                        {item?.performanceMetrics?.averageScore != null
                          ? Math.round(
                              item.performanceMetrics.averageScore / 10,
                            )
                          : "-"}
                        <span className="text-lg text-gray-500">/10</span>
                      </div>
                      <div className="text-xs text-gray-400 uppercase tracking-wide">
                        Average Score
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500 block">Questions</span>
                        <span className="text-white font-semibold">
                          {item?.performanceMetrics?.totalQuestions ?? "-"}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-gray-500 block">Duration</span>
                        <span className="text-white font-semibold">
                          {item.completedAt
                            ? Math.round(
                                (new Date(item.completedAt) -
                                  new Date(item.startedAt)) /
                                  60000,
                              ) + " min"
                            : "-"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Interview;

// import React, { useState, useEffect, useRef, useCallback } from "react";
// import { toast } from "react-toastify";
// import Swal from "sweetalert2";
// import {
//   startInterview,
//   submitInterviewAnswer,
//   completeInterview,
//   getInterviewHistory,
//   deleteInterview,
// } from "../api/userApi";
// import LoadingScreen from "../components/LoadingScreen";
// import RefreshButton from "../components/RefreshButton";
// import "./styles/DashboardPages.css";

// // ─── AI Avatar Component ────────────────────────────────────────────────────
// const AIAvatar = ({ isTalking, isListening }) => {
//   const canvasRef = useRef(null);
//   const animRef = useRef(null);
//   const timeRef = useRef(0);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;
//     const ctx = canvas.getContext("2d");
//     canvas.width = 300;
//     canvas.height = 300;

//     const draw = () => {
//       timeRef.current += 0.05;
//       const t = timeRef.current;
//       ctx.clearRect(0, 0, 300, 300);

//       // Background glow
//       const bgGrad = ctx.createRadialGradient(150, 150, 10, 150, 150, 150);
//       bgGrad.addColorStop(0, "rgba(168,85,247,0.15)");
//       bgGrad.addColorStop(1, "rgba(0,0,0,0)");
//       ctx.fillStyle = bgGrad;
//       ctx.fillRect(0, 0, 300, 300);

//       // Outer rotating rings
//       for (let r = 0; r < 3; r++) {
//         ctx.save();
//         ctx.translate(150, 150);
//         ctx.rotate(t * (r % 2 === 0 ? 0.3 : -0.2) + r * 1.2);
//         ctx.strokeStyle = `rgba(${r === 0 ? "168,85,247" : r === 1 ? "0,217,255" : "255,0,110"}, ${isTalking ? 0.6 : 0.2})`;
//         ctx.lineWidth = 1.5;
//         ctx.setLineDash([6, 8]);
//         ctx.beginPath();
//         ctx.arc(0, 0, 100 + r * 18, 0, Math.PI * 2);
//         ctx.stroke();
//         ctx.restore();
//       }

//       // Sound wave bars (talking)
//       if (isTalking) {
//         const barCount = 24;
//         for (let i = 0; i < barCount; i++) {
//           const angle = (i / barCount) * Math.PI * 2;
//           const wave = Math.sin(t * 4 + i * 0.5) * 0.5 + 0.5;
//           const innerR = 68, outerR = 68 + wave * 28;
//           const x1 = 150 + Math.cos(angle) * innerR, y1 = 150 + Math.sin(angle) * innerR;
//           const x2 = 150 + Math.cos(angle) * outerR, y2 = 150 + Math.sin(angle) * outerR;
//           ctx.strokeStyle = `rgba(0,217,255,${0.4 + wave * 0.6})`;
//           ctx.lineWidth = 2; ctx.setLineDash([]);
//           ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
//         }
//       }

//       // Listening pulse bars
//       if (isListening) {
//         const barCount = 20;
//         for (let i = 0; i < barCount; i++) {
//           const angle = (i / barCount) * Math.PI * 2;
//           const wave = Math.sin(t * 6 + i * 0.8) * 0.5 + 0.5;
//           const innerR = 68, outerR = 68 + wave * 22;
//           const x1 = 150 + Math.cos(angle) * innerR, y1 = 150 + Math.sin(angle) * innerR;
//           const x2 = 150 + Math.cos(angle) * outerR, y2 = 150 + Math.sin(angle) * outerR;
//           ctx.strokeStyle = `rgba(0,245,160,${0.3 + wave * 0.7})`;
//           ctx.lineWidth = 2; ctx.setLineDash([]);
//           ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
//         }
//       }

//       // Face circle
//       const faceGrad = ctx.createRadialGradient(145, 140, 10, 150, 150, 65);
//       faceGrad.addColorStop(0, "#3b1f7a"); faceGrad.addColorStop(1, "#1a0a3c");
//       ctx.fillStyle = faceGrad;
//       ctx.beginPath(); ctx.arc(150, 150, 65, 0, Math.PI * 2); ctx.fill();

//       ctx.strokeStyle = isTalking ? "rgba(0,217,255,0.8)" : isListening ? "rgba(0,245,160,0.8)" : "rgba(168,85,247,0.5)";
//       ctx.lineWidth = 2.5; ctx.setLineDash([]);
//       ctx.beginPath(); ctx.arc(150, 150, 65, 0, Math.PI * 2); ctx.stroke();

//       // Eyes
//       const eyeBlink = Math.sin(t * 0.7) > 0.97 ? 0.05 : 1;
//       [-18, 18].forEach((xOff) => {
//         const eyeGlow = ctx.createRadialGradient(150 + xOff, 140, 0, 150 + xOff, 140, 12);
//         eyeGlow.addColorStop(0, "rgba(0,217,255,0.4)"); eyeGlow.addColorStop(1, "rgba(0,217,255,0)");
//         ctx.fillStyle = eyeGlow;
//         ctx.beginPath(); ctx.arc(150 + xOff, 140, 12, 0, Math.PI * 2); ctx.fill();
//         ctx.fillStyle = "#00d9ff";
//         ctx.beginPath(); ctx.ellipse(150 + xOff, 140, 7, 7 * eyeBlink, 0, 0, Math.PI * 2); ctx.fill();
//         ctx.fillStyle = "#0a0520";
//         ctx.beginPath(); ctx.ellipse(150 + xOff, 140, 3.5, 3.5 * eyeBlink, 0, 0, Math.PI * 2); ctx.fill();
//         ctx.fillStyle = "rgba(255,255,255,0.8)";
//         ctx.beginPath(); ctx.arc(150 + xOff + 2, 138, 1.5, 0, Math.PI * 2); ctx.fill();
//       });

//       // Mouth
//       ctx.strokeStyle = isTalking ? "rgba(0,217,255,0.9)" : "rgba(168,85,247,0.7)";
//       ctx.lineWidth = 2.5; ctx.lineCap = "round"; ctx.setLineDash([]);
//       ctx.beginPath();
//       if (isTalking) {
//         const mouthOpen = Math.abs(Math.sin(t * 8)) * 10;
//         ctx.moveTo(130, 168); ctx.quadraticCurveTo(150, 168 + mouthOpen, 170, 168);
//         ctx.moveTo(130, 168); ctx.quadraticCurveTo(150, 168 - mouthOpen * 0.5, 170, 168);
//       } else {
//         ctx.moveTo(133, 168); ctx.quadraticCurveTo(150, 175, 167, 168);
//       }
//       ctx.stroke();

//       // Nose
//       ctx.strokeStyle = "rgba(168,85,247,0.5)"; ctx.lineWidth = 1.5;
//       ctx.beginPath(); ctx.moveTo(147, 153); ctx.lineTo(143, 162); ctx.lineTo(148, 162); ctx.stroke();
//       ctx.beginPath(); ctx.moveTo(153, 153); ctx.lineTo(157, 162); ctx.lineTo(152, 162); ctx.stroke();

//       // Status dot
//       const statusColor = isTalking ? "#00d9ff" : isListening ? "#00f5a0" : "#a855f7";
//       ctx.fillStyle = statusColor; ctx.shadowColor = statusColor; ctx.shadowBlur = 10;
//       ctx.beginPath(); ctx.arc(150, 225, 5, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;

//       animRef.current = requestAnimationFrame(draw);
//     };

//     draw();
//     return () => cancelAnimationFrame(animRef.current);
//   }, [isTalking, isListening]);

//   return (
//     <div className="relative flex flex-col items-center">
//       <div
//         className="relative"
//         style={{
//           filter: `drop-shadow(0 0 ${isTalking ? "30px" : "15px"} ${isTalking ? "#00d9ff" : isListening ? "#00f5a0" : "#a855f7"})`,
//           transition: "filter 0.3s ease",
//         }}
//       >
//         <canvas ref={canvasRef} style={{ width: 220, height: 220 }} />
//       </div>
//       <div className="mt-3 text-sm font-medium tracking-wider uppercase">
//         {isTalking ? (
//           <span className="text-[#00d9ff] animate-pulse">🔊 Speaking...</span>
//         ) : isListening ? (
//           <span className="text-[#00f5a0] animate-pulse">🎙️ Listening to you...</span>
//         ) : (
//           <span className="text-[#a855f7]">● AI Interviewer</span>
//         )}
//       </div>
//     </div>
//   );
// };

// // ─── Main Interview Component ────────────────────────────────────────────────
// const Interview = () => {
//   const [loading, setLoading] = useState(false);
//   const [startingInterview, setStartingInterview] = useState(false);
//   const [history, setHistory] = useState([]);
//   const [session, setSession] = useState(null);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [answer, setAnswer] = useState("");
//   const [submitting, setSubmitting] = useState(false);
//   const [feedback, setFeedback] = useState(null);
//   const [view, setView] = useState("start");
//   const [isFullscreen, setIsFullscreen] = useState(false);
//   const [tabWarning, setTabWarning] = useState(false);

//   // AI voice states
//   const [isListening, setIsListening] = useState(false);
//   const [isTalking, setIsTalking] = useState(false);
//   const [questionRead, setQuestionRead] = useState(false);

//   // Refs
//   const recognitionRef = useRef(null);
//   const synthRef = useRef(window.speechSynthesis);
//   const utteranceRef = useRef(null);
//   const fullscreenRef = useRef(null);
//   const textareaRef = useRef(null);

//   // Refs kept in sync with state for async callbacks
//   const sessionRef = useRef(null);
//   const currentQuestionIndexRef = useRef(0);
//   const answerRef = useRef("");
//   const submittingRef = useRef(false);
//   const feedbackRef = useRef(null);
//   const viewRef = useRef("start");

//   useEffect(() => { sessionRef.current = session; }, [session]);
//   useEffect(() => { currentQuestionIndexRef.current = currentQuestionIndex; }, [currentQuestionIndex]);
//   useEffect(() => { answerRef.current = answer; }, [answer]);
//   useEffect(() => { submittingRef.current = submitting; }, [submitting]);
//   useEffect(() => { feedbackRef.current = feedback; }, [feedback]);
//   useEffect(() => { viewRef.current = view; }, [view]);

//   // ── Fullscreen helpers ──────────────────────────────────────────────
//   const enterFullscreen = () => {
//     const el = fullscreenRef.current || document.documentElement;
//     if (el.requestFullscreen) el.requestFullscreen();
//     else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
//     else if (el.mozRequestFullScreen) el.mozRequestFullScreen();
//   };

//   const exitFullscreen = () => {
//     if (document.exitFullscreen) document.exitFullscreen();
//     else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
//     else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
//   };

//   useEffect(() => {
//     const handleFullscreenChange = () => {
//       const isFull = !!(
//         document.fullscreenElement ||
//         document.webkitFullscreenElement ||
//         document.mozFullScreenElement
//       );
//       setIsFullscreen(isFull);
//       // Silently re-enter if user presses Escape mid-interview
//       if (!isFull && viewRef.current === "interview") {
//         setTimeout(() => enterFullscreen(), 300);
//       }
//     };
//     document.addEventListener("fullscreenchange", handleFullscreenChange);
//     document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
//     document.addEventListener("mozfullscreenchange", handleFullscreenChange);
//     return () => {
//       document.removeEventListener("fullscreenchange", handleFullscreenChange);
//       document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
//       document.removeEventListener("mozfullscreenchange", handleFullscreenChange);
//     };
//   }, []);

//   // ── Tab switch / visibility → auto-submit ───────────────────────────
//   const autoSubmitDueToTabSwitch = useCallback(async () => {
//     const currentSession = sessionRef.current;
//     const currentFeedback = feedbackRef.current;
//     const isSubmitting = submittingRef.current;
//     const qIndex = currentQuestionIndexRef.current;
//     const currentAnswer = answerRef.current;

//     if (!currentSession || currentFeedback || isSubmitting) return;

//     const answerToSubmit = currentAnswer.trim() || "[No answer provided — tab switched]";
//     setTabWarning(true);
//     toast.warning("⚠️ Tab switch detected! Answer auto-submitted.", { autoClose: 4000 });

//     try {
//       setSubmitting(true);
//       stopListening();
//       synthRef.current?.cancel();
//       setIsTalking(false);
//       const response = await submitInterviewAnswer(currentSession.sessionId, {
//         questionIndex: qIndex,
//         answer: answerToSubmit,
//       });
//       if (response.data.success) setFeedback(response.data.data);
//     } catch (error) {
//       console.error("Auto-submit error:", error);
//     } finally {
//       setSubmitting(false);
//     }
//   }, []);

//   useEffect(() => {
//     const handleVisibilityChange = () => {
//       if (document.hidden && viewRef.current === "interview") autoSubmitDueToTabSwitch();
//     };
//     const handleBlur = () => {
//       if (viewRef.current === "interview") autoSubmitDueToTabSwitch();
//     };
//     document.addEventListener("visibilitychange", handleVisibilityChange);
//     window.addEventListener("blur", handleBlur);
//     return () => {
//       document.removeEventListener("visibilitychange", handleVisibilityChange);
//       window.removeEventListener("blur", handleBlur);
//     };
//   }, [autoSubmitDueToTabSwitch]);

//   // ── Cleanup on unmount ──────────────────────────────────────────────
//   useEffect(() => {
//     loadHistory();
//     return () => {
//       if (recognitionRef.current) recognitionRef.current.stop();
//       if (synthRef.current) synthRef.current.cancel();
//     };
//   }, []);

//   // ── Auto-read question when it changes ─────────────────────────────
//   useEffect(() => {
//     if (view === "interview" && session && !feedback) {
//       setQuestionRead(false);
//       readQuestion(session.questions[currentQuestionIndex]);
//     }
//   }, [currentQuestionIndex, view, session]);

//   // Stop speech when feedback arrives
//   useEffect(() => {
//     if (feedback) { synthRef.current?.cancel(); setIsTalking(false); }
//   }, [feedback]);

//   // ── Speech synthesis ────────────────────────────────────────────────
//   const readQuestion = (text) => {
//     if (!synthRef.current) return;
//     synthRef.current.cancel();
//     setIsTalking(true);
//     setQuestionRead(false);

//     const utter = new SpeechSynthesisUtterance(text);
//     utter.rate = 0.9; utter.pitch = 1.0; utter.volume = 1;

//     // Wait for voices to load then pick best available
//     const assignVoice = () => {
//       const voices = synthRef.current.getVoices();
//       const preferred = voices.find(
//         (v) => v.name.includes("Google") || v.name.includes("Daniel") || v.name.includes("Alex") || v.lang === "en-US"
//       );
//       if (preferred) utter.voice = preferred;
//     };
//     assignVoice();
//     if (window.speechSynthesis.onvoiceschanged !== undefined) {
//       window.speechSynthesis.onvoiceschanged = assignVoice;
//     }

//     utter.onstart = () => setIsTalking(true);
//     utter.onend = () => { setIsTalking(false); setQuestionRead(true); };
//     utter.onerror = () => { setIsTalking(false); setQuestionRead(true); };

//     utteranceRef.current = utter;
//     synthRef.current.speak(utter);
//   };

//   // ── Voice recognition ───────────────────────────────────────────────
//   const startListening = () => {
//     if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
//       toast.error("Browser does not support speech recognition.");
//       return;
//     }
//     if (isTalking) { toast.info("Please wait for the question to finish reading."); return; }
//     const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
//     recognitionRef.current = new SR();
//     recognitionRef.current.continuous = true;
//     recognitionRef.current.interimResults = true;
//     recognitionRef.current.lang = "en-US";
//     recognitionRef.current.onstart = () => setIsListening(true);
//     recognitionRef.current.onresult = (event) => {
//       let final = "";
//       for (let i = event.resultIndex; i < event.results.length; i++) {
//         if (event.results[i].isFinal) final += event.results[i][0].transcript;
//       }
//       if (final) setAnswer((prev) => prev + " " + final);
//     };
//     recognitionRef.current.onerror = (event) => {
//       setIsListening(false);
//       const msgs = { "not-allowed": "Microphone access denied.", "no-speech": "No speech detected.", network: "Network error." };
//       toast.error(msgs[event.error] || `Voice error: ${event.error}`);
//     };
//     recognitionRef.current.onend = () => setIsListening(false);
//     recognitionRef.current.start();
//   };

//   const stopListening = () => {
//     if (recognitionRef.current) { recognitionRef.current.stop(); setIsListening(false); }
//   };

//   const toggleListening = () => (isListening ? stopListening() : startListening());

//   // ── Enter to submit, Shift+Enter = newline ──────────────────────────
//   const handleKeyDown = (e) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       if (!feedback && answer.trim() && !submitting && !isTalking) handleSubmitAnswer();
//     }
//   };

//   // ── Block copy / paste / cut ────────────────────────────────────────
//   const blockCopyPaste = (e) => {
//     e.preventDefault();
//     toast.info("Copy/paste is disabled during the interview.", { autoClose: 2000, toastId: "no-paste" });
//   };

//   // ── API Calls (unchanged) ───────────────────────────────────────────
//   const loadHistory = async () => {
//     try {
//       setLoading(true);
//       const response = await getInterviewHistory();
//       if (response.data.success) setHistory(response.data.data);
//     } catch (e) { console.error(e); } finally { setLoading(false); }
//   };

//   const handleStartInterview = async () => {
//     try {
//       setStartingInterview(true);
//       await new Promise((r) => setTimeout(r, 1500));
//       const response = await startInterview({});
//       if (response.data.success) {
//         setSession(response.data.data);
//         setView("interview");
//         setCurrentQuestionIndex(0);
//         setAnswer("");
//         setFeedback(null);
//         setTabWarning(false);
//         setTimeout(() => enterFullscreen(), 100);
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Failed to start interview");
//     } finally { setStartingInterview(false); }
//   };

//   const handleSubmitAnswer = async () => {
//     if (!answer.trim()) { toast.warning("Please enter an answer"); return; }
//     try {
//       setSubmitting(true);
//       stopListening();
//       const response = await submitInterviewAnswer(session.sessionId, {
//         questionIndex: currentQuestionIndex,
//         answer,
//       });
//       if (response.data.success) setFeedback(response.data.data);
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Failed to submit answer");
//     } finally { setSubmitting(false); }
//   };

//   const handleNextQuestion = async () => {
//     const next = currentQuestionIndex + 1;
//     if (next < session.questions.length) {
//       setCurrentQuestionIndex(next);
//       setAnswer(""); setFeedback(null); setTabWarning(false);
//     } else { await finishInterview(); }
//   };

//   const finishInterview = async () => {
//     try {
//       setLoading(true);
//       stopListening();
//       synthRef.current?.cancel();
//       exitFullscreen();
//       const response = await completeInterview(session.sessionId);
//       if (response.data.success) {
//         setSession(response.data.data);
//         setView("result");
//         loadHistory();
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Failed to complete interview");
//     } finally { setLoading(false); }
//   };

//   const handleDeleteInterview = async (sessionId) => {
//     const result = await Swal.fire({
//       title: "Are you sure?", text: "This action cannot be undone!", icon: "warning",
//       showCancelButton: true, confirmButtonColor: "#d33", cancelButtonColor: "#3085d6",
//       confirmButtonText: "Yes, delete it!",
//     });
//     if (!result.isConfirmed) return;
//     try {
//       const response = await deleteInterview(sessionId);
//       if (response.data.success) {
//         Swal.fire({ icon: "success", title: "Deleted!", timer: 1500, showConfirmButton: false });
//         loadHistory();
//       }
//     } catch (error) {
//       Swal.fire({ icon: "error", title: "Error!", text: error.response?.data?.message || "Failed to delete" });
//     }
//   };

//   if (loading && view !== "history") {
//     return (
//       <div className="dashboard-page flex items-center justify-center h-screen">
//         <div className="spinner"></div>
//       </div>
//     );
//   }

//   return (
//     <>
//       {startingInterview && <LoadingScreen message="Preparing your interview questions..." />}

//       <div className="dashboard-page" ref={fullscreenRef}>
//         <RefreshButton onClick={loadHistory} />

//         <div className="page-header flex justify-between items-center">
//           <div>
//             <h1 className="page-title">Mock Interview</h1>
//             <p className="page-subtitle">Practice technical questions tailored to your profile</p>
//           </div>
//           {view !== "interview" && (
//             <button
//               onClick={() => setView(view === "history" ? "start" : "history")}
//               className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-[#00d9ff] border border-[#00d9ff]/30 hover:shadow-[0_0_10px_rgba(0,217,255,0.2)] transition-all"
//             >
//               {view === "history" ? "Start New Interview" : "View History"}
//             </button>
//           )}
//         </div>

//         {/* ── START VIEW ── */}
//         {view === "start" && (
//           <div className="max-w-3xl mx-auto mt-10">
//             <div className="bg-gradient-to-br from-[#2d1b69]/80 to-[#1a103c]/90 rounded-2xl p-10 border border-[#a855f7]/30 text-center shadow-[0_0_30px_rgba(168,85,247,0.2)] relative overflow-hidden">
//               <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#a855f7] to-transparent opacity-50"></div>

//               <AIAvatar isTalking={false} isListening={false} />

//               <h2 className="text-3xl font-bold text-white mb-4 mt-4 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]">
//                 Ready for your interview?
//               </h2>
//               <p className="text-gray-300 text-lg mb-6 max-w-xl mx-auto">
//                 Our AI interviewer will <strong className="text-[#00d9ff]">speak</strong> each question aloud.
//                 Answer by voice or text and get instant scored feedback.
//               </p>

//               {/* Rules box */}
//               <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-8 text-left">
//                 <h3 className="text-yellow-400 font-bold mb-2 flex items-center gap-2">
//                   <span>⚠️</span> Interview Rules
//                 </h3>
//                 <ul className="text-yellow-200/80 text-sm space-y-1">
//                   <li>• The interview runs in <strong>fullscreen</strong> mode — do not exit.</li>
//                   <li>• <strong>Copy &amp; paste</strong> are disabled during the interview.</li>
//                   <li>• Switching tabs or losing focus will <strong>auto-submit</strong> your current answer.</li>
//                   <li>• Press <strong>Enter</strong> to submit · <strong>Shift+Enter</strong> for a new line.</li>
//                   <li>• AI reads each question aloud — click <strong>🎙️ Speak</strong> to answer by voice.</li>
//                 </ul>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 text-left">
//                 <div className="bg-white/5 p-4 rounded-xl border border-[#00d9ff]/20 hover:border-[#00d9ff]/50 transition-all group">
//                   <div className="text-[#00d9ff] font-bold text-lg mb-1 group-hover:text-white transition-colors">1. AI Voice</div>
//                   <p className="text-gray-400 text-sm">Questions are read aloud by your animated AI interviewer.</p>
//                 </div>
//                 <div className="bg-white/5 p-4 rounded-xl border border-[#a855f7]/20 hover:border-[#a855f7]/50 transition-all group">
//                   <div className="text-[#a855f7] font-bold text-lg mb-1 group-hover:text-white transition-colors">2. Speak to Answer</div>
//                   <p className="text-gray-400 text-sm">Use voice recognition to answer hands-free like a real interview.</p>
//                 </div>
//                 <div className="bg-white/5 p-4 rounded-xl border border-[#ff006e]/20 hover:border-[#ff006e]/50 transition-all group">
//                   <div className="text-[#ff006e] font-bold text-lg mb-1 group-hover:text-white transition-colors">3. Track Progress</div>
//                   <p className="text-gray-400 text-sm">Monitor your improvement over time with detailed history.</p>
//                 </div>
//               </div>

//               <button
//                 onClick={handleStartInterview}
//                 className="px-8 py-4 bg-gradient-to-r from-[#667eea] via-[#a855f7] to-[#ff006e] hover:from-[#5a6fd6] hover:via-[#9333ea] hover:to-[#e11d48] text-white font-bold rounded-xl transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(168,85,247,0.5)] text-lg flex items-center justify-center gap-3 mx-auto"
//               >
//                 🚀 Start Interview Session
//               </button>
//             </div>
//           </div>
//         )}

//         {/* ── INTERVIEW VIEW ── */}
//         {view === "interview" && session && (
//           <div className="max-w-6xl mx-auto mt-6">
//             {/* Tab switch banner */}
//             {tabWarning && (
//               <div className="mb-4 bg-red-500/15 border border-red-500/40 rounded-xl px-4 py-3 text-red-300 text-sm flex items-center gap-2">
//                 <span>🚨</span>
//                 <span>Tab switch detected — your answer was auto-submitted. Please stay focused on this tab.</span>
//               </div>
//             )}

//             {/* Progress */}
//             <div className="flex justify-between items-center mb-6">
//               <div className="text-gray-400">
//                 Question {currentQuestionIndex + 1} of {session.questions.length}
//               </div>
//               <div className="w-1/2 bg-gray-700 rounded-full h-2">
//                 <div
//                   className="bg-[#00f5a0] h-2 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(0,245,160,0.5)]"
//                   style={{ width: `${((currentQuestionIndex + 1) / session.questions.length) * 100}%` }}
//                 ></div>
//               </div>
//             </div>

//             {/* Split layout */}
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

//               {/* LEFT: AI Avatar + Question */}
//               <div className="bg-gradient-to-br from-[#1a0a3c]/90 to-[#0d0620]/95 rounded-2xl p-8 border border-[#a855f7]/30 shadow-[0_0_30px_rgba(168,85,247,0.15)] flex flex-col items-center">
//                 <AIAvatar isTalking={isTalking} isListening={isListening} />

//                 <div className="mt-6 w-full">
//                   <div className="flex items-center gap-2 mb-3">
//                     <span className="w-2 h-2 rounded-full bg-[#a855f7] shadow-[0_0_6px_#a855f7]"></span>
//                     <span className="text-xs uppercase tracking-widest text-[#a855f7] font-semibold">Question</span>
//                   </div>
//                   <div
//                     className={`bg-black/30 rounded-xl p-5 border transition-all duration-500 ${
//                       isTalking ? "border-[#00d9ff]/60 shadow-[0_0_20px_rgba(0,217,255,0.15)]" : "border-white/10"
//                     }`}
//                   >
//                     <p className="text-white text-lg leading-relaxed font-medium">
//                       {session.questions[currentQuestionIndex]}
//                     </p>
//                   </div>
//                   {!isTalking && (
//                     <button
//                       onClick={() => readQuestion(session.questions[currentQuestionIndex])}
//                       className="mt-3 text-xs text-[#a855f7] hover:text-white flex items-center gap-1 transition-colors"
//                     >
//                       🔁 Replay question
//                     </button>
//                   )}
//                 </div>
//               </div>

//               {/* RIGHT: Answer Panel */}
//               <div className="bg-gradient-to-br from-[#0d1a2e]/90 to-[#060d1a]/95 rounded-2xl p-8 border border-[#00d9ff]/20 shadow-[0_0_30px_rgba(0,217,255,0.1)] flex flex-col">
//                 {!feedback ? (
//                   <>
//                     <div className="flex items-center gap-2 mb-3">
//                       <span className="w-2 h-2 rounded-full bg-[#00d9ff] shadow-[0_0_6px_#00d9ff]"></span>
//                       <span className="text-xs uppercase tracking-widest text-[#00d9ff] font-semibold">Your Answer</span>
//                       {isListening && (
//                         <span className="ml-auto text-xs text-[#00f5a0] font-medium animate-pulse flex items-center gap-1">
//                           <span className="w-1.5 h-1.5 rounded-full bg-[#00f5a0] animate-ping inline-block"></span>
//                           Listening...
//                         </span>
//                       )}
//                     </div>

//                     <div
//                       className={`relative flex-1 min-h-[200px] bg-black/30 rounded-xl border transition-all duration-300 ${
//                         isListening ? "border-[#00f5a0]/60 shadow-[0_0_15px_rgba(0,245,160,0.1)]" : "border-white/10"
//                       }`}
//                     >
//                       <textarea
//                         ref={textareaRef}
//                         value={answer}
//                         onChange={(e) => setAnswer(e.target.value)}
//                         onKeyDown={handleKeyDown}
//                         onCopy={blockCopyPaste}
//                         onPaste={blockCopyPaste}
//                         onCut={blockCopyPaste}
//                         onContextMenu={(e) => e.preventDefault()}
//                         placeholder={
//                           isTalking
//                             ? "🎤 AI is reading the question..."
//                             : questionRead
//                             ? "Click 🎙️ Speak or type here... (Enter to submit)"
//                             : "Waiting for question to finish..."
//                         }
//                         className="w-full h-full bg-transparent p-4 text-white placeholder-gray-500 focus:outline-none resize-none min-h-[220px] select-none"
//                         style={{ userSelect: "none" }}
//                       />
//                       <div className="absolute bottom-3 left-4 text-gray-600 text-xs pointer-events-none">
//                         Enter to submit · Shift+Enter for new line
//                       </div>
//                     </div>

//                     <div className="flex items-center gap-3 mt-4">
//                       {/* Mic */}
//                       <button
//                         onClick={toggleListening}
//                         disabled={isTalking}
//                         title={isListening ? "Stop Recording" : "Start Recording"}
//                         className={`p-4 rounded-2xl font-bold transition-all flex items-center gap-2 ${
//                           isListening
//                             ? "bg-[#ff006e] text-white shadow-[0_0_20px_rgba(255,0,110,0.5)] animate-pulse"
//                             : isTalking
//                             ? "bg-gray-700 text-gray-500 cursor-not-allowed"
//                             : "bg-[#a855f7]/20 hover:bg-[#a855f7]/40 text-[#a855f7] border border-[#a855f7]/30"
//                         }`}
//                       >
//                         {isListening ? (
//                           <>
//                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
//                               <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25v-9z" />
//                             </svg>
//                             Stop
//                           </>
//                         ) : (
//                           <>
//                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
//                               <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
//                             </svg>
//                             Speak
//                           </>
//                         )}
//                       </button>

//                       {answer && (
//                         <button
//                           onClick={() => setAnswer("")}
//                           className="px-4 py-3 rounded-xl text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-sm"
//                         >
//                           Clear
//                         </button>
//                       )}

//                       <button
//                         onClick={handleSubmitAnswer}
//                         disabled={submitting || !answer.trim() || isTalking}
//                         className="ml-auto px-6 py-3 bg-gradient-to-r from-[#00d9ff]/20 to-[#00d9ff]/10 hover:from-[#00d9ff]/40 hover:to-[#00d9ff]/20 text-[#00d9ff] font-bold rounded-xl border border-[#00d9ff]/30 hover:shadow-[0_0_15px_rgba(0,217,255,0.3)] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
//                       >
//                         {submitting ? (
//                           <div className="spinner w-4 h-4 border-[#00d9ff]"></div>
//                         ) : (
//                           <>
//                             Submit Answer
//                             <kbd className="px-1.5 py-0.5 bg-[#00d9ff]/10 border border-[#00d9ff]/30 rounded text-xs">↵</kbd>
//                           </>
//                         )}
//                       </button>
//                     </div>
//                   </>
//                 ) : (
//                   /* Feedback panel */
//                   <div className="animate-fade-in flex flex-col gap-4">
//                     <div className="flex items-center gap-2 mb-1">
//                       <span className="w-2 h-2 rounded-full bg-[#00f5a0] shadow-[0_0_6px_#00f5a0]"></span>
//                       <span className="text-xs uppercase tracking-widest text-[#00f5a0] font-semibold">Feedback</span>
//                     </div>

//                     <div className="bg-black/30 rounded-xl p-4 border border-white/10">
//                       <h4 className="text-gray-400 text-xs mb-2 uppercase tracking-wider">Your Answer</h4>
//                       <p className="text-gray-300 italic text-sm leading-relaxed">{answer}</p>
//                     </div>

//                     <div
//                       className={`rounded-xl p-5 border ${
//                         feedback.score >= 7 ? "bg-[#00f5a0]/10 border-[#00f5a0]/30"
//                           : feedback.score >= 4 ? "bg-[#ffd700]/10 border-[#ffd700]/30"
//                           : "bg-[#ff006e]/10 border-[#ff006e]/30"
//                       }`}
//                     >
//                       <div className="flex justify-between items-center mb-3">
//                         <h4 className="font-bold text-white text-base">AI Feedback</h4>
//                         <div
//                           className={`px-3 py-1 rounded-full font-bold text-sm ${
//                             feedback.score >= 7 ? "bg-[#00f5a0]/20 text-[#00f5a0]"
//                               : feedback.score >= 4 ? "bg-[#ffd700]/20 text-[#ffd700]"
//                               : "bg-[#ff006e]/20 text-[#ff006e]"
//                           }`}
//                         >
//                           Score: {feedback.score}/10
//                         </div>
//                       </div>
//                       <p className="text-gray-200 leading-relaxed text-sm">{feedback.feedback}</p>
//                     </div>

//                     <button
//                       onClick={handleNextQuestion}
//                       className="w-full py-3 bg-white text-indigo-900 font-bold rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 mt-2"
//                     >
//                       {currentQuestionIndex < session.questions.length - 1 ? "Next Question →" : "Finish Interview 🎉"}
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* ── RESULT VIEW ── */}
//         {view === "result" && session && (
//           <div className="max-w-2xl mx-auto mt-10 text-center">
//             <div className="bg-gradient-to-br from-[#2d1b69]/80 to-[#1a103c]/90 rounded-3xl p-10 border border-[#a855f7]/30 backdrop-blur-sm shadow-[0_0_30px_rgba(168,85,247,0.2)]">
//               <div className="w-24 h-24 bg-[#00f5a0]/20 rounded-full flex items-center justify-center mx-auto mb-6 text-5xl animate-bounce shadow-[0_0_20px_rgba(0,245,160,0.4)]">
//                 🏆
//               </div>
//               <h2 className="text-3xl font-bold text-white mb-2">Interview Completed!</h2>
//               <p className="text-gray-400 mb-8">Great job on completing the session.</p>
//               <div className="flex justify-center gap-8 mb-10">
//                 <div className="text-center">
//                   <div className="text-4xl font-bold text-white mb-1">{session.performanceMetrics?.averageScore ?? "-"}</div>
//                   <div className="text-sm text-gray-400 uppercase tracking-wider">Avg Score</div>
//                 </div>
//                 <div className="w-px bg-white/10"></div>
//                 <div className="text-center">
//                   <div className="text-4xl font-bold text-white mb-1">{session.performanceMetrics?.totalQuestions ?? "-"}</div>
//                   <div className="text-sm text-gray-400 uppercase tracking-wider">Questions</div>
//                 </div>
//                 <div className="w-px bg-white/10"></div>
//                 <div className="text-center">
//                   <div className="text-4xl font-bold text-white mb-1">{Math.floor((session.performanceMetrics?.averageScore ?? 0) / 2)}</div>
//                   <div className="text-sm text-gray-400 uppercase tracking-wider">Rating</div>
//                 </div>
//               </div>
//               <div className="flex justify-center gap-4">
//                 <button onClick={() => setView("history")} className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-colors">
//                   View History
//                 </button>
//                 <button onClick={handleStartInterview} className="px-6 py-3 bg-gradient-to-r from-[#667eea] to-[#a855f7] hover:from-[#5a6fd6] hover:to-[#9333ea] text-white font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(168,85,247,0.4)]">
//                   Start New Session
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* ── HISTORY VIEW ── */}
//         {view === "history" && (
//           <div className="mt-8">
//             {history.length === 0 ? (
//               <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10">
//                 <p className="text-gray-400 text-lg mb-4">No interview history found.</p>
//                 <button onClick={() => setView("start")} className="text-[#a855f7] hover:text-[#9333ea] underline">
//                   Start your first interview
//                 </button>
//               </div>
//             ) : (
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {history.map((item) => (
//                   <div key={item._id} className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-indigo-500/50 transition-colors group">
//                     <div className="flex justify-between items-start mb-4">
//                       <div className="text-gray-400 text-sm">{new Date(item.startedAt).toLocaleDateString()}</div>
//                       <div className="flex items-center gap-2">
//                         <div className={`px-2 py-1 rounded text-xs font-bold ${item.status === "completed" ? "bg-[#00f5a0]/20 text-[#00f5a0]" : "bg-[#ffd700]/20 text-[#ffd700]"}`}>
//                           {item.status === "completed" ? "Completed" : "In Progress"}
//                         </div>
//                         <button
//                           onClick={() => handleDeleteInterview(item._id)}
//                           className="p-1.5 rounded hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors"
//                           title="Delete"
//                         >
//                           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
//                             <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
//                           </svg>
//                         </button>
//                       </div>
//                     </div>
//                     <div className="mb-4">
//                       <div className="text-3xl font-bold text-white mb-1">
//                         {item?.performanceMetrics?.averageScore != null
//                           ? Math.round(item.performanceMetrics.averageScore / 10)
//                           : "-"}
//                         <span className="text-lg text-gray-500">/10</span>
//                       </div>
//                       <div className="text-xs text-gray-400 uppercase tracking-wide">Average Score</div>
//                     </div>
//                     <div className="grid grid-cols-2 gap-4 text-sm">
//                       <div>
//                         <span className="text-gray-500 block">Questions</span>
//                         <span className="text-white font-semibold">{item?.performanceMetrics?.totalQuestions ?? "-"}</span>
//                       </div>
//                       <div className="text-right">
//                         <span className="text-gray-500 block">Duration</span>
//                         <span className="text-white font-semibold">
//                           {item.completedAt
//                             ? Math.round((new Date(item.completedAt) - new Date(item.startedAt)) / 60000) + " min"
//                             : "-"}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default Interview;
