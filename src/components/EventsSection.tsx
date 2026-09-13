import React from "react";
import Reveal from "./Reveal";
import { whatsAppQuoteLink } from "../utils/whatsapp";

const OCCASIONS = [
  { emoji: "🎓", title: "Graduaciones", text: "Vela con foto, nombre y año — el detalle perfecto para celebrar el logro." },
  { emoji: "🍼", title: "Baby Shower", text: "Velas personalizadas con el nombre del bebé, ideales como recuerdo para los invitados." },
  { emoji: "🎄", title: "Navidad", text: "Cajas de velas y esferas personalizadas para regalar en estas fechas." },
  { emoji: "🎉", title: "Cumpleaños y celebraciones", text: "Packs de velas para decorar o regalar en cualquier festejo." },
];

export default function EventsSection() {
  return (
    <section id="eventos" className="py-16 md:py-24 bg-ivory/60">
      <div className="max-w-8xl mx-auto px-5 md:px-8">
        <Reveal className="max-w-xl mb-10 md:mb-14">
          <p className="uppercase tracking-[0.25em] text-xs text-gold font-medium mb-3">Para cada ocasión</p>
          <h2 className="font-serif text-3xl md:text-4xl text-ink">Un detalle para cada momento especial</h2>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {OCCASIONS.map((occ, idx) => (
            <Reveal key={occ.title} delay={idx * 80}>
              <div className="bg-cream rounded-2xl p-6 h-full border border-ink/5">
                <span className="text-3xl" aria-hidden>
                  {occ.emoji}
                </span>
                <h3 className="font-serif text-lg text-ink mt-4 mb-2">{occ.title}</h3>
                <p className="text-sm text-charcoal/70 leading-relaxed">{occ.text}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={320} className="mt-10 text-center">
          <p className="text-charcoal/70 mb-4">¿Tienes un evento o pedido grande en mente?</p>
          <a
            href={whatsAppQuoteLink("un evento o pedido grande")}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center border border-ink/20 text-ink px-7 py-3.5 rounded-full text-sm tracking-wide hover:border-gold hover:text-gold transition-colors duration-200"
          >
            Cotizar pedido para evento
          </a>
        </Reveal>
      </div>
    </section>
  );
}
