import { SITE_CONFIG } from "../config/site.config";

export interface OrderTotals {
  subtotal: number;
  delivery: number;
  total: number;
  /** Valor que se paga ahora por Nequi. Hoy es el 100% del total (DEPOSIT_PERCENT), redondeado hacia arriba al peso. */
  deposit: number;
  /** Lo que queda por pagar después de este pago (con pago completo es $0). */
  balance: number;
}

/**
 * Único lugar donde se calculan los valores del pedido.
 * Se paga el TOTAL (productos + domicilio). Si DEPOSIT_PERCENT vuelve a ser menor que 100,
 * `deposit` + `balance` siempre suman exactamente el total.
 */
export function calcOrderTotals(subtotal: number): OrderTotals {
  const delivery = subtotal > 0 ? SITE_CONFIG.DOMICILIO_PRICE : 0;
  const total = subtotal + delivery;
  const deposit = Math.ceil((total * SITE_CONFIG.DEPOSIT_PERCENT) / 100);
  return { subtotal, delivery, total, deposit, balance: total - deposit };
}
