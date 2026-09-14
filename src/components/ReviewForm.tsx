import React, { useState } from "react";

type Status = "idle" | "sending" | "sent" | "error";

/** Codifica un objeto como application/x-www-form-urlencoded (formato que espera Netlify Forms). */
function encode(data: Record<string, string>): string {
  return Object.keys(data)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
    .join("&");
}

/**
 * Formulario para que las clientas dejen su reseña.
 * Se envía a Netlify Forms (sin backend propio): las reseñas NO se publican
 * solas, llegan al panel de Netlify (y por correo, si activas notificaciones)
 * para que Dany las revise y las agregue a src/data/testimonials.ts.
 */
export default function ReviewForm() {
  const [nombre, setNombre] = useState("");
  const [resena, setResena] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !resena.trim()) return;

    setStatus("sending");
    try {
      await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encode({ "form-name": "resenas", nombre, resena, "bot-field": "" }),
      });
      setStatus("sent");
      setNombre("");
      setResena("");
    } catch {
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <div className="bg-cream border border-gold/30 rounded-2xl p-6 text-center">
        <p className="text-ink font-medium">¡Gracias por tu reseña! 💛</p>
        <p className="text-sm text-charcoal/70 mt-1">
          La vamos a revisar y muy pronto la vas a ver publicada aquí.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      name="resenas"
      data-netlify="true"
      data-netlify-honeypot="bot-field"
      className="bg-cream border border-ink/10 rounded-2xl p-6 md:p-7"
    >
      <p className="text-sm font-medium text-ink tracking-wide mb-1">¿Ya nos compraste?</p>
      <p className="text-sm text-charcoal/60 mb-4">
        Cuéntanos tu experiencia — la revisamos y la publicamos con gusto.
      </p>

      {/* Campo trampa para bots, invisible para personas */}
      <input type="text" name="bot-field" tabIndex={-1} autoComplete="off" style={{ display: "none" }} />

      <div className="space-y-3">
        <input
          type="text"
          required
          placeholder="Tu nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full rounded-lg border border-ink/15 bg-ivory px-3.5 py-2.5 text-sm text-ink placeholder:text-charcoal/40 focus:outline-none focus:border-gold transition-colors"
        />
        <textarea
          required
          rows={3}
          placeholder="Escribe aquí tu experiencia con tu detalle..."
          value={resena}
          onChange={(e) => setResena(e.target.value)}
          className="w-full rounded-lg border border-ink/15 bg-ivory px-3.5 py-2.5 text-sm text-ink placeholder:text-charcoal/40 focus:outline-none focus:border-gold transition-colors resize-none"
        />
      </div>

      {status === "error" && (
        <p className="text-xs text-red-700/80 mt-2">
          No pudimos enviar tu reseña. Intenta de nuevo o escríbenos por WhatsApp.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-4 bg-ink text-cream px-6 py-2.5 rounded-full text-sm hover:bg-charcoal transition-colors duration-200 disabled:opacity-60"
      >
        {status === "sending" ? "Enviando..." : "Enviar reseña"}
      </button>
    </form>
  );
}
