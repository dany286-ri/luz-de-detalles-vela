import { formatCOP, SITE_CONFIG } from "../config/site.config";
import type { CartItem } from "../context/CartContext";

const FIELD_LABELS: Record<string, string> = {
  nombre: "Nombre",
  colorGlitter: "Color",
  notas: "Notas",
  anio: "Año",
  mensaje: "Mensaje",
  fechaEvento: "Fecha del evento",
  nombreMascota: "Nombre de la mascota",
  foto: "Foto",
  fotoAdicional: "Foto en la vela",
};

/** Genera el texto del pedido para un solo producto (usado en la página de producto). */
export function buildSingleProductMessage(
  productName: string,
  presentation: string,
  quantity: number,
  price: number,
  personalization: Record<string, string>
): string {
  const lines: string[] = [];
  lines.push(`Hola, quiero pedir este detalle de ${SITE_CONFIG.BRAND_NAME}:`);
  lines.push("");
  lines.push(`Producto: ${productName}`);
  lines.push(`Presentación: ${presentation}`);
  lines.push(`Cantidad: ${quantity}`);
  lines.push(`Subtotal: ${formatCOP(price * quantity)}`);

  const persEntries = Object.entries(personalization).filter(([, v]) => v && v.trim() !== "");
  if (persEntries.length > 0) {
    lines.push("");
    lines.push("Personalización:");
    persEntries.forEach(([key, value]) => {
      lines.push(`- ${FIELD_LABELS[key] ?? key}: ${value}`);
    });
  }

  lines.push("");
  lines.push("Quedo atento(a), ¡gracias!");
  return lines.join("\n");
}

/** Genera el texto del pedido completo a partir del carrito. */
export function buildCartMessage(items: CartItem[], subtotal: number, domicilio: number, total: number): string {
  const lines: string[] = [];
  lines.push(`Hola, quiero realizar un pedido con ${SITE_CONFIG.BRAND_NAME}:`);

  items.forEach((item, idx) => {
    lines.push("");
    lines.push(`${idx + 1}. Producto: ${item.product.name}`);
    lines.push(`Presentación: ${item.product.presentation}`);
    lines.push(`Cantidad: ${item.quantity}`);
    lines.push(`Subtotal: ${formatCOP(item.product.price * item.quantity)}`);

    const persEntries = Object.entries(item.personalization).filter(([, v]) => v && v.trim() !== "");
    if (persEntries.length > 0) {
      lines.push("Personalización:");
      persEntries.forEach(([key, value]) => {
        lines.push(`  - ${FIELD_LABELS[key] ?? key}: ${value}`);
      });
    }
  });

  lines.push("");
  lines.push(`Subtotal productos: ${formatCOP(subtotal)}`);
  lines.push(`Domicilio: ${formatCOP(domicilio)}`);
  lines.push(`Total: ${formatCOP(total)}`);
  lines.push("");
  lines.push("Quedo atento(a) para confirmar el anticipo. ¡Gracias!");
  return lines.join("\n");
}

/** Mensaje genérico para cotizar un evento, un tema o solo saludar. */
export function buildQuoteMessage(topic: string): string {
  return `Hola, quiero cotizar un pedido para: ${topic}. ¿Me ayudas a armarlo?`;
}

export function buildGreetingMessage(): string {
  return `Hola, vi ${SITE_CONFIG.BRAND_NAME} y quiero más información.`;
}
