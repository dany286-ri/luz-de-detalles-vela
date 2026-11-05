/**
 * PRECIOS Y NOMBRES OFICIALES DE LOS PRODUCTOS
 * ------------------------------------------------------------------
 * Esta es la ÚNICA fuente de nombre, presentación y precio de cada producto.
 * La usan tanto la página (src/data/products.ts) como el servidor de pedidos
 * (netlify/functions), que recalcula los valores y NO confía en los precios que
 * envía el navegador. Para cambiar un precio, cámbialo solo aquí.
 *
 * Este archivo no importa imágenes a propósito, para que el servidor pueda leerlo.
 */
export interface CatalogEntry {
  name: string;
  presentation: string;
  price: number;
  /** Cantidad mínima en el mismo pedido, si el precio solo aplica desde cierta cantidad. */
  minQuantity?: number;
}

export const CATALOG = {
  "vela-degrade": { name: "Vela Degradé", presentation: "Pack x5 unidades", price: 8000 },
  "vela-escarchada": { name: "Vela Escarchada", presentation: "Pack x5 unidades", price: 12000 },
  "vela-grande-x6": { name: "Vela Grande", presentation: "Pack x6 unidades", price: 18000 },
  "vela-grande-x10": { name: "Vela Grande", presentation: "Pack x10 unidades", price: 30000 },
  "caja-de-velas": { name: "Caja de Velas", presentation: "Pack x10 unidades", price: 22000 },
  "vela-grado": { name: "Vela de Grado + Tarjeta", presentation: "Unidad", price: 7500 },
  "vela-baby-shower": { name: "Vela Baby Shower + Tarjeta", presentation: "Unidad", price: 7800 },
  "vela-baby-shower-50": {
    name: "Vela Baby Shower 50+",
    presentation: "Unidad (pedidos de 50 o más)",
    price: 7000,
    minQuantity: 50,
  },
  "esfera-navidena-mascota": {
    name: "Esfera Navideña Personalizada para Mascota",
    presentation: "Unidad",
    price: 11000,
  },
} as const satisfies Record<string, CatalogEntry>;

export type ProductId = keyof typeof CATALOG;

export function getCatalogEntry(id: string): CatalogEntry | undefined {
  return (CATALOG as Record<string, CatalogEntry>)[id];
}
