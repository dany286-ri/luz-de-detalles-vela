import { getDb } from "../lib/store";
import { HttpError, createOrder } from "../lib/orders-core";

const MAX_BODY_BYTES = 5_500_000; // Netlify admite 6 MB por petición

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });

/** Recibe el pedido desde el checkout y lo guarda como "pendiente de verificación". */
export default async (req: Request): Promise<Response> => {
  if (req.method !== "POST") return json({ error: "Método no permitido." }, 405);
  try {
    const text = await req.text();
    if (text.length > MAX_BODY_BYTES) throw new HttpError(413, "El pedido pesa demasiado (fotos).");
    let payload: unknown;
    try {
      payload = JSON.parse(text);
    } catch {
      throw new HttpError(400, "Pedido ilegible.");
    }
    // Campo trampa anti-bots: si viene lleno, respondemos "ok" sin guardar nada.
    if (typeof (payload as { website?: unknown })?.website === "string" && (payload as { website: string }).website) {
      return json({ ok: true, id: "LD-000000-XXXX" });
    }
    const order = await createOrder(getDb(), payload);
    return json({
      ok: true,
      id: order.id,
      createdAt: order.createdAt,
      sede: order.sede,
      sedeLabel: order.sedeLabel,
      totals: order.totals,
    });
  } catch (err) {
    if (err instanceof HttpError) return json({ error: err.message }, err.status);
    console.error("create-order failed", err);
    return json({ error: "No pudimos guardar tu pedido. Intenta de nuevo." }, 500);
  }
};
