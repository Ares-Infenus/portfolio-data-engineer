"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";

// ═══════════════════════════════════════
// HOOK — ancho real (mismo sistema probado)
// ═══════════════════════════════════════
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

// ═══════════════════════════════════════
// DATOS
// ═══════════════════════════════════════
const NAV_LINKS = [
  { id: "proyectos",    label: "Proyectos",   index: "01" },
  { id: "trayectoria",  label: "Trayectoria", index: "02" },
  { id: "certificados", label: "Arsenal",     index: "03" },
  { id: "sobre-mi",     label: "Identidad",   index: "04" },
];

const SOCIAL = [
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/sebastian-pinzon",
    icon: (
      <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
        <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="4" cy="4" r="2" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
  },
  {
    label: "GitHub",
    href: "https://github.com/Ares-Infenus",
    icon: (
      <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
];

const MANIFESTO_LINES = [
  "No busco oportunidades.",
  "Las oportunidades me encuentran a mí.",
];

// ═══════════════════════════════════════
// TERMINAL BLOCK
// ═══════════════════════════════════════
function TerminalBlock({ w }: { w: number }) {
  const isMobile = w < 640;

  const lines = [
    { key: "SYS",       val: "ONLINE // v2025.02"          },
    { key: "STACK",     val: "Next.js · Tailwind · Framer" },
    { key: "DOMAIN",    val: "Data Eng · MLOps · Cloud"    },
    { key: "CLEARANCE", val: "ALPHA-7 // VERIFIED"         },
    { key: "STATUS",    val: "AVAILABLE FOR DEPLOYMENT"    },
  ];

  const innerPad = isMobile
    ? "1rem"
    : "clamp(1rem,1.8vw,1.75rem)";

  return (
    <div
      className="relative overflow-hidden border"
      style={{ borderColor: "rgba(255,255,255,0.06)", padding: innerPad }}
    >
      {/* Línea superior de color */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(to right, rgba(16,185,129,0.5), rgba(16,185,129,0.2), transparent)" }}
      />

      {/* Prompt header */}
      <div
        className="flex items-center gap-2 border-b"
        style={{
          marginBottom: isMobile ? "0.85rem" : "clamp(0.85rem,1.2vw,1.5rem)",
          paddingBottom: isMobile ? "0.75rem" : "clamp(0.75rem,1vw,1.25rem)",
          borderColor: "rgba(255,255,255,0.05)",
        }}
      >
        <div className="flex gap-1.5">
          <div className="w-2 h-2 rounded-full" style={{ background: "rgba(255,255,255,0.1)" }} />
          <div className="w-2 h-2 rounded-full" style={{ background: "rgba(255,255,255,0.1)" }} />
          <motion.div
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-2 h-2 rounded-full"
            style={{ background: "rgba(16,185,129,0.6)" }}
          />
        </div>
        <span
          className="font-mono uppercase"
          style={{
            fontSize: isMobile ? "0.38rem" : "clamp(0.38rem,0.44vw,0.52rem)",
            letterSpacing: "0.5em",
            color: "rgba(255,255,255,0.15)",
            marginLeft: "0.5rem",
          }}
        >
          system.log
        </span>
      </div>

      {/* Líneas de datos */}
      <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? "0.6rem" : "clamp(0.6rem,0.8vw,1rem)" }}>
        {lines.map((line, i) => (
          <motion.div
            key={line.key}
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
            className="flex items-start gap-3"
          >
            <span
              className="font-mono uppercase shrink-0"
              style={{
                fontSize: isMobile ? "0.38rem" : "clamp(0.38rem,0.44vw,0.52rem)",
                letterSpacing: "0.3em",
                color: "rgba(16,185,129,0.4)",
                width: isMobile ? "4rem" : "clamp(4rem,5vw,6rem)",
                paddingTop: "1px",
              }}
            >
              {line.key}
            </span>
            <span
              className="font-mono uppercase"
              style={{
                fontSize: isMobile ? "0.38rem" : "clamp(0.38rem,0.44vw,0.52rem)",
                letterSpacing: "0.15em",
                color: "rgba(255,255,255,0.25)",
              }}
            >
              {line.val}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Cursor parpadeante */}
      <div
        className="flex items-center gap-2 border-t"
        style={{
          marginTop: isMobile ? "0.85rem" : "clamp(0.85rem,1.2vw,1.5rem)",
          paddingTop: isMobile ? "0.75rem" : "clamp(0.75rem,1vw,1.25rem)",
          borderColor: "rgba(255,255,255,0.04)",
        }}
      >
        <span className="font-mono" style={{ fontSize: "0.42rem", color: "rgba(16,185,129,0.3)" }}>$</span>
        <motion.div
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 1.2, repeat: Infinity }}
          className="w-2"
          style={{ height: "0.55rem", background: "rgba(16,185,129,0.3)" }}
        />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// FOOTER PRINCIPAL
// ═══════════════════════════════════════
export default function Footer() {
  const year = new Date().getFullYear();
  const footerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: footerRef,
    offset: ["start end", "end end"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["30%", "0%"]);

  const w = useWindowWidth();
  const isMobile  = w < 640;
  const isMid     = w >= 640 && w < 1024;
  const isDesktop = w >= 1024;

  // Padding horizontal: crece con pantalla, sin techo
  const hPad = isMobile ? "1rem" : isMid ? "1.5rem" : "clamp(2rem,5vw,6rem)";

  // Padding vertical de bloques internos
  const blockVPad = isMobile ? "3.5rem" : isMid ? "4.5rem" : "clamp(4.5rem,7vw,9rem)";

  // Grid del cuerpo: 1col mobile, 2col mid, 3col(4/2/6) desktop
  const bodyGrid = isMobile
    ? "1fr"
    : isMid
    ? "1fr 1fr"
    : "clamp(16rem,28vw,32rem) clamp(8rem,12vw,14rem) 1fr";

  const bodyGap = isMobile
    ? "2.5rem"
    : isMid
    ? "clamp(2rem,4vw,4rem)"
    : "clamp(3rem,5vw,7rem)";

  return (
    <footer
      ref={footerRef}
      className="relative overflow-hidden"
      style={{
        background: "#080808",
        borderTop: "1px solid rgba(255,255,255,0.04)",
      }}
    >

      {/* ── ATMÓSFERA ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Glow inferior */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full"
          style={{
            width: "70vw", height: "35vw",
            maxWidth: "800px", maxHeight: "400px",
            background: "radial-gradient(ellipse, rgba(16,185,129,0.04) 0%, transparent 70%)",
          }}
        />
        {/* Grid tenue */}
        <div
          className="absolute inset-0"
          style={{
            opacity: 0.015,
            backgroundImage: `
              linear-gradient(rgba(255,255,255,1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
            maskImage: "radial-gradient(ellipse 100% 80% at 50% 100%, black, transparent)",
          }}
        />
        {/* Sello PINZÓN colosal con parallax */}
        <motion.div
          style={{ y: bgY }}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none select-none whitespace-nowrap"
        >
          <span
            className="font-serif font-black leading-none tracking-tighter"
            style={{ fontSize: "clamp(5rem,18vw,22rem)", color: "rgba(255,255,255,0.018)" }}
          >
            PINZÓN
          </span>
        </motion.div>
      </div>

      {/* ══ MANIFESTO ══ */}
      <div
        className="relative border-b overflow-hidden"
        style={{
          borderColor: "rgba(255,255,255,0.04)",
          padding: `${blockVPad} ${hPad}`,
        }}
      >
        <div style={{ maxWidth: isDesktop ? "clamp(32rem,55vw,72rem)" : "100%" }}>
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex items-center gap-3"
            style={{ marginBottom: isMobile ? "1.5rem" : "clamp(1.5rem,2.5vw,3rem)" }}
          >
            <div
              className="h-px shrink-0"
              style={{ width: isMobile ? "1.5rem" : "clamp(1.5rem,2.5vw,3rem)", background: "rgba(16,185,129,0.5)" }}
            />
            <span
              className="font-mono uppercase"
              style={{
                fontSize: isMobile ? "0.4rem" : "clamp(0.4rem,0.48vw,0.58rem)",
                letterSpacing: "clamp(0.4em,0.6vw,0.7em)",
                color: "rgba(16,185,129,0.6)",
              }}
            >
              Declaración Final
            </span>
          </motion.div>

          {/* Líneas del manifiesto — clip reveal */}
          {MANIFESTO_LINES.map((line, i) => (
            <div key={i} className="overflow-hidden">
              <motion.p
                initial={{ y: "110%" }}
                whileInView={{ y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="font-serif leading-tight"
                style={{
                  fontSize: "clamp(1.6rem,5.5vw,6rem)",
                  color: i === 0 ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.15)",
                  fontStyle: i === 1 ? "italic" : "normal",
                  fontWeight: i === 1 ? 300 : undefined,
                }}
              >
                {line}
              </motion.p>
            </div>
          ))}
        </div>
      </div>

      {/* ══ CUERPO — grid 3 columnas desktop ══ */}
      <div
        className="relative"
        style={{ padding: `${blockVPad} ${hPad}` }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: bodyGrid,
            gap: bodyGap,
            alignItems: "start",
          }}
        >

          {/* ─ IDENTIDAD ─ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            style={{ display: "flex", flexDirection: "column", gap: isMobile ? "1.25rem" : "clamp(1.25rem,2vw,2.5rem)" }}
          >
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="relative shrink-0" style={{ width: "2rem", height: "2rem" }}>
                <motion.div
                  animate={{ rotate: [0, 90, 0] }}
                  transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="w-4 h-4 rotate-45 border" style={{ borderColor: "rgba(16,185,129,0.5)" }} />
                </motion.div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rotate-45" style={{ background: "rgb(16,185,129)" }} />
                </div>
              </div>
              <div>
                <div
                  className="font-serif leading-none"
                  style={{ fontSize: isMobile ? "1.1rem" : "clamp(1.1rem,1.5vw,1.4rem)", color: "rgba(255,255,255,0.9)", marginBottom: "0.25rem" }}
                >
                  S. Pinzón
                </div>
                <div
                  className="font-mono uppercase"
                  style={{ fontSize: "0.38rem", letterSpacing: "0.5em", color: "rgba(16,185,129,0.4)" }}
                >
                  Data Engineer
                </div>
              </div>
            </div>

            <p
              className="font-sans leading-relaxed"
              style={{
                fontSize: isMobile ? "0.8rem" : "clamp(0.78rem,0.9vw,0.95rem)",
                color: "rgba(255,255,255,0.2)",
                maxWidth: isDesktop ? "clamp(16rem,20vw,24rem)" : "28rem",
              }}
            >
              Convirtiendo datos en decisiones. Arquitecturas que no solo escalan — dominan.
            </p>

            {/* Redes sociales */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {SOCIAL.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 group w-fit"
                >
                  <span
                    className="transition-colors duration-300 group-hover:text-emerald-500"
                    style={{ color: "rgba(255,255,255,0.2)" }}
                  >
                    {s.icon}
                  </span>
                  <span
                    className="font-mono uppercase transition-colors duration-300 group-hover:text-white/50"
                    style={{
                      fontSize: isMobile ? "0.44rem" : "clamp(0.44rem,0.5vw,0.58rem)",
                      letterSpacing: "0.4em",
                      color: "rgba(255,255,255,0.15)",
                    }}
                  >
                    {s.label}
                  </span>
                  <span
                    className="font-mono transition-colors duration-300 group-hover:text-emerald-500/40"
                    style={{ fontSize: "0.4rem", color: "rgba(255,255,255,0.08)" }}
                  >
                    ↗
                  </span>
                </a>
              ))}
            </div>
          </motion.div>

          {/* ─ NAVEGACIÓN ─ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <h4
              className="font-mono uppercase"
              style={{
                fontSize: isMobile ? "0.4rem" : "clamp(0.4rem,0.48vw,0.58rem)",
                letterSpacing: "0.55em",
                color: "rgba(255,255,255,0.15)",
                marginBottom: isMobile ? "1.25rem" : "clamp(1.25rem,2vw,2rem)",
              }}
            >
              Mapa
            </h4>
            <ul style={{ display: "flex", flexDirection: isMobile ? "row" : "column", flexWrap: "wrap", gap: isMobile ? "0.85rem 1.5rem" : "clamp(0.75rem,1.2vw,1.25rem)" }}>
              {NAV_LINKS.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="flex items-center gap-2 group"
                  >
                    <span
                      className="font-mono transition-colors duration-300 group-hover:text-emerald-500/60"
                      style={{ fontSize: "0.38rem", color: "rgba(16,185,129,0.25)", letterSpacing: "0.2em" }}
                    >
                      {item.index}
                    </span>
                    <span
                      className="font-mono uppercase transition-colors duration-300 group-hover:text-white/50"
                      style={{
                        fontSize: isMobile ? "0.44rem" : "clamp(0.44rem,0.5vw,0.58rem)",
                        letterSpacing: "0.3em",
                        color: "rgba(255,255,255,0.2)",
                      }}
                    >
                      {item.label}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* ─ TERMINAL ─ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            // En mid: ocupa las 2 columnas para que no quede aplastado
            style={isMid ? { gridColumn: "1 / -1" } : {}}
          >
            <h4
              className="font-mono uppercase"
              style={{
                fontSize: isMobile ? "0.4rem" : "clamp(0.4rem,0.48vw,0.58rem)",
                letterSpacing: "0.55em",
                color: "rgba(255,255,255,0.15)",
                marginBottom: isMobile ? "1.25rem" : "clamp(1.25rem,2vw,2rem)",
              }}
            >
              System Log
            </h4>
            <TerminalBlock w={w} />
          </motion.div>

        </div>
      </div>

      {/* ══ BARRA FINAL ══ */}
      <div
        className="relative border-t"
        style={{ borderColor: "rgba(255,255,255,0.04)" }}
      >
        <div
          className="flex items-center justify-between flex-wrap"
          style={{
            padding: `clamp(1.25rem,2vw,2rem) ${hPad}`,
            gap: isMobile ? "1rem" : "clamp(1rem,2vw,2rem)",
          }}
        >
          {/* Copyright + cita */}
          <div
            className="flex items-center flex-wrap"
            style={{ gap: isMobile ? "0.75rem" : "clamp(0.75rem,2vw,2rem)" }}
          >
            <span
              className="font-mono uppercase"
              style={{
                fontSize: isMobile ? "0.38rem" : "clamp(0.38rem,0.44vw,0.52rem)",
                letterSpacing: "0.5em",
                color: "rgba(255,255,255,0.1)",
              }}
            >
              © {year} Sebastián Pinzón Zambrano
            </span>
            {!isMobile && (
              <div className="h-3 w-px" style={{ background: "rgba(255,255,255,0.1)" }} />
            )}
            <span
              className="font-serif italic"
              style={{ fontSize: isMobile ? "0.55rem" : "clamp(0.55rem,0.65vw,0.75rem)", color: "rgba(255,255,255,0.1)" }}
            >
              "El reto es el plan."
            </span>
          </div>

          {/* Back to top */}
          <motion.button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            whileHover={{ y: -3 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="group flex items-center gap-3"
            aria-label="Volver al inicio"
            style={{ cursor: "none" }}
          >
            <span
              className="font-mono uppercase transition-colors duration-300 group-hover:text-emerald-500/50"
              style={{
                fontSize: isMobile ? "0.38rem" : "clamp(0.38rem,0.44vw,0.52rem)",
                letterSpacing: "0.6em",
                color: "rgba(255,255,255,0.15)",
              }}
            >
              Back to Top
            </span>
            <div className="flex flex-col items-center gap-1">
              <motion.div
                animate={{ height: ["16px", "36px", "16px"], opacity: [0.2, 0.5, 0.2] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                className="w-px"
                style={{ background: "linear-gradient(to top, rgb(16,185,129), transparent)" }}
              />
              <div
                className="w-1 h-1 rotate-45 transition-colors duration-300 group-hover:bg-emerald-500/60"
                style={{ background: "rgba(16,185,129,0.3)" }}
              />
            </div>
          </motion.button>
        </div>
      </div>

    </footer>
  );
}