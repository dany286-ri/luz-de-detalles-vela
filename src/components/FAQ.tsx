import React, { useState } from "react";
import Reveal from "./Reveal";
import { SITE_CONFIG, formatCOP } from "../config/site.config";

const FAQS = [
  {
    q: "¿Cómo hago un pedido?",
    a: "Eliges tu detalle en el catálogo, lo personalizas si aplica y confirmas por WhatsApp. Ahí coordinamos el pago del anticipo y la entrega.",
  },
  {
    q: "¿Cuánto tiempo tarda mi pedido?",
    a: "Como cada detalle se elabora bajo pedido, el tiempo de entrega es de 3 a 4 días hábiles desde que confirmas el anticipo.",
  },
  {
    q: "¿Necesito pagar por adelantado?",
    a: "Sí. Para confirmar y empezar a elaborar tu pedido pedimos un anticipo del 50%. El resto se paga al recibirlo.",
  },
  {
    q: "¿Puedo personalizar cualquier vela?",
    a: "La mayoría de nuestros productos se pueden personalizar con nombre, mensaje, fecha o color. En cada producto verás si tiene esta opción.",
  },
  {
    q: `¿Cuánto cuesta el domicilio?`,
    a: `El domicilio tiene un costo de ${formatCOP(SITE_CONFIG.DOMICILIO_PRICE)} en ${SITE_CONFIG.CITY}, y se suma automáticamente al finalizar tu pedido.`,
  },
  {
    q: "¿Puedo comprar solo una vela de un pack?",
    a: "Los packs se venden completos, al precio indicado por el conjunto (por ejemplo, Pack x5). No vendemos unidades sueltas de estos packs.",
  },
  {
    q: "¿Hacen pedidos grandes para eventos o empresas?",
    a: "Sí. Escríbenos por WhatsApp contándonos la cantidad y la fecha que necesitas, y te armamos una cotización a la medida.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-8xl mx-auto px-5 md:px-8 max-w-3xl">
        <Reveal className="mb-10 md:mb-14">
          <p className="uppercase tracking-[0.25em] text-xs text-gold font-medium mb-3">Preguntas frecuentes</p>
          <h2 className="font-serif text-3xl md:text-4xl text-ink">¿Tienes dudas?</h2>
        </Reveal>

        <div className="divide-y divide-ink/10 border-t border-b border-ink/10">
          {FAQS.map((item, idx) => {
            const isOpen = open === idx;
            return (
              <div key={item.q}>
                <button
                  onClick={() => setOpen(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between gap-4 py-5 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="font-serif text-lg text-ink">{item.q}</span>
                  <span className={`text-xl text-gold transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}>
                    +
                  </span>
                </button>
                <div
                  className={`overflow-hidden transition-[max-height,opacity] duration-300 ${
                    isOpen ? "max-h-40 opacity-100 pb-5" : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="text-sm text-charcoal/70 leading-relaxed pr-8">{item.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
