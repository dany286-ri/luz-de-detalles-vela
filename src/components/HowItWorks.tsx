import React from "react";
import Reveal from "./Reveal";

const STEPS = [
  {
    number: "01",
    title: "Elige tu detalle",
    text: "Explora el catálogo y escoge la vela o el pack que más se ajuste a lo que quieres regalar.",
  },
  {
    number: "02",
    title: "Personalízalo",
    text: "Cuéntanos el nombre, mensaje o fecha especial que quieres incluir en tu pedido.",
  },
  {
    number: "03",
    title: "Confirma con el anticipo",
    text: "Reservamos tu pedido con un anticipo del 50%. El resto se paga al recibirlo.",
  },
  {
    number: "04",
    title: "Recíbelo en pocos días",
    text: "Como cada detalle se hace bajo pedido, lo preparamos y coordinamos la entrega en 3 a 4 días hábiles.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-8xl mx-auto px-5 md:px-8">
        <Reveal className="max-w-xl mb-12 md:mb-16">
          <p className="uppercase tracking-[0.25em] text-xs text-gold font-medium mb-3">Cómo funciona</p>
          <h2 className="font-serif text-3xl md:text-4xl text-ink">De la idea a tu puerta</h2>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
          {STEPS.map((step, idx) => (
            <Reveal key={step.number} delay={idx * 90}>
              <span className="font-serif text-4xl text-gold-soft">{step.number}</span>
              <h3 className="font-serif text-xl text-ink mt-3 mb-2">{step.title}</h3>
              <p className="text-sm text-charcoal/70 leading-relaxed">{step.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
