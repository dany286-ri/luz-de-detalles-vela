import React, { useEffect } from "react";
import { useCart } from "../context/CartContext";
import { formatCOP, SITE_CONFIG } from "../config/site.config";
import { buildCartMessage } from "../utils/whatsapp";
import { useOrderFlow } from "../context/OrderFlowContext";

export default function Cart() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal, total } = useCart();
  const { requestWhatsApp } = useOrderFlow();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleCheckout = () => {
    const message = buildCartMessage(items, subtotal, SITE_CONFIG.DOMICILIO_PRICE, total);
    requestWhatsApp(message);
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-ink/40 backdrop-blur-sm z-[70] transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeCart}
      />
      <aside
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-cream z-[80] shadow-soft flex flex-col transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!isOpen}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-ink/10">
          <h2 className="font-serif text-xl text-ink">Tu pedido</h2>
          <button onClick={closeCart} aria-label="Cerrar pedido" className="text-xl text-charcoal/70 hover:text-ink">
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center gap-3 text-charcoal/60">
              <span className="text-3xl inline-block animate-flicker" aria-hidden>
                🕯️
              </span>
              <p className="text-sm">Aún no has agregado ningún detalle.</p>
            </div>
          ) : (
            <ul className="space-y-5">
              {items.map((item) => {
                const persEntries = Object.entries(item.personalization).filter(([, v]) => v?.trim());
                return (
                  <li key={item.cartId} className="flex gap-3.5 pb-5 border-b border-ink/5">
                    <div className="w-16 h-16 rounded-xl bg-beige overflow-hidden shrink-0">
                      {item.product.images[0] ? (
                        <img src={item.product.images[0]} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-lg"><span className="inline-block animate-flicker">🕯️</span></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-ink truncate">{item.product.name}</p>
                      <p className="text-xs text-charcoal/55">{item.product.presentation}</p>
                      {persEntries.length > 0 && (
                        <p className="text-xs text-charcoal/50 mt-0.5 truncate">
                          {persEntries.map(([, v]) => v).join(" · ")}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-ink/15 rounded-full">
                          <button
                            onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                            className="w-7 h-7 text-sm flex items-center justify-center text-ink"
                          >
                            −
                          </button>
                          <span className="w-6 text-center text-xs">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                            className="w-7 h-7 text-sm flex items-center justify-center text-ink"
                          >
                            +
                          </button>
                        </div>
                        <span className="text-sm text-ink">{formatCOP(item.product.price * item.quantity)}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => removeItem(item.cartId)}
                      aria-label="Eliminar"
                      className="text-charcoal/40 hover:text-ink text-sm self-start"
                    >
                      ✕
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="px-6 py-5 border-t border-ink/10 space-y-2">
            <div className="flex justify-between text-sm text-charcoal/70">
              <span>Subtotal</span>
              <span>{formatCOP(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm text-charcoal/70">
              <span>Domicilio</span>
              <span>{formatCOP(SITE_CONFIG.DOMICILIO_PRICE)}</span>
            </div>
            <div className="flex justify-between font-serif text-lg text-ink pt-1">
              <span>Total</span>
              <span>{formatCOP(total)}</span>
            </div>
            <p className="text-xs text-charcoal/50 pt-1">
              Se confirma el pedido con un anticipo del 50%. El envío se coordina por WhatsApp.
            </p>
            <button
              onClick={handleCheckout}
              className="w-full bg-ink text-cream py-3.5 rounded-full text-sm tracking-wide hover:bg-charcoal transition-colors mt-2"
            >
              Finalizar por WhatsApp
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
