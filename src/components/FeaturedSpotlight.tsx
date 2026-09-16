import React from "react";
import Reveal from "./Reveal";
import { PRODUCTS } from "../data/products";
import { formatCOP } from "../config/site.config";
import type { Product } from "../types/product";
import cajaVelasDetalle from "../assets/images/caja-velas-detalle.jpg";

interface FeaturedSpotlightProps {
  onOpen: (product: Product) => void;
}

/** Sección editorial: un solo producto mostrado en grande, con foto protagonista. */
export default function FeaturedSpotlight({ onOpen }: FeaturedSpotlightProps) {
  const product = PRODUCTS.find((p) => p.id === "caja-de-velas");
  if (!product) return null;

  return (
    <section className="py-16 md:py-24 bg-ivory/60">
      <div className="max-w-8xl mx-auto px-5 md:px-8 grid md:grid-cols-2 gap-10 md:gap-16 items-center">
        <Reveal>
          <div className="relative mx-auto max-w-sm md:max-w-none">
            <div className="absolute -inset-4 md:-inset-6 bg-gold/10 rounded-[2rem] -z-10" />
            <img
              src={cajaVelasDetalle}
              alt="Caja de velas de Luz de Detalles, foto real del producto"
              className="w-full aspect-[4/5] object-cover rounded-[1.75rem] shadow-soft"
              loading="lazy"
            />
          </div>
        </Reveal>

        <Reveal delay={100}>
          <p className="uppercase tracking-[0.25em] text-xs text-gold font-medium mb-3">El detalle que más encanta</p>
          <h2 className="font-serif text-3xl md:text-4xl text-ink mb-4 leading-tight">{product.name}</h2>
          <p className="text-charcoal/75 text-base leading-relaxed mb-6 max-w-md">{product.description}</p>
          <div className="flex items-center gap-3 mb-8">
            <span className="font-serif text-2xl md:text-3xl text-ink">
              {product.presentation.replace("unidades", "").replace("Unidad", "").trim() || product.presentation} ·{" "}
              {formatCOP(product.price)}
            </span>
          </div>
          <button
            onClick={() => onOpen(product)}
            className="inline-flex items-center justify-center bg-ink text-cream px-7 py-3.5 rounded-full text-sm tracking-wide hover:bg-charcoal transition-colors duration-200"
          >
            Quiero este detalle
          </button>
        </Reveal>
      </div>
    </section>
  );
}
