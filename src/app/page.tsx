import Navbar          from "@/components/layout/Navbar";
import HeroCinematic   from "@/components/layout/HeroCinematic";
import ProjectGrid      from "@/components/layout/ProyectGrid";
import ExperienceSection from "@/components/layout/ExperienceSection";
import AcademyVault     from "@/components/layout/AcademyVault";
import IdentitySection  from "@/components/layout/IdentitySection";
import ContactTerminal  from "@/components/layout/ContactTerminal";
import Footer           from "@/components/layout/Footer";

/**
 * ARQUITECTURA DE PÁGINA — Orden narrativo intencional
 *
 * 1. Navbar         — Siempre visible. Fijo en la parte superior.
 * 2. HeroCinematic  — La primera impresión. El AURA. (id: hero)
 * 3. ProjectGrid    — Prueba tangible del trabajo. (id: proyectos)
 * 4. ExperienceSection — La trayectoria cronológica. (id: trayectoria)
 * 5. AcademyVault   — El arsenal intelectual. (id: certificados)
 * 6. IdentitySection — Quién es. El hombre detrás del sistema. (id: sobre-mi)
 * 7. ContactTerminal — El cierre. La llamada a la acción. (id: contacto)
 * 8. Footer         — El sello final.
 */
export default function Home() {
  return (
    <>
      {/* ── Navbar fijo sobre todo ── */}
      <Navbar />

      <main className="flex flex-col bg-bg">

        {/* 01 — IDENTIDAD INICIAL */}
        <HeroCinematic />

        {/* 02 — EVIDENCIA: lo que ha construido */}
        <ProjectGrid />

        {/* 03 — TRAYECTORIA: de dónde viene */}
        <ExperienceSection />

        {/* 04 — ARSENAL: con qué armas opera */}
        <AcademyVault />

        {/* 05 — IDENTIDAD PROFUNDA: quién es realmente */}
        <IdentitySection />

        {/* 06 — CONTACTO: el cierre del argumento */}
        <ContactTerminal />

        {/* 07 — SELLO FINAL */}
        <Footer />

      </main>
    </>
  );
}