import React from "react";
import Reveal from "./Reveal";

/**
 * Sección de testimonios con placeholders honestos.
 * No se inventan reseñas: este espacio se completará con experiencias reales de clientes.
 */
export default function Testimonials() {
  return (
    <section className="py-16 md:py-24 bg-ivory/60">
      <div className="max-w-8xl mx-auto px-5 md:px-8">
        <Reveal className="max-w-xl mb-10 md:mb-14">
          <p className="uppercase tracking-[0.25em] text-xs text-gold font-medium mb-3">Clientes</p>
          <h2 className="font-serif text-3xl md:text-4xl text-ink">Lo que dicen de nosotros</h2>
        </Reveal>

        <div className="grid sm:grid-cols-3 gap-5 md:gap-6">
          {[0, 1, 2].map((i) => (
            <Reveal key={i} delay={i * 90}>
              <div className="bg-cream border border-dashed border-ink/15 rounded-2xl p-6 h-full flex flex-col justify-between">
                <span className="text-2xl text-gold-soft mb-4" aria-hidden>
                  “
                </span>
                <p className="text-charcoal/50 text-sm italic leading-relaxed flex-1">
                  Tu experiencia podría aparecer aquí.
                </p>
                <p className="text-xs text-charcoal/40 mt-5">— Espacio disponible para tu reseña</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
