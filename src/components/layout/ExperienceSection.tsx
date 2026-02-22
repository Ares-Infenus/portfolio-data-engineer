"use client";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import React, { useRef, useState, useEffect } from "react";
import { Shield, TrendingUp, Brain } from "lucide-react";

// ═══════════════════════════════════════════════════════════
// DATOS
// ═══════════════════════════════════════════════════════════
const EXPERIENCES = [
  {
    era: "THE DISCIPLINE ERA",
    period: "AGO. 2025 — PRESENTE",
    role: "Auxiliar Administrativo y de Operaciones",
    company: "Ejército Nacional de Colombia",
    description:
      "Gestión y control documental de procesos internos con altos estándares institucionales. Redacción de informes, coordinación de servicios de centinela y apoyo en la administración de un pelotón. Actualmente en comunicaciones estratégicas: transmisión y recepción de información crítica bajo protocolos de alta seguridad.",
    tech: ["Ofimática avanzada", "Comunicaciones operacionales", "Gestión de pelotón", "Control documental"],
    icon: <Shield size={18} />,
    side: "left",
    accent: "rgba(16,185,129,1)",
    index: "01",
  },
  {
    era: "THE PIVOT LAYER",
    period: "AGO. 2024 — MAY. 2025",
    role: "Desarrollo Profesional en Ciencia de Datos",
    company: "Formación Autodidacta & Certificaciones",
    description:
      "Reorientación estratégica de carrera hacia Ciencia de Datos e Ingeniería de ML. 17 credenciales de Stanford, Duke, Harvard, AWS, Google y Microsoft. Consolidación de competencias en Python, SQL, R, cloud y MLOps. Todo en 10 meses de ejecución fría y constante.",
    tech: ["Python", "TensorFlow", "AWS", "MLOps", "SQL", "R"],
    icon: <Brain size={18} />,
    side: "right",
    accent: "rgba(16,185,129,1)",
    index: "02",
  },
  {
    era: "THE ORIGIN POINT",
    period: "JUN. 2023 — JUN. 2024",
    role: "Gerente General",
    company: "Imperio del Plástico",
    description:
      "Liderazgo integral de operaciones con datos como única brújula. ETL pipelines: +63% eficiencia contable. Forecasting: +15% precisión. Costos: −12%. Crecimiento mensual sostenido del 13% respaldado por dashboards de KPIs. Una empresa dirigida como un sistema.",
    tech: ["Python", "R", "SQL", "Excel", "ETL", "E-commerce"],
    icon: <TrendingUp size={18} />,
    side: "left",
    accent: "rgba(16,185,129,1)",
    index: "03",
  },
];

// ═══════════════════════════════════════════════════════════
// HOOK: ancho real de ventana
// ═══════════════════════════════════════════════════════════
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

// ═══════════════════════════════════════════════════════════
// PARTÍCULAS FLOTANTES
// ═══════════════════════════════════════════════════════════
function FloatingParticles({ active }: { active: boolean }) {
  const particles = Array.from({ length: 6 }, (_, i) => ({
    x: ["-20%", "120%", "80%", "-10%", "110%", "50%"][i],
    y: [`${10 + i * 15}%`],
    delay: i * 0.15,
    size: i % 2 === 0 ? 2 : 1,
  }));

  return (
    <AnimatePresence>
      {active &&
        particles.map((p, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: "50%", y: p.y[0] }}
            animate={{ opacity: [0, 0.6, 0], x: p.x, y: p.y[0] }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 2.5 + i * 0.3,
              delay: p.delay,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute pointer-events-none"
            style={{
              width: p.size,
              height: p.size,
              background: "rgba(16,185,129,0.8)",
              borderRadius: "50%",
              top: p.y[0],
            }}
          />
        ))}
    </AnimatePresence>
  );
}

// ═══════════════════════════════════════════════════════════
// ERA TEXT — fondo fantasma visible sólo en pantallas anchas
// ═══════════════════════════════════════════════════════════
function EraText({ text, side }: { text: string; side: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: side === "left" ? 40 : -40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
      className={`
        absolute top-1/2 -translate-y-1/2
        ${side === "left" ? "right-full pr-10 text-right" : "left-full pl-10 text-left"}
        hidden xl:block select-none pointer-events-none z-0 overflow-hidden
      `}
    >
      <div className="relative">
        <span
          className="font-serif font-black leading-none whitespace-nowrap block"
          style={{ fontSize: "clamp(3rem,6vw,7rem)", color: "rgba(255,255,255,0.04)" }}
        >
          {text}
        </span>
        <motion.div
          initial={{ x: "-110%" }}
          whileInView={{ x: "110%" }}
          viewport={{ once: true }}
          transition={{ duration: 1.8, delay: 0.3, ease: "easeInOut" }}
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(16,185,129,0.15) 50%, transparent 100%)",
            mixBlendMode: "screen",
          }}
        />
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════
// EXPERIENCE CARD — responsive por breakpoint real
// ═══════════════════════════════════════════════════════════
const ExperienceCard = ({
  exp,
  index,
  w,
}: {
  exp: (typeof EXPERIENCES)[0];
  index: number;
  w: number;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mx = useSpring(x, { stiffness: 280, damping: 28 });
  const my = useSpring(y, { stiffness: 280, damping: 28 });
  const rotX = useTransform(my, [-0.5, 0.5], ["4deg", "-4deg"]);
  const rotY = useTransform(mx, [-0.5, 0.5], ["-4deg", "4deg"]);
  const [hovered, setHovered] = useState(false);

  const isMobile  = w < 640;
  const isMid     = w >= 640 && w < 1024;
  const isDesktop = w >= 1024;

  // En móvil y mid las cards van full-width apiladas; en desktop van al lado correspondiente
  const isLeft = exp.side === "left";

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile) return; // sin tilt en móvil
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - r.left) / r.width - 0.5);
    y.set((e.clientY - r.top) / r.height - 0.5);
  };

  // Padding interno de la card escala con vw
  const cardPadding = isMobile
    ? "1.25rem"
    : isMid
    ? "clamp(1.5rem,3vw,2.5rem)"
    : "clamp(1.75rem,2.5vw,3.5rem)";

  // Ancho de la card en desktop
  const cardWidth = isDesktop ? "clamp(44%,46%,52%)" : "100%";

  // Tamaño rol
  const roleFontSize = isMobile
    ? "1.25rem"
    : isMid
    ? "clamp(1.3rem,2.5vw,2rem)"
    : "clamp(1.5rem,2.2vw,2.5rem)";

  return (
    <div
      className="relative"
      style={{
        display: "flex",
        justifyContent: isDesktop
          ? isLeft ? "flex-end" : "flex-start"
          : "center",
        alignItems: "center",
        marginTop:    index === 0 ? 0 : isMobile ? "2.5rem" : "clamp(2.5rem,4vw,7rem)",
        marginBottom: "0",
      }}
    >
      {/* ERA TEXT de fondo (sólo desktop) */}
      {isDesktop && <EraText text={exp.era} side={isLeft ? "left" : "right"} />}

      {/* Número fantasma */}
      {isDesktop && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: index * 0.1 + 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="absolute"
          style={{
            [isLeft ? "right" : "left"]: "calc(50% + clamp(3rem,5vw,6rem))",
            top: "-2rem",
          }}
        >
          <span
            className="font-serif font-black leading-none select-none"
            style={{ fontSize: "clamp(5rem,7vw,10rem)", color: "rgba(255,255,255,0.025)" }}
          >
            {exp.index}
          </span>
        </motion.div>
      )}

      {/* ── LA CARD ── */}
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => { x.set(0); y.set(0); setHovered(false); }}
        initial={{
          opacity: 0,
          x: isMobile ? 0 : isLeft ? -80 : 80,
          y: isMobile ? 30 : 0,
          filter: "blur(12px)",
          clipPath: isMobile
            ? "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)"
            : isLeft
            ? "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)"
            : "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)",
        }}
        whileInView={{
          opacity: 1,
          x: 0,
          y: 0,
          filter: "blur(0px)",
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{
          duration: isMobile ? 0.8 : 1.1,
          delay: index * 0.12,
          ease: [0.16, 1, 0.3, 1],
        }}
        style={{
          rotateX: isMobile ? 0 : rotX,
          rotateY: isMobile ? 0 : rotY,
          transformStyle: "preserve-3d",
          width: cardWidth,
          position: "relative",
          zIndex: 10,
          border: "1px solid rgba(255,255,255,0.07)",
          cursor: "default",
          overflow: "hidden",
          // En desktop quitar borde del lado que toca el eje central
          borderRight: isDesktop && isLeft ? "none" : undefined,
          borderLeft:  isDesktop && !isLeft ? "none" : undefined,
        }}
      >
        {/* Sweep de luz al hover */}
        <motion.div
          animate={{ opacity: hovered ? 1 : 0, x: hovered ? "100%" : "-100%" }}
          initial={{ opacity: 0, x: "-100%" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            background:
              "linear-gradient(105deg, transparent 40%, rgba(16,185,129,0.06) 50%, transparent 60%)",
          }}
        />

        {/* Línea top en hover */}
        <motion.div
          animate={{ scaleX: hovered ? 1 : 0 }}
          initial={{ scaleX: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="absolute top-0 left-0 right-0 h-px pointer-events-none z-20"
          style={{
            transformOrigin: isLeft ? "left" : "right",
            background: isLeft
              ? "linear-gradient(90deg, rgb(16,185,129), rgba(16,185,129,0.1), transparent)"
              : "linear-gradient(270deg, rgb(16,185,129), rgba(16,185,129,0.1), transparent)",
          }}
        />

        {/* Scanline de boot (una sola vez) */}
        <motion.div
          initial={{ top: "-30%" }}
          whileInView={{ top: "130%" }}
          viewport={{ once: true }}
          transition={{ duration: 1.6, delay: 0.3 + index * 0.15, ease: "easeInOut" }}
          className="absolute left-0 w-full h-24 pointer-events-none z-30"
          style={{
            background:
              "linear-gradient(to bottom, transparent, rgba(16,185,129,0.08), transparent)",
          }}
        />

        {/* Partículas en hover */}
        <FloatingParticles active={hovered} />

        {/* ── CONTENIDO ── */}
        <div
          className="relative z-10"
          style={{
            padding: cardPadding,
            transform: isMobile ? "none" : "translateZ(30px)",
          }}
        >
          {/* Eyebrow — era label en mobile, period + icon en todos */}
          {isMobile && (
            <div
              className="font-mono uppercase mb-3"
              style={{
                fontSize: "0.38rem",
                letterSpacing: "0.45em",
                color: "rgba(16,185,129,0.5)",
              }}
            >
              {exp.era}
            </div>
          )}

          <div
            className="flex items-center justify-between"
            style={{ marginBottom: isMobile ? "1rem" : "clamp(1rem,1.5vw,1.75rem)" }}
          >
            <motion.div
              initial={{ opacity: 0, x: isLeft ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.4 + index * 0.15 }}
              className="flex items-center gap-2"
            >
              <motion.div
                animate={{ scale: [1, 1.5, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2.5, repeat: Infinity, delay: index * 0.4 }}
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: "rgb(16,185,129)", flexShrink: 0 }}
              />
              <span
                className="font-mono uppercase"
                style={{
                  fontSize: isMobile ? "0.42rem" : "clamp(0.42rem,0.5vw,0.6rem)",
                  letterSpacing: "clamp(0.3em,0.4vw,0.5em)",
                  color: "rgba(16,185,129,0.7)",
                }}
              >
                {exp.period}
              </span>
            </motion.div>

            <motion.div
              animate={{
                color: hovered ? "rgb(16,185,129)" : "rgba(255,255,255,0.2)",
                rotate: hovered ? [0, -10, 10, 0] : 0,
              }}
              transition={{ duration: 0.4 }}
              style={{ flexShrink: 0 }}
            >
              {exp.icon}
            </motion.div>
          </div>

          {/* Rol */}
          <div className="overflow-hidden" style={{ marginBottom: "0.35rem" }}>
            <motion.h3
              initial={{ y: "110%" }}
              whileInView={{ y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.85, delay: 0.5 + index * 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif text-white leading-tight"
              style={{ fontSize: roleFontSize }}
            >
              {exp.role}
            </motion.h3>
          </div>

          {/* Company */}
          <div
            className="overflow-hidden"
            style={{ marginBottom: isMobile ? "1rem" : "clamp(1rem,1.8vw,2rem)" }}
          >
            <motion.h4
              initial={{ y: "110%" }}
              whileInView={{ y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.75, delay: 0.62 + index * 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="font-mono uppercase"
              style={{
                fontSize: isMobile ? "0.42rem" : "clamp(0.42rem,0.52vw,0.62rem)",
                letterSpacing: "clamp(0.3em,0.4vw,0.5em)",
                color: "rgba(255,255,255,0.2)",
              }}
            >
              {exp.company}
            </motion.h4>
          </div>

          {/* Descripción */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.75 + index * 0.15 }}
            className="font-sans leading-relaxed"
            style={{
              fontSize: isMobile ? "0.8rem" : "clamp(0.78rem,0.9vw,1rem)",
              color: "rgba(255,255,255,0.25)",
              marginBottom: isMobile ? "1.25rem" : "clamp(1.25rem,2vw,2.5rem)",
            }}
          >
            {exp.description}
          </motion.p>

          {/* Tech tags */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.85 + index * 0.15 }}
            className="flex flex-wrap border-t"
            style={{
              gap: isMobile ? "0.35rem" : "clamp(0.3rem,0.5vw,0.6rem)",
              borderColor: "rgba(255,255,255,0.05)",
              paddingTop: isMobile ? "1rem" : "clamp(0.9rem,1.5vw,1.75rem)",
            }}
          >
            {exp.tech.map((t, i) => (
              <motion.span
                key={t}
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.9 + index * 0.15 + i * 0.05, duration: 0.4 }}
                animate={{
                  borderColor: hovered ? "rgba(16,185,129,0.25)" : "rgba(255,255,255,0.06)",
                  color: hovered ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.18)",
                }}
                className="font-mono uppercase border transition-colors duration-300"
                style={{
                  fontSize: isMobile ? "0.4rem" : "clamp(0.38rem,0.44vw,0.52rem)",
                  letterSpacing: "0.12em",
                  padding: isMobile ? "0.2rem 0.5rem" : "clamp(0.2rem,0.3vw,0.4rem) clamp(0.5rem,0.8vw,1rem)",
                }}
              >
                {t}
              </motion.span>
            ))}
          </motion.div>
        </div>

        {/* ── CONECTOR AL EJE CENTRAL (sólo desktop) ── */}
        {isDesktop && (
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.9 + index * 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-1/2 -translate-y-1/2 h-px"
            style={{
              width: "clamp(2.5rem,4vw,5rem)",
              transformOrigin: isLeft ? "right" : "left",
              [isLeft ? "right" : "left"]: `calc(-1 * clamp(2.5rem,4vw,5rem))`,
              background: "rgba(16,185,129,0.3)",
            }}
          >
            {/* Dot en el extremo del conector */}
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 1.1 + index * 0.15, type: "spring", stiffness: 400 }}
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full"
              style={{
                [isLeft ? "right" : "left"]: "-6px",
                background: "#080808",
                border: "2px solid rgb(16,185,129)",
              }}
            >
              <motion.div
                animate={{ scale: [1, 2, 1], opacity: [0.6, 0, 0.6] }}
                transition={{ duration: 3, repeat: Infinity, delay: index * 0.5 }}
                className="absolute inset-0 rounded-full"
                style={{ border: "1px solid rgb(16,185,129)" }}
              />
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// SECCIÓN PRINCIPAL
// ═══════════════════════════════════════════════════════════
export default function ExperienceSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const lineScaleY   = useTransform(scrollYProgress, [0.05, 0.95], [0, 1]);
  const lineOpacity  = useTransform(scrollYProgress, [0.05, 0.15, 0.85, 0.95], [0, 1, 1, 0]);
  const dotTop       = useTransform(scrollYProgress, [0.05, 0.95], ["0%", "100%"]);

  const w = useWindowWidth();
  const isMobile  = w < 640;
  const isMid     = w >= 640 && w < 1024;
  const isDesktop = w >= 1024;

  const hPad = isMobile
    ? "1rem"
    : isMid
    ? "1.5rem"
    : `clamp(2rem,5vw,6rem)`;

  const vPad = isMobile ? "5rem" : isMid ? "6rem" : "clamp(6rem,9vw,12rem)";

  return (
    <section
      ref={containerRef}
      id="trayectoria"
      className="relative overflow-hidden"
      style={{ background: "#080808", padding: `${vPad} 0` }}
    >

      {/* ── ATMÓSFERA ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            opacity: 0.022,
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
            `,
            backgroundSize: "72px 72px",
            maskImage:
              "radial-gradient(ellipse 70% 80% at 50% 50%, black, transparent)",
          }}
        />
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2"
          style={{
            width: "60vw",
            height: "60vw",
            maxWidth: "700px",
            maxHeight: "700px",
            background:
              "radial-gradient(ellipse, rgba(16,185,129,0.04) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* ── EJE CENTRAL (solo desktop) ── */}
      {isDesktop && (
        <motion.div
          style={{ opacity: lineOpacity }}
          className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px"
          // nota: dos style props se funden aquí intencionalmente
        >
          {/* Track tenue */}
          <div className="absolute inset-0" style={{ background: "rgba(255,255,255,0.04)" }} />
          {/* Línea de progreso */}
          <motion.div
            style={{ scaleY: lineScaleY, originY: 0 }}
            className="absolute top-0 left-0 w-full h-full"
          >
            <div
              className="w-full h-full"
              style={{
                background:
                  "linear-gradient(to bottom, rgb(16,185,129), rgba(16,185,129,0.4), transparent)",
                boxShadow: "0 0 20px rgba(16,185,129,0.4)",
              }}
            />
          </motion.div>
          {/* Dot viajero */}
          <motion.div
            style={{ top: dotTop }}
            className="absolute left-1/2 -translate-x-1/2 w-2 h-2 rounded-full"
            style={{
              background: "rgb(16,185,129)",
              boxShadow: "0 0 12px rgba(16,185,129,0.9)",
              translateX: "-50%",
            }}
          />
        </motion.div>
      )}

      {/* ── PADDING LATERAL CONTENEDOR ── */}
      <div style={{ paddingLeft: hPad, paddingRight: hPad }}>

        {/* ══ CABECERA ══ */}
        <div
          className="text-center relative overflow-hidden"
          style={{ marginBottom: isMobile ? "3rem" : isMid ? "5rem" : "clamp(5rem,8vw,10rem)" }}
        >
          {/* CHRONOLOGY fantasma */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
            <motion.span
              initial={{ opacity: 0, scale: 1.1 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5 }}
              className="font-serif font-black leading-none whitespace-nowrap"
              style={{
                fontSize: "clamp(3rem,12vw,13rem)",
                color: "rgba(255,255,255,0.025)",
                filter: "blur(2px)",
              }}
            >
              CHRONOLOGY
            </motion.span>
          </div>

          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex items-center justify-center gap-4 relative z-10"
            style={{ marginBottom: isMobile ? "1.5rem" : "clamp(1.25rem,2vw,2.5rem)" }}
          >
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="h-px origin-right"
              style={{
                width: isMobile ? "2rem" : "clamp(2rem,4vw,4rem)",
                background: "linear-gradient(to right, transparent, rgb(16,185,129))",
              }}
            />
            <span
              className="font-mono uppercase"
              style={{
                fontSize: isMobile ? "0.4rem" : "clamp(0.4rem,0.48vw,0.58rem)",
                letterSpacing: "clamp(0.4em,0.6vw,0.8em)",
                color: "rgba(16,185,129,0.5)",
              }}
            >
              Trayectoria Operativa
            </span>
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="h-px origin-left"
              style={{
                width: isMobile ? "2rem" : "clamp(2rem,4vw,4rem)",
                background: "linear-gradient(to left, transparent, rgb(16,185,129))",
              }}
            />
          </motion.div>

          {/* Título */}
          <div className="relative z-10">
            <div className="overflow-hidden">
              <motion.h2
                initial={{ y: "110%", skewY: 2 }}
                whileInView={{ y: "0%", skewY: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="font-serif text-white leading-tight"
                style={{ fontSize: "clamp(2rem,6.5vw,7rem)" }}
              >
                The Professional
              </motion.h2>
            </div>
            <div className="overflow-hidden">
              <motion.h2
                initial={{ y: "110%", skewY: 2 }}
                whileInView={{ y: "0%", skewY: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="font-serif italic font-light leading-tight"
                style={{ fontSize: "clamp(2rem,6.5vw,7rem)", color: "rgba(255,255,255,0.2)" }}
              >
                Path.
              </motion.h2>
            </div>
          </div>

          {/* Línea divisoria */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto relative z-10 origin-center"
            style={{
              height: "1px",
              width: isMobile ? "3rem" : "clamp(3rem,5vw,6rem)",
              background: "rgb(16,185,129)",
              marginTop: isMobile ? "1rem" : "clamp(1rem,1.5vw,2rem)",
            }}
          />
        </div>

        {/* ══ CARDS ══ */}
        {/*
          Mobile/Mid: stack vertical centrado, sin eje central
          Desktop:    layout alternado izquierda/derecha con eje central
        */}
        <div className="relative">
          {EXPERIENCES.map((exp, index) => (
            <ExperienceCard key={index} exp={exp} index={index} w={w} />
          ))}
        </div>

        {/* ══ CIERRE DEL EJE ══ */}
        <div
          className="flex justify-center relative"
          style={{
            marginTop: isMobile ? "2.5rem" : "clamp(2.5rem,5vw,7rem)",
            zIndex: 20,
          }}
        >
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, type: "spring", stiffness: 300 }}
            className="relative"
          >
            <div
              className="w-4 h-4 rotate-45"
              style={{
                background: "#080808",
                border: "2px solid rgb(16,185,129)",
              }}
            />
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                animate={{ scale: [1, 2.5 + i * 0.5], opacity: [0.4, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
                className="absolute inset-0 rotate-45"
                style={{ border: "1px solid rgb(16,185,129)" }}
              />
            ))}
          </motion.div>
        </div>

      </div>
    </section>
  );
}