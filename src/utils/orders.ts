import { LOCATIONS, SITE_CONFIG, formatCOP, type LocationKey } from "../config/site.config";
import type { CartItem } from "../context/CartContext";
import { calcOrderTotals, type OrderTotals } from "./pricing";
import { MAX_ORDER_PHOTO_BYTES, photosBytes } from "./photos";
import type { CustomerData, OrderPayload } from "../shared/orderTypes";

export type { CustomerData };

/** Estado con el que SIEMPRE nace un pedido: nunca se marca como pagado desde la página. */
export const PAYMENT_STATUS_PENDING = "Pendiente de verificación";

const DRAFT_KEY = "luz-de-detalles-checkout";
const LAST_ORDER_KEY = "luz-de-detalles-last-order";
const CREATE_ORDER_URL = "/.netlify/functions/create-order";

export const EMPTY_CUSTOMER: CustomerData = {
  nombre: "",
  celular: "",
  correo: "",
  direccion: "",
  fechaEntrega: "",
  notas: "",
};

/** Pedido ya guardado en el servidor, tal como lo muestra la página. */
export interface OrderRecord {
  id: string;
  createdAt: string; // ISO
  sede: LocationKey;
  sedeLabel: string;
  /** Nequi al que se le pidió transferir (el de la sede elegida). */
  nequiDestino: string;
  paymentMethod: "Nequi";
  paymentStatus: typeof PAYMENT_STATUS_PENDING;
  customer: CustomerData;
  /** Texto legible de los productos y su personalización. */
  productsText: string;
  totals: OrderTotals;
  photoCount: number;
}

const FIELD_LABELS: Record<string, string> = {
  nombre: "Nombre",
  colorGlitter: "Color",
  notas: "Notas",
  anio: "Año",
  mensaje: "Mensaje",
  fechaEvento: "Fecha del evento",
  nombreMascota: "Nombre de la mascota",
};

export function describeItems(items: CartItem[]): string {
  return items
    .map((item, idx) => {
      const lines = [
        `${idx + 1}. ${item.product.name} (${item.product.presentation}) x${item.quantity} = ${formatCOP(
          item.product.price * item.quantity
        )}`,
      ];
      Object.entries(item.personalization)
        .filter(([, v]) => v && v.trim() !== "")
        .forEach(([key, value]) => lines.push(`   - ${FIELD_LABELS[key] ?? key}: ${value}`));
      if (item.photos && item.photos.length > 0) lines.push(`   - Fotos: ${item.photos.length}`);
      return lines.join("\n");
    })
    .join("\n");
}

/** Fecha mínima de entrega (hoy + días mínimos de anticipación) en formato yyyy-mm-dd, hora local. */
export function minDeliveryDate(now = new Date()): string {
  const d = new Date(now);
  d.setDate(d.getDate() + SITE_CONFIG.MIN_LEAD_DAYS);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}

export type CustomerErrors = Partial<Record<keyof CustomerData | "sede" | "items", string>>;

export function validateCustomer(c: CustomerData, sede: LocationKey | null, items: CartItem[] = []): CustomerErrors {
  const errors: CustomerErrors = {};
  if (c.nombre.trim().length < 3) errors.nombre = "Escribe tu nombre completo.";
  if (c.celular.replace(/\D/g, "").length !== 10) errors.celular = "Escribe un celular de 10 dígitos.";
  if (c.correo.trim() && !/^\S+@\S+\.\S+$/.test(c.correo.trim())) errors.correo = "Revisa que el correo esté bien escrito.";
  if (c.direccion.trim().length < 5) errors.direccion = "Indícanos la dirección o barrio de entrega.";
  if (!c.fechaEntrega) errors.fechaEntrega = "Elige la fecha en que lo necesitas.";
  else if (c.fechaEntrega < minDeliveryDate())
    errors.fechaEntrega = `Los pedidos requieren mínimo ${SITE_CONFIG.MIN_LEAD_DAYS} días de anticipación.`;
  if (!sede) errors.sede = "Elige la sede desde la que haces tu pedido.";

  const short = items.find((i) => i.product.minQuantity && i.quantity < i.product.minQuantity);
  if (short) errors.items = `${short.product.name} solo aplica desde ${short.product.minQuantity} unidades en el mismo pedido.`;
  const photoBytes = items.reduce((sum, i) => sum + photosBytes(i.photos ?? []), 0);
  if (photoBytes > MAX_ORDER_PHOTO_BYTES)
    errors.items = "Las fotos de tu pedido pesan demasiado. Quita algunas o súbelas de nuevo en menor cantidad.";
  return errors;
}

/**
 * Envía el pedido al servidor, que lo guarda como PENDIENTE y calcula precios y totales por su cuenta.
 * Lanza un error con un mensaje claro si no se pudo guardar: así nunca mostramos un pedido "registrado" que no llegó.
 */
export async function submitOrder(items: CartItem[], customer: CustomerData, sede: LocationKey | null): Promise<OrderRecord> {
  if (!sede) throw new Error("Falta elegir la sede.");
  if (items.length === 0) throw new Error("El pedido no tiene productos.");

  const payload: OrderPayload = {
    customer: { ...customer, celular: customer.celular.replace(/\D/g, "") },
    sede,
    website: "",
    items: items.map((i) => ({
      productId: i.product.id,
      quantity: i.quantity,
      personalization: i.personalization,
      photos: (i.photos ?? []).map((p) => ({ dataUrl: p.dataUrl, label: p.label })),
    })),
  };

  let res: Response;
  try {
    res = await fetch(CREATE_ORDER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error("No hay conexión con el servidor. Revisa tu internet e intenta de nuevo.");
  }

  const data = (await res.json().catch(() => null)) as
    | { ok?: boolean; error?: string; id?: string; createdAt?: string; totals?: OrderTotals }
    | null;
  if (!res.ok || !data?.ok || !data.id || !data.totals) {
    throw new Error(data?.error ?? "No pudimos guardar tu pedido. Intenta de nuevo.");
  }

  const record: OrderRecord = {
    id: data.id,
    createdAt: data.createdAt ?? new Date().toISOString(),
    sede,
    sedeLabel: LOCATIONS[sede].label,
    nequiDestino: LOCATIONS[sede].nequi,
    paymentMethod: "Nequi",
    paymentStatus: PAYMENT_STATUS_PENDING,
    customer,
    productsText: describeItems(items),
    totals: data.totals,
    photoCount: items.reduce((sum, i) => sum + (i.photos?.length ?? 0), 0),
  };
  void notifyByEmail(record);
  return record;
}

/**
 * Aviso por correo (opcional): copia un resumen SIN fotos al formulario "pedidos" de Netlify Forms,
 * para que Dany reciba un correo si activó las notificaciones. Si falla, no afecta el pedido.
 */
async function notifyByEmail(order: OrderRecord): Promise<void> {
  try {
    const body = new URLSearchParams({
      "form-name": "pedidos",
      "bot-field": "",
      pedido_id: order.id,
      estado_pago: order.paymentStatus,
      sede: order.sedeLabel,
      nombre: order.customer.nombre.trim(),
      celular: order.customer.celular.replace(/\D/g, ""),
      fecha_entrega: order.customer.fechaEntrega,
      productos: order.productsText,
      total: String(order.totals.total),
      anticipo_50: String(order.totals.deposit),
      fotos: String(order.photoCount),
    });
    await fetch("/", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: body.toString() });
  } catch {
    /* sin aviso por correo, el pedido ya quedó guardado */
  }
}

/* ---------- Persistencia local (para no perder datos si se cierra la ventana) ---------- */

export interface CheckoutDraft {
  customer: CustomerData;
  sede: LocationKey | null;
}

export function loadDraft(): CheckoutDraft {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<CheckoutDraft>;
      const sede = parsed.sede && parsed.sede in LOCATIONS ? parsed.sede : null;
      return { customer: { ...EMPTY_CUSTOMER, ...(parsed.customer ?? {}) }, sede };
    }
  } catch {
    /* sin almacenamiento disponible */
  }
  return { customer: { ...EMPTY_CUSTOMER }, sede: null };
}

export function saveDraft(draft: CheckoutDraft): void {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  } catch {
    /* ignorar */
  }
}

export function saveLastOrder(order: OrderRecord): void {
  try {
    localStorage.setItem(LAST_ORDER_KEY, JSON.stringify(order));
  } catch {
    /* ignorar */
  }
}

export { calcOrderTotals };
