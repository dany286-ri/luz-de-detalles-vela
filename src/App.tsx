import React, { useState } from "react";
import { CartProvider } from "./context/CartContext";
import { OrderFlowProvider } from "./context/OrderFlowContext";
import type { Product, ProductCategory } from "./types/product";

import Header from "./components/Header";
import Hero from "./components/Hero";
import PersonalizedBanner from "./components/PersonalizedBanner";
import Occasions from "./components/Occasions";
import FeaturedProducts from "./components/FeaturedProducts";
import FeaturedSpotlight from "./components/FeaturedSpotlight";
import Catalog from "./components/Catalog";
import Gallery from "./components/Gallery";
import HowItWorks from "./components/HowItWorks";
import InfoBeforeOrder from "./components/InfoBeforeOrder";
import TrustSection from "./components/TrustSection";
import Testimonials from "./components/Testimonials";
import EventCTA from "./components/EventCTA";
import FAQ from "./components/FAQ";
import InstagramGrid from "./components/InstagramGrid";
import FinalCTA from "./components/FinalCTA";
import Footer from "./components/Footer";
import Cart from "./components/Cart";
import ProductModal from "./components/ProductModal";
import AddedToast from "./components/AddedToast";
import WhatsAppFloatButton from "./components/WhatsAppFloatButton";
import SedeModal from "./components/SedeModal";

export default function App() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("todos");

  const handleSelectOccasion = (category: ProductCategory) => setActiveCategory(category);

  return (
    <CartProvider>
      <OrderFlowProvider>
        <Header />
        <main>
          <Hero />
          <PersonalizedBanner />
          <Occasions onSelect={handleSelectOccasion} />
          <FeaturedProducts onOpen={setSelectedProduct} />
          <FeaturedSpotlight onOpen={setSelectedProduct} />
          <Catalog onOpen={setSelectedProduct} active={activeCategory} onChangeActive={setActiveCategory} />
          <Gallery />
          <HowItWorks />
          <InfoBeforeOrder />
          <TrustSection />
          <Testimonials />
          <EventCTA />
          <FAQ />
          <InstagramGrid />
          <FinalCTA />
        </main>
        <Footer />

        <Cart />
        <WhatsAppFloatButton />
        <AddedToast />
        <SedeModal />
        {selectedProduct && (
          <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
        )}
      </OrderFlowProvider>
    </CartProvider>
  );
}
