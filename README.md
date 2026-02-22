# Sebastián Pinzón Zambrano — Portfolio

> *"El reto no interrumpe el plan. El reto es el plan."*

Portfolio profesional de **Data Engineering & ML Architecture**, construido con Next.js 14, Framer Motion y Tailwind CSS. Un sistema de presentación cinemático, completamente responsivo y orientado a comunicar competencia técnica con precisión quirúrgica.

---

## 🔗 Live Demo

<!-- TODO: Reemplaza con tu URL de producción -->
```
https://tu-dominio.vercel.app
```

---

## ✅ Estado del Proyecto

| Módulo | Visual | Funcional | URLs enlazadas |
|--------|--------|-----------|----------------|
| Hero Cinematic | ✅ | ✅ | — |
| Project Grid | ✅ | ✅ | ⏳ Pendiente |
| Experience Section | ✅ | ✅ | — |
| Academy Vault | ✅ | ✅ | ⏳ Pendiente |
| Identity Section | ✅ | ✅ | — |
| Contact Terminal | ✅ | ✅ | ⏳ Pendiente |
| Footer | ✅ | ✅ | ⏳ Pendiente |
| Navbar | ✅ | ✅ | — |

---

## 📋 Tareas Pendientes

### 1. Certificados — `AcademyVault.tsx`

El array `CREDENTIALS` contiene los 17 registros. Cada objeto necesita una propiedad `url` con el enlace de verificación de Coursera/AWS/Microsoft/Google.

**Archivo:** `src/components/layout/AcademyVault.tsx`

```typescript
// Estructura actual del objeto (líneas ~10-27):
const CREDENTIALS = [
  { id: "DQ62CP3GJECK", title: "AWS Cloud Solutions Architect", ... },
  ...
]

// Estructura objetivo:
const CREDENTIALS = [
  {
    id: "DQ62CP3GJECK",
    title: "AWS Cloud Solutions Architect",
    issuer: "Amazon Web Services",
    year: "2025",
    domain: "CLOUD",
    tier: "S",
    index: "001",
    url: "https://www.coursera.org/account/accomplishments/verify/DQ62CP3GJECK" // ← AGREGAR
  },
  ...
]
```

Una vez añadida la propiedad `url`, envolver el componente `CredentialRow` (o el título `h3` dentro de él) con un tag `<a>`:

```tsx
// Dentro de CredentialRow, en cada layout (mobile/mid/desktop):
<a
  href={cred.url}
  target="_blank"
  rel="noopener noreferrer"
  style={{ textDecoration: "none" }}
>
  <motion.h3 ...>{cred.title}</motion.h3>
</a>
```

**URLs de verificación por plataforma:**

| Plataforma | Formato URL |
|---|---|
| Coursera | `https://www.coursera.org/account/accomplishments/verify/{ID}` |
| Credly (AWS) | `https://www.credly.com/badges/{ID}` |
| Microsoft Learn | `https://learn.microsoft.com/api/credentials/share/...` |
| Google Cloud | `https://google.accredible.com/{ID}` |

---

### 2. Contacto directo — `ContactTerminal.tsx`

**Archivo:** `src/components/layout/ContactTerminal.tsx`

**Email** — Línea ~230 (sección "Contacto Directo"):

```tsx
// Reemplazar el placeholder:
<a href="mailto:sebastian.pinzon@email.com" ...>
  sebastian.pinzon@email.com
</a>

// Por tu email real:
<a href="mailto:TU_EMAIL_REAL@dominio.com" ...>
  TU_EMAIL_REAL@dominio.com
</a>
```

**Integración del formulario** — La función `handleSubmit` (línea ~127) actualmente simula el envío con un timeout. Para activar el envío real, reemplazar con tu servicio preferido:

```typescript
// Opción A — Resend (recomendado para Next.js):
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!name || !email || !message) return;
  setFormState("sending");
  const res = await fetch("/api/contact", {
    method: "POST",
    body: JSON.stringify({ name, email, subject, message }),
    headers: { "Content-Type": "application/json" },
  });
  setFormState(res.ok ? "sent" : "error");
};

// Opción B — Formspree (sin backend):
// action="https://formspree.io/f/TU_FORM_ID"
```

---

### 3. Redes sociales — `Footer.tsx` y `Navbar.tsx`

**Archivo:** `src/components/layout/Footer.tsx`

```typescript
// Líneas ~52-71 — Array SOCIAL:
const SOCIAL = [
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/sebastian-pinzon", // ← Verificar/actualizar
  },
  {
    label: "GitHub",
    href: "https://github.com/Ares-Infenus", // ← Verificar/actualizar
  },
];
```

---

### 4. Proyectos — `ProjectGrid.tsx`

El botón de flecha en cada `ProjectCard` (componente `ArrowUpRight`) actualmente no enlaza a ningún repositorio. Para activarlo, agregar una propiedad `url` al array `PROJECTS`:

```typescript
// Estructura objetivo en cada proyecto:
{
  id: "01",
  ...
  url: "https://github.com/Ares-Infenus/nombre-del-repo" // ← AGREGAR
}
```

Luego envolver el footer de la card con un `<a>` o manejar el `onClick` del botón de flecha.

---

## 🏗️ Arquitectura

```
├── public/                      # Assets estáticos (imágenes, fuentes locales)
│
└── src/
    ├── app/
    │   ├── globals.css          # Tokens de diseño: colores, spotlight, tipografía
    │   ├── layout.tsx           # Root layout, fuentes Google, metadata SEO
    │   └── page.tsx             # Orquestador de secciones — orden narrativo intencional
    │
    ├── components/
    │   ├── layout/              # Secciones principales (page-level)
    │   │   ├── Navbar.tsx           # Navegación fija, detección de sección activa
    │   │   ├── HeroCinematic.tsx    # Hero con glitch reveal, cursor personalizado
    │   │   ├── ProyectGrid.tsx      # 20 proyectos con filtro por nivel de dificultad
    │   │   ├── ExperienceSection.tsx# Timeline alternado con eje central animado
    │   │   ├── AcademyVault.tsx     # 17 credenciales con filtro por dominio
    │   │   ├── IdentitySection.tsx  # Bio, facet cards 3D, stack ticker
    │   │   ├── ContactTerminal.tsx  # Formulario estilo terminal
    │   │   └── Footer.tsx           # Manifiesto + terminal block + redes
    │   │
    │   └── ui/                  # Componentes atómicos reutilizables
    │       ├── CertCard.tsx         # Tarjeta de certificado (Award icon)
    │       ├── ContactForm.tsx      # Formulario de contacto base
    │       ├── ExperienceItem.tsx   # Ítem de timeline con achievements
    │       └── ProjectCard.tsx      # Tarjeta de proyecto con métricas
    │
    ├── content/
    │   └── projects/            # Contenido estático de proyectos (MDX / JSON)
    │
    ├── lib/                     # Utilidades y helpers compartidos
    └── styles/                  # Estilos adicionales o configuraciones globales
```

### Flujo narrativo de la página

```
Navbar (fijo)
  ↓
HeroCinematic     — Primera impresión. Identidad. Aura.        [#hero]
  ↓
ProjectGrid       — Evidencia tangible del trabajo.            [#proyectos]
  ↓
ExperienceSection — Trayectoria cronológica.                   [#trayectoria]
  ↓
AcademyVault      — Arsenal intelectual: 17 credenciales.      [#certificados]
  ↓
IdentitySection   — Quién es el hombre detrás del sistema.     [#sobre-mi]
  ↓
ContactTerminal   — El cierre. La llamada a la acción.         [#contacto]
  ↓
Footer            — Sello final + manifiesto.
```

---

## 🎨 Sistema de Diseño

### Paleta

| Token | Valor | Uso |
|-------|-------|-----|
| `--color-bg` | `#000000` | Fondo principal |
| `--color-surface` | `#0a0a0a` | Superficies elevadas |
| `--color-border` | `#1a1a1a` | Bordes base |
| `--color-emerald-power` | `#007a5a` | Color de acento dominante |
| `--color-text-main` | `#e6e6e6` | Texto primario |
| `--color-text-muted` | `#666666` | Texto secundario |

### Tipografía

| Rol | Fuente | Variable CSS |
|-----|--------|-------------|
| Titulares (serif) | Playfair Display | `--font-playfair` |
| Cuerpo (sans) | Instrument Sans | `--font-instrument` |
| Técnico/mono | JetBrains Mono | `--font-jetbrains` |

### Efectos visuales clave

- **Spotlight radial** — sigue el cursor del usuario (`globals.css` → `.obsidian-spotlight`)
- **Glitch reveal** — efecto de interferencia en el nombre del hero
- **Scanlines de boot** — animación de inicialización en cards
- **Tilt 3D** — efecto de perspectiva en cards al hover (desactivado en mobile)
- **Textos fantasma** — tipografía colosal a opacidad 0.018–0.03 como fondo decorativo

---

## ⚙️ Stack Técnico

| Categoría | Tecnología |
|-----------|-----------|
| Framework | Next.js 14 (App Router) |
| Lenguaje | TypeScript |
| Estilos | Tailwind CSS v4 |
| Animaciones | Framer Motion |
| Iconos | Lucide React |
| Fuentes | Next/Font (Google Fonts) |
| Deployment | Vercel (recomendado) |

---

## 🚀 Instalación y Desarrollo

```bash
# Clonar el repositorio
git clone https://github.com/Ares-Infenus/nombre-del-repo.git
cd nombre-del-repo

# Instalar dependencias
npm install

# Servidor de desarrollo
npm run dev
# → http://localhost:3000

# Build de producción
npm run build
npm run start
```

**Requisitos:** Node.js ≥ 18, npm ≥ 9

---

## 📦 Deployment en Vercel

```bash
# Con Vercel CLI
npm i -g vercel
vercel

# O conectar el repositorio directamente en vercel.com
# Framework preset: Next.js (auto-detectado)
# Build command: npm run build
# Output directory: .next
```

---

## 📁 Variables de Entorno

Actualmente el proyecto no requiere variables de entorno. Al integrar el formulario de contacto con un servicio externo, crear un archivo `.env.local`:

```env
# Ejemplo con Resend
RESEND_API_KEY=re_xxxxxxxxxxxx

# Ejemplo con Formspree
NEXT_PUBLIC_FORMSPREE_ID=xxxxxxxx
```

---

## 🔍 SEO y Metadata

Configurado en `app/layout.tsx`:

```typescript
export const metadata: Metadata = {
  title: "Sebastian D. Pinzon | Data Infrastructure Architect",
  description: "Estrategia y arquitectura de datos de alto rendimiento.",
};
```

Para extender con Open Graph y Twitter Cards:

```typescript
export const metadata: Metadata = {
  title: "Sebastian D. Pinzon | Data Infrastructure Architect",
  description: "Estrategia y arquitectura de datos de alto rendimiento.",
  openGraph: {
    title: "Sebastian D. Pinzon | Data Infrastructure Architect",
    description: "Estrategia y arquitectura de datos de alto rendimiento.",
    url: "https://tu-dominio.vercel.app",
    images: [{ url: "/og-image.png" }],
  },
};
```

---

## 📄 Licencia

Proyecto privado. Todos los derechos reservados © 2025 Sebastián Pinzón Zambrano.

---

<div align="center">
  <sub>Built with precision. Engineered for dominance.</sub>
</div>