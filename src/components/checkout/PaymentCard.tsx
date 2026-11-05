import React, { useEffect, useState } from "react";
import { LOCATIONS, formatCOP, formatPhone, type LocationKey } from "../../config/site.config";
import type { OrderTotals } from "../../utils/pricing";
import { copyText } from "../../utils/clipboard";

/** Color de acento de Nequi. Solo se usa en el identificador; el resto sigue la paleta de la marca. */
const NEQUI_PINK = "#DA0081";

interface Props {
  sede: LocationKey;
  onChangeSede: (sede: LocationKey) => void;
  totals: OrderTotals;
}

const STEPS = [
  "Abre tu app Nequi y elige la opción para enviar plata.",
  "Pega el número de arriba (toca «Copiar número»).",
  "Escribe el valor total de tu pedido y confirma la transferencia.",
  "Toma una captura del comprobante: la enviarás por WhatsApp a la sede.",
];

/**
 * Tarjeta de pago. Muestra ÚNICAMENTE el Nequi de la sede elegida:
 * el número se calcula a partir de `sede`, por eso cambia solo si la persona cambia de sede.
 */
export default function PaymentCard({ sede, onChangeSede, totals }: Props) {
  const location = LOCATIONS[sede];
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = window.setTimeout(() => setCopied(false), 2500);
    return () => window.clearTimeout(t);
  }, [copied]);

  const handleCopy = async () => {
    const ok = await copyText(location.nequi);
    setCopyFailed(!ok);
    setCopied(ok);
  };

  return (
    <section className="rounded-3xl border border-gold/30 bg-gradient-to-b from-cream to-ivory p-5 md:p-7 shadow-card">
      <div className="text-center">
        <span className="text-3xl inline-block animate-flicker" aria-hidden>
          🕯️
        </span>
        <h3 className="font-serif text-2xl md:text-3xl text-ink mt-1">¡Ya casi es tuyo!</h3>
        <p className="text-sm text-charcoal/65 mt-1">Realiza tu pago de manera fácil y segura</p>
      </div>

      {/* Sede elegida (con opción de cambiarla: el número se actualiza solo) */}
      <div className="mt-5 flex flex-col items-center gap-2">
        <p className="text-xs uppercase tracking-[0.2em] text-gold font-medium">Sede {location.label}</p>
        <div className="inline-flex rounded-full border border-ink/15 bg-cream p-1" role="radiogroup" aria-label="Cambiar sede">
          {Object.values(LOCATIONS).map((loc) => (
            <button
              key={loc.key}
              type="button"
              role="radio"
              aria-checked={loc.key === sede}
              onClick={() => onChangeSede(loc.key)}
              className={`px-4 py-1.5 rounded-full text-xs transition-colors ${
                loc.key === sede ? "bg-ink text-cream" : "text-charcoal/70 hover:text-ink"
              }`}
            >
              {loc.label}
            </button>
          ))}
        </div>
      </div>

      {/* Número de Nequi */}
      <div className="mt-5 rounded-2xl bg-cream border border-ink/10 p-5 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <span
            className="inline-flex items-center rounded-full px-3 py-1 text-white text-sm font-bold lowercase tracking-wide"
            style={{ backgroundColor: NEQUI_PINK }}
          >
            nequi
          </span>
          <span className="text-xs text-charcoal/60">Transfiere a este número</span>
        </div>
        <p
          className="font-serif text-4xl md:text-5xl text-ink tracking-wider select-all"
          aria-label={`Número de Nequi de la sede ${location.label}: ${location.nequi.split("").join(" ")}`}
        >
          {formatPhone(location.nequi)}
        </p>
        <p className="text-xs text-charcoal/55 mt-1">Nequi de la sede {location.label}</p>
        <button
          type="button"
          onClick={handleCopy}
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-ink text-cream px-6 py-3 text-sm hover:bg-charcoal transition-colors"
        >
          <span aria-hidden>{copied ? "✓" : "📋"}</span>
          {copied ? "Copiado" : "Copiar número"}
        </button>
        {copyFailed && (
          <p className="text-xs text-red-700/80 mt-2" role="alert">
            No pudimos copiarlo automáticamente. Mantén presionado el número para copiarlo.
          </p>
        )}
      </div>

      {/* Valor a pagar */}
      <div className="mt-4 rounded-2xl border border-gold/40 bg-gold/10 p-4 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-cocoa">Valor a pagar ahora</p>
        <p className="font-serif text-4xl text-ink mt-1">{formatCOP(totals.deposit)}</p>
        <p className="text-xs text-charcoal/65 mt-1">Es el valor completo de tu pedido, domicilio incluido</p>
      </div>

      {/* Instrucciones */}
      <ol className="mt-5 space-y-2.5">
        {STEPS.map((text, i) => (
          <li key={text} className="flex gap-3 text-sm text-charcoal/80">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink text-cream text-xs">
              {i + 1}
            </span>
            <span className="pt-0.5">{text}</span>
          </li>
        ))}
      </ol>

      <div className="mt-5 space-y-1.5 rounded-xl bg-cream/80 border border-ink/10 px-4 py-3 text-xs text-charcoal/70 leading-relaxed">
        <p>💡 Recuerda realizar tu transferencia al Nequi de la sede que seleccionaste.</p>
        <p>💡 Una vez realices el pago, envía tu comprobante por WhatsApp a la sede para que podamos verificarlo.</p>
        <p>💡 Tu pedido quedará confirmado una vez verifiquemos tu pago.</p>
      </div>

      {/* Aviso de copiado */}
      {copied && (
        <div
          role="status"
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] w-max max-w-[90vw] bg-ink text-cream px-5 py-3 rounded-full shadow-soft flex items-center gap-3 text-sm animate-popIn"
        >
          <span aria-hidden>✓</span>
          <span>¡Número copiado correctamente!</span>
        </div>
      )}
    </section>
  );
}
