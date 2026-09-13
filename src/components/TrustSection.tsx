import React from "react";
import Reveal from "./Reveal";

const POINTS = [
  { emoji: "✋", title: "Hecho a mano", text: "Cada vela se elabora artesanalmente, con atención al detalle." },
  { emoji: "📝", title: "100% personalizable", text: "Nombres, mensajes y fechas a tu gusto en la mayoría de productos." },
  { emoji: "🔒", title: "Pedido confirmado con anticipo", text: "Reservas tu pedido con el 50% y pagas el resto al recibirlo." },
  { emoji: "💬", title: "Atención directa por WhatsApp", text: "Resolvemos tus dudas y coordinamos la entrega contigo." },
];

export default function TrustSection() {
  return (
    <section id="nosotros" className="py-16 md:py-24">
      <div className="max-w-8xl mx-auto px-5 md:px-8">
        <Reveal className="max-w-xl mb-10 md:mb-14">
          <p className="uppercase tracking-[0.25em] text-xs text-gold font-medium mb-3">Por qué elegirnos</p>
          <h2 className="font-serif text-3xl md:text-4xl text-ink">Confianza en cada detalle</h2>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {POINTS.map((point, idx) => (
            <Reveal key={point.title} delay={idx * 80} className="text-center sm:text-left">
              <span className="text-3xl" aria-hidden>
                {point.emoji}
              </span>
              <h3 className="font-serif text-lg text-ink mt-4 mb-2">{point.title}</h3>
              <p className="text-sm text-charcoal/70 leading-relaxed">{point.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
