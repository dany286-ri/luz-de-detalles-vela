import React from "react";
import Reveal from "./Reveal";
import { useOrderFlow } from "../context/OrderFlowContext";
import { buildQuoteMessage } from "../utils/whatsapp";

const TAGS = ["🎓 Grados", "🍼 Baby Shower", "🎂 Cumpleaños", "🎄 Eventos"];

export default function EventCTA() {
  const { requestWhatsApp } = useOrderFlow();

  return (
    <section id="eventos" className="py-16 md:py-24 bg-charcoal text-cream">
      <div className="max-w-8xl mx-auto px-5 md:px-8 text-center">
        <Reveal className="max-w-2xl mx-auto">
          <p className="uppercase tracking-[0.25em] text-xs text-gold-soft font-medium mb-3">Pedidos grandes</p>
          <h2 className="font-serif text-3xl md:text-4xl leading-tight mb-4">¿Tienes un evento?</h2>
          <p className="text-cream/75 text-base md:text-lg mb-2">¿Necesitas 10, 20, 50 o más velas?</p>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm text-cream/70 mb-8 mt-4">
            {TAGS.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          <p className="text-cream/70 mb-8 max-w-md mx-auto">
            Cuéntanos qué necesitas y te ayudamos a preparar tu pedido.
          </p>
          <button
            onClick={() => requestWhatsApp(buildQuoteMessage("un evento con varias velas (10, 20, 50 o más)"))}
            className="inline-flex items-center justify-center bg-cream text-ink px-7 py-3.5 rounded-full text-sm tracking-wide hover:bg-gold-soft transition-colors duration-200"
          >
            💬 Cotizar mi evento
          </button>
        </Reveal>
      </div>
    </section>
  );
}
