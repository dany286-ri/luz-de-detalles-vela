/** Foto que la persona sube para personalizar una vela (ya reducida y lista para enviar). */
export interface ItemPhoto {
  id: string;
  /** Imagen JPEG reducida, como data URL. */
  dataUrl: string;
  /** A qué vela va (ej. "Amor"). Opcional. */
  label: string;
  name: string;
}

const MAX_SIDE = 1000; // px del lado más largo
const JPEG_QUALITY = 0.75;
export const MAX_RAW_PHOTO_BYTES = 20 * 1024 * 1024; // límite de la foto original antes de reducirla
/** Tope del total de fotos de un pedido (el servidor admite 6 MB por envío). */
export const MAX_ORDER_PHOTO_BYTES = 4_200_000;

async function loadBitmap(file: File): Promise<{ source: CanvasImageSource; width: number; height: number; close: () => void }> {
  if (typeof createImageBitmap === "function") {
    try {
      const bmp = await createImageBitmap(file, { imageOrientation: "from-image" });
      return { source: bmp, width: bmp.width, height: bmp.height, close: () => bmp.close() };
    } catch {
      /* seguimos con <img> */
    }
  }
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error("decode"));
      el.src = url;
    });
    return { source: img, width: img.naturalWidth, height: img.naturalHeight, close: () => undefined };
  } finally {
    URL.revokeObjectURL(url);
  }
}

/** Reduce una foto del celular (a veces de 5-10 MB) a ~100-250 KB para poder enviarla con el pedido. */
export async function compressImage(file: File): Promise<string> {
  const bmp = await loadBitmap(file);
  try {
    const scale = Math.min(1, MAX_SIDE / Math.max(bmp.width, bmp.height));
    const w = Math.max(1, Math.round(bmp.width * scale));
    const h = Math.max(1, Math.round(bmp.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("canvas");
    ctx.fillStyle = "#ffffff"; // fondo blanco para PNG con transparencia
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(bmp.source, 0, 0, w, h);
    return canvas.toDataURL("image/jpeg", JPEG_QUALITY);
  } finally {
    bmp.close();
  }
}

export function dataUrlBytes(dataUrl: string): number {
  const comma = dataUrl.indexOf(",");
  return Math.floor(((dataUrl.length - comma - 1) * 3) / 4);
}

export function photosBytes(photos: ItemPhoto[]): number {
  return photos.reduce((sum, p) => sum + dataUrlBytes(p.dataUrl), 0);
}

export function newPhotoId(): string {
  return `ph-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}
