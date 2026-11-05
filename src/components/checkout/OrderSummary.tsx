import React from "react";
import { formatCOP, SITE_CONFIG } from "../../config/site.config";
import type { OrderTotals } from "../../utils/pricing";

interface Props {
  totals: OrderTotals;
  /** true cuando el pedido ya fue enviado (cambia el texto del anticipo). */
  registered?: boolean;
}

/** Resumen de valores: subtotal, domicilio, total, anticipo y saldo (todo sale de calcOrderTotals). */
export default function OrderSummary({ totals, registered = false }: Props) {
  return (
    <div className="rounded-2xl border border-ink/10 bg-ivory/60 p-5 text-sm">
      <p className="text-xs uppercase tracking-[0.2em] text-gold font-medium mb-3">Resumen del pedido</p>
      <dl className="space-y-2 text-charcoal/80">
        <div className="flex justify-between">
          <dt>Subtotal de productos</dt>
          <dd>{formatCOP(totals.subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Domicilio</dt>
          <dd>{formatCOP(totals.delivery)}</dd>
        </div>
        <div className="flex justify-between font-serif text-lg text-ink pt-2 border-t border-ink/10">
          <dt>Total del pedido</dt>
          <dd>{formatCOP(totals.total)}</dd>
        </div>
        <div className="flex justify-between font-medium text-ink pt-2 border-t border-dashed border-ink/15">
          <dt>Anticipo del {SITE_CONFIG.DEPOSIT_PERCENT}%{registered ? "" : " (a pagar ahora)"}</dt>
          <dd className="text-gold">{formatCOP(totals.deposit)}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Saldo pendiente</dt>
          <dd>{formatCOP(totals.balance)}</dd>
        </div>
      </dl>
      <p className="text-xs text-charcoal/55 mt-3 leading-relaxed">
        El saldo pendiente se paga según las condiciones acordadas para la entrega.
      </p>
    </div>
  );
}
