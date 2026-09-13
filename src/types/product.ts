export type ProductCategory =
  | "regalos"
  | "graduaciones"
  | "baby-shower"
  | "navidad"
  | "mascotas";

export type PersonalizationFieldType = "text" | "textarea" | "select" | "date" | "number";

export interface PersonalizationField {
  key: string;
  label: string;
  type: PersonalizationFieldType;
  placeholder?: string;
  options?: string[];
  required?: boolean;
}

export interface Product {
  id: string;
  name: string;
  /** Ej: "Pack x5 unidades" o "Unidad" */
  presentation: string;
  price: number;
  description: string;
  shortDescription: string;
  category: ProductCategory[];
  /** Imagen principal + galería (rutas ya importadas como módulos) */
  images: string[];
  /** Placeholder si aún no hay foto real del producto */
  isPlaceholderImage?: boolean;
  personalizable: boolean;
  personalizationFields?: PersonalizationField[];
  /** Nota corta que aparece bajo el precio, ej. condiciones de pedidos grandes */
  note?: string;
  featured?: boolean;
}
