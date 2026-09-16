import React from "react";
import Reveal from "./Reveal";
import { useOrderFlow } from "../context/OrderFlowContext";
import { buildGreetingMessage } from "../utils/whatsapp";

export default function FinalCTA() {
  const { requestWhatsApp } = useOrderFlow();

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-8xl mx-auto px-5 md:px-8 text-center">
        <Reveal className="max-w-xl mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl text-ink mb-4 leading-tight">
            ¿Listo para encontrar tu próximo detalle?
          </h2>
          <p className="text-charcoal/70 mb-8">
            Elige una vela, personalízala y convierte un momento especial en un recuerdo.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="#catalogo"
              className="inline-flex items-center justify-center bg-ink text-cream px-7 py-3.5 rounded-full text-sm tracking-wide hover:bg-charcoal transition-colors duration-200"
            >
              Ver catálogo
            </a>
            <button
              onClick={() => requestWhatsApp(buildGreetingMessage())}
              className="inline-flex items-center justify-center border border-ink/20 text-ink px-7 py-3.5 rounded-full text-sm tracking-wide hover:border-gold hover:text-gold transition-colors duration-200"
            >
              Hablar por WhatsApp
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
