import React, { useRef, useState } from "react";
import { MAX_RAW_PHOTO_BYTES, compressImage, newPhotoId, type ItemPhoto } from "../utils/photos";

interface Props {
  value: ItemPhoto[];
  onChange: (photos: ItemPhoto[]) => void;
  max: number;
}

/**
 * Subida de fotos para personalizar las velas, con la palabra o vela a la que va cada una.
 * Las fotos se reducen en el navegador antes de guardarse.
 */
export default function PhotoUploader({ value, onChange, max }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const remaining = max - value.length;

  const handlePick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (inputRef.current) inputRef.current.value = "";
    if (files.length === 0) return;

    setError(null);
    setBusy(true);
    const added: ItemPhoto[] = [];
    let problem: string | null = null;

    for (const file of files.slice(0, remaining)) {
      if (!file.type.startsWith("image/")) {
        problem = "Solo se pueden subir imágenes (JPG, PNG...).";
        continue;
      }
      if (file.size > MAX_RAW_PHOTO_BYTES) {
        problem = "Una foto pesa demasiado (más de 20 MB). Elige otra.";
        continue;
      }
      try {
        added.push({ id: newPhotoId(), dataUrl: await compressImage(file), label: "", name: file.name });
      } catch {
        problem = "No pudimos leer una de las fotos. Prueba con otra (JPG o PNG).";
      }
    }
    if (files.length > remaining) problem = `Puedes subir máximo ${max} fotos.`;

    if (added.length > 0) onChange([...value, ...added]);
    setError(problem);
    setBusy(false);
  };

  const setLabel = (id: string, label: string) => onChange(value.map((p) => (p.id === id ? { ...p, label } : p)));
  const remove = (id: string) => onChange(value.filter((p) => p.id !== id));

  return (
    <div>
      <input ref={inputRef} type="file" accept="image/*" multiple onChange={handlePick} className="sr-only" id="photo-input" />

      {value.length > 0 && (
        <ul className="space-y-2.5 mb-3">
          {value.map((photo) => (
            <li key={photo.id} className="flex items-center gap-3 rounded-xl border border-ink/10 bg-ivory/60 p-2.5">
              <img src={photo.dataUrl} alt="" className="h-14 w-14 shrink-0 rounded-lg object-cover" />
              <input
                type="text"
                value={photo.label}
                maxLength={60}
                onChange={(e) => setLabel(photo.id, e.target.value)}
                placeholder="¿Para qué vela? Ej. Amor"
                className="min-w-0 flex-1 rounded-lg border border-ink/15 bg-cream px-3 py-2 text-sm text-ink placeholder:text-charcoal/40 focus:outline-none focus:border-gold"
              />
              <button
                type="button"
                onClick={() => remove(photo.id)}
                aria-label="Quitar foto"
                className="px-1 text-charcoal/50 hover:text-ink"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}

      {remaining > 0 && (
        <label
          htmlFor="photo-input"
          className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-ink/20 bg-cream px-4 py-4 text-sm text-ink transition-colors hover:border-gold focus-within:border-gold ${
            busy ? "opacity-60 pointer-events-none" : ""
          }`}
        >
          <span aria-hidden>📷</span>
          {busy ? "Preparando fotos..." : value.length === 0 ? "Subir fotos" : "Agregar más fotos"}
        </label>
      )}
      <p className="text-xs text-charcoal/50 mt-1.5">
        Hasta {max} {max === 1 ? "foto" : "fotos"}. Escribe junto a cada una la palabra o vela donde la quieres.
      </p>
      {error && (
        <p className="text-xs text-red-700/80 mt-1" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
