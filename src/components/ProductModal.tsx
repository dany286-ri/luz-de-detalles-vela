import React, { useEffect, useState } from "react";
import type { Product } from "../types/product";
import { formatCOP } from "../config/site.config";
import { useCart } from "../context/CartContext";
import PersonalizationForm from "./PersonalizationForm";
import { buildSingleProductMessage, whatsAppLinkFor } from "../utils/whatsapp";

interface ProductModalProps {
  product: Product;
  onClose: () => void;
}

export default function ProductModal({ product, onClose }: ProductModalProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [values, setValues] = useState<Record<string, string>>({});

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const hasImage = product.images.length > 0;
  const missingRequired = (product.personalizationFields ?? [])
    .filter((f) => f.required)
    .some((f) => !values[f.key]?.trim());

  const handleAdd = () => {
    addItem(product, quantity, values);
    onClose();
  };

  const handleWhatsApp = () => {
    const message = buildSingleProductMessage(product.name, product.presentation, quantity, product.price, values);
    window.open(whatsAppLinkFor(message), "_blank");
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-end md:items-center justify-center">
      <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-cream w-full md:max-w-3xl md:rounded-2xl rounded-t-2xl max-h-[92vh] overflow-y-auto shadow-soft grid md:grid-cols-2">
        <button
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-cream/90 flex items-center justify-center text-ink hover:bg-beige transition-colors"
        >
          ✕
        </button>

        <div className="bg-beige">
          {hasImage ? (
            <>
              <img
                src={product.images[activeImage]}
                alt={`${product.name} - ${product.presentation}, foto real del producto`}
                className="w-full aspect-square md:aspect-auto md:h-full object-cover"
              />
              {product.images.length > 1 && (
                <div className="flex gap-2 p-3 md:absolute md:bottom-3 md:left-3">
                  {product.images.map((img, idx) => (
                    <button
                      key={img}
                      onClick={() => setActiveImage(idx)}
                      className={`w-12 h-12 rounded-lg overflow-hidden border-2 ${
                        idx === activeImage ? "border-gold" : "border-transparent"
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="w-full aspect-square flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-beige to-sand text-cocoa">
              <span className="text-4xl inline-block animate-flicker" aria-hidden>
                🕯️
              </span>
              <span className="text-xs tracking-wide px-6 text-center">
                Foto real próximamente — este espacio se reemplazará por una fotografía del producto
              </span>
            </div>
          )}
        </div>

        <div className="p-6 md:p-8 flex flex-col">
          {product.isPlaceholderImage && (
            <span className="inline-block w-fit bg-beige text-ink/70 text-[10px] tracking-wide px-2.5 py-1 rounded-full mb-3">
              Imagen referencial
            </span>
          )}
          <h2 className="font-serif text-2xl md:text-3xl text-ink leading-tight">{product.name}</h2>
          <p className="text-sm text-charcoal/60 mt-1">{product.presentation}</p>
          <p className="text-charcoal/75 text-sm leading-relaxed mt-4">{product.description}</p>

          <div className="mt-5">
            <span className="font-serif text-2xl text-ink">{formatCOP(product.price)}</span>
            {product.note && <p className="text-xs text-charcoal/60 mt-1">{product.note}</p>}
          </div>

          <div className="flex items-center gap-3 mt-5">
            <span className="text-sm text-charcoal/70">Cantidad</span>
            <div className="flex items-center border border-ink/15 rounded-full">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-9 h-9 flex items-center justify-center text-ink hover:text-gold"
                aria-label="Disminuir cantidad"
              >
                −
              </button>
              <span className="w-8 text-center text-sm">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="w-9 h-9 flex items-center justify-center text-ink hover:text-gold"
                aria-label="Aumentar cantidad"
              >
                +
              </button>
            </div>
          </div>

          {product.personalizable && product.personalizationFields && (
            <div className="mt-6">
              <PersonalizationForm
                fields={product.personalizationFields}
                values={values}
                onChange={(key, value) => setValues((v) => ({ ...v, [key]: value }))}
              />
            </div>
          )}

          <div className="mt-auto pt-7 flex flex-col gap-3">
            <button
              onClick={handleAdd}
              disabled={missingRequired}
              className="w-full bg-ink text-cream py-3.5 rounded-full text-sm tracking-wide hover:bg-charcoal transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Agregar al pedido · {formatCOP(product.price * quantity)}
            </button>
            <button
              onClick={handleWhatsApp}
              disabled={missingRequired}
              className="w-full border border-ink/15 text-ink py-3.5 rounded-full text-sm tracking-wide hover:border-gold hover:text-gold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Pedir directo por WhatsApp
            </button>
            {missingRequired && (
              <p className="text-xs text-charcoal/50 text-center">Completa los campos obligatorios (*) para continuar.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
