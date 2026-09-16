import React from "react";
import Reveal from "./Reveal";
import { useOrderFlow } from "../context/OrderFlowContext";
import { buildQuoteMessage } from "../utils/whatsapp";
import collage from "../assets/images/collage.jpg";

export default function PersonalizedBanner() {
  const { requestWhatsApp } = useOrderFlow();

  return (
    <section id="personalizados" className="py-16 md:py-24 bg-charcoal text-cream">
      <div className="max-w-8xl mx-auto px-5 md:px-8 grid md:grid-cols-2 gap-10 md:gap-16 items-center">
        <Reveal>
          <div className="relative rounded-2xl overflow-hidden aspect-[4/5] max-w-sm mx-auto md:mx-0">
            <img
              src={collage}
              alt="Velas personalizadas con nombres, foto real del proceso de personalización"
              loading="lazy"
              className="w-full h-full object-cover"
            />
          </div>
        </Reveal>

        <Reveal delay={100}>
          <p className="uppercase tracking-[0.25em] text-xs text-gold-soft font-medium mb-3">Hay momentos que merecen quedarse para siempre</p>
          <h2 className="font-serif text-3xl md:text-4xl leading-tight mb-5">
            Un detalle hecho para tu momento
          </h2>
          <p className="text-cream/75 text-base leading-relaxed mb-8 max-w-md">
            Un grado, un baby shower, una celebración, una Navidad o simplemente un detalle para alguien especial.
            En Luz de Detalles creamos velas pensadas para acompañar esos momentos — no manejamos inventario grande,
            cada una se hace bajo pedido con el nombre, mensaje o motivo que tú elijas.
          </p>
          <button
            onClick={() => requestWhatsApp(buildQuoteMessage("un detalle personalizado"))}
            className="inline-flex items-center justify-center bg-cream text-ink px-7 py-3.5 rounded-full text-sm tracking-wide hover:bg-gold-soft transition-colors duration-200"
          >
            Cuéntanos qué necesitas
          </button>
        </Reveal>
      </div>
    </section>
  );
}
