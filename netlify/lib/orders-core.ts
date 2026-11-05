import { LOCATIONS, SITE_CONFIG, type LocationKey } from "../../src/config/site.config";
import { getCatalogEntry } from "../../src/data/catalog";
import { calcOrderTotals } from "../../src/utils/pricing";
import {
  PAYMENT_KINDS,
  type CustomerData,
  type OrderPayload,
  type PaymentKind,
  type PaymentRecord,
  type StoredItem,
  type StoredOrder,
} from "../../src/shared/orderTypes";
import type { Db } from "./store";

export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

const MAX_ITEMS = 30;
const MAX_PHOTOS_PER_ITEM = 10;
const MAX_PHOTO_BYTES = 900_000; // por foto, ya reducida por el navegador
const MAX_TOTAL_PHOTO_BYTES = 4_400_000;
const JPEG_DATA_URL = /^data:image\/jpeg;base64,[A-Za-z0-9+/]+={0,2}$/;

const str = (v: unknown, max: number): string => (typeof v === "string" ? v.trim().slice(0, max) : "");

function isIsoDate(v: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return false;
  const d = new Date(`${v}T12:00:00Z`);
  return !isNaN(d.getTime()) && d.toISOString().slice(0, 10) === v;
}

function base64Bytes(dataUrl: string): number {
  const b64 = dataUrl.slice(dataUrl.indexOf(",") + 1);
  return Math.floor((b64.length * 3) / 4);
}

function validateCustomer(raw: unknown): CustomerData {
  const c = (raw ?? {}) as Record<string, unknown>;
  const customer: CustomerData = {
    nombre: str(c.nombre, 120),
    celular: str(c.celular, 20).replace(/\D/g, ""),
    correo: str(c.correo, 120),
    direccion: str(c.direccion, 200),
    fechaEntrega: str(c.fechaEntrega, 10),
    notas: str(c.notas, 600),
  };
  if (customer.nombre.length < 3) throw new HttpError(400, "Falta el nombre.");
  if (customer.celular.length !== 10) throw new HttpError(400, "El celular debe tener 10 dígitos.");
  if (customer.correo && !/^\S+@\S+\.\S+$/.test(customer.correo)) throw new HttpError(400, "El correo no es válido.");
  if (customer.direccion.length < 5) throw new HttpError(400, "Falta la dirección de entrega.");
  // La hora del servidor es UTC: solo se rechazan fechas con formato inválido o claramente pasadas.
  const yesterday = new Date(Date.now() - 36 * 3600 * 1000).toISOString().slice(0, 10);
  if (!isIsoDate(customer.fechaEntrega) || customer.fechaEntrega < yesterday)
    throw new HttpError(400, "La fecha de entrega no es válida.");
  return customer;
}

function generateOrderId(now: Date): string {
  const yy = String(now.getFullYear()).slice(2);
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `LD-${yy}${mm}${dd}-${rand}`;
}

/**
 * Valida el pedido que llega del navegador y lo guarda como PENDIENTE.
 * Los precios salen del catálogo del servidor (src/data/catalog.ts), no de lo que envíe el navegador,
 * y el Nequi destino sale de la sede elegida. Nada queda como pagado: eso solo lo registra el administrador.
 */
export async function createOrder(db: Db, payload: unknown, now = new Date()): Promise<StoredOrder> {
  const p = (payload ?? {}) as Partial<OrderPayload>;

  if (!p.sede || !(p.sede in LOCATIONS)) throw new HttpError(400, "Falta elegir la sede.");
  const sede = p.sede as LocationKey;
  const customer = validateCustomer(p.customer);

  if (!Array.isArray(p.items) || p.items.length === 0 || p.items.length > MAX_ITEMS)
    throw new HttpError(400, "El pedido no tiene productos válidos.");

  let totalPhotoBytes = 0;
  const pendingPhotos: { itemIdx: number; n: number; label: string; dataUrl: string }[] = [];
  const items: StoredItem[] = p.items.map((raw, itemIdx) => {
    const entry = getCatalogEntry(str(raw?.productId, 80));
    if (!entry) throw new HttpError(400, "Hay un producto que ya no existe en el catálogo.");
    const quantity = Number(raw.quantity);
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 1000) throw new HttpError(400, "Cantidad inválida.");
    const minQuantity = "minQuantity" in entry ? (entry.minQuantity as number) : 1;
    if (quantity < minQuantity)
      throw new HttpError(400, `${entry.name} solo aplica desde ${minQuantity} unidades en el mismo pedido.`);

    const personalization: Record<string, string> = {};
    Object.entries(raw.personalization ?? {})
      .slice(0, 20)
      .forEach(([k, v]) => {
        const key = str(k, 40);
        const value = str(v, 500);
        if (key && value) personalization[key] = value;
      });

    const photos = Array.isArray(raw.photos) ? raw.photos : [];
    if (photos.length > MAX_PHOTOS_PER_ITEM) throw new HttpError(400, "Demasiadas fotos en un producto.");
    photos.forEach((ph, n) => {
      const dataUrl = typeof ph?.dataUrl === "string" ? ph.dataUrl : "";
      if (!JPEG_DATA_URL.test(dataUrl)) throw new HttpError(400, "Una de las fotos no es válida.");
      const bytes = base64Bytes(dataUrl);
      totalPhotoBytes += bytes;
      if (bytes > MAX_PHOTO_BYTES || totalPhotoBytes > MAX_TOTAL_PHOTO_BYTES)
        throw new HttpError(413, "Las fotos pesan demasiado. Sube menos fotos o más livianas.");
      pendingPhotos.push({ itemIdx, n, label: str(ph.label, 60), dataUrl });
    });

    return {
      productId: raw.productId,
      name: entry.name,
      presentation: entry.presentation,
      quantity,
      unitPrice: entry.price,
      lineTotal: entry.price * quantity,
      personalization,
      photos: [],
    };
  });

  // Número de pedido único.
  let id = generateOrderId(now);
  for (let i = 0; i < 5 && (await db.orders.getJSON(id)); i++) id = generateOrderId(now);

  // Fotos primero; si algo falla, el pedido no queda a medias sin sus fotos.
  for (const ph of pendingPhotos) {
    const key = `${id}/${ph.itemIdx}-${ph.n}`;
    await db.photos.setText(key, ph.dataUrl);
    items[ph.itemIdx].photos.push({ key, label: ph.label });
  }

  const subtotal = items.reduce((sum, i) => sum + i.lineTotal, 0);
  const order: StoredOrder = {
    id,
    createdAt: now.toISOString(),
    sede,
    sedeLabel: LOCATIONS[sede].label,
    nequiDestino: LOCATIONS[sede].nequi,
    customer,
    items,
    totals: calcOrderTotals(subtotal),
    payments: [],
  };
  await db.orders.setJSON(id, order);
  return order;
}

/* ------------------------- Operaciones del administrador ------------------------- */

async function mapLimit<T, R>(list: T[], limit: number, fn: (t: T) => Promise<R>): Promise<R[]> {
  const out: R[] = new Array(list.length);
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(limit, list.length) }, async () => {
      while (next < list.length) {
        const i = next++;
        out[i] = await fn(list[i]);
      }
    })
  );
  return out;
}

export async function listOrders(db: Db): Promise<StoredOrder[]> {
  const keys = await db.orders.keys();
  const orders = await mapLimit(keys, 15, (k) => db.orders.getJSON<StoredOrder>(k));
  return orders.filter((o): o is StoredOrder => !!o).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getOrderWithPhotos(db: Db, id: unknown) {
  const order = await requireOrder(db, id);
  const photos: { key: string; label: string; dataUrl: string }[] = [];
  for (const item of order.items) {
    for (const ph of item.photos) {
      const dataUrl = await db.photos.getText(ph.key);
      if (dataUrl) photos.push({ key: ph.key, label: ph.label, dataUrl });
    }
  }
  return { order, photos };
}

async function requireOrder(db: Db, id: unknown): Promise<StoredOrder> {
  const key = typeof id === "string" ? id : "";
  const order = key ? await db.orders.getJSON<StoredOrder>(key) : null;
  if (!order) throw new HttpError(404, "No encontramos ese pedido.");
  return order;
}

export async function addPayment(db: Db, input: Record<string, unknown>, now = new Date()): Promise<StoredOrder> {
  const order = await requireOrder(db, input.id);
  if (order.cancelled) throw new HttpError(409, "El pedido está cancelado. Restáuralo para registrar pagos.");

  const amount = Number(input.amount);
  if (!Number.isInteger(amount) || amount < 1 || amount > 50_000_000) throw new HttpError(400, "El valor debe ser un número entero de pesos.");
  const kind = str(input.kind, 20) as PaymentKind;
  if (!PAYMENT_KINDS.includes(kind)) throw new HttpError(400, "Tipo de pago inválido.");
  const paidAt = str(input.paidAt, 10);
  const tomorrow = new Date(now.getTime() + 36 * 3600 * 1000).toISOString().slice(0, 10);
  if (!isIsoDate(paidAt) || paidAt > tomorrow) throw new HttpError(400, "La fecha del pago no es válida.");

  const payment: PaymentRecord = {
    id: `pg-${now.getTime().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    amount,
    kind,
    paidAt,
    note: str(input.note, 200),
    registeredAt: now.toISOString(),
  };
  order.payments.push(payment);
  await db.orders.setJSON(order.id, order);
  return order;
}

export async function voidPayment(db: Db, input: Record<string, unknown>, now = new Date()): Promise<StoredOrder> {
  const order = await requireOrder(db, input.id);
  const payment = order.payments.find((p) => p.id === input.paymentId);
  if (!payment) throw new HttpError(404, "No encontramos ese pago.");
  if (payment.voided) throw new HttpError(409, "Ese pago ya estaba anulado.");
  const reason = str(input.reason, 200);
  if (reason.length < 3) throw new HttpError(400, "Escribe el motivo de la anulación.");
  payment.voided = { at: now.toISOString(), reason };
  await db.orders.setJSON(order.id, order);
  return order;
}

export async function cancelOrder(db: Db, input: Record<string, unknown>, now = new Date()): Promise<StoredOrder> {
  const order = await requireOrder(db, input.id);
  const reason = str(input.reason, 200);
  if (reason.length < 3) throw new HttpError(400, "Escribe el motivo de la cancelación.");
  order.cancelled = { at: now.toISOString(), reason };
  await db.orders.setJSON(order.id, order);
  return order;
}

export async function restoreOrder(db: Db, input: Record<string, unknown>): Promise<StoredOrder> {
  const order = await requireOrder(db, input.id);
  delete order.cancelled;
  await db.orders.setJSON(order.id, order);
  return order;
}

export const _config = { DEPOSIT_PERCENT: SITE_CONFIG.DEPOSIT_PERCENT };
