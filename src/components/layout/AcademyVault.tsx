"use client";
import { motion, useScroll, useTransform, animate } from "framer-motion";
import { useRef, useState, useEffect } from "react";

// ═══════════════════════════════════════════════════════════
// DATOS
// ═══════════════════════════════════════════════════════════
const CREDENTIALS = [
  { id: "DQ62CP3GJECK", title: "AWS Cloud Solutions Architect",       issuer: "Amazon Web Services",      year: "2025", domain: "CLOUD", tier: "S", index: "001" },
  { id: "AWS-DE-ASSOC", title: "AWS Certified Data Engineer",         issuer: "Amazon Web Services",      year: "2025", domain: "CLOUD", tier: "S", index: "002" },
  { id: "AZURE-DP100",  title: "Azure Data Scientist (DP-100)",       issuer: "Microsoft Certified",      year: "2025", domain: "CLOUD", tier: "S", index: "003" },
  { id: "GCP-PDE",      title: "Professional Data Engineer",          issuer: "Google Cloud",             year: "2025", domain: "CLOUD", tier: "S", index: "004" },
  { id: "AC7NFFS0WXWP", title: "Machine Learning",                    issuer: "Stanford University",      year: "2025", domain: "ML",    tier: "S", index: "005" },
  { id: "9GW0O26FOENS", title: "MLOps | Machine Learning Operations",  issuer: "Duke University",          year: "2025", domain: "ML",    tier: "S", index: "006" },
  { id: "83F9FK5OOPHM", title: "TensorFlow Developer",                issuer: "DeepLearning.AI",          year: "2025", domain: "ML",    tier: "A", index: "007" },
  { id: "1AZLWBHUEUP5", title: "Deep Learning Specialization",        issuer: "DeepLearning.AI",          year: "2025", domain: "ML",    tier: "A", index: "008" },
  { id: "D7GUABT9DHUU", title: "Mathematics for Machine Learning",    issuer: "Imperial College London",  year: "2025", domain: "MATH",  tier: "A", index: "009" },
  { id: "CS50-HVD",     title: "CS50: Computer Science",              issuer: "Harvard University",       year: "2024", domain: "MATH",  tier: "A", index: "010" },
  { id: "X885O29U87NI", title: "IBM Data Science Professional",       issuer: "IBM",                      year: "2024", domain: "DATA",  tier: "A", index: "011" },
  { id: "M8V0QULMQX4N", title: "Google Data Analytics",              issuer: "Google",                   year: "2025", domain: "DATA",  tier: "A", index: "012" },
  { id: "YVQ1D5MLFDQU", title: "Applied Data Science with Python",    issuer: "University of Michigan",   year: "2025", domain: "DATA",  tier: "B", index: "013" },
  { id: "MI5FUPDVP8JW", title: "Data Science: Foundations using R",   issuer: "Johns Hopkins University", year: "2025", domain: "DATA",  tier: "B", index: "014" },
  { id: "PMJQNHZRUFV0", title: "Software Design and Architecture",    issuer: "University of Alberta",    year: "2025", domain: "ENG",   tier: "B", index: "015" },
  { id: "8KBK5UWK2HFK", title: "PostgreSQL for Everybody",            issuer: "University of Michigan",   year: "2025", domain: "ENG",   tier: "B", index: "016" },
  { id: "819EBQCCD93U", title: "SQL for Data Science",                issuer: "UC Davis",                 year: "2024", domain: "ENG",   tier: "B", index: "017" },
];

const DOMAIN_META: Record<string, { label: string; shortLabel: string; color: string; glow: string }> = {
  CLOUD: { label: "CLOUD SUPREMACY",      shortLabel: "CLOUD", color: "#22D3EE", glow: "rgba(34,211,238,0.12)"  },
  ML:    { label: "MACHINE INTELLIGENCE", shortLabel: "ML",    color: "#A78BFA", glow: "rgba(167,139,250,0.12)" },
  MATH:  { label: "MATHEMATICAL CORE",    shortLabel: "MATH",  color: "#F59E0B", glow: "rgba(245,158,11,0.12)"  },
  DATA:  { label: "DATA MASTERY",         shortLabel: "DATA",  color: "#10B981", glow: "rgba(16,185,129,0.12)"  },
  ENG:   { label: "ENGINEERING",          shortLabel: "ENG",   color: "#F87171", glow: "rgba(248,113,113,0.12)" },
};

// ─── BREAKPOINTS ─────────────────────────────────────────
// mobile  < 640
// mid     640–899
// desktop 900+   (escala libre, sin techo de max-width)
// ─────────────────────────────────────────────────────────

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
// COUNTER ANIMADO
// ═══════════════════════════════════════════════════════════
function AnimatedCounter({ to, duration = 2.2 }: { to: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const triggered = useRef(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !triggered.current) {
        triggered.current = true;
        const c = animate(0, to, {
          duration,
          ease: "easeOut",
          onUpdate: (v) => {
            if (ref.current)
              ref.current.textContent = Math.floor(v).toString().padStart(2, "0");
          },
        });
        return () => c.stop();
      }
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [to, duration]);
  return <span ref={ref}>00</span>;
}

// ═══════════════════════════════════════════════════════════
// CREDENTIAL ROW
// ═══════════════════════════════════════════════════════════
const CredentialRow = ({
  cred, i, w,
}: {
  cred: typeof CREDENTIALS[0]; i: number; w: number;
}) => {
  const [hovered, setHovered] = useState(false);
  const meta = DOMAIN_META[cred.domain];

  const isMobile  = w < 640;
  const isMid     = w >= 640 && w < 900;
  const isDesktop = w >= 900;

  // Tipografía del título escala suavemente con el ancho
  // clamp: mínimo 0.8rem, sube 1.1vw, máximo 1.35rem
  const titleSize = "clamp(0.8rem, 1.1vw, 1.35rem)";
  const issuerSize = "clamp(0.38rem, 0.42vw, 0.52rem)";

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.55, delay: i * 0.03, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative cursor-default"
      style={{ opacity: cred.tier === "B" ? 0.65 : 1 }}
    >
      {/* Sweep fondo */}
      <motion.div
        initial={false}
        animate={{ scaleX: hovered ? 1 : 0, opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 origin-left pointer-events-none"
        style={{ background: `linear-gradient(90deg, ${meta.glow} 0%, transparent 70%)` }}
      />

      {/* ── MOBILE CARD ── */}
      {isMobile && (
        <div
          className="relative px-4 py-3 border-b"
          style={{ borderColor: "rgba(255,255,255,0.04)" }}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5">
                <span
                  className="font-mono uppercase"
                  style={{
                    fontSize: "0.42rem", letterSpacing: "0.3em",
                    padding: "0.15rem 0.4rem", border: "1px solid",
                    borderColor: meta.color, color: meta.color,
                  }}
                >
                  {meta.shortLabel}
                </span>
                <span
                  className="font-mono uppercase"
                  style={{ fontSize: "0.38rem", letterSpacing: "0.2em", color: "rgba(255,255,255,0.2)" }}
                >
                  {cred.index}
                </span>
              </div>
              <motion.h3
                animate={{ color: hovered ? meta.color : "rgba(255,255,255,0.9)" }}
                transition={{ duration: 0.25 }}
                className="font-serif leading-snug mb-1"
                style={{ fontSize: "0.92rem" }}
              >
                {cred.title}
              </motion.h3>
              <p
                className="font-mono uppercase"
                style={{ fontSize: "0.42rem", letterSpacing: "0.25em", color: "rgba(255,255,255,0.25)" }}
              >
                {cred.issuer}
              </p>
            </div>
            <div className="text-right shrink-0 pt-0.5">
              <div className="font-mono" style={{ fontSize: "0.48rem", color: "rgba(255,255,255,0.4)" }}>
                {cred.year}
              </div>
              <div
                className="font-mono uppercase mt-0.5 max-w-[5rem] truncate"
                style={{ fontSize: "0.32rem", color: "rgba(255,255,255,0.12)" }}
              >
                {cred.id}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TABLA COMPACTA 640–899 ── */}
      {isMid && (
        <div
          className="relative grid items-center border-b"
          style={{
            gridTemplateColumns: "2.2rem 1fr 5.5rem 4.5rem",
            gap: "0.75rem",
            padding: "0.75rem 1.25rem",
            borderColor: "rgba(255,255,255,0.04)",
          }}
        >
          <span className="font-mono tabular-nums select-none"
            style={{ fontSize: "0.42rem", color: "rgba(255,255,255,0.15)" }}>
            {cred.index}
          </span>
          <div className="min-w-0">
            <motion.h3
              animate={{ color: hovered ? meta.color : "rgba(255,255,255,0.9)" }}
              transition={{ duration: 0.25 }}
              className="font-serif leading-tight mb-0.5 truncate"
              style={{ fontSize: titleSize }}
            >
              {cred.title}
            </motion.h3>
            <p className="font-mono uppercase truncate"
              style={{ fontSize: issuerSize, letterSpacing: "0.22em", color: "rgba(255,255,255,0.25)" }}>
              {cred.issuer}
            </p>
          </div>
          <div className="flex items-center gap-1.5 overflow-hidden">
            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: meta.color }} />
            <span className="font-mono uppercase truncate"
              style={{ fontSize: "0.39rem", letterSpacing: "0.18em", color: meta.color }}>
              {meta.shortLabel}
            </span>
          </div>
          <div className="text-right">
            <div className="font-mono" style={{ fontSize: "0.5rem", color: "rgba(255,255,255,0.4)" }}>{cred.year}</div>
            <div className="font-mono uppercase mt-0.5 truncate"
              style={{ fontSize: "0.33rem", color: "rgba(255,255,255,0.12)" }}>{cred.id}</div>
          </div>
        </div>
      )}

      {/* ── TABLA COMPLETA 900+ (escala libre) ── */}
      {isDesktop && (
        <div
          className="relative grid items-center border-b"
          style={{
            // col-1: índice fijo • col-2: título flexible • col-3: domain pill • col-4: año
            gridTemplateColumns: "clamp(2rem,2.2vw,3.5rem) 1fr clamp(9rem,14vw,18rem) clamp(4rem,5.5vw,7rem)",
            gap: "clamp(0.75rem,1.2vw,1.75rem)",
            padding: "clamp(0.75rem,0.9vw,1.25rem) clamp(1.25rem,2.5vw,3rem)",
            borderColor: "rgba(255,255,255,0.04)",
          }}
        >
          <span
            className="font-mono tabular-nums select-none"
            style={{ fontSize: "clamp(0.4rem,0.42vw,0.55rem)", color: "rgba(255,255,255,0.15)" }}
          >
            {cred.index}
          </span>

          <div className="min-w-0">
            <motion.h3
              animate={{ color: hovered ? meta.color : "rgba(255,255,255,0.9)" }}
              transition={{ duration: 0.25 }}
              className="font-serif leading-tight mb-0.5 truncate"
              style={{ fontSize: titleSize }}
            >
              {cred.title}
            </motion.h3>
            <p
              className="font-mono uppercase truncate"
              style={{ fontSize: issuerSize, letterSpacing: "0.28em", color: "rgba(255,255,255,0.25)" }}
            >
              {cred.issuer}
            </p>
          </div>

          <motion.span
            animate={{
              borderColor: hovered ? meta.color : "rgba(255,255,255,0.06)",
              color: hovered ? meta.color : "rgba(255,255,255,0.2)",
            }}
            transition={{ duration: 0.25 }}
            className="font-mono uppercase whitespace-nowrap justify-self-start"
            style={{
              fontSize: "clamp(0.38rem,0.42vw,0.54rem)",
              letterSpacing: "clamp(0.2em,0.3vw,0.38em)",
              padding: "clamp(0.25rem,0.35vw,0.5rem) clamp(0.5rem,0.8vw,1rem)",
              border: "1px solid",
            }}
          >
            {meta.label}
          </motion.span>

          <div className="text-right shrink-0">
            <div
              className="font-mono"
              style={{ fontSize: "clamp(0.45rem,0.5vw,0.65rem)", color: "rgba(255,255,255,0.4)" }}
            >
              {cred.year}
            </div>
            <div
              className="font-mono uppercase mt-0.5 truncate"
              style={{ fontSize: "clamp(0.3rem,0.35vw,0.44rem)", color: "rgba(255,255,255,0.12)" }}
            >
              {cred.id}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════
// STAT BLOCK — escala con vw
// ═══════════════════════════════════════════════════════════
const StatBlock = ({
  value, label, color, delay,
}: {
  value: number; label: string; color: string; delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    className="relative border border-white/[0.05] group hover:border-white/10 transition-colors duration-500"
    style={{ padding: "clamp(1rem,2.5vw,2.5rem)" }}
  >
    <div
      className="absolute top-0 left-0 right-0 h-px"
      style={{ background: `linear-gradient(90deg, transparent, ${color}50, transparent)` }}
    />
    <div
      className="font-mono font-black tabular-nums tracking-tight"
      style={{ fontSize: "clamp(1.6rem,3.5vw,4rem)", color, marginBottom: "clamp(0.3rem,0.5vw,0.75rem)" }}
    >
      <AnimatedCounter to={value} />
    </div>
    <div
      className="font-mono uppercase leading-relaxed"
      style={{
        fontSize: "clamp(0.36rem,0.45vw,0.56rem)",
        letterSpacing: "clamp(0.25em,0.4vw,0.5em)",
        color: "rgba(255,255,255,0.25)",
      }}
    >
      {label}
    </div>
  </motion.div>
);

// ═══════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════
export default function AcademyVault() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"]);

  const [activeDomain, setActiveDomain] = useState<string | null>(null);
  const w = useWindowWidth();
  const filtered = activeDomain
    ? CREDENTIALS.filter((c) => c.domain === activeDomain)
    : CREDENTIALS;

  const isMobile  = w < 640;
  const isMid     = w >= 640 && w < 900;
  const isDesktop = w >= 900;

  // Padding horizontal del contenedor: crece con el ancho, sin techo
  const hPad = isMobile
    ? "1rem"
    : isMid
    ? "1.5rem"
    : `clamp(2rem, 5vw, 6rem)`;

  // Padding vertical de la sección
  const vPad = isMobile ? "5rem" : isMid ? "6rem" : "clamp(6rem, 9vw, 12rem)";

  return (
    <section
      ref={containerRef}
      id="certificados"
      className="relative overflow-hidden"
      style={{ background: "#080808", padding: `${vPad} 0` }}
    >
      {/* ── ATMÓSFERA ── */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div style={{ y: bgY }} className="absolute inset-0">
          <div
            className="absolute inset-0"
            style={{
              opacity: 0.018,
              backgroundImage: `
                linear-gradient(rgba(255,255,255,1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)
              `,
              backgroundSize: "72px 72px",
              maskImage:
                "radial-gradient(ellipse 75% 70% at 50% 40%, black, transparent)",
            }}
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              width: "80vw",
              height: "60vw",
              maxWidth: "1200px",
              maxHeight: "800px",
              background:
                "radial-gradient(ellipse, rgba(16,185,129,0.035) 0%, transparent 70%)",
            }}
          />
        </motion.div>
        <motion.div
          animate={{ y: ["-5vh", "110vh"] }}
          transition={{ duration: 14, repeat: Infinity, ease: "linear", repeatDelay: 3 }}
          className="absolute left-0 right-0 h-px pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(16,185,129,0.15) 40%, rgba(16,185,129,0.25) 50%, rgba(16,185,129,0.15) 60%, transparent 100%)",
          }}
        />
      </div>

      {/* ── CONTENEDOR — ancho 100%, padding lateral crece con pantalla ── */}
      <div style={{ paddingLeft: hPad, paddingRight: hPad }}>

        {/* ══ CABECERA ══ */}
        <div style={{ marginBottom: isMobile ? "3.5rem" : isMid ? "5rem" : "clamp(5rem,7vw,10rem)" }}>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex items-center gap-3"
            style={{ marginBottom: "clamp(1.5rem,2.5vw,3rem)" }}
          >
            <div className="h-px w-10" style={{ background: "rgba(16,185,129,0.6)" }} />
            <span
              className="font-mono uppercase"
              style={{
                fontSize: "clamp(0.4rem,0.5vw,0.6rem)",
                letterSpacing: "clamp(0.4em,0.6vw,0.8em)",
                color: "#10B981",
              }}
            >
              Intellectual Arsenal — Classified
            </span>
          </motion.div>

          {/* Ghost text + título */}
          <div className="relative overflow-hidden">
            <div
              className="absolute -top-4 -left-2 select-none pointer-events-none"
              aria-hidden
            >
              <span
                className="font-serif font-black leading-none whitespace-nowrap"
                style={{ fontSize: "clamp(4rem,16vw,18rem)", color: "rgba(255,255,255,0.018)" }}
              >
                ARSENAL
              </span>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.1 }}
              className="relative z-10"
            >
              <h2
                className="font-serif"
                style={{ lineHeight: 0.88, marginBottom: "clamp(1.25rem,2vw,2.5rem)" }}
              >
                <motion.span
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, delay: 0.15 }}
                  className="block"
                  style={{
                    fontSize: "clamp(1.8rem,6.5vw,8rem)",
                    color: "rgba(255,255,255,0.9)",
                  }}
                >
                  Not certifications.
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, delay: 0.3 }}
                  className="block italic font-light"
                  style={{
                    fontSize: "clamp(1.8rem,6.5vw,8rem)",
                    color: "rgba(255,255,255,0.15)",
                  }}
                >
                  Weapons.
                </motion.span>
              </h2>

              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.55 }}
                className="font-mono uppercase leading-loose"
                style={{
                  fontSize: "clamp(0.42rem,0.5vw,0.62rem)",
                  letterSpacing: "clamp(0.35em,0.5vw,0.65em)",
                  color: "rgba(255,255,255,0.2)",
                  maxWidth: "clamp(18rem,30vw,40rem)",
                }}
              >
                Cada credencial es una herramienta forjada para resolver
                problemas que otros llaman imposibles.
              </motion.p>
            </motion.div>
          </div>
        </div>

        {/* ══ STATS ══ */}
        <div
          className="grid gap-px"
          style={{
            gridTemplateColumns: isMobile ? "1fr 1fr" : "1fr 1fr 1fr 1fr",
            background: "rgba(255,255,255,0.04)",
            marginBottom: isMobile ? "2.5rem" : `clamp(2.5rem,4vw,6rem)`,
          }}
        >
          <StatBlock value={17} label="Verified Credentials" color="#10B981" delay={0}   />
          <StatBlock value={8}  label="Global Institutions"  color="#22D3EE" delay={0.1} />
          <StatBlock value={4}  label="Cloud Platforms"      color="#A78BFA" delay={0.2} />
          <StatBlock value={1}  label="Year of Execution"    color="#F59E0B" delay={0.3} />
        </div>

        {/* ══ FILTROS ══ */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex flex-wrap"
          style={{
            gap: isMobile ? "0.35rem" : "clamp(0.35rem,0.5vw,0.65rem)",
            marginBottom: isMobile ? "1.25rem" : "clamp(1.25rem,1.8vw,2.5rem)",
          }}
        >
          {[
            { key: null, label: "ALL", fullLabel: "ALL DOMAINS", color: "rgba(255,255,255,0.5)" },
            ...Object.entries(DOMAIN_META).map(([key, m]) => ({
              key, label: m.shortLabel, fullLabel: m.label, color: m.color,
            })),
          ].map(({ key, label, fullLabel, color }) => {
            const active = activeDomain === key;
            const btnFontSize = isMobile
              ? "0.4rem"
              : `clamp(0.4rem,0.45vw,0.56rem)`;
            const btnLetterSpacing = isMobile ? "0.28em" : "clamp(0.28em,0.4vw,0.5em)";
            const btnPad = isMobile
              ? "0.28rem 0.65rem"
              : `clamp(0.3rem,0.45vw,0.55rem) clamp(0.65rem,1vw,1.2rem)`;
            return (
              <button
                key={String(key)}
                onClick={() => setActiveDomain(key)}
                className="font-mono uppercase transition-all duration-300"
                style={{
                  fontSize: btnFontSize,
                  letterSpacing: btnLetterSpacing,
                  padding: btnPad,
                  border: "1px solid",
                  borderColor: active ? color : "rgba(255,255,255,0.06)",
                  color: active ? color : "rgba(255,255,255,0.2)",
                  background: active ? `${color}08` : "transparent",
                }}
              >
                {isMobile ? label : fullLabel}
              </button>
            );
          })}
        </motion.div>

        {/* ══ TABLA ══ */}
        <div className="relative border" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          {/* Acento superior */}
          <div
            className="absolute top-0 left-0 right-0 h-px"
            style={{
              background:
                "linear-gradient(90deg, rgba(16,185,129,0.4), rgba(16,185,129,0.1), transparent)",
            }}
          />

          {/* ── Headers ── */}
          {isMobile && (
            <div
              className="flex items-center justify-between border-b"
              style={{
                padding: "0.55rem 1rem",
                borderColor: "rgba(255,255,255,0.06)",
                background: "rgba(255,255,255,0.015)",
              }}
            >
              <span className="font-mono uppercase tracking-[0.4em]"
                style={{ fontSize: "0.4rem", color: "rgba(255,255,255,0.12)" }}>
                Credential
              </span>
              <span className="font-mono uppercase tracking-[0.4em]"
                style={{ fontSize: "0.4rem", color: "rgba(255,255,255,0.12)" }}>
                {filtered.length} results
              </span>
            </div>
          )}

          {isMid && (
            <div
              className="grid items-center border-b"
              style={{
                gridTemplateColumns: "2.2rem 1fr 5.5rem 4.5rem",
                gap: "0.75rem",
                padding: "0.6rem 1.25rem",
                borderColor: "rgba(255,255,255,0.06)",
                background: "rgba(255,255,255,0.015)",
              }}
            >
              {["#", "Credential", "Domain", "Issued"].map((h) => (
                <span key={h} className="font-mono uppercase"
                  style={{ fontSize: "0.4rem", letterSpacing: "0.38em", color: "rgba(255,255,255,0.12)" }}>
                  {h}
                </span>
              ))}
            </div>
          )}

          {isDesktop && (
            <div
              className="grid items-center border-b"
              style={{
                gridTemplateColumns:
                  "clamp(2rem,2.2vw,3.5rem) 1fr clamp(9rem,14vw,18rem) clamp(4rem,5.5vw,7rem)",
                gap: "clamp(0.75rem,1.2vw,1.75rem)",
                padding: `clamp(0.5rem,0.7vw,0.9rem) clamp(1.25rem,2.5vw,3rem)`,
                borderColor: "rgba(255,255,255,0.06)",
                background: "rgba(255,255,255,0.015)",
              }}
            >
              {["#", "Credential", "Domain", "Issued"].map((h) => (
                <span key={h} className="font-mono uppercase"
                  style={{
                    fontSize: "clamp(0.38rem,0.42vw,0.52rem)",
                    letterSpacing: "clamp(0.3em,0.5vw,0.6em)",
                    color: "rgba(255,255,255,0.12)",
                  }}>
                  {h}
                </span>
              ))}
            </div>
          )}

          {/* Filas */}
          <motion.div layout transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}>
            {filtered.map((cred, i) => (
              <CredentialRow key={cred.id} cred={cred} i={i} w={w} />
            ))}
          </motion.div>

          {/* Acento lateral derecho */}
          <div
            className="absolute top-0 right-0 bottom-0 w-px"
            style={{
              background:
                "linear-gradient(to bottom, transparent, rgba(16,185,129,0.15), transparent)",
            }}
          />
        </div>

        {/* ══ CIERRE ══ */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, delay: 0.3 }}
          style={{ marginTop: isMobile ? "5rem" : "clamp(5rem,7vw,10rem)" }}
        >
          <div
            className="flex items-center"
            style={{
              gap: "clamp(1rem,2vw,2.5rem)",
              marginBottom: "clamp(2rem,3.5vw,4rem)",
            }}
          >
            <div
              className="h-px flex-grow"
              style={{
                background: "linear-gradient(to right, rgba(16,185,129,0.25), transparent)",
              }}
            />
            <span
              className="font-mono uppercase whitespace-nowrap"
              style={{
                fontSize: "clamp(0.38rem,0.44vw,0.54rem)",
                letterSpacing: "clamp(0.5em,0.8vw,1em)",
                color: "rgba(255,255,255,0.12)",
              }}
            >
              — EOF —
            </span>
            <div
              className="h-px flex-grow"
              style={{
                background: "linear-gradient(to left, rgba(16,185,129,0.25), transparent)",
              }}
            />
          </div>

          <div className="text-center px-4">
            <p
              className="font-serif italic leading-relaxed"
              style={{
                fontSize: "clamp(1rem,2.5vw,2.5rem)",
                color: "rgba(255,255,255,0.08)",
              }}
            >
              "El reto no interrumpe el plan.
              <br />
              <span style={{ color: "rgba(255,255,255,0.15)" }}>
                El reto <em>es</em> el plan."
              </span>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}