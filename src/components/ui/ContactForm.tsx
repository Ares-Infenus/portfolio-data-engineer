"use client";
import { useState } from "react";
import { Send } from "lucide-react";

export default function ContactForm() {
  return (
    <form className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="group">
          <label className="block font-mono text-[0.6rem] uppercase tracking-widest text-textMuted mb-2 group-focus-within:text-emeraldPower transition-colors">Nombre</label>
          <input type="text" className="w-full bg-surface border border-border p-4 text-sm text-textMain outline-none focus:border-emeraldPower transition-all" placeholder="John Doe" />
        </div>
        <div className="group">
          <label className="block font-mono text-[0.6rem] uppercase tracking-widest text-textMuted mb-2 group-focus-within:text-emeraldPower transition-colors">Email Corporativo</label>
          <input type="email" className="w-full bg-surface border border-border p-4 text-sm text-textMain outline-none focus:border-emeraldPower transition-all" placeholder="john@company.com" />
        </div>
      </div>

      <div className="group">
        <label className="block font-mono text-[0.6rem] uppercase tracking-widest text-textMuted mb-2 group-focus-within:text-emeraldPower transition-colors">Interés Estratégico</label>
        <select className="w-full bg-surface border border-border p-4 text-sm text-textMain outline-none focus:border-emeraldPower appearance-none transition-all">
          <option>Consultoría de Infraestructura</option>
          <option>Oportunidad Full-Time (Executive)</option>
          <option>Optimización de Costos Cloud</option>
          <option>Otros proyectos</option>
        </select>
      </div>

      <div className="group">
        <label className="block font-mono text-[0.6rem] uppercase tracking-widest text-textMuted mb-2 group-focus-within:text-emeraldPower transition-colors">Contexto del Proyecto</label>
        <textarea rows={4} className="w-full bg-surface border border-border p-4 text-sm text-textMain outline-none focus:border-emeraldPower transition-all" placeholder="Describa brevemente el desafío técnico..."></textarea>
      </div>

      <div className="flex items-center gap-3 mb-8">
        <input type="checkbox" className="accent-emeraldPower w-4 h-4" id="gdpr" />
        <label htmlFor="gdpr" className="text-[0.65rem] text-textMuted uppercase tracking-tight">Acepto que mis datos sean procesados para fines profesionales.</label>
      </div>

      <button className="w-full bg-emeraldPower py-4 text-[0.7rem] font-mono uppercase tracking-[0.3em] text-bg font-bold hover:bg-white transition-all duration-300 flex items-center justify-center gap-3">
        Enviar Mensaje <Send size={14} />
      </button>
    </form>
  );
}