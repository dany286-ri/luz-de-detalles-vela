import React from "react";
import Reveal from "./Reveal";
import type { ProductCategory } from "../types/product";

interface OccasionsProps {
  onSelect: (category: ProductCategory) => void;
}

const OCCASIONS: { emoji: string; title: string; text: string; category: ProductCategory }[] = [
  { emoji: "🎓", title: "Grados", text: "Un logro que merece ser recordado.", category: "graduaciones" },
  { emoji: "🍼", title: "Baby Shower", text: "Un pequeño detalle para una gran bienvenida.", category: "baby-shower" },
  { emoji: "🎄", title: "Navidad", text: "Ilumina esta Navidad con un detalle diferente.", category: "navidad" },
  { emoji: "🐾", title: "Mascotas", text: "Porque ellos también hacen parte de nuestros recuerdos.", category: "mascotas" },
  { emoji: "🎁", title: "Regalos", text: "Un detalle especial para alguien especial.", category: "regalos" },
];

export default function Occasions({ onSelect }: OccasionsProps) {
  const handleClick = (category: ProductCategory) => {
    onSelect(category);
    document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section id="ocasiones" className="py-16 md:py-24">
      <div className="max-w-8xl mx-auto px-5 md:px-8">
        <Reveal className="max-w-xl mb-10 md:mb-14">
          <p className="uppercase tracking-[0.25em] text-xs text-gold font-medium mb-3">Encuentra tu detalle</p>
          <h2 className="font-serif text-3xl md:text-4xl text-ink">¿Para qué ocasión buscas tu detalle?</h2>
        </Reveal>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5">
          {OCCASIONS.map((occ, idx) => (
            <Reveal key={occ.category} delay={idx * 70}>
              <button
                onClick={() => handleClick(occ.category)}
                className="group w-full h-full text-left bg-ivory rounded-2xl p-6 border border-ink/5 hover:border-gold/60 hover:shadow-card transition-all duration-300"
              >
                <span className="text-3xl inline-block group-hover:scale-110 transition-transform duration-300" aria-hidden>
                  {occ.emoji}
                </span>
                <h3 className="font-serif text-lg text-ink mt-4 mb-1.5">{occ.title}</h3>
                <p className="text-sm text-charcoal/70 leading-relaxed">{occ.text}</p>
                <span className="inline-flex items-center gap-1.5 text-xs text-gold mt-4 tracking-wide">
                  Ver opciones
                  <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                </span>
              </button>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
