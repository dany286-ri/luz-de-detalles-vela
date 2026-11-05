import type { StoredOrder } from "../shared/orderTypes";

const ENDPOINT = "/.netlify/functions/admin";
const TOKEN_KEY = "luz-admin-token";

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export function getToken(): string | null {
  try {
    return sessionStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}
export function setToken(token: string | null): void {
  try {
    if (token) sessionStorage.setItem(TOKEN_KEY, token);
    else sessionStorage.removeItem(TOKEN_KEY);
  } catch {
    /* ignorar */
  }
}

async function call<T>(action: string, body: Record<string, unknown> = {}): Promise<T> {
  const token = getToken();
  let res: Response;
  try {
    res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: JSON.stringify({ action, ...body }),
    });
  } catch {
    throw new ApiError(0, "No hay conexión con el servidor.");
  }
  const data = (await res.json().catch(() => null)) as (T & { error?: string }) | null;
  if (!res.ok) throw new ApiError(res.status, data?.error ?? "Error del servidor.");
  return data as T;
}

export interface OrderPhotoView {
  key: string;
  label: string;
  dataUrl: string;
}

export const api = {
  login: (password: string) => call<{ token: string }>("login", { password }),
  list: () => call<{ orders: StoredOrder[] }>("list"),
  get: (id: string) => call<{ order: StoredOrder; photos: OrderPhotoView[] }>("get", { id }),
  addPayment: (input: { id: string; amount: number; kind: string; paidAt: string; note: string }) =>
    call<{ order: StoredOrder }>("addPayment", input),
  voidPayment: (id: string, paymentId: string, reason: string) => call<{ order: StoredOrder }>("voidPayment", { id, paymentId, reason }),
  cancel: (id: string, reason: string) => call<{ order: StoredOrder }>("cancel", { id, reason }),
  restore: (id: string) => call<{ order: StoredOrder }>("restore", { id }),
};
