"use client";
import { motion } from "framer-motion";

interface ExperienceProps {
  role: string;
  company: string;
  period: string;
  description: string;
  achievements: string[];
}

export default function ExperienceItem({ role, company, period, description, achievements }: ExperienceProps) {
  return (
    <div className="relative pl-8 pb-16 border-l border-border last:border-0">
      {/* Indicador de Línea de Tiempo */}
      <div className="absolute -left-[5px] top-0 w-[9px] h-[9px] bg-bg border border-emeraldPower rotate-45" />

      <motion.div 
        initial={{ opacity: 0, x: 10 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="grid grid-cols-1 lg:grid-cols-12 gap-4"
      >
        {/* Fecha y Empresa */}
        <div className="lg:col-span-4">
          <div className="font-mono text-[0.65rem] text-emeraldPower uppercase tracking-[0.2em] mb-2">
            {period}
          </div>
          <h4 className="font-serif text-xl text-textMain">{company}</h4>
        </div>

        {/* Cargo y Detalles */}
        <div className="lg:col-span-8">
          <h3 className="font-sans text-lg font-medium text-textMain mb-4 uppercase tracking-wider">
            {role}
          </h3>
          <p className="font-sans text-textMuted text-sm leading-relaxed mb-6 max-w-2xl">
            {description}
          </p>
          <ul className="space-y-3">
            {achievements.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3 group">
                <span className="text-emeraldPower mt-1.5 text-[10px]">◆</span>
                <span className="font-sans text-sm text-textMuted group-hover:text-textMain transition-colors">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </div>
  );
}