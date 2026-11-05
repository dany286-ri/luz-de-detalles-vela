import { getStore } from "@netlify/blobs";

/** Almacén mínimo clave-valor que usan las funciones (en las pruebas se reemplaza por uno en memoria). */
export interface KV {
  getJSON<T>(key: string): Promise<T | null>;
  setJSON(key: string, value: unknown): Promise<void>;
  getText(key: string): Promise<string | null>;
  setText(key: string, value: string): Promise<void>;
  keys(prefix?: string): Promise<string[]>;
}

export interface Db {
  /** Un JSON por pedido (clave = número de pedido). */
  orders: KV;
  /** Las fotos de las velas, una por clave. */
  photos: KV;
}

function netlifyKV(name: string): KV {
  // consistency "strong": después de guardar un pago, el panel lo ve de inmediato.
  const store = getStore({ name, consistency: "strong" });
  return {
    async getJSON<T>(key: string) {
      return ((await store.get(key, { type: "json" })) as T | null) ?? null;
    },
    async setJSON(key, value) {
      await store.setJSON(key, value);
    },
    async getText(key) {
      return (await store.get(key, { type: "text" })) ?? null;
    },
    async setText(key, value) {
      await store.set(key, value);
    },
    async keys(prefix) {
      const { blobs } = await store.list(prefix ? { prefix } : undefined);
      return blobs.map((b) => b.key);
    },
  };
}

export function getDb(): Db {
  return { orders: netlifyKV("luz-pedidos"), photos: netlifyKV("luz-fotos") };
}
