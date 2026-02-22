"use client";
import { Award } from "lucide-react";

interface CertProps {
  name: string;
  issuer: string;
  year: string;
}

export default function CertCard({ name, issuer, year }: CertProps) {
  return (
    <div className="flex items-center gap-4 p-4 border border-border bg-surface/50 group hover:border-emeraldPower transition-colors">
      <div className="text-gold-micro opacity-50 group-hover:opacity-100 transition-opacity">
        <Award size={20} />
      </div>
      <div>
        <div className="font-sans text-[0.7rem] text-textMain uppercase tracking-wider mb-1">{name}</div>
        <div className="font-mono text-[0.6rem] text-textMuted uppercase">{issuer} — {year}</div>
      </div>
    </div>
  );
}