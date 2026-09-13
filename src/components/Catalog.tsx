import React, { useMemo, useState } from "react";
import { PRODUCTS, CATEGORY_LABELS } from "../data/products";
import type { Product } from "../types/product";
import ProductCard from "./ProductCard";
import CatalogFilters from "./CatalogFilters";
import Reveal from "./Reveal";

interface CatalogProps {
  onOpen: (product: Product) => void;
}

export default function Catalog({ onOpen }: CatalogProps) {
  const [active, setActive] = useState("todos");

  const categories = useMemo(() => {
    const set = new Set<string>();
    PRODUCTS.forEach((p) => p.category.forEach((c) => set.add(c)));
    return ["todos", ...Array.from(set)].filter((c) => CATEGORY_LABELS[c]);
  }, []);

  const filtered = active === "todos" ? PRODUCTS : PRODUCTS.filter((p) => p.category.includes(active as never));

  return (
    <section id="catalogo" className="py-16 md:py-24 bg-ivory/60">
      <div className="max-w-8xl mx-auto px-5 md:px-8">
        <Reveal className="max-w-xl mb-10 md:mb-12">
          <p className="uppercase tracking-[0.25em] text-xs text-gold font-medium mb-3">Catálogo completo</p>
          <h2 className="font-serif text-3xl md:text-4xl text-ink">Todos los detalles</h2>
        </Reveal>

        <CatalogFilters active={active} onChange={setActive} categories={categories} />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filtered.map((product, idx) => (
            <Reveal key={product.id} delay={(idx % 4) * 60}>
              <ProductCard product={product} onOpen={onOpen} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
