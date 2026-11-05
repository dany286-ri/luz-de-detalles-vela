/**
 * CONFIGURACIÓN DEL SITIO
 * ------------------------------------------------------------------
 * Este es el ÚNICO lugar donde debes cambiar los datos del negocio.
 * No hay precios ni datos de contacto repetidos en otros archivos:
 * todo lo que ves en la página sale de aquí y de `src/data/products.ts`.
 *
 * Los números de WhatsApp van en formato internacional SIN "+" ni espacios,
 * por ejemplo Colombia: "573001234567".
 */

export const SITE_CONFIG = {
  BRAND_NAME: "Luz de Detalles",
  BRAND_TAGLINE: "Detalles que iluminan momentos",
  // Número general de respaldo (se usa solo si algo no pasa por el flujo de sede).
  WHATSAPP_NUMBER: "573102483613",
  INSTAGRAM_URL: "https://www.instagram.com/luzde.detalles/",
  EMAIL: "luzdedetalles@gmail.com",
  DOMICILIO_PRICE: 5000,
  /** Porcentaje que se paga por adelantado para confirmar un pedido personalizado. */
  DEPOSIT_PERCENT: 50,
  /** Días mínimos de anticipación para pedidos (se usa en la fecha mínima de entrega). */
  MIN_LEAD_DAYS: 2,
  CITY: "Tunja, Boyacá",
  CURRENCY_LOCALE: "es-CO",
};

/**
 * Sedes de la tienda. Cada pedido por WhatsApp se dirige al número de la sede
 * que la persona elija (ver OrderFlowContext + SedeModal).
 */
export const LOCATIONS = {
  tunja: {
    key: "tunja" as const,
    label: "Tunja",
    whatsapp: "573102483613",
    /** Nequi de la sede Tunja (solo dígitos). Se muestra ÚNICAMENTE a quien eligió esta sede. */
    nequi: "3102483613",
  },
  bogota: {
    key: "bogota" as const,
    label: "Bogotá",
    whatsapp: "573132799431",
    /** Nequi de la sede Bogotá (solo dígitos). Se muestra ÚNICAMENTE a quien eligió esta sede. */
    nequi: "3132799431",
  },
};

export type LocationKey = keyof typeof LOCATIONS;

/** Métodos de pago realmente configurados hoy. No agregar métodos aquí sin confirmarlos primero. */
export const PAYMENT_METHODS = ["Transferencia Nequi", "Transferencia Bancolombia", "Llave Bre-B"];

/** "3102483613" -> "310 248 3613" (más fácil de leer). */
export function formatPhone(digits: string): string {
  const d = digits.replace(/\D/g, "");
  if (d.length !== 10) return d;
  return `${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6)}`;
}

export function formatCOP(value: number): string {
  const formatted = new Intl.NumberFormat(SITE_CONFIG.CURRENCY_LOCALE, {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);
  // Elimina el espacio que el navegador inserta entre "$" y el número (ej. "$ 8.000" -> "$8.000").
  return formatted.replace(/\s+/g, "");
}

/** Construye el link de WhatsApp de una sede específica con un mensaje pre-escrito. */
export function buildWhatsAppLinkForSede(sede: LocationKey, message: string): string {
  const number = LOCATIONS[sede].whatsapp.replace(/\D/g, "");
  const fullMessage = `${message}\n\nSede: ${LOCATIONS[sede].label}`;
  const base = number ? `https://wa.me/${number}` : "https://wa.me/";
  return `${base}?text=${encodeURIComponent(fullMessage)}`;
}

/** Construye el link de WhatsApp con el número general (uso interno / respaldo). */
export function buildWhatsAppLink(message: string): string {
  const number = SITE_CONFIG.WHATSAPP_NUMBER.replace(/\D/g, "");
  const base = number ? `https://wa.me/${number}` : "https://wa.me/";
  return `${base}?text=${encodeURIComponent(message)}`;
}
