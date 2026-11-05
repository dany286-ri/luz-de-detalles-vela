import { getDb } from "../lib/store";
import { adminConfigured, bearerToken, checkPassword, signToken, verifyToken } from "../lib/auth";
import {
  HttpError,
  addPayment,
  cancelOrder,
  getOrderWithPhotos,
  listOrders,
  restoreOrder,
  voidPayment,
} from "../lib/orders-core";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });

/** Panel privado: todas las acciones (menos entrar) exigen la sesión que se obtiene con la clave. */
export default async (req: Request): Promise<Response> => {
  if (req.method !== "POST") return json({ error: "Método no permitido." }, 405);
  const env = process.env;

  try {
    let body: Record<string, unknown>;
    try {
      body = (await req.json()) as Record<string, unknown>;
    } catch {
      throw new HttpError(400, "Petición ilegible.");
    }
    const action = String(body.action ?? "");

    if (!adminConfigured(env)) {
      throw new HttpError(503, "El panel aún no está activado: falta definir la variable ADMIN_PASSWORD en Netlify.");
    }

    if (action === "login") {
      if (typeof body.password === "string" && checkPassword(body.password, env)) {
        return json({ ok: true, token: signToken(env) });
      }
      await new Promise((r) => setTimeout(r, 800)); // frena intentos repetidos
      throw new HttpError(401, "Clave incorrecta.");
    }

    if (!verifyToken(bearerToken(req), env)) throw new HttpError(401, "Tu sesión venció. Vuelve a entrar.");

    const db = getDb();
    switch (action) {
      case "list":
        return json({ orders: await listOrders(db) });
      case "get":
        return json(await getOrderWithPhotos(db, body.id));
      case "addPayment":
        return json({ order: await addPayment(db, body) });
      case "voidPayment":
        return json({ order: await voidPayment(db, body) });
      case "cancel":
        return json({ order: await cancelOrder(db, body) });
      case "restore":
        return json({ order: await restoreOrder(db, body) });
      default:
        throw new HttpError(400, "Acción desconocida.");
    }
  } catch (err) {
    if (err instanceof HttpError) return json({ error: err.message }, err.status);
    console.error("admin failed", err);
    return json({ error: "Algo salió mal en el servidor." }, 500);
  }
};
