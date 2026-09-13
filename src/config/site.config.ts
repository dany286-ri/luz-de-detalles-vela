/**
 * CONFIGURACIÓN DEL SITIO
 * ------------------------------------------------------------------
 * Este es el ÚNICO lugar donde debes cambiar los datos del negocio.
 * No hay precios ni datos de contacto repetidos en otros archivos:
 * todo lo que ves en la página sale de aquí y de `src/data/products.ts`.
 *
 * WHATSAPP_NUMBER debe ir en formato internacional SIN "+" ni espacios,
 * por ejemplo Colombia: "573001234567".
 */

export const SITE_CONFIG = {
  BRAND_NAME: "Luz de Detalles",
  BRAND_TAGLINE: "Velas y detalles personalizados",
  WHATSAPP_NUMBER: "573102483613",
  INSTAGRAM_URL: "https://www.instagram.com/luzde.detalles/",
  EMAIL: "hola@luzdedetalles.com", // TODO: reemplazar por el correo real
  DOMICILIO_PRICE: 5000,
  CITY: "Tunja, Boyacá",
  CURRENCY_LOCALE: "es-CO",
};

export function formatCOP(value: number): string {
  const formatted = new Intl.NumberFormat(SITE_CONFIG.CURRENCY_LOCALE, {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);
  // Elimina el espacio que el navegador inserta entre "$" y el número (ej. "$ 8.000" -> "$8.000").
  return formatted.replace(/\s+/g, "");
}

/** Construye el link de WhatsApp con un mensaje pre-escrito. */
export function buildWhatsAppLink(message: string): string {
  const number = SITE_CONFIG.WHATSAPP_NUMBER.replace(/\D/g, "");
  const base = number ? `https://wa.me/${number}` : "https://wa.me/";
  return `${base}?text=${encodeURIComponent(message)}`;
}
