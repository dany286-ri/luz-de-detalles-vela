import React from "react";
import { SITE_CONFIG } from "../config/site.config";
import { useOrderFlow } from "../context/OrderFlowContext";
import { buildGreetingMessage } from "../utils/whatsapp";

const LINKS = [
  { href: "#inicio", label: "Inicio" },
  { href: "#catalogo", label: "Catálogo" },
  { href: "#ocasiones", label: "Ocasiones" },
  { href: "#como-funciona", label: "Cómo funciona" },
  { href: "#faq", label: "Preguntas frecuentes" },
];

export default function Footer() {
  const { requestWhatsApp } = useOrderFlow();

  return (
    <footer className="bg-ink text-cream/80 pt-14 pb-8">
      <div className="max-w-8xl mx-auto px-5 md:px-8 grid sm:grid-cols-3 gap-10 mb-10">
        <div>
          <p className="font-serif text-2xl text-cream mb-2">{SITE_CONFIG.BRAND_NAME}</p>
          <p className="text-sm text-cream/60">{SITE_CONFIG.BRAND_TAGLINE}</p>
          <p className="text-sm text-cream/60 mt-1">Tunja y Bogotá</p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-widest text-cream/50 mb-3">Explorar</p>
          <ul className="space-y-2 text-sm">
            {LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="hover:text-gold-soft transition-colors">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs uppercase tracking-widest text-cream/50 mb-3">Contacto</p>
          <ul className="space-y-2 text-sm">
            <li>
              <button onClick={() => requestWhatsApp(buildGreetingMessage())} className="hover:text-gold-soft transition-colors">
                WhatsApp
              </button>
            </li>
            <li>
              <a href={SITE_CONFIG.INSTAGRAM_URL} target="_blank" rel="noreferrer" className="hover:text-gold-soft transition-colors">
                Instagram
              </a>
            </li>
            <li>
              <a href={`mailto:${SITE_CONFIG.EMAIL}`} className="hover:text-gold-soft transition-colors">
                {SITE_CONFIG.EMAIL}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-8xl mx-auto px-5 md:px-8 pt-6 border-t border-cream/10 text-xs text-cream/40">
        © {new Date().getFullYear()} {SITE_CONFIG.BRAND_NAME}. Hecho a mano, bajo pedido.
      </div>
    </footer>
  );
}
