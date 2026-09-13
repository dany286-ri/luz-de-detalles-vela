import React from "react";
import type { PersonalizationField } from "../types/product";

interface PersonalizationFormProps {
  fields: PersonalizationField[];
  values: Record<string, string>;
  onChange: (key: string, value: string) => void;
}

/** Renderiza dinámicamente los campos de personalización de un producto. */
export default function PersonalizationForm({ fields, values, onChange }: PersonalizationFormProps) {
  if (!fields || fields.length === 0) return null;

  return (
    <div className="space-y-4">
      <p className="text-sm font-medium text-ink tracking-wide">Personaliza tu detalle</p>
      {fields.map((field) => {
        const value = values[field.key] ?? "";
        const commonClasses =
          "w-full rounded-lg border border-ink/15 bg-cream px-3.5 py-2.5 text-sm text-ink placeholder:text-charcoal/40 focus:outline-none focus:border-gold transition-colors";

        return (
          <div key={field.key}>
            <label className="block text-xs text-charcoal/70 mb-1.5">
              {field.label}
              {field.required && <span className="text-gold"> *</span>}
            </label>
            {field.type === "textarea" ? (
              <textarea
                className={`${commonClasses} resize-none`}
                rows={2}
                placeholder={field.placeholder}
                value={value}
                onChange={(e) => onChange(field.key, e.target.value)}
              />
            ) : field.type === "select" ? (
              <select
                className={commonClasses}
                value={value}
                onChange={(e) => onChange(field.key, e.target.value)}
              >
                <option value="">Selecciona una opción</option>
                {field.options?.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={field.type === "date" ? "date" : field.type === "number" ? "number" : "text"}
                className={commonClasses}
                placeholder={field.placeholder}
                value={value}
                onChange={(e) => onChange(field.key, e.target.value)}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
