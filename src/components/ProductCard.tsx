import React from "react";
import type { Product } from "../types/product";
import { formatCOP } from "../config/site.config";

interface ProductCardProps {
  product: Product;
  onOpen: (product: Product) => void;
}

export default function ProductCard({ product, onOpen }: ProductCardProps) {
  const hasImage = product.images.length > 0;

  return (
    <button
      onClick={() => onOpen(product)}
      className="group text-left bg-ivory rounded-2xl overflow-hidden border border-ink/5 hover:shadow-card transition-shadow duration-300 flex flex-col"
    >
      <div className="relative aspect-[4/5] bg-beige overflow-hidden">
        {hasImage ? (
          <img
            src={product.images[0]}
            alt={`${product.name} - ${product.presentation}, foto real del producto`}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-beige to-sand text-cocoa">
            <span className="text-3xl inline-block animate-flicker" aria-hidden>
              🕯️
            </span>
            <span className="text-xs tracking-wide px-4 text-center">Foto próximamente</span>
          </div>
        )}
        {product.isPlaceholderImage && hasImage && (
          <span className="absolute top-3 left-3 bg-cream/90 text-ink text-[10px] tracking-wide px-2.5 py-1 rounded-full">
            Imagen referencial
          </span>
        )}
        {product.featured && (
          <span className="absolute top-3 right-3 bg-ink/85 text-cream text-[10px] tracking-widest uppercase px-2.5 py-1 rounded-full">
            Popular
          </span>
        )}
      </div>

      <div className="p-4 md:p-5 flex flex-col flex-1">
        <h3 className="font-serif text-lg text-ink leading-tight">{product.name}</h3>
        <p className="text-xs text-charcoal/60 mt-0.5">{product.presentation}</p>
        <p className="text-sm text-charcoal/70 mt-2 leading-snug flex-1">{product.shortDescription}</p>
        <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-ink/5">
          <span className="font-serif text-lg sm:text-xl text-ink whitespace-nowrap">{formatCOP(product.price)}</span>
          <span
            className="shrink-0 w-7 h-7 rounded-full border border-ink/15 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-cream group-hover:border-gold transition-colors"
            aria-hidden
          >
            →
          </span>
        </div>
      </div>
    </button>
  );
}
