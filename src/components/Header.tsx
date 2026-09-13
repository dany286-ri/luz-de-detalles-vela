import React, { useEffect, useState } from "react";
import { SITE_CONFIG } from "../config/site.config";
import { useCart } from "../context/CartContext";

const NAV_LINKS = [
  { href: "#inicio", label: "Inicio" },
  { href: "#catalogo", label: "Catálogo" },
  { href: "#personalizados", label: "Personalizados" },
  { href: "#eventos", label: "Eventos" },
  { href: "#nosotros", label: "Nosotros" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { itemCount, openCart } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 bg-cream/95 backdrop-blur transition-all duration-300 ${
        scrolled ? "shadow-[0_2px_20px_-8px_rgba(43,39,36,0.15)] py-2" : "py-4"
      }`}
    >
      <div className="max-w-8xl mx-auto px-5 md:px-8 flex items-center justify-between">
        {/* Logo */}
        <a href="#inicio" className="font-serif text-2xl md:text-3xl font-medium tracking-wide text-ink">
          {SITE_CONFIG.BRAND_NAME}
        </a>

        {/* Nav desktop */}
        <nav className="hidden md:flex items-center gap-9 text-[15px] tracking-wide">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-charcoal/80 hover:text-ink transition-colors duration-200 relative group"
            >
              {link.label}
              <span className="absolute left-0 -bottom-1 h-px w-0 bg-gold transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        {/* Right actions desktop */}
        <div className="hidden md:flex items-center gap-5 text-[15px]">
          <a
            href={SITE_CONFIG.INSTAGRAM_URL}
            target="_blank"
            rel="noreferrer"
            className="text-charcoal/70 hover:text-gold transition-colors"
            aria-label="Instagram"
          >
            Instagram
          </a>
          <a
            href={`https://wa.me/${SITE_CONFIG.WHATSAPP_NUMBER.replace(/\D/g, "")}`}
            target="_blank"
            rel="noreferrer"
            className="text-charcoal/70 hover:text-gold transition-colors"
          >
            WhatsApp
          </a>
          <button
            onClick={openCart}
            className="relative flex items-center gap-2 border border-ink/15 rounded-full px-4 py-2 hover:border-gold hover:text-gold transition-colors duration-200"
          >
            <span>Pedido</span>
            <span aria-hidden>🛍️</span>
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-gold text-cream text-[11px] w-5 h-5 rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </button>
        </div>

        {/* Mobile actions */}
        <div className="flex md:hidden items-center gap-4">
          <button
            onClick={openCart}
            className="relative"
            aria-label="Ver pedido"
          >
            <span className="text-xl">🛍️</span>
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-gold text-cream text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Abrir menú"
            className="text-2xl leading-none"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-[max-height,opacity] duration-300 ${
          menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="flex flex-col gap-1 px-5 pt-3 pb-5 text-[15px]">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="py-2.5 border-b border-ink/5 text-charcoal/85"
            >
              {link.label}
            </a>
          ))}
          <div className="flex gap-5 pt-3">
            <a href={SITE_CONFIG.INSTAGRAM_URL} target="_blank" rel="noreferrer" className="text-charcoal/70">
              Instagram
            </a>
            <a
              href={`https://wa.me/${SITE_CONFIG.WHATSAPP_NUMBER.replace(/\D/g, "")}`}
              target="_blank"
              rel="noreferrer"
              className="text-charcoal/70"
            >
              WhatsApp
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
