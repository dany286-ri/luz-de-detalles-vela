export type ProductCategory =
  | "regalos"
  | "graduaciones"
  | "baby-shower"
  | "navidad"
  | "mascotas";

export type PersonalizationFieldType = "text" | "textarea" | "select" | "date" | "number" | "photos";

export interface PersonalizationField {
  key: string;
  label: string;
  type: PersonalizationFieldType;
  placeholder?: string;
  options?: string[];
  required?: boolean;
  /** Solo para type "photos": máximo de fotos que se pueden subir. */
  maxPhotos?: number;
}

export interface Product {
  id: string;
  name: string;
  /** Ej: "Pack x5 unidades" o "Unidad" */
  presentation: string;
  price: number;
  description: string;
  shortDescription: string;
  /** Frase emocional corta para mostrar en vez de (o encima de) la descripción corta, ej. "🎓 Un logro que merece quedarse para siempre" */
  emotionalHook?: string;
  category: ProductCategory[];
  /** Imagen principal + galería (rutas ya importadas como módulos) */
  images: string[];
  /** Placeholder si aún no hay foto real del producto */
  isPlaceholderImage?: boolean;
  personalizable: boolean;
  personalizationFields?: PersonalizationField[];
  /** Nota corta que aparece bajo el precio, ej. condiciones de pedidos grandes */
  note?: string;
  /** Cantidad mínima en el mismo pedido para que aplique este precio (ver src/data/catalog.ts). */
  minQuantity?: number;
  featured?: boolean;
}
