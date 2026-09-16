import React from "react";
import { useOrderFlow } from "../context/OrderFlowContext";
import { LOCATIONS } from "../config/site.config";

/** Modal que pregunta desde qué sede se hace el pedido antes de abrir WhatsApp. */
export default function SedeModal() {
  const { isModalOpen, confirmSede, cancel } = useOrderFlow();

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center px-5">
      <div className="absolute inset-0 bg-ink/50 backdrop-blur-sm" onClick={cancel} />
      <div className="relative bg-cream w-full max-w-sm rounded-2xl shadow-soft p-7 text-center animate-popIn">
        <button
          onClick={cancel}
          aria-label="Cerrar"
          className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-charcoal/50 hover:text-ink"
        >
          ✕
        </button>
        <span className="text-3xl" aria-hidden>
          📍
        </span>
        <h3 className="font-serif text-xl md:text-2xl text-ink mt-3 mb-2">¿Desde qué sede vas a pedir?</h3>
        <p className="text-sm text-charcoal/65 mb-6">Así te comunicamos con el WhatsApp de la sede correcta.</p>
        <div className="flex flex-col gap-3">
          {Object.values(LOCATIONS).map((loc) => (
            <button
              key={loc.key}
              onClick={() => confirmSede(loc.key)}
              className="w-full bg-ink text-cream py-3.5 rounded-full text-sm tracking-wide hover:bg-charcoal transition-colors"
            >
              {loc.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
