import { SITE_CONFIG } from "../config/site.config";

export interface OrderTotals {
  subtotal: number;
  delivery: number;
  total: number;
  /** Anticipo que se paga para confirmar el pedido (porcentaje del total, redondeado hacia arriba al peso). */
  deposit: number;
  /** Lo que queda por pagar según las condiciones acordadas para la entrega. */
  balance: number;
}

/**
 * Único lugar donde se calculan los valores del pedido.
 * El anticipo es el 50% del TOTAL (productos + domicilio) y el saldo es lo que falta,
 * así anticipo + saldo siempre suman exactamente el total.
 */
export function calcOrderTotals(subtotal: number): OrderTotals {
  const delivery = subtotal > 0 ? SITE_CONFIG.DOMICILIO_PRICE : 0;
  const total = subtotal + delivery;
  const deposit = Math.ceil((total * SITE_CONFIG.DEPOSIT_PERCENT) / 100);
  return { subtotal, delivery, total, deposit, balance: total - deposit };
}
