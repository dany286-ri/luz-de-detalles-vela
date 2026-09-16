import React from "react";
import Reveal from "./Reveal";
import { SITE_CONFIG, PAYMENT_METHODS, formatCOP } from "../config/site.config";

const POINTS = [
  { emoji: "⏰", text: "Los pedidos deben realizarse con mínimo 2 días de anticipación." },
  { emoji: "🚚", text: `Domicilio en ${SITE_CONFIG.CITY}: ${formatCOP(SITE_CONFIG.DOMICILIO_PRICE)}.` },
  { emoji: "📦", text: "Trabajamos principalmente bajo pedido, no manejamos inventario grande." },
];

export default function InfoBeforeOrder() {
  return (
    <section className="py-14 md:py-20 bg-ivory/60">
      <div className="max-w-8xl mx-auto px-5 md:px-8 max-w-3xl">
        <Reveal>
          <p className="uppercase tracking-[0.25em] text-xs text-gold font-medium mb-3">Antes de pedir</p>
          <h2 className="font-serif text-2xl md:text-3xl text-ink mb-8">Antes de realizar tu pedido</h2>
        </Reveal>

        <div className="space-y-4">
          {POINTS.map((point, idx) => (
            <Reveal key={point.text} delay={idx * 70}>
              <div className="flex items-start gap-3.5 bg-cream rounded-xl px-5 py-4 border border-ink/5">
                <span className="text-xl shrink-0" aria-hidden>
                  {point.emoji}
                </span>
                <p className="text-sm text-charcoal/75 leading-relaxed pt-0.5">{point.text}</p>
              </div>
            </Reveal>
          ))}
          <Reveal delay={POINTS.length * 70}>
            <div className="flex items-start gap-3.5 bg-cream rounded-xl px-5 py-4 border border-ink/5">
              <span className="text-xl shrink-0" aria-hidden>
                💳
              </span>
              <div className="text-sm text-charcoal/75 leading-relaxed pt-0.5">
                <span>Métodos de pago: </span>
                <span className="text-ink">{PAYMENT_METHODS.join(" · ")}</span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
