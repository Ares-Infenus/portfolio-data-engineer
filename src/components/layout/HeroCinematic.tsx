"use client";

import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  animate,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";

// ═══════════════════════════════════════════════════════════════
// GLITCH TEXT — nombre que se revela con interferencia
// ═══════════════════════════════════════════════════════════════
const GLITCH_CHARS = "!<>-_\\/[]{}—=+*^?#∆ΩΛΣΞΠ";

function GlitchReveal({ text, delay = 0 }: { text: string; delay?: number }) {
  const [displayed, setDisplayed] = useState(Array(text.length).fill(""));
  const [done, setDone] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      let frame = 0;
      const totalFrames = 18;
      const interval = setInterval(() => {
        frame++;
        setDisplayed(
          text.split("").map((char, i) => {
            const revealAt = Math.floor((i / text.length) * totalFrames * 0.7);
            if (frame > revealAt + 4) return char;
            if (char === " ") return " ";
            return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
          })
        );
        if (frame >= totalFrames) {
          clearInterval(interval);
          setDisplayed(text.split(""));
          setDone(true);
        }
      }, 55);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timeout);
  }, [text, delay]);

  return (
    <span className={`transition-all duration-300 ${done ? "opacity-100" : "opacity-80"}`}>
      {displayed.map((c, i) => (
        <span
          key={i}
          style={{
            color: done || c === text[i] ? "inherit" : "rgba(16,185,129,0.6)",
            fontFamily: done || c === text[i] ? "inherit" : "monospace",
          }}
        >
          {c || "\u00A0"}
        </span>
      ))}
    </span>
  );
}

// ═══════════════════════════════════════════════════════════════
// CURSOR PERSONALIZADO
// ═══════════════════════════════════════════════════════════════
function CustomCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springX = useSpring(cursorX, { stiffness: 500, damping: 40 });
  const springY = useSpring(cursorY, { stiffness: 500, damping: 40 });

  const trailX = useSpring(cursorX, { stiffness: 120, damping: 25 });
  const trailY = useSpring(cursorY, { stiffness: 120, damping: 25 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <>
      {/* Dot principal */}
      <motion.div
        style={{ left: springX, top: springY, translateX: "-50%", translateY: "-50%" }}
        className="fixed w-2 h-2 bg-emerald-power rounded-full pointer-events-none z-[9999] mix-blend-difference"
      />
      {/* Anillo de trail */}
      <motion.div
        style={{ left: trailX, top: trailY, translateX: "-50%", translateY: "-50%" }}
        className="fixed w-8 h-8 border border-emerald-power/40 rounded-full pointer-events-none z-[9998]"
      />
    </>
  );
}

// ═══════════════════════════════════════════════════════════════
// LÍNEAS DE DATOS LATERALES — Ambient data stream
// ═══════════════════════════════════════════════════════════════
const DATA_LINES_LEFT = [
  "SYS.BOOT // READY",
  "LAT: 10.9878° N",
  "LON: 74.7889° W",
  "STATUS: OPERATIONAL",
  "CLEARANCE: ALPHA-7",
  "DOMAIN: DATA.ENG",
  "UPTIME: 99.98%",
  "THREAT_LVL: ZERO",
];

const DATA_LINES_RIGHT = [
  "ML.OPS // ACTIVE",
  "CLOUD: MULTI",
  "CRED: 17 VERIFIED",
  "INST: 8 GLOBAL",
  "MODE: ARCHITECT",
  "FOCUS: MAXIMUM",
  "EXECUTION: COLD",
  "ETA: NOW",
];

function DataStream({ lines, side }: { lines: string[]; side: "left" | "right" }) {
  return (
    <div
      className={`absolute top-0 bottom-0 flex flex-col justify-center gap-3 pointer-events-none hidden xl:flex ${
        side === "left" ? "left-6" : "right-6"
      }`}
    >
      {lines.map((line, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.25, 0.08] }}
          transition={{ duration: 4, delay: 2 + i * 0.3, repeat: Infinity, repeatDelay: Math.random() * 8 + 4 }}
          className={`font-mono text-[0.38rem] text-emerald-power uppercase tracking-[0.25em] ${
            side === "right" ? "text-right" : "text-left"
          }`}
        >
          {line}
        </motion.div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// CORNER BRACKETS — decoración de visor táctil
// ═══════════════════════════════════════════════════════════════
function CornerBrackets({ className = "" }: { className?: string }) {
  const size = 18;
  const stroke = "rgba(16,185,129,0.5)";
  return (
    <svg
      width={size * 2}
      height={size * 2}
      className={`absolute pointer-events-none ${className}`}
      viewBox={`0 0 ${size * 2} ${size * 2}`}
    >
      {/* TL */}
      <path d={`M0,${size} L0,0 L${size},0`} fill="none" stroke={stroke} strokeWidth="1" />
      {/* TR */}
      <path d={`M${size},0 L${size * 2},0 L${size * 2},${size}`} fill="none" stroke={stroke} strokeWidth="1" />
      {/* BL */}
      <path d={`M0,${size} L0,${size * 2} L${size},${size * 2}`} fill="none" stroke={stroke} strokeWidth="1" />
      {/* BR */}
      <path d={`M${size},${size * 2} L${size * 2},${size * 2} L${size * 2},${size}`} fill="none" stroke={stroke} strokeWidth="1" />
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════
// PORTRAIT — La foto con todos los efectos
// ═══════════════════════════════════════════════════════════════
function Portrait({ mouseX, mouseY }: { mouseX: any; mouseY: any }) {
  const rotateY = useTransform(mouseX, [-300, 300], ["-4deg", "4deg"]);
  const rotateX = useTransform(mouseY, [-300, 300], ["3deg", "-3deg"]);
  const springRotY = useSpring(rotateY, { stiffness: 80, damping: 20 });
  const springRotX = useSpring(rotateX, { stiffness: 80, damping: 20 });

  return (
    <motion.div
      initial={{ opacity: 0, x: 80, filter: "blur(20px)" }}
      animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
      transition={{ duration: 1.4, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
      style={{ rotateY: springRotY, rotateX: springRotX, transformStyle: "preserve-3d" }}
      className="relative flex-shrink-0 select-none"
    >
      {/* Resplandor de fondo atmosférico */}
      <div className="absolute -inset-12 z-0">
        <div className="absolute inset-0 bg-emerald-power/8 blur-[80px] rounded-full" />
        <div className="absolute inset-8 bg-emerald-power/5 blur-[50px] rounded-full" />
      </div>

      {/* Marco exterior pulsante */}
      <motion.div
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -inset-3 border border-emerald-power/15 z-0"
      />

      {/* Contenedor de imagen */}
      <div
        className="relative w-[300px] h-[420px] md:w-[380px] md:h-[520px] z-10 overflow-hidden"
        style={{ clipPath: "polygon(0 0, 95% 0, 100% 5%, 100% 100%, 5% 100%, 0 95%)" }}
      >
        {/* Imagen */}
        <img
          src="/img2.png"
          alt="Sebastian Pinzon — Data Engineer"
          className="w-full h-full object-cover object-top select-none drag-none"
          style={{
            filter: "grayscale(20%) contrast(1.12) brightness(0.9) saturate(0.85)",
          }}
          draggable={false}
        />

        {/* Duotone emerald overlay */}
        <div
          className="absolute inset-0 mix-blend-color pointer-events-none"
          style={{ background: "linear-gradient(160deg, rgba(16,185,129,0.08) 0%, transparent 60%)" }}
        />

        {/* Gradient inferior — fade al negro */}
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />

        {/* Scanline sutil */}
        <motion.div
          animate={{ y: ["-100%", "200%"] }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear", repeatDelay: 4 }}
          className="absolute left-0 right-0 h-24 pointer-events-none"
          style={{
            background: "linear-gradient(to bottom, transparent, rgba(16,185,129,0.04), transparent)",
          }}
        />

        {/* Vignette bordes */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            boxShadow: "inset 0 0 60px rgba(0,0,0,0.6), inset 2px 2px 0 rgba(16,185,129,0.1)",
          }}
        />

        {/* Badge de estado — esquina inferior */}
        <div className="absolute bottom-5 left-5 right-5">
          <div className="flex items-center gap-2 mb-2">
            <motion.div
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-emerald-power"
            />
            <span className="font-mono text-[0.45rem] text-emerald-power/80 uppercase tracking-[0.4em]">
              Active — Available
            </span>
          </div>
          <div className="h-px bg-gradient-to-r from-emerald-power/40 to-transparent" />
        </div>
      </div>

      {/* Corner brackets en las esquinas del retrato */}
      <CornerBrackets className="-top-1 -left-1" />

      {/* Línea lateral derecha decorativa */}
      <div className="absolute top-8 -right-4 bottom-8 w-px">
        <div className="w-full h-full bg-gradient-to-b from-transparent via-emerald-power/30 to-transparent" />
      </div>
      {/* Dot en la línea */}
      <motion.div
        animate={{ top: ["10%", "90%", "10%"] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -right-[17px] w-[5px] h-[5px] bg-emerald-power rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)]"
      />
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════
// HERO PRINCIPAL
// ═══════════════════════════════════════════════════════════════
export default function HeroCinematic() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  const yText = useTransform(scrollY, [0, 700], [0, 220]);
  const opacityHero = useTransform(scrollY, [0, 600], [1, 0]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      mouseX.set(e.clientX - window.innerWidth / 2);
      mouseY.set(e.clientY - window.innerHeight / 2);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <>
      <CustomCursor />

      <section
        ref={containerRef}
        className="relative min-h-screen flex items-center justify-center bg-bg overflow-hidden cursor-none"
      >
        {/* ── FONDO — Capas atmosféricas ── */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Ruido de grano */}
          <div
            className="absolute inset-0 opacity-[0.035] mix-blend-overlay"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
              backgroundSize: "128px",
            }}
          />

          {/* Grid perspectiva muy tenue */}
          <div
            className="absolute inset-0 opacity-[0.022]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)`,
              backgroundSize: "80px 80px",
              maskImage: "radial-gradient(ellipse 90% 80% at 60% 50%, black, transparent)",
            }}
          />

          {/* Glow esmeralda — centrado a la derecha donde está la foto */}
          <motion.div
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute right-[15%] top-1/2 -translate-y-1/2 w-[600px] h-[700px] rounded-full"
            style={{ background: "radial-gradient(ellipse, rgba(16,185,129,0.06) 0%, transparent 70%)" }}
          />

          {/* Vignette global */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_90%_at_50%_50%,transparent_40%,rgba(0,0,0,0.7)_100%)]" />

          {/* Borde superior sutil */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-power/20 to-transparent" />
        </div>

        {/* ── DATA STREAMS laterales ── */}
        <DataStream lines={DATA_LINES_LEFT} side="left" />
        <DataStream lines={DATA_LINES_RIGHT} side="right" />

        {/* ── CONTENIDO PRINCIPAL ── */}
        <motion.div
          style={{ opacity: opacityHero }}
          className="container mx-auto px-6 relative z-10 flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20 xl:gap-32 min-h-screen py-20"
        >
          {/* ═══ TEXTO ═══ */}
          <motion.div
            style={{ y: yText }}
            className="flex-1 max-w-2xl text-center lg:text-left"
          >
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.4 }}
              className="flex items-center justify-center lg:justify-start gap-3 mb-10"
            >
              <motion.div
                animate={{ scaleX: [0, 1] }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="h-px w-10 bg-emerald-power origin-left"
              />
              <span className="font-mono text-[0.52rem] text-emerald-power/70 tracking-[0.7em] uppercase">
                Data Engineer & ML Architect
              </span>
              <motion.div
                animate={{ scaleX: [0, 1] }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="h-px w-10 bg-emerald-power origin-right"
              />
            </motion.div>

            {/* NOMBRE — El momento de más peso */}
            <div className="mb-6 overflow-hidden">
              <motion.div
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1.1, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                <p className="font-mono text-[0.55rem] text-white/20 uppercase tracking-[0.6em] mb-3">
                  Identificado como
                </p>
                <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-white leading-[0.9] tracking-[-0.02em]">
                  <GlitchReveal text="Sebastián" delay={900} />
                  <br />
                  <GlitchReveal text="Pinzón" delay={1100} />
                  <br />
                  <span className="text-white/15 italic font-light text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
                    <GlitchReveal text="Zambrano." delay={1300} />
                  </span>
                </h1>
              </motion.div>
            </div>

            {/* Separador */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 1.8, ease: [0.16, 1, 0.3, 1] }}
              className="h-px bg-gradient-to-r from-emerald-power/50 via-emerald-power/20 to-transparent mb-8 origin-left"
            />

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, delay: 2 }}
              className="font-sans text-white/35 text-base md:text-lg leading-relaxed mb-10 font-light max-w-md mx-auto lg:mx-0"
            >
              Donde los datos caóticos se convierten en{" "}
              <span className="text-white/65 font-normal">sistemas que dominan.</span>{" "}
              Arquitecto de inteligencia en la nube. Estratega frío. Ejecutor preciso.
            </motion.p>

            {/* SKILLS — mini indicadores */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 2.2 }}
              className="flex flex-wrap gap-2 justify-center lg:justify-start mb-12"
            >
              {["AWS", "GCP", "Azure", "MLOps", "TensorFlow", "Python", "SQL"].map((tag, i) => (
                <motion.span
                  key={tag}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 2.3 + i * 0.07 }}
                  className="font-mono text-[0.45rem] text-white/25 border border-white/8 px-3 py-1.5 uppercase tracking-widest hover:border-emerald-power/30 hover:text-emerald-power/60 transition-all duration-300 cursor-none"
                >
                  {tag}
                </motion.span>
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 2.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center"
            >
              {/* CTA primario */}
              <button
                onClick={() => document.getElementById("proyectos")?.scrollIntoView({ behavior: "smooth" })}
                className="group relative px-10 py-4 overflow-hidden border border-emerald-power/40 hover:border-emerald-power transition-colors duration-400 cursor-none"
              >
                <motion.div
                  initial={false}
                  className="absolute inset-0 bg-emerald-power/0 group-hover:bg-emerald-power/8 transition-colors duration-400"
                />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                  style={{ background: "linear-gradient(90deg, rgba(16,185,129,0.1) 0%, transparent 100%)" }} />
                <span className="relative font-mono text-[0.55rem] tracking-[0.4em] uppercase text-white/70 group-hover:text-emerald-power transition-colors duration-300">
                  Ver Proyectos
                </span>
              </button>

              {/* CTA secundario — texto */}
              <button
                onClick={() => document.getElementById("trayectoria")?.scrollIntoView({ behavior: "smooth" })}
                className="font-mono text-[0.5rem] text-white/20 uppercase tracking-[0.5em] hover:text-white/50 transition-colors duration-300 cursor-none"
              >
                Explorar Trayectoria →
              </button>
            </motion.div>
          </motion.div>

          {/* ═══ RETRATO ═══ */}
          <Portrait mouseX={mouseX} mouseY={mouseY} />
        </motion.div>

        {/* ── SCROLL INDICATOR ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2"
          >
            <span className="font-mono text-[0.4rem] text-white/15 uppercase tracking-[0.8em]">
              Scroll
            </span>
            <motion.div
              animate={{ height: ["20px", "50px", "20px"], opacity: [0.2, 0.6, 0.2] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-px bg-gradient-to-b from-emerald-power/60 to-transparent"
            />
          </motion.div>
        </motion.div>

        {/* ── NÚMERO DE SECCIÓN ── */}
        <div className="absolute bottom-10 right-10 hidden lg:block">
          <span className="font-mono text-[0.4rem] text-white/10 uppercase tracking-[0.6em]">
            01 / IDENTITY
          </span>
        </div>

        {/* ── AÑO — esquina superior derecha ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
          className="absolute top-8 right-8 hidden lg:block"
        >
          <span className="font-mono text-[0.4rem] text-white/12 uppercase tracking-[0.5em]">
            © 2025
          </span>
        </motion.div>
      </section>
    </>
  );
}