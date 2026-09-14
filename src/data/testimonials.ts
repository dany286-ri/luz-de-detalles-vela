export interface Testimonial {
  quote: string;
  author: string;
}

/**
 * Reseñas reales de clientas y clientes de Luz de Detalles.
 * No se inventan testimonios: este archivo empieza vacío a propósito.
 *
 * Para agregar una reseña real, solo añade un objeto aquí, por ejemplo:
 *   { quote: "Llegó justo a tiempo y quedó hermosa.", author: "Camila R." },
 *
 * El "author" puede ser el nombre completo, solo el nombre de pila,
 * o algo como "Cliente de Instagram" si prefieres no usar el nombre.
 * Los espacios que no tengan reseña real se llenan automáticamente
 * con un aviso honesto ("Espacio disponible para tu reseña").
 */
export const TESTIMONIALS: Testimonial[] = [];
