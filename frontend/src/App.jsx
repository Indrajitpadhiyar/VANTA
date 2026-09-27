import React from 'react';
import { CartProvider, UIProvider, useUI } from './context';
import { 
  DynamicIslandNav, 
  TopBrandHeader, 
  Footer, 
  CartDrawer, 
  SearchModal 
} from './components';
import { 
  HeroSection, 
  PhilosophyBanner, 
  FeaturedDrops, 
  ProductDetailPage 
} from './features';

function MainContent() {
  const { selectedProduct, goHome } = useUI();

  const scrollToShop = () => {
    if (selectedProduct) {
      goHome();
      setTimeout(() => {
        const el = document.getElementById('shop');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById('shop');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900 selection:bg-orange-500 selection:text-white flex flex-col font-['Outfit',sans-serif] relative">
      {/* 1. Global Interactive Navigation */}
      <DynamicIslandNav />
      <TopBrandHeader />

      {/* 2. Main Viewport Router */}
      <main className="flex-1">
        {selectedProduct ? (
          <ProductDetailPage product={selectedProduct} />
        ) : (
          <>
            <HeroSection onExploreClick={scrollToShop} />
            <FeaturedDrops />
            <PhilosophyBanner />
          </>
        )}
      </main>

      {/* 3. Global Footer */}
      <Footer />

      {/* 4. Global Modals and Drawers */}
      <SearchModal />
      <CartDrawer />
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <UIProvider>
        <MainContent />
      </UIProvider>
    </CartProvider>
  );
}
