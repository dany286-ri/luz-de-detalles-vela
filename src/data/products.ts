import type { Product, PersonalizationField } from "../types/product";

import velaDegrade from "../assets/images/vela-degrade.jpg";
import velaEscarchada from "../assets/images/vela-escarchada.jpg";
import velaGrandeX6 from "../assets/images/vela-grande-x6.jpg";
import cajaVelas from "../assets/images/caja-velas.jpg";
import cajaVelasDetalle from "../assets/images/caja-velas-detalle.jpg";
import grado from "../assets/images/grado.jpg";
import babyShower from "../assets/images/baby-shower.jpg";
import collage from "../assets/images/collage.jpg";
import esferaNavidena from "../assets/images/esfera-navidena.jpg";

const nombreYFrase: PersonalizationField[] = [
  { key: "nombre", label: "Nombre o palabra", type: "text", placeholder: "Ej: Gratitud, María...", required: true },
  { key: "colorGlitter", label: "Color de escarcha / degradé", type: "text", placeholder: "Ej: dorado, rosado..." },
  { key: "notas", label: "Información adicional", type: "textarea", placeholder: "Cuéntanos cualquier detalle extra" },
  {
    key: "fotoAdicional",
    label: "¿Quieres agregarle una foto a tu vela? (opcional, la envías por WhatsApp)",
    type: "select",
    options: ["No, sin foto", "Sí, quiero agregarle una foto"],
  },
];

const gradoFields: PersonalizationField[] = [
  { key: "nombre", label: "Nombre de quien se gradúa", type: "text", required: true },
  { key: "foto", label: "Foto para la vela", type: "text", placeholder: "La envías por WhatsApp al confirmar tu pedido", required: true },
  { key: "anio", label: "Año de grado", type: "text", placeholder: "2026" },
  { key: "mensaje", label: "Mensaje para la tarjeta", type: "textarea", placeholder: "Un mensaje corto y especial" },
  { key: "fechaEvento", label: "Fecha en que lo necesitas", type: "date" },
];

const babyShowerFields: PersonalizationField[] = [
  { key: "nombre", label: "Nombre del bebé", type: "text", required: true },
  { key: "mensaje", label: "Mensaje para la tarjeta", type: "textarea" },
  { key: "fechaEvento", label: "Fecha del baby shower", type: "date" },
  {
    key: "fotoAdicional",
    label: "¿Quieres agregarle una foto a tu vela? (opcional, la envías por WhatsApp)",
    type: "select",
    options: ["No, sin foto", "Sí, quiero agregarle una foto"],
  },
];

const mascotaFields: PersonalizationField[] = [
  { key: "nombreMascota", label: "Nombre de tu mascota", type: "text", required: true },
  { key: "foto", label: "Foto de tu mascota", type: "text", placeholder: "Nos la envías por WhatsApp al confirmar" },
];

export const PRODUCTS: Product[] = [
  {
    id: "vela-degrade",
    name: "Vela Degradé",
    presentation: "Pack x5 unidades",
    price: 8000,
    shortDescription: "Colores degradados, 12 cm, se personaliza con nombre o frase.",
    description:
      "Un pack de 5 velas de 12 cm con un suave efecto degradado de color. Cada vela se personaliza con una palabra o nombre distinto — perfectas para regalar en conjunto o repartir como detalle individual.",
    category: ["regalos"],
    images: [velaDegrade],
    personalizable: true,
    personalizationFields: nombreYFrase,
    featured: true,
  },
  {
    id: "vela-escarchada",
    name: "Vela Escarchada",
    presentation: "Pack x5 unidades",
    price: 12000,
    shortDescription: "Acabado escarchado, 12 cm, se personaliza.",
    description:
      "Pack de 5 velas de 12 cm con la punta escarchada — un acabado brillante y elegante. Se personalizan con el nombre, palabra o mensaje que quieras para cada una.",
    category: ["regalos"],
    images: [velaEscarchada],
    personalizable: true,
    personalizationFields: nombreYFrase,
    featured: true,
  },
  {
    id: "vela-grande-x6",
    name: "Vela Grande",
    presentation: "Pack x6 unidades",
    price: 18000,
    shortDescription: "16 cm de alto, se puede personalizar.",
    description:
      "Pack de 6 velas grandes de 16 cm de alto. Ideales para decorar o regalar en conjunto, con la opción de personalizar cada una con nombre, palabra o pequeña ilustración.",
    category: ["regalos", "mascotas"],
    images: [velaGrandeX6],
    personalizable: true,
    personalizationFields: nombreYFrase,
    featured: true,
  },
  {
    id: "vela-grande-x10",
    name: "Vela Grande",
    presentation: "Pack x10 unidades",
    price: 30000,
    shortDescription: "16 cm de alto, se puede personalizar.",
    description:
      "Pack de 10 velas grandes de 16 cm de alto, se puede personalizar cada una. Ideal para eventos, mesas de regalo o detalles por cantidad.",
    category: ["regalos", "navidad"],
    images: [collage],
    isPlaceholderImage: true,
    personalizable: true,
    personalizationFields: nombreYFrase,
  },
  {
    id: "caja-de-velas",
    name: "Caja de Velas",
    presentation: "Pack x10 unidades",
    price: 22000,
    shortDescription: "10 velas de 12 cm presentadas en caja.",
    description:
      "10 velas de 12 cm presentadas en una caja lista para regalar — no necesitas envolver nada más. Cada vela se personaliza con una palabra distinta, perfecta como detalle grupal o decorativo.",
    category: ["regalos", "navidad"],
    images: [cajaVelas, cajaVelasDetalle],
    personalizable: true,
    personalizationFields: nombreYFrase,
    featured: true,
  },
  {
    id: "vela-grado",
    name: "Vela de Grado + Tarjeta",
    presentation: "Unidad",
    price: 7500,
    shortDescription: "Con foto, nombre y año. Incluye tarjeta.",
    description:
      "Una vela de 16 cm personalizada con foto, nombre y año de grado, acompañada de una tarjeta con mensaje. El detalle perfecto para celebrar ese logro.",
    category: ["graduaciones"],
    images: [grado],
    personalizable: true,
    personalizationFields: gradoFields,
    featured: true,
  },
  {
    id: "vela-baby-shower",
    name: "Vela Baby Shower + Tarjeta",
    presentation: "Unidad",
    price: 7800,
    shortDescription: "Personalizada con el nombre del bebé. Incluye tarjeta.",
    description:
      "Una vela personalizada con el nombre del bebé y una tarjeta con mensaje — un recuerdo pequeño y significativo para acompañar el momento de la llegada.",
    category: ["baby-shower"],
    images: [babyShower],
    personalizable: true,
    personalizationFields: babyShowerFields,
  },
  {
    id: "vela-baby-shower-50",
    name: "Vela Baby Shower 50+",
    presentation: "Unidad (pedidos de 50 o más)",
    price: 7000,
    shortDescription: "Mismo detalle, precio especial para pedidos grandes.",
    description:
      "El mismo detalle de Baby Shower personalizado con el nombre del bebé, a precio especial cuando el pedido es de 50 unidades o más — ideal como recuerdo para todos los invitados.",
    category: ["baby-shower"],
    images: [babyShower],
    personalizable: true,
    personalizationFields: babyShowerFields,
    note: "Precio válido desde 50 unidades en el mismo pedido.",
  },
  {
    id: "esfera-navidena-mascota",
    name: "Esfera Navideña Personalizada para Mascota",
    presentation: "Unidad",
    price: 11000,
    shortDescription: "Con foto y nombre de tu mascota. Incluye listón.",
    description:
      "Una esfera navideña de acrílico transparente con la foto y el nombre de tu mascota — un recuerdo tierno para colgar en el árbol. Incluye listón para colgar.",
    category: ["navidad", "mascotas"],
    images: [esferaNavidena],
    personalizable: true,
    personalizationFields: mascotaFields,
    featured: true,
  },
];

export const CATEGORY_LABELS: Record<string, string> = {
  todos: "Todos",
  regalos: "Regalos",
  graduaciones: "Graduaciones",
  "baby-shower": "Baby Shower",
  navidad: "Navidad",
  mascotas: "Mascotas",
};
