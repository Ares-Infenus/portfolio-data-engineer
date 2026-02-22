"use client";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";

// ═══════════════════════════════════════════════════════
// TIPOS
// ═══════════════════════════════════════════════════════
type FormState = "idle" | "sending" | "sent" | "error";

// ═══════════════════════════════════════════════════════
// HOOK — ancho real (mismo sistema probado)
// ═══════════════════════════════════════════════════════
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

// ═══════════════════════════════════════════════════════
// TERMINAL FIELD — label flotante, borde animado
// ═══════════════════════════════════════════════════════
function TerminalField({
  label, code, type = "text", placeholder,
  value, onChange, multiline = false, w,
}: {
  label: string; code: string; type?: string;
  placeholder: string; value: string;
  onChange: (v: string) => void;
  multiline?: boolean; w: number;
}) {
  const [focused, setFocused] = useState(false);
  const hasValue = value.length > 0;
  const isMobile = w < 640;

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "transparent",
    border: "none",
    outline: "none",
    paddingTop: isMobile ? "1.75rem" : "clamp(1.75rem,2.5vw,2.25rem)",
    paddingBottom: "0.75rem",
    paddingLeft: 0,
    paddingRight: 0,
    fontFamily: "monospace",
    fontSize: isMobile ? "0.7rem" : "clamp(0.65rem,0.8vw,0.82rem)",
    color: "rgba(255,255,255,0.7)",
    letterSpacing: "0.08em",
    resize: "none" as const,
    caretColor: "rgb(16,185,129)",
  };

  return (
    <div className="relative group">
      {/* Borde inferior base */}
      <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
      {/* Borde animado al focus/valor */}
      <motion.div
        animate={{ scaleX: focused || hasValue ? 1 : 0 }}
        initial={{ scaleX: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="absolute bottom-0 left-0 right-0 h-px origin-left"
        style={{ background: "rgb(16,185,129)" }}
      />

      {/* Label flotante */}
      <motion.label
        animate={{
          y: focused || hasValue ? 0 : isMobile ? 14 : 16,
          scale: focused || hasValue ? 1 : 1.08,
          color: focused ? "rgba(16,185,129,0.8)" : "rgba(255,255,255,0.15)",
        }}
        transition={{ duration: 0.25 }}
        className="absolute top-0 left-0 pointer-events-none origin-left"
        style={{
          fontFamily: "monospace",
          fontSize: isMobile ? "0.38rem" : "clamp(0.38rem,0.44vw,0.52rem)",
          textTransform: "uppercase",
          letterSpacing: "0.5em",
        }}
      >
        <span style={{ color: "rgba(16,185,129,0.4)", marginRight: "0.2em" }}>{code}</span>
        {label}
      </motion.label>

      {multiline ? (
        <textarea
          rows={isMobile ? 3 : 4}
          placeholder={focused ? placeholder : ""}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{ ...inputStyle, placeholderColor: "rgba(255,255,255,0.1)" }}
        />
      ) : (
        <input
          type={type}
          placeholder={focused ? placeholder : ""}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={inputStyle}
        />
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// SUBMIT BUTTON — todos los estados con animación
// ═══════════════════════════════════════════════════════
function SubmitButton({ state, w }: { state: FormState; w: number }) {
  const isMobile = w < 640;
  return (
    <button
      type="submit"
      disabled={state === "sending" || state === "sent"}
      className="relative w-full group overflow-hidden border transition-all duration-500"
      style={{
        padding: isMobile ? "0.9rem" : "clamp(0.9rem,1.5vw,1.4rem)",
        borderColor:
          state === "sent"  ? "rgba(16,185,129,0.6)" :
          state === "error" ? "rgba(239,68,68,0.4)"  :
          "rgba(16,185,129,0.25)",
        cursor: state === "sending" || state === "sent" ? "default" : "none",
      }}
    >
      {/* Fill hover */}
      {state === "idle" && (
        <motion.div
          initial={{ scaleX: 0 }}
          whileHover={{ scaleX: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 origin-left"
          style={{ background: "rgba(16,185,129,0.06)" }}
        />
      )}

      <AnimatePresence mode="wait">
        {state === "idle" && (
          <motion.div
            key="idle"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex items-center justify-center gap-4 relative"
          >
            <span
              className="font-mono uppercase group-hover:text-emerald-power/70 transition-colors duration-300"
              style={{
                fontSize: isMobile ? "0.46rem" : "clamp(0.46rem,0.52vw,0.62rem)",
                letterSpacing: "clamp(0.35em,0.5vw,0.6em)",
                color: "rgba(255,255,255,0.3)",
              }}
            >
              Establecer Conexión
            </span>
            <motion.div
              animate={{ x: [0, 3, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              style={{ color: "rgba(16,185,129,0.4)" }}
              className="group-hover:text-emerald-power transition-colors shrink-0"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M1 6h10M7 2l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.div>
          </motion.div>
        )}

        {state === "sending" && (
          <motion.div
            key="sending"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex items-center justify-center gap-3"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-3 h-3 rounded-full"
              style={{ border: "1px solid rgba(16,185,129,0.4)", borderTopColor: "rgb(16,185,129)" }}
            />
            <span className="font-mono uppercase" style={{ fontSize: "0.48rem", letterSpacing: "0.5em", color: "rgba(16,185,129,0.5)" }}>
              Transmitiendo...
            </span>
          </motion.div>
        )}

        {state === "sent" && (
          <motion.div
            key="sent"
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex items-center justify-center gap-3"
          >
            <div className="w-3 h-3 rounded-full flex items-center justify-center" style={{ border: "1px solid rgb(16,185,129)" }}>
              <div className="w-1 h-1 rounded-full" style={{ background: "rgb(16,185,129)" }} />
            </div>
            <span className="font-mono uppercase" style={{ fontSize: "0.48rem", letterSpacing: "0.5em", color: "rgba(16,185,129,0.7)" }}>
              Señal Recibida
            </span>
          </motion.div>
        )}

        {state === "error" && (
          <motion.div
            key="error"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="font-mono uppercase text-center"
            style={{ fontSize: "0.48rem", letterSpacing: "0.5em", color: "rgba(239,68,68,0.6)" }}
          >
            Error de Transmisión — Reintenta
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}

// ═══════════════════════════════════════════════════════
// INFO CARD — lateral izquierda
// ═══════════════════════════════════════════════════════
function InfoCard({
  index, label, value, delay, w,
}: { index: string; label: string; value: string; delay: number; w: number }) {
  const [hovered, setHovered] = useState(false);
  const isMobile = w < 640;

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative flex items-start border-b"
      style={{
        gap: isMobile ? "0.85rem" : "clamp(0.85rem,1.5vw,1.5rem)",
        padding: isMobile ? "0.85rem 0" : "clamp(0.85rem,1.2vw,1.4rem) 0",
        borderColor: "rgba(255,255,255,0.04)",
      }}
    >
      {/* Sweep */}
      <motion.div
        animate={{ scaleX: hovered ? 1 : 0, opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 origin-left pointer-events-none"
        style={{ background: "rgba(16,185,129,0.04)" }}
      />
      <span
        className="font-mono shrink-0 relative"
        style={{ fontSize: "0.4rem", letterSpacing: "0.3em", color: "rgba(16,185,129,0.3)", marginTop: "0.1rem" }}
      >
        {index}
      </span>
      <div className="relative min-w-0">
        <p
          className="font-mono uppercase"
          style={{
            fontSize: isMobile ? "0.38rem" : "clamp(0.38rem,0.44vw,0.52rem)",
            letterSpacing: "0.4em",
            color: "rgba(255,255,255,0.2)",
            marginBottom: "0.4rem",
          }}
        >
          {label}
        </p>
        <p
          className="font-sans transition-colors duration-300"
          style={{
            fontSize: isMobile ? "0.8rem" : "clamp(0.78rem,0.9vw,1rem)",
            color: hovered ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.55)",
          }}
        >
          {value}
        </p>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════
// SECCIÓN PRINCIPAL
// ═══════════════════════════════════════════════════════
export default function ContactTerminal() {
  const [name,    setName]    = useState("");
  const [email,   setEmail]   = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [formState, setFormState] = useState<FormState>("idle");

  const w = useWindowWidth();
  const isMobile  = w < 640;
  const isMid     = w >= 640 && w < 1024;
  const isDesktop = w >= 1024;

  const hPad  = isMobile ? "1rem" : isMid ? "1.5rem" : "clamp(2rem,5vw,6rem)";
  const vPad  = isMobile ? "5rem" : isMid ? "6rem" : "clamp(6rem,9vw,12rem)";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setFormState("sending");
    await new Promise((r) => setTimeout(r, 2200));
    setFormState("sent");
  };

  const INFO_ITEMS = [
    { index: "01", label: "Disponibilidad",   value: "Remoto · Híbrido · Global"        },
    { index: "02", label: "Respuesta",         value: "< 24 horas"                       },
    { index: "03", label: "Tipo de Proyecto", value: "Data · ML · Cloud · Consultoría"  },
    { index: "04", label: "Zona Horaria",     value: "UTC−5 (Colombia)"                  },
  ];

  // Padding interior del formulario
  const formPad = isMobile
    ? "1.25rem"
    : isMid
    ? "clamp(1.5rem,3vw,2.5rem)"
    : "clamp(2rem,3.5vw,4rem)";

  // Espacio entre campos del form
  const fieldGap = isMobile ? "2rem" : "clamp(2rem,3vw,3rem)";

  return (
    <section
      id="contacto"
      className="relative overflow-hidden"
      style={{ background: "#080808", padding: `${vPad} 0` }}
    >

      {/* ── ATMÓSFERA ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0" style={{
          opacity: 0.018,
          backgroundImage: `linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black, transparent)",
        }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{
          width: "70vw", height: "50vw",
          maxWidth: "900px", maxHeight: "600px",
          background: "radial-gradient(ellipse, rgba(16,185,129,0.04) 0%, transparent 70%)",
        }} />
        {/* Scanline */}
        <motion.div
          animate={{ y: ["-10vh", "110vh"] }}
          transition={{ duration: 16, repeat: Infinity, ease: "linear", repeatDelay: 6 }}
          className="absolute left-0 right-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, rgba(16,185,129,0.12), transparent)" }}
        />
      </div>

      <div style={{ paddingLeft: hPad, paddingRight: hPad }}>

        {/* ══ CABECERA ══ */}
        <div style={{ marginBottom: isMobile ? "3rem" : "clamp(3rem,6vw,8rem)" }}>

          {/* Eyebrow pulsante */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex items-center gap-3"
            style={{ marginBottom: isMobile ? "1.5rem" : "clamp(1.5rem,2.5vw,3rem)" }}
          >
            <motion.div
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{ background: "rgb(16,185,129)" }}
            />
            <span
              className="font-mono uppercase"
              style={{
                fontSize: isMobile ? "0.42rem" : "clamp(0.42rem,0.5vw,0.6rem)",
                letterSpacing: "clamp(0.4em,0.6vw,0.8em)",
                color: "rgba(16,185,129,0.6)",
              }}
            >
              Secure Uplink — Open
            </span>
          </motion.div>

          {/* Título — clip reveal */}
          <div className="overflow-hidden" style={{ marginBottom: "0.25em" }}>
            <motion.h2
              initial={{ y: "110%" }}
              whileInView={{ y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif text-white leading-[0.9]"
              style={{ fontSize: "clamp(1.8rem,6.5vw,8rem)" }}
            >
              ¿Tienes un reto
            </motion.h2>
          </div>
          <div className="overflow-hidden">
            <motion.h2
              initial={{ y: "110%" }}
              whileInView={{ y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif italic font-light leading-[0.9]"
              style={{
                fontSize: "clamp(1.8rem,6.5vw,8rem)",
                color: "rgba(255,255,255,0.15)",
              }}
            >
              que otros no pueden resolver?
            </motion.h2>
          </div>

          {/* Separador */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.4 }}
            className="h-px origin-left"
            style={{
              width: isMobile ? "5rem" : "clamp(5rem,8vw,10rem)",
              background: "linear-gradient(to right, rgba(16,185,129,0.5), transparent)",
              marginTop: isMobile ? "1.5rem" : "clamp(1.5rem,2.5vw,3rem)",
            }}
          />
        </div>

        {/* ══ CUERPO — 2 columnas en desktop, stack en mobile/mid ══ */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isDesktop ? "1fr 2fr" : "1fr",
            gap: isDesktop
              ? "clamp(3rem,6vw,8rem)"
              : isMid
              ? "3rem"
              : "2.5rem",
            alignItems: "start",
          }}
        >

          {/* ─── COLUMNA IZQUIERDA ─── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.2 }}
              className="font-sans leading-relaxed"
              style={{
                fontSize: isMobile ? "0.82rem" : "clamp(0.8rem,0.92vw,1rem)",
                color: "rgba(255,255,255,0.25)",
                marginBottom: isMobile ? "1.5rem" : "clamp(1.5rem,3vw,3rem)",
              }}
            >
              No busco proyectos ordinarios. Si tienes una visión que requiere precisión, escala y dominio — establece la conexión. La respuesta no tardará.
            </motion.p>

            {/* Info items */}
            <div>
              {INFO_ITEMS.map((item, i) => (
                <InfoCard key={item.index} {...item} delay={0.1 + i * 0.08} w={w} />
              ))}
            </div>

            {/* Contacto directo */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              style={{
                marginTop: isMobile ? "1.5rem" : "clamp(1.5rem,2.5vw,3rem)",
                paddingTop: isMobile ? "1.25rem" : "clamp(1.25rem,2vw,2rem)",
                borderTop: "1px solid rgba(255,255,255,0.04)",
              }}
            >
              <p
                className="font-mono uppercase"
                style={{
                  fontSize: "clamp(0.38rem,0.44vw,0.52rem)",
                  letterSpacing: "0.5em",
                  color: "rgba(255,255,255,0.12)",
                  marginBottom: "0.75rem",
                }}
              >
                Contacto Directo
              </p>
              <a
                href="mailto:sebastian.pinzon@email.com"
                className="font-serif italic transition-colors duration-300"
                style={{
                  fontSize: isMobile ? "0.82rem" : "clamp(0.82rem,0.95vw,1.1rem)",
                  color: "rgba(255,255,255,0.3)",
                }}
                onMouseEnter={e => (e.currentTarget.style.color = "rgba(16,185,129,0.6)")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.3)")}
              >
                sebastian.pinzon@email.com
              </a>
            </motion.div>
          </div>

          {/* ─── COLUMNA DERECHA — FORMULARIO ─── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            {/* Esquinas decorativas — escalan con el contenedor */}
            <div className="absolute -top-3 -left-3 w-5 h-5 border-t border-l" style={{ borderColor: "rgba(16,185,129,0.25)" }} />
            <div className="absolute -bottom-3 -right-3 w-5 h-5 border-b border-r" style={{ borderColor: "rgba(16,185,129,0.25)" }} />
            <div className="absolute -top-3 -right-3 w-3 h-3 border-t border-r" style={{ borderColor: "rgba(255,255,255,0.08)" }} />
            <div className="absolute -bottom-3 -left-3 w-3 h-3 border-b border-l" style={{ borderColor: "rgba(255,255,255,0.08)" }} />

            <div
              className="relative border"
              style={{
                borderColor: "rgba(255,255,255,0.06)",
                padding: formPad,
              }}
            >
              {/* Línea top acento */}
              <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{ background: "linear-gradient(90deg, rgba(16,185,129,0.3), rgba(16,185,129,0.1), transparent)" }}
              />

              {/* Header de terminal */}
              <div
                className="flex items-center justify-between border-b"
                style={{
                  marginBottom: isMobile ? "1.5rem" : "clamp(1.5rem,2.5vw,3rem)",
                  paddingBottom: isMobile ? "1rem" : "clamp(1rem,1.5vw,1.75rem)",
                  borderColor: "rgba(255,255,255,0.05)",
                }}
              >
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }} />
                    <div className="w-2 h-2 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }} />
                    <motion.div
                      animate={{ opacity: [1, 0.4, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-2 h-2 rounded-full"
                      style={{ background: "rgba(16,185,129,0.5)" }}
                    />
                  </div>
                  <span
                    className="font-mono uppercase"
                    style={{
                      fontSize: isMobile ? "0.36rem" : "clamp(0.36rem,0.42vw,0.5rem)",
                      letterSpacing: "0.5em",
                      color: "rgba(255,255,255,0.12)",
                      marginLeft: "0.5rem",
                    }}
                  >
                    transmission.init
                  </span>
                </div>
                <div
                  className="font-mono uppercase"
                  style={{ fontSize: "0.36rem", letterSpacing: "0.4em", color: "rgba(255,255,255,0.1)" }}
                >
                  ENC: AES-256
                </div>
              </div>

              {/* ── FORMULARIO ── */}
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: fieldGap }}>

                {/* Nombre + Email: en fila en tablet+, stacked en mobile */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                    gap: isMobile ? fieldGap : "clamp(1.5rem,3vw,3.5rem)",
                  }}
                >
                  <TerminalField
                    label="Identificación" code="ID_"
                    placeholder="Tu nombre"
                    value={name} onChange={setName} w={w}
                  />
                  <TerminalField
                    label="Canal Seguro" code="ML_" type="email"
                    placeholder="correo@dominio.com"
                    value={email} onChange={setEmail} w={w}
                  />
                </div>

                <TerminalField
                  label="Objetivo de Misión" code="OBJ_"
                  placeholder="Tipo de proyecto o colaboración"
                  value={subject} onChange={setSubject} w={w}
                />

                <TerminalField
                  label="Briefing Completo" code="MSG_"
                  placeholder="Describe el reto arquitectónico..."
                  value={message} onChange={setMessage}
                  multiline w={w}
                />

                <SubmitButton state={formState} w={w} />

                {/* Metadata del sistema */}
                <div className="flex items-center justify-between" style={{ paddingTop: "0.25rem" }}>
                  <div className="flex items-center gap-2">
                    <motion.div
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 2.5, repeat: Infinity }}
                      className="w-1 h-1 rounded-full"
                      style={{ background: "rgb(16,185,129)" }}
                    />
                    <span
                      className="font-mono uppercase"
                      style={{ fontSize: "0.36rem", letterSpacing: "0.4em", color: "rgba(255,255,255,0.12)" }}
                    >
                      Canal Activo
                    </span>
                  </div>
                  <span
                    className="font-mono uppercase"
                    style={{ fontSize: "0.36rem", letterSpacing: "0.4em", color: "rgba(255,255,255,0.08)" }}
                  >
                    UTC−5 // Colombia
                  </span>
                </div>
              </form>
            </div>
          </motion.div>
        </div>

        {/* ══ SELLO FINAL COLOSAL ══ */}
        <div
          className="relative overflow-hidden"
          style={{ marginTop: isMobile ? "5rem" : "clamp(5rem,10vw,14rem)" }}
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-center relative"
          >
            {/* Divisor */}
            <div
              className="flex items-center gap-6"
              style={{ marginBottom: isMobile ? "2.5rem" : "clamp(2.5rem,5vw,6rem)" }}
            >
              <div className="h-px flex-grow" style={{ background: "linear-gradient(to right, transparent, rgba(255,255,255,0.04))" }} />
              <div className="w-1 h-1 rotate-45 shrink-0" style={{ background: "rgba(255,255,255,0.1)" }} />
              <div className="h-px flex-grow" style={{ background: "linear-gradient(to left, transparent, rgba(255,255,255,0.04))" }} />
            </div>

            {/* Texto colosal — completamente fluido */}
            <div className="relative overflow-hidden">
              <h3
                className="font-serif font-black select-none pointer-events-none leading-none tracking-tighter"
                style={{
                  fontSize: "clamp(4rem,18vw,22rem)",
                  color: "rgba(255,255,255,0.018)",
                }}
              >
                CONTACT
              </h3>
              {/* Texto superpuesto */}
              <div className="absolute inset-0 flex items-center justify-center px-4">
                <p
                  className="font-mono uppercase text-center"
                  style={{
                    fontSize: isMobile ? "0.38rem" : "clamp(0.38rem,0.5vw,0.6rem)",
                    letterSpacing: "clamp(0.5em,0.8vw,1em)",
                    color: "rgba(255,255,255,0.15)",
                  }}
                >
                  Sebastian Pinzón Zambrano · Data Engineer · Colombia
                </p>
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}