"use client";
import {
  motion, useMotionValue, useSpring, useTransform,
  AnimatePresence, useScroll, useInView,
} from "framer-motion";
import {
  ArrowUpRight, Database, BarChart2, TrendingUp, Brain, Layers,
  Activity, BookOpen, Eye, GitBranch, Search, Boxes, Sigma,
  Network, FlaskConical, Radio,
} from "lucide-react";
import React, { useState, useRef, useEffect } from "react";

// ═══════════════════════════════════════════════════════════════════
// HOOK — ancho real (mismo sistema probado en las otras secciones)
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

// ─── LEVEL CONFIG ─────────────────────────────────────────────────
const LEVELS = [
  { id: "ALL",          label: "ALL SYSTEMS",               short: "ALL"  },
  { id: "BASIC",        label: "LEVEL 01 // BASIC",         short: "L1"   },
  { id: "INTERMEDIATE", label: "LEVEL 02 // INTERMEDIATE",  short: "L2"   },
  { id: "ADVANCED",     label: "LEVEL 03 // ADVANCED",      short: "L3"   },
  { id: "EXPERT",       label: "LEVEL 04 // EXPERT",        short: "L4"   },
];

// ─── PROJECTS DATA ────────────────────────────────────────────────
const PROJECTS = [
  { id: "01", level: "BASIC",        levelLabel: "L1 // BASIC",        tag: "DATA ENGINEERING",      title: "Financial ETL Pipeline",        description: "Pipeline ETL completo para datos financieros. Ingesta multi-fuente, limpieza, normalización y almacenamiento optimizado en Parquet. Capacidad de resampleo temporal con validación de calidad.", metrics: [{ label: "Stack", value: "Pandas / NumPy" }, { label: "Output", value: "Parquet" }], icon: <Database size={16} />, featured: false },
  { id: "02", level: "BASIC",        levelLabel: "L1 // BASIC",        tag: "STATISTICAL ANALYSIS",  title: "Time Series EDA",               description: "Análisis estadístico profundo de series temporales financieras: tests ADF/KPSS, ACF/PACF, kurtosis, skewness, retornos logarítmicos y descomposición tendencia-estacionalidad-ruido.", metrics: [{ label: "Tests", value: "ADF / KPSS" }, { label: "Visuals", value: "12 Charts" }], icon: <BarChart2 size={16} />, featured: false },
  { id: "03", level: "BASIC",        levelLabel: "L1 // BASIC",        tag: "BACKTESTING ENGINE",    title: "RSI Strategy Backtester",       description: "Motor de backtesting para estrategia RSI con simulación realista de comisiones y slippage. Métricas completas: Sharpe Ratio, CAGR, Max Drawdown y Win Rate sobre equity curve histórica.", metrics: [{ label: "Sharpe", value: "Tracked" }, { label: "Engine", value: "ta-lib" }], icon: <TrendingUp size={16} />, featured: false },
  { id: "04", level: "BASIC",        levelLabel: "L1 // BASIC",        tag: "BUSINESS ML",           title: "Predictive Analytics",          description: "Solución ML para problema empresarial real: predicción de churn, forecast de demanda u optimización de pricing. Dashboard interactivo con Streamlit e interpretabilidad completa mediante SHAP.", metrics: [{ label: "Model", value: "XGBoost" }, { label: "XAI", value: "SHAP" }], icon: <Brain size={16} />, featured: false },
  { id: "05", level: "INTERMEDIATE", levelLabel: "L2 // INTERMEDIATE", tag: "FEATURE ENGINEERING",   title: "Temporal Feature Store",        description: "Construcción sistemática de 50+ features para series temporales: lagged returns, indicadores técnicos (RSI, MACD, Bollinger, ATR), rolling windows y z-scores. Análisis de correlación y selección óptima.", metrics: [{ label: "Features", value: "50+" }, { label: "Format", value: "Parquet" }], icon: <Layers size={16} />, featured: false },
  { id: "06", level: "INTERMEDIATE", levelLabel: "L2 // INTERMEDIATE", tag: "ML MODELING",           title: "XGBoost Price Predictor",       description: "Modelo predictivo de dirección de precios con walk-forward validation temporal. Pipeline completo: preparación, entrenamiento, evaluación (ROC-AUC, F1) e interpretabilidad avanzada con SHAP.", metrics: [{ label: "Validation", value: "Walk-Fwd" }, { label: "Metric", value: "ROC-AUC" }], icon: <Activity size={16} />, featured: false },
  { id: "07", level: "INTERMEDIATE", levelLabel: "L2 // INTERMEDIATE", tag: "NLP",                   title: "Sentiment Classifier",          description: "Clasificador de sentimientos con comparación de 3 modelos: SVM baseline, XGBoost y DistilBERT fine-tuned. Pipeline NLP completo con preprocesamiento, embeddings y demo interactiva en Gradio.", metrics: [{ label: "Models", value: "3 Compared" }, { label: "Backend", value: "HuggingFace" }], icon: <BookOpen size={16} />, featured: false },
  { id: "08", level: "INTERMEDIATE", levelLabel: "L2 // INTERMEDIATE", tag: "COMPUTER VISION",       title: "YOLOv8 Object Detector",        description: "Detector de objetos con YOLOv8 fine-tuneado en dataset custom. Pipeline completo de anotación (Roboflow), entrenamiento, evaluación con mAP e inferencia en tiempo real a 30+ FPS.", metrics: [{ label: "Model", value: "YOLOv8" }, { label: "Speed", value: "30+ FPS" }], icon: <Eye size={16} />, featured: false },
  { id: "09", level: "INTERMEDIATE", levelLabel: "L2 // INTERMEDIATE", tag: "MLOPS",                 title: "ML Model API Deployment",       description: "Deployment de modelo ML como servicio REST con FastAPI, validación Pydantic, containerización Docker y deployment gratuito en Render. Documentación Swagger automática y Postman collection.", metrics: [{ label: "Stack", value: "FastAPI" }, { label: "Deploy", value: "Docker" }], icon: <GitBranch size={16} />, featured: false },
  { id: "10", level: "INTERMEDIATE", levelLabel: "L2 // INTERMEDIATE", tag: "ENTERPRISE NLP",        title: "Multi-Task NLP System",         description: "Sistema NLP empresarial multi-componente: sentiment analysis, Named Entity Recognition con spaCy, topic modeling con LDA y dashboard analítico completo con visualizaciones temporales.", metrics: [{ label: "Tasks", value: "3 Models" }, { label: "UI", value: "Streamlit" }], icon: <Search size={16} />, featured: false },
  { id: "11", level: "INTERMEDIATE", levelLabel: "L2 // INTERMEDIATE", tag: "BIG DATA",              title: "PySpark Analytics Engine",      description: "Procesamiento distribuido de datasets masivos (10GB+) en Databricks. Window functions, broadcast joins, caching estratégico y almacenamiento ACID con Delta Lake. Análisis de fraude sobre 100M+ transacciones.", metrics: [{ label: "Scale", value: "100M+ rows" }, { label: "Format", value: "Delta Lake" }], icon: <Boxes size={16} />, featured: false },
  { id: "12", level: "ADVANCED",     levelLabel: "L3 // ADVANCED",     tag: "QUANTITATIVE FINANCE",  title: "Markowitz Portfolio Optimizer",  description: "Optimizador cuantitativo multi-método: Mean-Variance, Risk Parity, CVaR y Black-Litterman. Restricciones reales (pesos mín/máx, límites sectoriales, turnover). Backtesting con rebalanceo y costos.", metrics: [{ label: "Methods", value: "4 Models" }, { label: "Backtest", value: "2+ Years" }], icon: <Sigma size={16} />, featured: true },
  { id: "13", level: "ADVANCED",     levelLabel: "L3 // ADVANCED",     tag: "RECOMMENDATION",        title: "Hybrid Recommender System",     description: "Sistema de recomendaciones híbrido: Collaborative Filtering (SVD), Content-Based (BERT embeddings) y Sequential Modeling (BERT4Rec). Ensemble final con métricas NDCG@10 y Recall@K.", metrics: [{ label: "Approach", value: "Hybrid" }, { label: "Metric", value: "NDCG@10" }], icon: <Network size={16} />, featured: false },
  { id: "14", level: "ADVANCED",     levelLabel: "L3 // ADVANCED",     tag: "COMPUTER VISION",       title: "Real-Time CV Pipeline",         description: "Pipeline CV end-to-end con YOLOv8/ViT, optimización ONNX (FP32→INT8, 4x speedup), API FastAPI dockerizada y detección en tiempo real a 30 FPS. Benchmarks comparativos PyTorch vs ONNX.", metrics: [{ label: "Format", value: "ONNX" }, { label: "Speedup", value: "4x" }], icon: <Eye size={16} />, featured: false },
  { id: "15", level: "ADVANCED",     levelLabel: "L3 // ADVANCED",     tag: "MLOPS END-TO-END",      title: "Reproducible ML Pipeline",      description: "Pipeline MLOps profesional: orquestación Airflow, experiment tracking MLflow, versionado DVC y CI/CD con GitHub Actions. Estructura modular con tests, Docker y runbooks completos.", metrics: [{ label: "Orch.", value: "Airflow" }, { label: "Tracking", value: "MLflow" }], icon: <GitBranch size={16} />, featured: false },
  { id: "16", level: "ADVANCED",     levelLabel: "L3 // ADVANCED",     tag: "GENERATIVE AI",         title: "Domain-Specific LLM",           description: "Fine-tuning eficiente de LLM (Mistral-7B) con LoRA/QLoRA entrenando solo el 0.1% de parámetros. Cuantización 4-bit. Demo Gradio + API FastAPI desplegada en HuggingFace Spaces.", metrics: [{ label: "Params", value: "0.1% LoRA" }, { label: "Quant.", value: "4-bit" }], icon: <Brain size={16} />, featured: true },
  { id: "17", level: "EXPERT",       levelLabel: "L4 // EXPERT",       tag: "QUANTITATIVE RESEARCH", title: "Market Regimes Engine",         description: "Motor de identificación de regímenes de mercado con HMM (bull/bear/sideways), GMM para clustering de volatilidad, GARCH y ensemble de señales. Dashboard interactivo Plotly.", metrics: [{ label: "Models", value: "HMM + GMM" }, { label: "Regimes", value: "6 States" }], icon: <Activity size={16} />, featured: false },
  { id: "18", level: "EXPERT",       levelLabel: "L4 // EXPERT",       tag: "ALPHA GENERATION",      title: "Alpha Factory Pipeline",        description: "Sistema cuantitativo de generación y ranking de 100+ señales alpha: momentum, mean-reversion, volume, volatility y cross-sectional. Walk-forward validation 2+ años. Alpha Book PDF.", metrics: [{ label: "Alphas", value: "100+" }, { label: "Validation", value: "Walk-Fwd" }], icon: <FlaskConical size={16} />, featured: true },
  { id: "19", level: "EXPERT",       levelLabel: "L4 // EXPERT",       tag: "INSTITUTIONAL FINANCE", title: "Portfolio Brain",               description: "Optimizador institucional: Ledoit-Wolf shrinkage, Mean-Variance, CVaR, Risk Parity y Black-Litterman. Restricciones reales (límites sectoriales, turnover, costos). Backtest 3+ años.", metrics: [{ label: "Methods", value: "4 Optim." }, { label: "Backtest", value: "3+ Years" }], icon: <Sigma size={16} />, featured: false },
  { id: "20", level: "EXPERT",       levelLabel: "L4 // EXPERT",       tag: "MARKET MICROSTRUCTURE", title: "Order Book Intelligence",       description: "Microestructura de mercado en tiempo real: ingesta WebSocket (Binance, 100ms), OBI/WMP/spread/depth, modelo XGBoost (1-60s) y estrategias VWAP, TWAP, POV y Smart Order Routing.", metrics: [{ label: "Latency", value: "100ms" }, { label: "Execution", value: "VWAP/TWAP" }], icon: <Radio size={16} />, featured: true },
];

const levelColor: Record<string, { text: string; border: string }> = {
  BASIC:        { text: "rgba(56,189,248,0.7)",  border: "rgba(56,189,248,0.2)"  },
  INTERMEDIATE: { text: "rgba(251,191,36,0.7)",  border: "rgba(251,191,36,0.2)"  },
  ADVANCED:     { text: "rgba(167,139,250,0.7)", border: "rgba(167,139,250,0.2)" },
  EXPERT:       { text: "rgb(16,185,129)",        border: "rgba(16,185,129,0.4)"  },
};

// ═══════════════════════════════════════════════════════════════════
// CINEMATIC HEADER — parallax + clip reveal, totalmente fluido
// ═══════════════════════════════════════════════════════════════════
function CinematicHeader({ w }: { w: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const titleY  = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const titleOp = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const isMobile  = w < 640;
  const isMid     = w >= 640 && w < 900;
  const isDesktop = w >= 900;

  // El indent izquierdo que acompaña la línea vertical — escala con vw
  const indentLeft = isMobile
    ? "2.25rem"
    : isMid
    ? "2.75rem"
    : "clamp(2.75rem,4vw,5rem)";

  const statBoxMax = isMobile ? "100%" : isMid ? "90%" : "clamp(28rem,44vw,52rem)";

  return (
    <div ref={ref} className="relative overflow-hidden" style={{ marginBottom: 0 }}>

      {/* Línea vertical de arranque */}
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        whileInView={{ height: "100%", opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="absolute left-0 top-0 origin-top"
        style={{
          width: isMobile ? "2px" : "3px",
          background: "linear-gradient(to bottom, rgb(16,185,129), rgba(16,185,129,0.5), transparent)",
        }}
      />

      <motion.div style={{ y: titleY, opacity: titleOp }} style={{ paddingLeft: indentLeft, y: titleY, opacity: titleOp }}>

        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex items-center gap-3 flex-wrap"
          style={{ marginBottom: isMobile ? "1.5rem" : "clamp(1.5rem,2.5vw,2.5rem)" }}
        >
          <span
            className="font-mono uppercase"
            style={{
              fontSize: isMobile ? "0.38rem" : "clamp(0.38rem,0.44vw,0.52rem)",
              letterSpacing: "clamp(0.4em,0.7vw,0.9em)",
              color: "rgba(16,185,129,0.5)",
            }}
          >
            // SYS.PORTFOLIO.INIT
          </span>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.8 }}
            className="h-px origin-left"
            style={{ width: isMobile ? "2rem" : "clamp(2rem,4vw,5rem)", background: "rgba(16,185,129,0.4)" }}
          />
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1.2 }}
            className="font-mono uppercase"
            style={{
              fontSize: isMobile ? "0.36rem" : "clamp(0.36rem,0.42vw,0.5rem)",
              letterSpacing: "0.35em",
              color: "rgba(255,255,255,0.15)",
            }}
          >
            20 MODULES LOADED
          </motion.span>
        </motion.div>

        {/* Título — clip reveal línea por línea */}
        <div style={{ marginBottom: isMobile ? "1.5rem" : "clamp(1.5rem,2.5vw,3rem)" }}>
          {[
            { text: "Strategic",      italic: false },
            { text: "Intelligence.",  italic: true  },
          ].map((line, i) => (
            <div key={i} className="overflow-hidden">
              <motion.div
                initial={{ y: "110%", skewY: 2 }}
                whileInView={{ y: "0%", skewY: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.1, delay: 0.5 + i * 0.18, ease: [0.16, 1, 0.3, 1] }}
              >
                <h2
                  className="font-serif leading-[0.88] tracking-[-0.02em]"
                  style={{
                    fontSize: "clamp(2.2rem,7.5vw,10rem)",
                    color: line.italic ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.95)",
                    fontStyle: line.italic ? "italic" : "normal",
                    fontWeight: line.italic ? 300 : undefined,
                  }}
                >
                  {line.text}
                </h2>
              </motion.div>
            </div>
          ))}
        </div>

        {/* Stats bar HUD */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 1.1 }}
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr 1fr" : "1fr 1fr 1fr 1fr",
            gap: "1px",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.05)",
            maxWidth: statBoxMax,
            marginBottom: isMobile ? "2rem" : "clamp(2rem,3.5vw,4rem)",
          }}
        >
          {[
            { n: "20",   l: "Projects"        },
            { n: "4",    l: "Difficulty Tiers" },
            { n: "100+", l: "Alpha Signals"   },
            { n: "∞",    l: "Scalability"     },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 1.2 + i * 0.08 }}
              className="relative group"
              style={{
                background: "#080808",
                padding: isMobile ? "0.85rem 1rem" : "clamp(0.85rem,1.5vw,1.5rem) clamp(1rem,2vw,2rem)",
              }}
            >
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 1.3 + i * 0.08, duration: 0.5 }}
                className="absolute top-0 left-0 right-0 h-px origin-left"
                style={{ background: "linear-gradient(to right, rgba(16,185,129,0.5), transparent)" }}
              />
              <div
                className="font-mono text-white tracking-tight"
                style={{ fontSize: isMobile ? "1.1rem" : "clamp(1.1rem,2vw,1.75rem)", marginBottom: "0.2rem" }}
              >
                {s.n}
              </div>
              <div
                className="font-mono uppercase"
                style={{
                  fontSize: isMobile ? "0.38rem" : "clamp(0.38rem,0.44vw,0.52rem)",
                  letterSpacing: "0.4em",
                  color: "rgba(255,255,255,0.2)",
                }}
              >
                {s.l}
              </div>
            </motion.div>
          ))}
        </motion.div>

      </motion.div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// PROJECT CARD — tilt 3D desactivado en mobile, todo con clamp
// ═══════════════════════════════════════════════════════════════════
const ProjectCard = ({
  project, index, w,
}: {
  project: (typeof PROJECTS)[number];
  index: number;
  w: number;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mx = useSpring(x, { stiffness: 250, damping: 28 });
  const my = useSpring(y, { stiffness: 250, damping: 28 });
  const rotX = useTransform(my, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotY = useTransform(mx, [-0.5, 0.5], ["-5deg", "5deg"]);
  const [hovered, setHovered] = useState(false);
  const isMobile = w < 640;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile) return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - r.left) / r.width - 0.5);
    y.set((e.clientY - r.top) / r.height - 0.5);
  };

  const colors = levelColor[project.level] ?? { text: "rgba(255,255,255,0.2)", border: "rgba(255,255,255,0.1)" };

  // Stagger por columna (adaptado al nº de cols)
  const cols = isMobile ? 1 : w < 1200 ? 2 : 3;
  const col = index % cols;
  const staggerDelay = col * 0.08;

  const cardPad = isMobile ? "1rem" : "clamp(1rem,1.8vw,1.75rem)";
  const minH    = isMobile ? "220px" : "clamp(240px,22vw,320px)";
  const titleSz = isMobile ? "1.15rem" : "clamp(1.1rem,1.5vw,1.6rem)";

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.85, delay: staggerDelay, ease: [0.16, 1, 0.3, 1] }}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { x.set(0); y.set(0); setHovered(false); }}
      style={{
        rotateX: isMobile ? 0 : rotX,
        rotateY: isMobile ? 0 : rotY,
        transformStyle: "preserve-3d",
      }}
      className="group relative flex flex-col justify-between overflow-hidden"
      style={{
        background: "#080808",
        border: "1px solid rgba(255,255,255,0.06)",
        minHeight: minH,
        rotateX: isMobile ? 0 : rotX,
        rotateY: isMobile ? 0 : rotY,
        transformStyle: "preserve-3d",
      }}
    >
      {/* Sweep bottom-up hover */}
      <motion.div
        animate={{ scaleY: hovered ? 1 : 0 }}
        initial={{ scaleY: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 origin-bottom pointer-events-none"
        style={{ background: "linear-gradient(to top, rgba(16,185,129,0.05), transparent 70%)" }}
      />

      {/* Línea superior hover */}
      <motion.div
        animate={{ scaleX: hovered ? 1 : 0 }}
        initial={{ scaleX: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-0 left-0 right-0 h-px origin-left pointer-events-none"
        style={{ background: "linear-gradient(90deg, rgb(16,185,129), rgba(16,185,129,0.2), transparent)" }}
      />

      {/* Scanline boot */}
      <motion.div
        initial={{ top: "-20%" }}
        whileInView={{ top: "120%" }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, delay: 0.2 + staggerDelay, ease: "easeInOut" }}
        className="absolute left-0 w-full h-20 pointer-events-none z-20"
        style={{ background: "linear-gradient(to bottom, transparent, rgba(16,185,129,0.07), transparent)" }}
      />

      {/* Featured mark */}
      {project.featured && (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 + staggerDelay }}
          className="absolute flex items-center gap-1.5 z-10"
          style={{ top: isMobile ? "0.6rem" : "1rem", right: isMobile ? "0.6rem" : "1rem" }}
        >
          <motion.div
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            className="w-1 h-1 rounded-full"
            style={{ background: "rgb(16,185,129)" }}
          />
          <span
            className="font-mono uppercase"
            style={{ fontSize: "0.38rem", letterSpacing: "0.4em", color: "rgba(16,185,129,0.5)" }}
          >
            Featured
          </span>
        </motion.div>
      )}

      {/* ── CUERPO SUPERIOR ── */}
      <div
        className="relative z-10 flex flex-col"
        style={{ padding: cardPad, transform: isMobile ? "none" : "translateZ(30px)" }}
      >
        {/* Header: badges + icono */}
        <div
          className="flex justify-between items-start"
          style={{ marginBottom: isMobile ? "0.85rem" : "clamp(0.85rem,1.5vw,1.75rem)" }}
        >
          <div className="flex flex-col gap-1">
            <motion.span
              animate={{ borderColor: hovered ? colors.border : "rgba(255,255,255,0.06)" }}
              className="font-mono uppercase w-fit"
              style={{
                fontSize: isMobile ? "0.38rem" : "clamp(0.38rem,0.44vw,0.52rem)",
                letterSpacing: "0.35em",
                padding: "0.15rem 0.5rem",
                border: "1px solid",
                borderColor: colors.border,
                color: colors.text,
                transition: "border-color 0.3s",
              }}
            >
              {project.levelLabel}
            </motion.span>
            <span
              className="font-mono uppercase"
              style={{
                fontSize: isMobile ? "0.38rem" : "clamp(0.38rem,0.44vw,0.5rem)",
                letterSpacing: "0.35em",
                color: "rgba(16,185,129,0.5)",
                marginTop: "0.2rem",
              }}
            >
              {project.tag}
            </span>
            <span
              className="font-mono italic"
              style={{ fontSize: "0.38rem", color: "rgba(255,255,255,0.12)" }}
            >
              SYS_ID // {project.id}
            </span>
          </div>

          <motion.div
            animate={{
              color: hovered ? "rgb(16,185,129)" : "rgba(255,255,255,0.2)",
              borderColor: hovered ? "rgba(16,185,129,0.4)" : "rgba(255,255,255,0.06)",
            }}
            transition={{ duration: 0.3 }}
            style={{
              padding: isMobile ? "0.4rem" : "clamp(0.4rem,0.6vw,0.75rem)",
              border: "1px solid",
              flexShrink: 0,
            }}
          >
            {project.icon}
          </motion.div>
        </div>

        {/* Título clip reveal */}
        <div className="overflow-hidden" style={{ marginBottom: "0.5rem" }}>
          <motion.h3
            initial={{ y: "100%" }}
            whileInView={{ y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.75, delay: 0.25 + staggerDelay, ease: [0.16, 1, 0.3, 1] }}
            animate={{ color: hovered ? "rgb(255,255,255)" : "rgba(255,255,255,0.75)" }}
            className="font-serif leading-tight"
            style={{ fontSize: titleSz }}
          >
            {project.title}
          </motion.h3>
        </div>

        {/* Descripción — slide en hover */}
        <motion.p
          animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 8 }}
          transition={{ duration: 0.4 }}
          className="font-sans leading-relaxed"
          style={{ fontSize: isMobile ? "0.72rem" : "clamp(0.7rem,0.82vw,0.875rem)", color: "rgba(255,255,255,0.3)" }}
        >
          {project.description}
        </motion.p>
      </div>

      {/* ── FOOTER ── */}
      <div
        className="relative z-10 flex justify-between items-end border-t border-white/[0.05] mt-auto"
        style={{
          padding: isMobile
            ? "0.75rem 1rem"
            : `clamp(0.75rem,1.2vw,1.25rem) clamp(1rem,1.8vw,1.75rem)`,
          transform: isMobile ? "none" : "translateZ(20px)",
        }}
      >
        <div className="flex gap-4 sm:gap-6">
          {project.metrics.map((m, i) => (
            <div key={i}>
              <motion.div
                animate={{ color: hovered ? "rgb(16,185,129)" : "rgba(255,255,255,0.7)" }}
                transition={{ duration: 0.3 }}
                className="font-mono tracking-tight leading-none"
                style={{ fontSize: isMobile ? "0.7rem" : "clamp(0.7rem,0.9vw,0.95rem)", marginBottom: "0.2rem" }}
              >
                {m.value}
              </motion.div>
              <div
                className="font-mono uppercase"
                style={{ fontSize: "0.38rem", letterSpacing: "0.15em", color: "rgba(255,255,255,0.15)" }}
              >
                {m.label}
              </div>
            </div>
          ))}
        </div>

        <motion.div
          animate={{
            rotate: hovered ? 45 : 0,
            backgroundColor: hovered ? "rgb(16,185,129)" : "transparent",
            borderColor: hovered ? "rgb(16,185,129)" : "rgba(255,255,255,0.1)",
          }}
          transition={{ duration: 0.3 }}
          className="border flex items-center justify-center shrink-0"
          style={{ width: isMobile ? "1.75rem" : "clamp(1.75rem,2.2vw,2.5rem)", height: isMobile ? "1.75rem" : "clamp(1.75rem,2.2vw,2.5rem)" }}
        >
          <ArrowUpRight
            size={isMobile ? 11 : 13}
            style={{ color: hovered ? "#000" : "rgba(255,255,255,0.25)" }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════════════
// FILTER BAR — etiqueta corta en mobile, completa en desktop
// ═══════════════════════════════════════════════════════════════════
function FilterBar({
  active, onChange, count, total, w,
}: {
  active: string; onChange: (v: string) => void;
  count: number; total: number; w: number;
}) {
  const isMobile = w < 640;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className="flex flex-wrap items-center"
      style={{ gap: isMobile ? "0.35rem" : "clamp(0.35rem,0.5vw,0.6rem)", marginBottom: isMobile ? "1.5rem" : "clamp(1.5rem,2.5vw,3rem)" }}
    >
      {LEVELS.map((lvl, i) => {
        const isActive = active === lvl.id;
        return (
          <motion.button
            key={lvl.id}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
            onClick={() => onChange(lvl.id)}
            className="relative font-mono uppercase overflow-hidden transition-colors duration-300"
            style={{
              fontSize: isMobile ? "0.38rem" : "clamp(0.38rem,0.46vw,0.56rem)",
              letterSpacing: isMobile ? "0.25em" : "clamp(0.25em,0.35vw,0.42em)",
              padding: isMobile
                ? "0.3rem 0.6rem"
                : `clamp(0.3rem,0.5vw,0.55rem) clamp(0.6rem,1vw,1.1rem)`,
              border: "1px solid",
              borderColor: isActive ? "rgba(16,185,129,0.6)" : "rgba(255,255,255,0.06)",
              color: isActive ? "rgb(16,185,129)" : "rgba(255,255,255,0.2)",
            }}
          >
            {isActive && (
              <motion.div
                layoutId="filter-bg"
                className="absolute inset-0"
                style={{ background: "rgba(16,185,129,0.08)" }}
                transition={{ type: "spring", stiffness: 400, damping: 35 }}
              />
            )}
            <span className="relative">
              {isMobile ? lvl.short : lvl.label}
            </span>
          </motion.button>
        );
      })}

      <div
        className="font-mono uppercase"
        style={{
          marginLeft: "auto",
          fontSize: isMobile ? "0.36rem" : "clamp(0.36rem,0.42vw,0.5rem)",
          letterSpacing: "0.35em",
          color: "rgba(255,255,255,0.12)",
        }}
      >
        {count} / {total}
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// SECCIÓN PRINCIPAL
// ═══════════════════════════════════════════════════════════════════
export default function ProjectGrid() {
  const [activeLevel, setActiveLevel] = useState("ALL");
  const w = useWindowWidth();

  const isMobile  = w < 640;
  const isMid     = w >= 640 && w < 900;
  const isDesktop = w >= 900;

  const filtered = activeLevel === "ALL"
    ? PROJECTS
    : PROJECTS.filter((p) => p.level === activeLevel);

  // Padding lateral: crece con pantalla, sin techo fijo
  const hPad = isMobile ? "1rem" : isMid ? "1.5rem" : "clamp(2rem,5vw,6rem)";
  const vPadTop    = isMobile ? "3.5rem" : "clamp(3.5rem,7vw,9rem)";
  const vPadBottom = isMobile ? "4rem"   : "clamp(4rem,8vw,12rem)";

  // Indent interior (la línea vertical + sangría de contenido)
  const innerIndent = isMobile
    ? "2.25rem"
    : isMid
    ? "2.75rem"
    : "clamp(2.75rem,4vw,5rem)";

  // Columnas del grid de cards
  const gridCols = isMobile
    ? "1fr"
    : isMid
    ? "1fr 1fr"
    : w < 1400
    ? "1fr 1fr 1fr"
    : "1fr 1fr 1fr 1fr"; // 4 cols en pantallas muy anchas

  return (
    <section
      id="proyectos"
      className="relative overflow-hidden"
      style={{
        background: "#080808",
        paddingTop: vPadTop,
        paddingBottom: vPadBottom,
      }}
    >

      {/* ── ATMÓSFERA ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: "70vw", height: "40vw",
            maxWidth: "1000px", maxHeight: "600px",
            background: "radial-gradient(ellipse, rgba(16,185,129,0.03) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            opacity: 0.015,
            backgroundImage: `linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)`,
            backgroundSize: "72px 72px",
            maskImage: "radial-gradient(ellipse 70% 60% at 50% 40%, black, transparent)",
          }}
        />
      </div>

      <div style={{ paddingLeft: hPad, paddingRight: hPad }}>

        {/* ── CINEMATIC HEADER ── */}
        <CinematicHeader w={w} />

        {/* ── SEPARADOR con pulso ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1.4 }}
          className="flex items-center gap-4"
          style={{
            paddingLeft: innerIndent,
            marginBottom: isMobile ? "1.5rem" : "clamp(1.5rem,2.5vw,3rem)",
          }}
        >
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full shrink-0"
            style={{ background: "rgb(16,185,129)" }}
          />
          <div
            className="h-px"
            style={{
              flex: 1,
              maxWidth: isMobile ? "6rem" : "clamp(6rem,12vw,18rem)",
              background: "linear-gradient(to right, rgba(16,185,129,0.2), transparent)",
            }}
          />
        </motion.div>

        {/* ── FILTER BAR ── */}
        <div style={{ paddingLeft: innerIndent }}>
          <FilterBar
            active={activeLevel}
            onChange={setActiveLevel}
            count={filtered.length}
            total={PROJECTS.length}
            w={w}
          />
        </div>

        {/* ── PROJECT GRID ── */}
        <div
          style={{
            paddingLeft: innerIndent,
            perspective: "1400px",
          }}
        >
          <AnimatePresence mode="popLayout">
            <motion.div
              key={activeLevel}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                display: "grid",
                gridTemplateColumns: gridCols,
                gap: isMobile ? "0.6rem" : "clamp(0.6rem,1vw,1rem)",
              }}
            >
              {filtered.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} w={w} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── FOOTER STRIP ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="flex items-center gap-4 sm:gap-6"
          style={{
            paddingLeft: innerIndent,
            marginTop: isMobile ? "2.5rem" : "clamp(2.5rem,4vw,6rem)",
          }}
        >
          <div className="h-px shrink-0" style={{ width: "clamp(1.5rem,3vw,3rem)", background: "rgba(16,185,129,0.2)" }} />
          <span
            className="font-mono uppercase shrink-0"
            style={{
              fontSize: isMobile ? "0.36rem" : "clamp(0.36rem,0.42vw,0.5rem)",
              letterSpacing: "clamp(0.4em,0.7vw,0.9em)",
              color: "rgba(255,255,255,0.1)",
            }}
          >
            No Mediocrity Allowed · Top 1% Portfolio
          </span>
          <div
            className="h-px flex-grow"
            style={{ background: "linear-gradient(to right, rgba(255,255,255,0.03), transparent)" }}
          />
        </motion.div>

      </div>
    </section>
  );
}