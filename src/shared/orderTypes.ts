/**
 * Tipos y reglas compartidos entre la página, el panel /admin y el servidor de pedidos.
 * No tiene dependencias del navegador ni de Node, para poder usarse en los tres lados.
 */
import type { LocationKey } from "../config/site.config";
import type { OrderTotals } from "../utils/pricing";

export type { OrderTotals };

export interface CustomerData {
  nombre: string;
  celular: string;
  correo: string;
  direccion: string;
  fechaEntrega: string; // yyyy-mm-dd
  notas: string;
}

/** Foto tal como la envía el navegador al crear el pedido. */
export interface PhotoPayload {
  dataUrl: string;
  label: string;
}

export interface OrderItemPayload {
  productId: string;
  quantity: number;
  personalization: Record<string, string>;
  photos: PhotoPayload[];
}

/** Lo que el navegador envía al servidor. Los precios y totales NO se envían: los calcula el servidor. */
export interface OrderPayload {
  customer: CustomerData;
  sede: LocationKey;
  items: OrderItemPayload[];
  /** Campo trampa anti-bots: debe llegar vacío. */
  website?: string;
}

export interface StoredPhoto {
  /** Clave de la foto en el almacenamiento. */
  key: string;
  label: string;
}

export interface StoredItem {
  productId: string;
  name: string;
  presentation: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  personalization: Record<string, string>;
  photos: StoredPhoto[];
}

export const PAYMENT_KINDS = ["Anticipo", "Saldo", "Pago completo", "Otro"] as const;
export type PaymentKind = (typeof PAYMENT_KINDS)[number];

/** Un pago que el administrador verificó y registró. */
export interface PaymentRecord {
  id: string;
  /** Pesos colombianos recibidos. */
  amount: number;
  kind: PaymentKind;
  /** Fecha en que entró el dinero (yyyy-mm-dd). */
  paidAt: string;
  note: string;
  registeredAt: string; // ISO
  /** Si el pago se anuló, queda el registro pero no suma a los ingresos. */
  voided?: { at: string; reason: string };
}

export interface StoredOrder {
  id: string;
  createdAt: string; // ISO
  sede: LocationKey;
  sedeLabel: string;
  /** Nequi al que se le pidió transferir (el de la sede elegida). */
  nequiDestino: string;
  customer: CustomerData;
  items: StoredItem[];
  totals: OrderTotals;
  payments: PaymentRecord[];
  cancelled?: { at: string; reason: string };
}

export type OrderStatus = "pendiente" | "parcial" | "anticipo" | "pagado" | "cancelado";

export const STATUS_LABELS: Record<OrderStatus, string> = {
  pendiente: "Pendiente de verificación",
  parcial: "Pago parcial",
  anticipo: "Anticipo verificado",
  pagado: "Pagado completo",
  cancelado: "Cancelado",
};

/** Dinero verificado de un pedido (los pagos anulados no cuentan). */
export function paidTotal(order: Pick<StoredOrder, "payments">): number {
  return order.payments.filter((p) => !p.voided).reduce((sum, p) => sum + p.amount, 0);
}

export function balanceDue(order: StoredOrder): number {
  return Math.max(0, order.totals.total - paidTotal(order));
}

/** El estado se calcula siempre a partir de los pagos verificados: nunca se "marca" a mano. */
export function orderStatus(order: StoredOrder): OrderStatus {
  if (order.cancelled) return "cancelado";
  const paid = paidTotal(order);
  if (paid >= order.totals.total) return "pagado";
  if (paid >= order.totals.deposit) return "anticipo";
  if (paid > 0) return "parcial";
  return "pendiente";
}
