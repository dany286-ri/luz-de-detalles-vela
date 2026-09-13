import React from "react";
import { PRODUCTS } from "../data/products";
import type { Product } from "../types/product";
import ProductCard from "./ProductCard";
import Reveal from "./Reveal";

interface FeaturedProductsProps {
  onOpen: (product: Product) => void;
}

export default function FeaturedProducts({ onOpen }: FeaturedProductsProps) {
  const featured = PRODUCTS.filter((p) => p.featured);

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-8xl mx-auto px-5 md:px-8">
        <Reveal className="max-w-xl mb-10 md:mb-14">
          <p className="uppercase tracking-[0.25em] text-xs text-gold font-medium mb-3">Lo más pedido</p>
          <h2 className="font-serif text-3xl md:text-4xl text-ink">Productos destacados</h2>
        </Reveal>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {featured.map((product, idx) => (
            <Reveal key={product.id} delay={idx * 70}>
              <ProductCard product={product} onOpen={onOpen} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
