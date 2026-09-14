import React from "react";
import Reveal from "./Reveal";
import { TESTIMONIALS } from "../data/testimonials";
import ReviewForm from "./ReviewForm";

/**
 * Sección de testimonios con placeholders honestos.
 * No se inventan reseñas: los espacios sin reseña real muestran un aviso claro.
 * Para agregar una reseña, edita src/data/testimonials.ts — no hace falta tocar este archivo.
 */
const MIN_SLOTS = 3;

export default function Testimonials() {
  const placeholderCount = Math.max(0, MIN_SLOTS - TESTIMONIALS.length);

  return (
    <section className="py-16 md:py-24 bg-ivory/60">
      <div className="max-w-8xl mx-auto px-5 md:px-8">
        <Reveal className="max-w-xl mb-10 md:mb-14">
          <p className="uppercase tracking-[0.25em] text-xs text-gold font-medium mb-3">Clientes</p>
          <h2 className="font-serif text-3xl md:text-4xl text-ink">Lo que dicen de nosotros</h2>
        </Reveal>

        <div className="grid sm:grid-cols-3 gap-5 md:gap-6">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={`${t.author}-${i}`} delay={i * 90}>
              <div className="bg-cream border border-ink/10 rounded-2xl p-6 h-full flex flex-col justify-between shadow-card">
                <span className="text-2xl text-gold-soft mb-4" aria-hidden>
                  “
                </span>
                <p className="text-charcoal/80 text-sm italic leading-relaxed flex-1">{t.quote}</p>
                <p className="text-xs text-charcoal/50 mt-5">— {t.author}</p>
              </div>
            </Reveal>
          ))}

          {Array.from({ length: placeholderCount }).map((_, i) => (
            <Reveal key={`placeholder-${i}`} delay={(TESTIMONIALS.length + i) * 90}>
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

        <Reveal className="max-w-md mt-8 md:mt-10" delay={(TESTIMONIALS.length + placeholderCount) * 90}>
          <ReviewForm />
        </Reveal>
      </div>
    </section>
  );
}
