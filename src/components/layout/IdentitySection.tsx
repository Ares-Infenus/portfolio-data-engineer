"use client";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  AnimatePresence,
  useInView,
} from "framer-motion";
import { useRef, useState, useEffect } from "react";

// ═══════════════════════════════════════════════════════════════════
// DATOS
// ═══════════════════════════════════════════════════════════════════
const FACETS = [
  {
    code: "SYS.01",
    title: "Arquitecto\nde Datos",
    sub: "Data Engineering · ETL · Pipelines",
    stat: { n: "63%", label: "mejora en eficiencia operativa" },
    line: "Convierto caos en sistemas que respiran solos.",
  },
  {
    code: "SYS.02",
    title: "Estratega\nde ML",
    sub: "MLOps · Deep Learning · Production",
    stat: { n: "15%", label: "ganancia en precisión predictiva" },
    line: "No entreno modelos. Entreno sistemas que dominan.",
  },
  {
    code: "SYS.03",
    title: "Ejecutor\nFrío",
    sub: "Cloud · AWS · GCP · Azure",
    stat: { n: "4×", label: "plataformas cloud certificadas" },
    line: "Cada reto es una ecuación. La resuelvo.",
  },
];

const TIMELINE = [
  { year: "2023–24", role: "Gerente General",              place: "Imperio del Plástico",         note: "−12% costos · +13% crecimiento" },
  { year: "2024–25", role: "Formación Intensiva",           place: "Stanford · Duke · Harvard",    note: "17 credenciales · 10 meses" },
  { year: "2025→",   role: "Aux. Admin. & Comunicaciones", place: "Ejército Nacional de Colombia", note: "Presión máxima · Decisión bajo fuego" },
];

const STACK = ["Python","R","SQL","TensorFlow","MLflow","AWS","GCP","Azure","Kafka","TimescaleDB","PostgreSQL","DVC","Optuna","dbt","Docker","Scikit-learn","XGBoost","Airflow"];

// ═══════════════════════════════════════════════════════════════════
// HOOK — ancho real de ventana (el mismo patrón probado)
// ═══════════════════════════════════════════════════════════════════
function useWindowWidth() {
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1440
  );
  useEffect(() => {
    const update = () => setWidth(window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return width;
}

// ═══════════════════════════════════════════════════════════════════
// CONTADOR ANIMADO
// ═══════════════════════════════════════════════════════════════════
function useCountUp(target: string, trigger: boolean) {
  const [val, setVal] = useState(target);
  useEffect(() => {
    if (!trigger) return;
    const num = parseFloat(target.replace(/[^0-9.]/g, ""));
    const suffix = target.replace(/[0-9.]/g, "");
    if (isNaN(num)) { setVal(target); return; }
    let start = 0;
    const duration = 1600;
    const step = 16;
    const inc = num / (duration / step);
    const timer = setInterval(() => {
      start = Math.min(start + inc, num);
      const display = Number.isInteger(num) ? Math.floor(start) : start.toFixed(0);
      setVal(`${display}${suffix}`);
      if (start >= num) clearInterval(timer);
    }, step);
    return () => clearInterval(timer);
  }, [trigger, target]);
  return val;
}

// ═══════════════════════════════════════════════════════════════════
// MAGNETIC SIGNATURE
// ═══════════════════════════════════════════════════════════════════
function MagneticSignature({ w }: { w: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 150, damping: 18 });
  const smy = useSpring(my, { stiffness: 150, damping: 18 });
  const isMobile = w < 640;

  const handleMove = (e: React.MouseEvent) => {
    if (isMobile) return;
    const r = ref.current!.getBoundingClientRect();
    mx.set((e.clientX - r.left - r.width / 2) * 0.35);
    my.set((e.clientY - r.top - r.height / 2) * 0.35);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={() => { mx.set(0); my.set(0); }}
      style={{ x: smx, y: smy }}
      className="flex items-center gap-4 border-t border-white/[0.05] w-fit"
      css-cursor="none"
      style={{
        paddingTop: isMobile ? "0.85rem" : "clamp(0.85rem,1.2vw,1.5rem)",
        marginTop:  isMobile ? "0.85rem" : "clamp(0.85rem,1.2vw,1.5rem)",
        x: smx, y: smy,
      }}
    >
      {/* Logo giratorio */}
      <div className="relative shrink-0" style={{ width: "2rem", height: "2rem" }}>
        <motion.div
          animate={{ rotate: [0, 90, 180, 270, 360] }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="w-5 h-5 rotate-45 border" style={{ borderColor: "rgba(16,185,129,0.3)" }} />
        </motion.div>
        <motion.div
          animate={{ rotate: [360, 270, 180, 90, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="w-3 h-3 rotate-45 border" style={{ borderColor: "rgba(16,185,129,0.5)" }} />
        </motion.div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-1 h-1 rotate-45" style={{ background: "rgb(16,185,129)" }} />
        </div>
      </div>

      <div>
        <motion.div
          className="font-serif italic"
          style={{ fontSize: isMobile ? "0.8rem" : "clamp(0.8rem,1vw,1rem)", color: "rgba(255,255,255,0.3)" }}
          whileHover={{ color: "rgba(16,185,129,0.5)" }}
        >
          Sebastián Pinzón Zambrano
        </motion.div>
        <div
          className="font-mono uppercase"
          style={{
            fontSize: "0.37rem",
            letterSpacing: "0.45em",
            color: "rgba(255,255,255,0.1)",
            marginTop: "0.2rem",
          }}
        >
          Barranquilla, Colombia · Remote-First · Global
        </div>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// FACET CARD — tilt 3D desactivado en mobile, escalado con clamp
// ═══════════════════════════════════════════════════════════════════
function FacetCard({ f, i, w }: { f: typeof FACETS[0]; i: number; w: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [hovered, setHovered] = useState(false);
  const statVal = useCountUp(f.stat.n, inView && hovered);
  const isMobile = w < 640;

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 260, damping: 28 });
  const smy = useSpring(my, { stiffness: 260, damping: 28 });
  const rotX = useTransform(smy, [-0.5, 0.5], ["6deg", "-6deg"]);
  const rotY = useTransform(smx, [-0.5, 0.5], ["-6deg", "6deg"]);
  const glowX = useTransform(smx, [-0.5, 0.5], ["20%", "80%"]);
  const glowY = useTransform(smy, [-0.5, 0.5], ["20%", "80%"]);

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile) return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };

  const innerPad = isMobile
    ? "1.25rem"
    : "clamp(1.5rem,2.5vw,2.75rem)";

  const minH = isMobile ? "240px" : "clamp(280px,28vw,380px)";

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)" }}
      animate={inView ? { opacity: 1, y: 0, clipPath: "polygon(0 0%, 100% 0%, 100% 100%, 0 100%)" } : {}}
      transition={{ duration: 1.1, delay: i * 0.18, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouse}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { mx.set(0); my.set(0); setHovered(false); }}
      style={{
        rotateX: isMobile ? 0 : rotX,
        rotateY: isMobile ? 0 : rotY,
        transformStyle: "preserve-3d",
      }}
      className="relative border border-white/[0.06] overflow-hidden"
      css-cursor="none"
    >
      {/* Glow cursor-follow */}
      {!isMobile && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: hovered ? 1 : 0,
            background: useTransform(
              [glowX, glowY] as any,
              ([x, y]: any) => `radial-gradient(circle at ${x} ${y}, rgba(16,185,129,0.1), transparent 65%)`
            ),
            transition: "opacity 0.5s",
          }}
        />
      )}

      {/* Línea top hover */}
      <motion.div
        animate={{ scaleX: hovered ? 1 : 0 }}
        initial={{ scaleX: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-0 left-0 right-0 h-px origin-left pointer-events-none z-20"
        style={{ background: "linear-gradient(90deg, rgb(16,185,129), rgba(16,185,129,0.1), transparent)" }}
      />

      {/* Scanline de boot */}
      <motion.div
        initial={{ top: "-30%" }}
        animate={inView ? { top: "130%" } : { top: "-30%" }}
        transition={{ duration: 1.5, delay: 0.3 + i * 0.18, ease: "easeInOut" }}
        className="absolute left-0 w-full h-20 pointer-events-none z-10"
        style={{ background: "linear-gradient(to bottom, transparent, rgba(16,185,129,0.07), transparent)" }}
      />

      {/* Contenido */}
      <div
        className="relative z-10 flex flex-col justify-between"
        style={{
          padding: innerPad,
          minHeight: minH,
          transform: isMobile ? "none" : "translateZ(25px)",
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between" style={{ marginBottom: isMobile ? "1rem" : "clamp(1rem,2vw,2.5rem)" }}>
          <motion.span
            animate={{ color: hovered ? "rgba(16,185,129,0.7)" : "rgba(16,185,129,0.3)" }}
            className="font-mono"
            style={{ fontSize: "clamp(0.38rem,0.44vw,0.52rem)", letterSpacing: "0.6em" }}
          >
            {f.code}
          </motion.span>
          <span
            className="font-serif font-black leading-none select-none absolute"
            style={{
              fontSize: isMobile ? "3.5rem" : "clamp(4rem,5vw,6rem)",
              color: "rgba(255,255,255,0.03)",
              top: isMobile ? "0.5rem" : "1rem",
              right: isMobile ? "1rem" : "clamp(1rem,2vw,1.5rem)",
            }}
          >
            {String(i + 1).padStart(2, "0")}
          </span>
        </div>

        {/* Título */}
        <div className="flex-1">
          <div className="overflow-hidden" style={{ marginBottom: "0.75rem" }}>
            <motion.h3
              initial={{ y: "110%" }}
              animate={inView ? { y: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.2 + i * 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif text-white leading-[1.05] whitespace-pre-line"
              style={{ fontSize: isMobile ? "1.6rem" : "clamp(1.7rem,2.8vw,2.8rem)" }}
            >
              {f.title}
            </motion.h3>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.6 + i * 0.18 }}
            className="font-mono uppercase"
            style={{
              fontSize: "clamp(0.38rem,0.44vw,0.52rem)",
              letterSpacing: "0.35em",
              color: "rgba(255,255,255,0.2)",
              marginBottom: isMobile ? "0.75rem" : "clamp(0.75rem,1.5vw,1.5rem)",
            }}
          >
            {f.sub}
          </motion.p>

          {/* Cita en hover */}
          <AnimatePresence>
            {hovered && (
              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.35 }}
                className="font-sans italic leading-relaxed"
                style={{ fontSize: isMobile ? "0.75rem" : "clamp(0.75rem,0.9vw,0.95rem)", color: "rgba(16,185,129,0.4)" }}
              >
                "{f.line}"
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Stat inferior */}
        <div
          className="flex items-end justify-between border-t border-white/[0.05]"
          style={{ marginTop: isMobile ? "1rem" : "clamp(1rem,2vw,2rem)", paddingTop: isMobile ? "1rem" : "clamp(1rem,1.5vw,1.75rem)" }}
        >
          <div>
            <motion.div
              animate={{ color: hovered ? "rgb(16,185,129)" : "rgba(16,185,129,0.6)" }}
              className="font-mono font-black tabular-nums leading-none"
              style={{ fontSize: isMobile ? "1.5rem" : "clamp(1.6rem,2.5vw,2.5rem)", marginBottom: "0.25rem" }}
            >
              {hovered ? statVal : f.stat.n}
            </motion.div>
            <div
              className="font-mono uppercase"
              style={{
                fontSize: "clamp(0.35rem,0.4vw,0.48rem)",
                letterSpacing: "0.1em",
                color: "rgba(255,255,255,0.15)",
              }}
            >
              {f.stat.label}
            </div>
          </div>
          <motion.div
            animate={{
              rotate: hovered ? 135 : 45,
              borderColor: hovered ? "rgba(16,185,129,0.6)" : "rgba(255,255,255,0.1)",
            }}
            transition={{ duration: 0.4 }}
            className="w-2.5 h-2.5 border"
          />
        </div>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// TIMELINE ROW — responsive, nota visible siempre en desktop
// ═══════════════════════════════════════════════════════════════════
function TimelineRow({ t, i, w }: { t: typeof TIMELINE[0]; i: number; w: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [hovered, setHovered] = useState(false);
  const isMobile = w < 640;
  const isDesktop = w >= 900;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -30, filter: "blur(6px)" }}
      animate={inView ? { opacity: 1, x: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 0.75, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative border-b border-white/[0.04]"
      style={{
        display: "grid",
        gridTemplateColumns: isMobile
          ? "3.5rem 1fr"
          : isDesktop
          ? "clamp(4rem,6vw,7rem) 1fr clamp(8rem,14vw,16rem)"
          : "4.5rem 1fr",
        alignItems: "center",
        gap: isMobile ? "0.75rem" : "clamp(1rem,2vw,2rem)",
        padding: isMobile ? "0.9rem 0.5rem" : "clamp(0.9rem,1.2vw,1.5rem) 0.5rem",
      }}
    >
      {/* Sweep fondo */}
      <motion.div
        animate={{ scaleX: hovered ? 1 : 0, opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        className="absolute inset-0 origin-left pointer-events-none"
        style={{ background: "linear-gradient(90deg, rgba(16,185,129,0.06), transparent 80%)" }}
      />
      {/* Acento izquierdo */}
      <motion.div
        animate={{ scaleY: hovered ? 1 : 0, opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="absolute left-0 top-0 bottom-0 w-px origin-top"
        style={{ background: "rgb(16,185,129)" }}
      />

      <span
        className="font-mono relative"
        style={{
          fontSize: isMobile ? "0.4rem" : "clamp(0.4rem,0.46vw,0.56rem)",
          letterSpacing: "0.15em",
          color: "rgba(16,185,129,0.35)",
          paddingLeft: "0.75rem",
        }}
      >
        {t.year}
      </span>

      <div className="relative min-w-0">
        <motion.div
          animate={{ color: hovered ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.55)" }}
          className="font-serif leading-tight truncate"
          style={{ fontSize: isMobile ? "0.95rem" : "clamp(0.95rem,1.3vw,1.4rem)" }}
        >
          {t.role}
        </motion.div>
        <div
          className="font-mono uppercase truncate"
          style={{
            fontSize: isMobile ? "0.38rem" : "clamp(0.38rem,0.42vw,0.5rem)",
            letterSpacing: "0.2em",
            color: "rgba(255,255,255,0.2)",
            marginTop: "0.2rem",
          }}
        >
          {t.place}
        </div>
        {/* Nota en mobile: debajo del lugar */}
        {isMobile && (
          <AnimatePresence>
            {hovered && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="font-mono uppercase overflow-hidden"
                style={{ fontSize: "0.36rem", letterSpacing: "0.15em", color: "rgba(255,255,255,0.2)", marginTop: "0.3rem" }}
              >
                {t.note}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

      {/* Nota en desktop: columna separada */}
      {isDesktop && (
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 6 }}
              className="font-mono text-right leading-relaxed relative"
              style={{
                fontSize: "clamp(0.38rem,0.42vw,0.5rem)",
                letterSpacing: "0.1em",
                color: "rgba(255,255,255,0.2)",
                maxWidth: "100%",
              }}
            >
              {t.note}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// STACK TICKER — igual pero con fade-mask adaptado
// ═══════════════════════════════════════════════════════════════════
function StackTicker() {
  const repeated = [...STACK, ...STACK, ...STACK];
  return (
    <div className="relative overflow-hidden border-y border-white/[0.04]" style={{ padding: "1rem 0" }}>
      <div className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to right, #080808, transparent)" }} />
      <div className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to left, #080808, transparent)" }} />
      <motion.div
        animate={{ x: ["0%", "-33.33%"] }}
        transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
        className="flex gap-10 whitespace-nowrap"
      >
        {repeated.map((tool, i) => (
          <span
            key={i}
            className="font-mono uppercase shrink-0"
            style={{ fontSize: "0.48rem", letterSpacing: "0.4em", color: "rgba(255,255,255,0.15)" }}
          >
            {tool}
            <span style={{ color: "rgba(16,185,129,0.2)", margin: "0 1.25rem" }}>·</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// WORD REVEAL — sin cambios, ya funciona con vw implícito
// ═══════════════════════════════════════════════════════════════════
function WordReveal({ text, className, delay = 0, style }: { text: string; className?: string; delay?: number; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const words = text.split(" ");

  return (
    <div ref={ref} className={`flex flex-wrap ${className}`} style={{ ...style, gap: "0 0.35em" }}>
      {words.map((word, i) => (
        <div key={i} className="overflow-hidden">
          <motion.span
            initial={{ y: "110%", opacity: 0 }}
            animate={inView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.75, delay: delay + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
            className="block"
          >
            {word}
          </motion.span>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// SECCIÓN PRINCIPAL
// ═══════════════════════════════════════════════════════════════════
export default function IdentitySection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const bgY    = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);
  const identY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);
  const titleY = useTransform(scrollYProgress, [0, 1], ["0%", "5%"]);

  const w = useWindowWidth();
  const isMobile  = w < 640;
  const isMid     = w >= 640 && w < 900;
  const isDesktop = w >= 900;

  const hPad = isMobile ? "1rem" : isMid ? "1.5rem" : "clamp(2rem,5vw,6rem)";
  const vPad = isMobile ? "5rem" : isMid ? "6rem" : "clamp(6rem,9vw,12rem)";

  return (
    <section
      ref={containerRef}
      id="sobre-mi"
      className="relative overflow-hidden"
      style={{ background: "#080808", padding: `${vPad} 0` }}
    >

      {/* ════════════ ATMÓSFERA ════════════ */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div style={{ y: bgY }} className="absolute inset-0">
          {/* Grid perspectiva */}
          <div className="absolute inset-0" style={{
            opacity: 0.016,
            backgroundImage: `linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)`,
            backgroundSize: "72px 72px",
            maskImage: "radial-gradient(ellipse 100% 80% at 25% 50%, black, transparent)",
          }} />
          {/* Nebulosas */}
          <div className="absolute rounded-full" style={{
            left: "-8vw", top: "30%",
            width: "clamp(300px,40vw,600px)", height: "clamp(400px,55vw,800px)",
            background: "radial-gradient(ellipse, rgba(16,185,129,0.06) 0%, transparent 65%)",
            filter: "blur(40px)",
          }} />
          <div className="absolute rounded-full" style={{
            right: "-5vw", bottom: 0,
            width: "clamp(250px,35vw,500px)", height: "clamp(250px,35vw,500px)",
            background: "radial-gradient(ellipse, rgba(16,185,129,0.03) 0%, transparent 70%)",
            filter: "blur(60px)",
          }} />
        </motion.div>

        {/* IDENTITY colosal vertical */}
        <motion.div
          style={{ y: identY }}
          className="absolute right-0 top-0 bottom-0 select-none pointer-events-none flex items-center"
        >
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 3, ease: "easeOut" }}
            className="font-serif font-black leading-none tracking-tighter whitespace-nowrap"
            style={{
              fontSize: "clamp(6rem,20vw,28rem)",
              color: "rgba(255,255,255,0.012)",
              writingMode: "vertical-rl",
            }}
          >
            IDENTITY
          </motion.span>
        </motion.div>

        {/* Scanline de sección */}
        <motion.div
          initial={{ top: "-5%" }}
          whileInView={{ top: "105%" }}
          viewport={{ once: true }}
          transition={{ duration: 4, ease: "easeInOut", delay: 0.5 }}
          className="absolute left-0 right-0 pointer-events-none"
          style={{
            height: "8rem",
            background: "linear-gradient(to bottom, transparent, rgba(16,185,129,0.025), transparent)",
          }}
        />
      </div>

      {/* ════════════ CONTENIDO ════════════ */}
      <div style={{ paddingLeft: hPad, paddingRight: hPad }}>

        {/* ══ CABECERA — título + bio ══ */}
        <motion.div
          style={{ y: titleY }}
          className={isDesktop ? "grid gap-0 items-end" : "flex flex-col"}
          style={{
            y: titleY,
            display: "grid",
            gridTemplateColumns: isDesktop ? "1fr 1fr" : "1fr",
            gap: isDesktop ? "clamp(2rem,4vw,5rem)" : isMid ? "2.5rem" : "2rem",
            marginBottom: isMobile ? "3rem" : isMid ? "4.5rem" : "clamp(4.5rem,7vw,9rem)",
            alignItems: "end",
          }}
        >
          {/* Izquierda — TÍTULO */}
          <div>
            {/* Eyebrow */}
            <div
              className="flex items-center gap-3 overflow-hidden"
              style={{ marginBottom: isMobile ? "1.5rem" : "clamp(1.5rem,2.5vw,3rem)" }}
            >
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="h-px origin-left shrink-0"
                style={{ width: isMobile ? "2rem" : "clamp(2rem,2.5vw,3rem)", background: "rgba(16,185,129,0.5)" }}
              />
              <motion.span
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.4 }}
                className="font-mono uppercase"
                style={{
                  fontSize: isMobile ? "0.4rem" : "clamp(0.4rem,0.46vw,0.56rem)",
                  letterSpacing: "clamp(0.4em,0.6vw,0.8em)",
                  color: "rgba(16,185,129,0.5)",
                }}
              >
                Perfil Clasificado — Acceso Concedido
              </motion.span>
            </div>

            {/* Títulos — word reveal con fontSize fluido */}
            <WordReveal
              text="No soy"
              delay={0.2}
              style={{ marginBottom: "0.1em" }}
              className="font-serif text-white leading-[0.88]"
              style={{
                fontSize: isMobile ? "2.5rem" : "clamp(2.5rem,6.5vw,8rem)",
                color: "rgba(255,255,255,0.9)",
                lineHeight: 0.88,
                marginBottom: "0.1em",
              }}
            />
            <WordReveal
              text="un recurso."
              delay={0.4}
              style={{
                fontSize: isMobile ? "2.5rem" : "clamp(2.5rem,6.5vw,8rem)",
                color: "rgba(255,255,255,0.9)",
                lineHeight: 0.88,
                marginBottom: "0.2em",
                fontFamily: "serif",
              }}
            />
            <WordReveal
              text="Soy la ventaja."
              delay={0.62}
              style={{
                fontSize: isMobile ? "2.5rem" : "clamp(2.5rem,6.5vw,8rem)",
                color: "rgba(255,255,255,0.15)",
                lineHeight: 0.88,
                fontStyle: "italic",
                fontWeight: 300,
                fontFamily: "serif",
              }}
            />
          </div>

          {/* Derecha — BIO */}
          <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? "1rem" : "clamp(1rem,1.5vw,1.5rem)" }}>
            {[
              {
                text: "Del Ejército Nacional aprendí que la presión no paraliza — clarifica. Bajo fuego real, los sistemas fallan o demuestran su arquitectura.",
                opacity: "rgba(255,255,255,0.3)",
                delay: 0.5,
              },
              {
                text: "Después lideré una empresa entera con datos como única brújula. Pipelines, modelos predictivos, dashboards de KPIs — resultados medidos en pesos y porcentajes, no en diapositivas.",
                opacity: "rgba(255,255,255,0.2)",
                delay: 0.7,
              },
              {
                text: "17 credenciales. Stanford. Duke. Harvard. AWS. Google. Microsoft. Todo en 10 meses. No porque fuera necesario — sino porque cada certificación era el próximo peldaño.",
                opacity: "rgba(255,255,255,0.13)",
                delay: 0.9,
              },
            ].map((p, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: p.delay, ease: [0.16, 1, 0.3, 1] }}
                className="font-sans leading-relaxed"
                style={{
                  fontSize: isMobile ? "0.8rem" : "clamp(0.78rem,0.9vw,1rem)",
                  color: p.opacity,
                }}
              >
                {p.text}
              </motion.p>
            ))}

            <MagneticSignature w={w} />
          </div>
        </motion.div>

        {/* ══ STACK TICKER ══ */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0.95 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginBottom: isMobile ? "3rem" : "clamp(3rem,5vw,7rem)" }}
        >
          <StackTicker />
        </motion.div>

        {/* ══ FACET CARDS ══ */}
        <div style={{ marginBottom: isMobile ? "3rem" : "clamp(3rem,5vw,7rem)" }}>
          {/* Header del bloque */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex items-center gap-4 w-full"
            style={{ marginBottom: isMobile ? "1.25rem" : "clamp(1.25rem,2vw,2.5rem)" }}
          >
            <span
              className="font-mono uppercase shrink-0"
              style={{
                fontSize: isMobile ? "0.38rem" : "clamp(0.38rem,0.44vw,0.52rem)",
                letterSpacing: "0.6em",
                color: "rgba(255,255,255,0.1)",
              }}
            >
              Tres Dimensiones
            </span>
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.2 }}
              className="h-px flex-grow origin-left"
              style={{ background: "linear-gradient(to right, rgba(255,255,255,0.04), transparent)" }}
            />
            <span
              className="font-mono shrink-0"
              style={{ fontSize: "0.38rem", letterSpacing: "0.5em", color: "rgba(16,185,129,0.25)" }}
            >
              03 SISTEMAS
            </span>
          </motion.div>

          {/* Grid de cards — 1 col mobile, 2 col mid, 3 col desktop */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile
                ? "1fr"
                : isMid
                ? "1fr 1fr"
                : "1fr 1fr 1fr",
              gap: isMobile ? "0.75rem" : "clamp(0.75rem,1.2vw,1.25rem)",
            }}
          >
            {FACETS.map((f, i) => (
              <FacetCard key={f.code} f={f} i={i} w={w} />
            ))}
          </div>
        </div>

        {/* ══ TIMELINE BLOCK ══ */}
        <motion.div
          initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative border border-white/[0.05]"
          style={{ padding: isMobile ? "1.25rem" : "clamp(1.5rem,3vw,3rem)" }}
        >
          {/* Corner brackets */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t border-l" style={{ borderColor: "rgba(16,185,129,0.3)" }} />
          <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-white/[0.06]" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r" style={{ borderColor: "rgba(16,185,129,0.3)" }} />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-white/[0.06]" />

          {/* Acento superior */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
            className="absolute top-0 left-0 right-0 h-px origin-left"
            style={{ background: "linear-gradient(90deg, rgb(16,185,129), rgba(16,185,129,0.15), transparent)" }}
          />

          {/* Header */}
          <div
            className="flex items-center justify-between border-b border-white/[0.04]"
            style={{ marginBottom: isMobile ? "0.75rem" : "clamp(0.75rem,1.5vw,1.5rem)", paddingBottom: isMobile ? "0.75rem" : "clamp(0.75rem,1.2vw,1.25rem)" }}
          >
            <span
              className="font-mono uppercase"
              style={{
                fontSize: isMobile ? "0.38rem" : "clamp(0.38rem,0.44vw,0.52rem)",
                letterSpacing: "0.55em",
                color: "rgba(255,255,255,0.12)",
              }}
            >
              Trayectoria Operativa
            </span>
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ opacity: [1, 0.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1 h-1 rounded-full"
                style={{ background: "rgb(16,185,129)" }}
              />
              <span
                className="font-mono uppercase"
                style={{ fontSize: "0.38rem", letterSpacing: "0.3em", color: "rgba(16,185,129,0.4)" }}
              >
                En Curso
              </span>
            </div>
          </div>

          {TIMELINE.map((t, i) => (
            <TimelineRow key={i} t={t} i={i} w={w} />
          ))}
        </motion.div>

        {/* ══ DECLARACIÓN FINAL ══ */}
        <div
          className="text-center relative overflow-hidden"
          style={{ marginTop: isMobile ? "4rem" : "clamp(4rem,8vw,12rem)" }}
        >
          {/* Separador */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5 }}
            className="flex items-center gap-6"
            style={{ marginBottom: isMobile ? "2.5rem" : "clamp(2.5rem,5vw,6rem)" }}
          >
            <div className="h-px flex-grow" style={{ background: "linear-gradient(to right, transparent, rgba(255,255,255,0.04))" }} />
            <motion.div
              animate={{ rotate: [0, 90, 180, 270, 360] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="w-1.5 h-1.5 border rotate-45 shrink-0"
              style={{ borderColor: "rgba(255,255,255,0.15)" }}
            />
            <div className="h-px flex-grow" style={{ background: "linear-gradient(to left, transparent, rgba(255,255,255,0.04))" }} />
          </motion.div>

          {/* Cita épica final */}
          <div className="relative">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 2, delay: 0.8 }}
              className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(ellipse 60% 80% at 50% 50%, rgba(16,185,129,0.04), transparent)" }}
            />

            <WordReveal
              text="Cuando el reto parece imposible,"
              delay={0.3}
              style={{
                fontSize: isMobile ? "1.1rem" : "clamp(1.1rem,2.5vw,2.5rem)",
                fontStyle: "italic",
                color: "rgba(255,255,255,0.08)",
                fontFamily: "serif",
                justifyContent: "center",
                marginBottom: "0.3em",
              }}
            />
            <WordReveal
              text="es cuando empiezo a sonreír."
              delay={0.7}
              style={{
                fontSize: isMobile ? "1.1rem" : "clamp(1.1rem,2.5vw,2.5rem)",
                fontStyle: "italic",
                color: "rgba(255,255,255,0.2)",
                fontFamily: "serif",
                justifyContent: "center",
              }}
            />
          </div>
        </div>

      </div>
    </section>
  );
}