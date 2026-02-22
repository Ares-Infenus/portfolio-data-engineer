"use client";
import { motion } from "framer-motion";
import { ArrowUpRight, Cpu, Globe, Zap } from "lucide-react";

interface ProjectProps {
  title: string;
  description: string;
  metric: string;
  label: string;
  tags: string[];
}

export default function ProjectCard({ title, description, metric, label, tags }: ProjectProps) {
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="group relative bg-surface border border-border p-8 transition-all duration-500 hover:border-emeraldPower/50"
    >
      {/* Glow Efecto Fondo */}
      <div className="absolute inset-0 bg-emeraldPower/0 group-hover:bg-emeraldPower/[0.02] transition-colors duration-500" />

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-12">
          <div className="h-10 w-10 border border-border flex items-center justify-center group-hover:border-emeraldPower transition-colors">
            <Cpu size={18} className="text-textMuted group-hover:text-emeraldPower" />
          </div>
          <ArrowUpRight size={20} className="text-border group-hover:text-emeraldPower group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
        </div>

        <h3 className="font-serif text-3xl mb-4 group-hover:text-emeraldPower transition-colors">
          {title}
        </h3>
        
        <p className="font-sans text-textMuted text-sm leading-relaxed mb-8 h-12 overflow-hidden">
          {description}
        </p>

        {/* Sección de Métrica - El "Power Point" de la tarjeta */}
        <div className="border-t border-border pt-6 mt-6 flex justify-between items-end">
          <div>
            <div className="font-mono text-2xl text-textMain tracking-tighter">
              {metric}
            </div>
            <div className="font-mono text-[0.6rem] uppercase tracking-widest text-emeraldPower mt-1">
              {label}
            </div>
          </div>
          
          <div className="flex gap-2">
            {tags.slice(0, 2).map(tag => (
              <span key={tag} className="font-mono text-[0.6rem] border border-border px-2 py-1 text-textMuted uppercase">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}