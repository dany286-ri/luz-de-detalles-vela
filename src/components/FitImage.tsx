import React, { useCallback, useEffect, useRef, useState } from "react";

interface FitImageProps {
  src: string;
  alt: string;
  loading?: "lazy" | "eager";
  /** Clases del contenedor (define el tamaño: aspect-*, h-full, absolute inset-0, etc.). */
  className?: string;
  /** Clases extra para la foto en primer plano (por ejemplo, el zoom al pasar el mouse). */
  imgClassName?: string;
  /**
   * "auto": llena el recuadro (recortando un poco) si la foto es parecida al recuadro; si es muy distinta, la muestra completa.
   * "contain": muestra SIEMPRE la foto completa, sin recortar nada.
   */
  mode?: "auto" | "contain";
}

/**
 * Cuánto se permite recortar para llenar el recuadro; si se pasa, la foto se muestra completa.
 * A una foto ancha (horizontal) casi no se le recortan los lados, para no perder lo que sale en los bordes.
 */
const MAX_CROP_WIDE_PHOTO = 1.25;
const MAX_CROP_TALL_PHOTO = 1.5;

/**
 * Muestra las fotos bien en computador y en celular, sin importar si son verticales u horizontales.
 * Cuando no se llena el recuadro, el sobrante se rellena con la misma foto difuminada (sin barras vacías).
 */
export default function FitImage({ src, alt, loading, className = "", imgClassName = "", mode = "auto" }: FitImageProps) {
  const box = useRef<HTMLDivElement>(null);
  const img = useRef<HTMLImageElement>(null);
  const [cover, setCover] = useState(false);

  const measure = useCallback(() => {
    const b = box.current;
    const i = img.current;
    if (!b || !i || mode === "contain" || !i.naturalWidth || !b.clientHeight) {
      setCover(false);
      return;
    }
    const frame = b.clientWidth / b.clientHeight;
    const photo = i.naturalWidth / i.naturalHeight;
    const ratio = photo / frame;
    setCover(ratio >= 1 ? ratio <= MAX_CROP_WIDE_PHOTO : 1 / ratio <= MAX_CROP_TALL_PHOTO);
  }, [mode]);

  useEffect(() => {
    measure();
    const b = box.current;
    if (!b || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(measure);
    ro.observe(b);
    return () => ro.disconnect();
  }, [measure, src]);

  return (
    <div ref={box} className={`${/\b(absolute|fixed|sticky)\b/.test(className) ? "" : "relative"} overflow-hidden bg-beige ${className}`}>
      {!cover && (
        <img
          src={src}
          alt=""
          aria-hidden="true"
          loading={loading}
          className="absolute inset-0 h-full w-full scale-125 object-cover opacity-70 blur-2xl"
        />
      )}
      <img
        ref={img}
        src={src}
        alt={alt}
        loading={loading}
        onLoad={measure}
        className={`relative h-full w-full ${cover ? "object-cover" : "object-contain"} ${imgClassName}`}
      />
    </div>
  );
}
