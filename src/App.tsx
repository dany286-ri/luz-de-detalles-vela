import React, { useState } from "react";
import { CartProvider } from "./context/CartContext";
import type { Product } from "./types/product";

import Header from "./components/Header";
import Hero from "./components/Hero";
import FeaturedProducts from "./components/FeaturedProducts";
import Catalog from "./components/Catalog";
import PersonalizedBanner from "./components/PersonalizedBanner";
import EventsSection from "./components/EventsSection";
import HowItWorks from "./components/HowItWorks";
import TrustSection from "./components/TrustSection";
import Testimonials from "./components/Testimonials";
import FAQ from "./components/FAQ";
import InstagramGrid from "./components/InstagramGrid";
import Footer from "./components/Footer";
import Cart from "./components/Cart";
import ProductModal from "./components/ProductModal";
import AddedToast from "./components/AddedToast";
import WhatsAppFloatButton from "./components/WhatsAppFloatButton";

export default function App() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <CartProvider>
      <Header />
      <main>
        <Hero />
        <FeaturedProducts onOpen={setSelectedProduct} />
        <Catalog onOpen={setSelectedProduct} />
        <PersonalizedBanner />
        <EventsSection />
        <HowItWorks />
        <TrustSection />
        <Testimonials />
        <FAQ />
        <InstagramGrid />
      </main>
      <Footer />

      <Cart />
      <WhatsAppFloatButton />
      <AddedToast />
      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </CartProvider>
  );
}
