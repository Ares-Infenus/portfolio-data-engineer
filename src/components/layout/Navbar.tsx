"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { motion, useReducedMotion, AnimatePresence, useScroll, useTransform } from "framer-motion";

// ─── Constants ───────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { id: "proyectos",    label: "Proyectos",  index: "01" },
  { id: "trayectoria",  label: "Trayectoria",index: "02" },
  { id: "certificados", label: "Arsenal",    index: "03" },
  { id: "sobre-mi",     label: "Identidad",  index: "04" },
] as const;

type NavItemId = (typeof NAV_ITEMS)[number]["id"];

// ─── Smooth Scroll Helper ────────────────────────────────────────────────────

function scrollToId(id: string, prefersReduced: boolean | null) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "start" });
}

// ─── NavLink (Desktop) ───────────────────────────────────────────────────────

function NavLink({
  item,
  isActive,
  onClick,
}: {
  item: (typeof NAV_ITEMS)[number];
  isActive: boolean;
  onClick: (id: string) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const lit = hovered || isActive;

  return (
    <button
      onClick={() => onClick(item.id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-current={isActive ? "page" : undefined}
      className="relative flex items-center gap-[6px] py-1 group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500/50 rounded-sm cursor-none"
    >
      {/* Index */}
      <motion.span
        animate={{ opacity: lit ? 1 : 0, x: lit ? 0 : -6 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        className="font-mono text-[0.38rem] text-emerald-400 tracking-[0.3em] tabular-nums select-none"
      >
        {item.index}
      </motion.span>

      {/* Label */}
      <span
        className="font-mono text-[0.52rem] uppercase tracking-[0.35em] transition-colors duration-300 select-none"
        style={{
          color: isActive
            ? "rgb(52,211,153)"
            : hovered
            ? "rgba(255,255,255,0.75)"
            : "rgba(255,255,255,0.22)",
        }}
      >
        {item.label}
      </span>

      {/* Underline */}
      <motion.span
        aria-hidden
        initial={false}
        animate={{ scaleX: isActive ? 1 : hovered ? 0.55 : 0 }}
        transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
        className="absolute -bottom-1 left-0 right-0 h-px origin-left pointer-events-none"
        style={{
          background: isActive
            ? "rgb(52,211,153)"
            : "rgba(52,211,153,0.45)",
        }}
      />
    </button>
  );
}

// ─── Hamburger Icon ──────────────────────────────────────────────────────────

function HamburgerIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <span className="w-5 h-[14px] flex flex-col justify-between relative">
      <motion.span
        animate={isOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="block h-px w-full bg-white/40"
      />
      <motion.span
        animate={isOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
        transition={{ duration: 0.2 }}
        className="block h-px w-3/4 bg-white/25"
      />
      <motion.span
        animate={isOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="block h-px w-5/6 bg-white/18"
      />
    </span>
  );
}

// ─── Mobile Menu Panel ───────────────────────────────────────────────────────

function MobileMenu({
  isOpen,
  onClose,
  onNavClick,
  active,
}: {
  isOpen: boolean;
  onClose: () => void;
  onNavClick: (id: string) => void;
  active: NavItemId | null;
}) {
  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 z-40 lg:hidden"
            style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
          />

          {/* Panel */}
          <motion.aside
            key="panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label="Menú de navegación"
            className="fixed top-0 right-0 bottom-0 z-50 lg:hidden flex flex-col"
            style={{
              width: "min(320px, 88vw)",
              background: "rgba(5,8,10,0.97)",
              borderLeft: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            {/* Top accent line */}
            <div className="absolute top-0 left-0 right-0 h-px"
              style={{ background: "linear-gradient(90deg, transparent, rgba(52,211,153,0.5), transparent)" }}
            />

            {/* Header */}
            <div className="flex items-center justify-between px-7 pt-7 pb-5"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
            >
              <div className="flex items-center gap-2.5">
                <motion.span
                  animate={{ opacity: [1, 0.35, 1] }}
                  transition={{ duration: 2.2, repeat: Infinity }}
                  className="w-[5px] h-[5px] rounded-full bg-emerald-400"
                />
                <span className="font-mono text-[0.4rem] uppercase tracking-[0.55em] text-emerald-400/60">
                  Nav // Open
                </span>
              </div>
              <button
                onClick={onClose}
                aria-label="Cerrar menú"
                className="w-8 h-8 flex items-center justify-center border border-white/10 hover:border-emerald-500/40 transition-colors duration-250 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500/50"
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M1 1L9 9M9 1L1 9" stroke="rgba(255,255,255,0.35)" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* Nav Items */}
            <nav className="flex-1 flex flex-col justify-center px-7 gap-0">
              {NAV_ITEMS.map((item, i) => {
                const isActive = active === item.id;
                return (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 + i * 0.065, ease: [0.16, 1, 0.3, 1], duration: 0.5 }}
                    onClick={() => { onNavClick(item.id); onClose(); }}
                    className="group w-full text-left flex items-center gap-5 py-5 cursor-none focus-visible:outline-none"
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                  >
                    <span className="font-mono text-[0.38rem] tabular-nums tracking-widest text-emerald-400/35 group-hover:text-emerald-400/65 transition-colors duration-250">
                      {item.index}
                    </span>
                    <span
                      className="font-serif text-[1.65rem] leading-none transition-colors duration-300"
                      style={{ color: isActive ? "rgb(52,211,153)" : "rgba(255,255,255,0.45)" }}
                    >
                      {item.label}
                    </span>
                    <AnimatePresence>
                      {isActive && (
                        <motion.span
                          key="dot"
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0 }}
                          className="ml-auto w-[5px] h-[5px] rounded-full bg-emerald-400 shrink-0"
                        />
                      )}
                    </AnimatePresence>
                  </motion.button>
                );
              })}
            </nav>

            {/* Footer */}
            <div className="px-7 pb-8 pt-5" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
              <button
                onClick={() => { onNavClick("contacto"); onClose(); }}
                className="block w-full text-center font-mono text-[0.48rem] uppercase tracking-[0.5em] py-3.5 border border-emerald-500/25 text-emerald-400/55 hover:border-emerald-400 hover:text-emerald-400 transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500/50"
              >
                Contacto
              </button>
              <div className="flex justify-between items-center mt-5">
                <span className="font-mono text-[0.36rem] uppercase tracking-widest text-white/10">Status</span>
                <div className="flex items-center gap-2">
                  <motion.span
                    animate={{ opacity: [1, 0.25, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-[4px] h-[4px] rounded-full bg-emerald-400"
                  />
                  <span className="font-mono text-[0.36rem] uppercase tracking-widest text-emerald-400/45">
                    Operational
                  </span>
                </div>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Main Navbar ─────────────────────────────────────────────────────────────

export default function Navbar(): JSX.Element {
  const [scrolled, setScrolled]   = useState(false);
  const [isOpen, setIsOpen]       = useState(false);
  const [active, setActive]       = useState<NavItemId | null>(null);
  const prefersReduced            = useReducedMotion();

  // ── Scroll state ─────────────────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── Active section observer ───────────────────────────────────────────────
  useEffect(() => {
    const sections = NAV_ITEMS
      .map((n) => document.getElementById(n.id))
      .filter(Boolean) as HTMLElement[];
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target?.id) setActive(visible.target.id as NavItemId);
      },
      { rootMargin: "-28% 0px -52% 0px", threshold: [0.1, 0.5] }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  // ── Nav click handler ─────────────────────────────────────────────────────
  const handleNavClick = useCallback(
    (id: string) => scrollToId(id, prefersReduced),
    [prefersReduced]
  );

  return (
    <>
      <motion.nav
        initial={{ y: -28, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
        role="navigation"
        aria-label="Navegación principal"
        className="fixed top-0 left-0 right-0 z-40"
      >
        {/* ── Frosted glass background ─────────────────────────────────────── */}
        <motion.div
          aria-hidden
          animate={{ opacity: scrolled ? 1 : 0 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "rgba(3,6,8,0.72)",
            backdropFilter: "blur(22px) saturate(160%)",
            WebkitBackdropFilter: "blur(22px) saturate(160%)",
            borderBottom: "1px solid rgba(255,255,255,0.045)",
          }}
        />

        {/* ── Top emerald accent line ───────────────────────────────────────── */}
        <motion.div
          aria-hidden
          animate={{ scaleX: scrolled ? 1 : 0, opacity: scrolled ? 1 : 0 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="absolute top-0 left-0 right-0 h-px origin-left pointer-events-none"
          style={{ background: "linear-gradient(90deg, rgb(52,211,153), rgba(52,211,153,0.15) 60%, transparent)" }}
        />

        {/* ── Inner container — responsive padding & height ─────────────────── */}
        <div
          className={`
            relative
            mx-auto
            w-full max-w-[1440px]
            px-4 sm:px-6 md:px-8 xl:px-12
            flex items-center justify-between
            transition-[padding] duration-500
            ${scrolled ? "py-3 sm:py-3.5" : "py-5 sm:py-6"}
          `}
        >

          {/* ── LOGO / FIRMA ──────────────────────────────────────────────── */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: prefersReduced ? "auto" : "smooth" })}
            aria-label="Ir al inicio"
            className="flex items-center gap-3 sm:gap-4 group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500/50 rounded-sm cursor-none shrink-0"
          >
            {/* Diamond mark */}
            <div className="relative w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center shrink-0">
              <motion.span
                aria-hidden
                animate={{ rotate: [0, 90, 0] }}
                transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
                className="absolute w-[10px] h-[10px] sm:w-3 sm:h-3 border border-emerald-400/55 rotate-45 group-hover:border-emerald-400 transition-colors duration-400"
              />
              <span className="absolute w-[4px] h-[4px] sm:w-[5px] sm:h-[5px] bg-emerald-400 rotate-45" />
            </div>

            {/* Wordmark */}
            <div className="flex flex-col leading-none">
              <span className="font-serif text-sm sm:text-base text-white/88 tracking-tight leading-tight group-hover:text-white transition-colors duration-300">
                S. Pinzón
              </span>
              <span className="font-mono text-[0.34rem] sm:text-[0.38rem] text-emerald-400/48 uppercase tracking-[0.45em] mt-[2px]">
                Data Engineer
              </span>
            </div>
          </button>

          {/* ── DESKTOP NAV (lg+) ─────────────────────────────────────────── */}
          <div className="hidden lg:flex items-center gap-8 xl:gap-10">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.id}
                item={item}
                isActive={active === item.id}
                onClick={handleNavClick}
              />
            ))}
          </div>

          {/* ── DESKTOP ACTIONS (lg+) ─────────────────────────────────────── */}
          <div className="hidden lg:flex items-center gap-5 xl:gap-6 shrink-0">
            {/* Available status */}
            <div className="flex items-center gap-[7px]">
              <motion.span
                animate={{ opacity: [1, 0.25, 1] }}
                transition={{ duration: 2.6, repeat: Infinity }}
                className="w-[5px] h-[5px] rounded-full bg-emerald-400 shrink-0"
              />
              <span className="font-mono text-[0.38rem] uppercase tracking-[0.45em] text-white/16">
                Available
              </span>
            </div>

            {/* CTA */}
            <button
              onClick={() => handleNavClick("contacto")}
              className="group relative overflow-hidden font-mono text-[0.48rem] uppercase tracking-[0.42em] px-4 xl:px-5 py-2.5 border border-white/10 hover:border-emerald-400/50 transition-colors duration-350 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500/50 cursor-none"
            >
              <span className="absolute inset-0 bg-emerald-400/0 group-hover:bg-emerald-400/[0.06] transition-colors duration-350" />
              <span className="relative text-white/28 group-hover:text-emerald-400/80 transition-colors duration-300">
                Contacto
              </span>
            </button>
          </div>

          {/* ── TABLET NAV (md–lg): inline compact links ──────────────────── */}
          {/* Shows nav items without CTA block to save space on md screens */}
          <div className="hidden md:flex lg:hidden items-center gap-6">
            {NAV_ITEMS.map((item) => {
              const isActive = active === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  aria-current={isActive ? "page" : undefined}
                  className="relative font-mono text-[0.48rem] uppercase tracking-[0.3em] pb-1 focus-visible:outline-none cursor-none"
                  style={{ color: isActive ? "rgb(52,211,153)" : "rgba(255,255,255,0.25)" }}
                >
                  {item.label}
                  {isActive && (
                    <motion.span
                      layoutId="tab-underline"
                      className="absolute -bottom-0.5 left-0 right-0 h-px bg-emerald-400"
                    />
                  )}
                </button>
              );
            })}
            {/* Mini CTA on tablet */}
            <button
              onClick={() => handleNavClick("contacto")}
              className="font-mono text-[0.48rem] uppercase tracking-[0.3em] px-3.5 py-2 border border-white/10 hover:border-emerald-400/50 text-white/25 hover:text-emerald-400/80 transition-all duration-300 focus-visible:outline-none cursor-none"
            >
              Contacto
            </button>
          </div>

          {/* ── HAMBURGER (mobile: < md) ──────────────────────────────────── */}
          <button
            onClick={() => setIsOpen((o) => !o)}
            aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            className="md:hidden p-2 -mr-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500/50 rounded-sm cursor-none"
          >
            <HamburgerIcon isOpen={isOpen} />
          </button>
        </div>
      </motion.nav>

      {/* ── MOBILE PANEL ──────────────────────────────────────────────────── */}
      <MobileMenu
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onNavClick={handleNavClick}
        active={active}
      />
    </>
  );
}