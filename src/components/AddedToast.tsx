import React from "react";
import { useCart } from "../context/CartContext";
import { formatCOP } from "../config/site.config";

/** Notificación breve al agregar un producto al pedido. */
export default function AddedToast() {
  const { lastAdded } = useCart();

  if (!lastAdded) return null;

  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] bg-ink text-cream px-5 py-3 rounded-full shadow-soft flex items-center gap-3 text-sm animate-[popIn_0.25s_ease-out]"
      role="status"
    >
      <span aria-hidden>✓</span>
      <span>
        {lastAdded.product.name} agregado · {formatCOP(lastAdded.product.price * lastAdded.quantity)}
      </span>
    </div>
  );
}
