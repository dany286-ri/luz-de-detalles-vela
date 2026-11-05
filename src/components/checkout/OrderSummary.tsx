import React from "react";
import { formatCOP } from "../../config/site.config";
import type { OrderTotals } from "../../utils/pricing";

interface Props {
  totals: OrderTotals;
  /** Nombre de quien hace el pedido; si se pasa, se muestra arriba del resumen. */
  customerName?: string;
}

/** Resumen de valores: subtotal, domicilio y total a pagar (todo sale de calcOrderTotals). */
export default function OrderSummary({ totals, customerName }: Props) {
  return (
    <div className="rounded-2xl border border-ink/10 bg-ivory/60 p-5 text-sm">
      <p className="text-xs uppercase tracking-[0.2em] text-gold font-medium mb-3">Resumen del pedido</p>
      <dl className="space-y-2 text-charcoal/80">
        {customerName && customerName.trim() && (
          <div className="flex justify-between gap-4 pb-2 border-b border-ink/10">
            <dt>Pedido a nombre de</dt>
            <dd className="text-ink font-medium text-right">{customerName.trim()}</dd>
          </div>
        )}
        <div className="flex justify-between">
          <dt>Subtotal de productos</dt>
          <dd>{formatCOP(totals.subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Domicilio</dt>
          <dd>{formatCOP(totals.delivery)}</dd>
        </div>
        <div className="flex justify-between font-serif text-xl text-ink pt-2 border-t border-ink/10">
          <dt>Total a pagar</dt>
          <dd className="text-gold">{formatCOP(totals.total)}</dd>
        </div>
      </dl>
      <p className="text-xs text-charcoal/55 mt-3 leading-relaxed">
        El pago se hace completo por Nequi, con el domicilio incluido.
      </p>
    </div>
  );
}
