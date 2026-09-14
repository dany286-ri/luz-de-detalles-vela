import React from "react";
import { whatsAppQuoteLink } from "../utils/whatsapp";

/** Botón flotante de WhatsApp, siempre visible en móvil y escritorio. */
export default function WhatsAppFloatButton() {
  return (
    <a
      href={whatsAppQuoteLink("un pedido personalizado")}
      target="_blank"
      rel="noreferrer"
      aria-label="Escríbenos por WhatsApp"
      className="fixed bottom-5 left-5 z-50 w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-soft hover:scale-105 transition-transform duration-200"
    >
      <svg viewBox="0 0 32 32" width="28" height="28" fill="currentColor" aria-hidden>
        <path d="M16.02 3C9.4 3 4 8.4 4 15.02c0 2.4.7 4.63 1.9 6.5L4 29l7.66-1.85a12 12 0 0 0 4.36.82h.01c6.62 0 12.02-5.4 12.02-12.02C28.05 8.4 22.65 3 16.02 3zm0 21.9c-1.9 0-3.68-.5-5.22-1.4l-.37-.22-4.55 1.1 1.13-4.44-.24-.38a9.9 9.9 0 0 1-1.53-5.34C5.24 9.5 10.03 4.7 15.98 4.7c5.96 0 10.75 4.8 10.75 10.72 0 5.93-4.8 10.73-10.71 10.73zm5.9-8.03c-.32-.16-1.9-.94-2.2-1.05-.3-.1-.5-.16-.72.16-.21.32-.83 1.04-1.02 1.26-.19.21-.37.24-.7.08-.32-.16-1.35-.5-2.57-1.6-.95-.85-1.6-1.9-1.78-2.22-.19-.32-.02-.5.14-.65.14-.14.32-.37.48-.56.16-.19.21-.32.32-.53.1-.21.05-.4-.03-.56-.08-.16-.72-1.75-.99-2.4-.26-.62-.53-.54-.72-.55h-.61c-.21 0-.56.08-.85.4-.29.32-1.12 1.1-1.12 2.67 0 1.58 1.15 3.1 1.31 3.32.16.21 2.26 3.45 5.48 4.84.77.33 1.36.53 1.83.68.77.24 1.47.21 2.02.13.62-.09 1.9-.78 2.17-1.53.27-.75.27-1.4.19-1.53-.08-.13-.29-.21-.61-.37z" />
      </svg>
    </a>
  );
}
