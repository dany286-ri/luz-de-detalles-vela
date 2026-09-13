import React from "react";
import Reveal from "./Reveal";
import velaGrandeX6 from "../assets/images/vela-grande-x6.jpg";

export default function Hero() {
  return (
    <section id="inicio" className="relative pt-32 md:pt-40 pb-16 md:pb-24 overflow-hidden">
      <div className="max-w-8xl mx-auto px-5 md:px-8 grid md:grid-cols-2 gap-10 md:gap-16 items-center">
        <Reveal className="order-2 md:order-1">
          <p className="uppercase tracking-[0.25em] text-xs md:text-sm text-gold font-medium mb-5">
            Hechas a mano · Bajo pedido
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl leading-[1.08] text-ink mb-6">
            Detalles que
            <br />
            iluminan momentos
          </h1>
          <p className="text-charcoal/75 text-base md:text-lg max-w-md mb-9 leading-relaxed">
            Velas y detalles personalizados creados para regalar, celebrar y recordar.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="#catalogo"
              className="inline-flex items-center justify-center bg-ink text-cream px-7 py-3.5 rounded-full text-sm tracking-wide hover:bg-charcoal transition-colors duration-200"
            >
              Ver colección
            </a>
            <a
              href="#personalizados"
              className="inline-flex items-center justify-center border border-ink/20 text-ink px-7 py-3.5 rounded-full text-sm tracking-wide hover:border-gold hover:text-gold transition-colors duration-200"
            >
              Personalizar mi detalle
            </a>
          </div>
        </Reveal>

        <Reveal delay={120} className="order-1 md:order-2">
          <div className="relative mx-auto max-w-sm md:max-w-none">
            <div className="absolute -inset-4 md:-inset-6 bg-beige/60 rounded-[2rem] -z-10" />
            <img
              src={velaGrandeX6}
              alt="Vela grande de Luz de Detalles, foto real del producto"
              className="w-full aspect-[4/5] object-cover rounded-[1.75rem] shadow-soft"
              loading="eager"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
