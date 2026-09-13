import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import type { Product } from "../types/product";
import { SITE_CONFIG } from "../config/site.config";

export interface CartItem {
  cartId: string;
  product: Product;
  quantity: number;
  personalization: Record<string, string>;
}

interface CartContextValue {
  items: CartItem[];
  isOpen: boolean;
  lastAdded: CartItem | null;
  openCart: () => void;
  closeCart: () => void;
  addItem: (product: Product, quantity: number, personalization: Record<string, string>) => void;
  removeItem: (cartId: string) => void;
  updateQuantity: (cartId: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);
const STORAGE_KEY = "luz-de-detalles-cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as CartItem[]) : [];
    } catch {
      return [];
    }
  });
  const [isOpen, setIsOpen] = useState(false);
  const [lastAdded, setLastAdded] = useState<CartItem | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* almacenamiento no disponible, seguimos sin persistencia */
    }
  }, [items]);

  const addItem = useCallback(
    (product: Product, quantity: number, personalization: Record<string, string>) => {
      const cartItem: CartItem = {
        cartId: `${product.id}-${Date.now()}`,
        product,
        quantity,
        personalization,
      };
      setItems((prev) => [...prev, cartItem]);
      setLastAdded(cartItem);
      setIsOpen(true);
      window.setTimeout(() => setLastAdded(null), 2600);
    },
    []
  );

  const removeItem = useCallback((cartId: string) => {
    setItems((prev) => prev.filter((i) => i.cartId !== cartId));
  }, []);

  const updateQuantity = useCallback((cartId: string, quantity: number) => {
    setItems((prev) =>
      prev.map((i) => (i.cartId === cartId ? { ...i, quantity: Math.max(1, quantity) } : i))
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
    [items]
  );
  const total = subtotal + (items.length > 0 ? SITE_CONFIG.DOMICILIO_PRICE : 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  const value: CartContextValue = {
    items,
    isOpen,
    lastAdded,
    openCart: () => setIsOpen(true),
    closeCart: () => setIsOpen(false),
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    subtotal,
    total,
    itemCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de <CartProvider>");
  return ctx;
}
