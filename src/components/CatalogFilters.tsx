import React from "react";
import { CATEGORY_LABELS } from "../data/products";

interface CatalogFiltersProps {
  active: string;
  onChange: (category: string) => void;
  categories: string[];
}

export default function CatalogFilters({ active, onChange, categories }: CatalogFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2.5 mb-9 md:mb-12">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`px-4 py-2 rounded-full text-sm tracking-wide border transition-colors duration-200 ${
            active === cat
              ? "bg-ink text-cream border-ink"
              : "bg-transparent text-charcoal/70 border-ink/15 hover:border-gold hover:text-gold"
          }`}
        >
          {CATEGORY_LABELS[cat] ?? cat}
        </button>
      ))}
    </div>
  );
}
