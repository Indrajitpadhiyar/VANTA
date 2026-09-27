import React from 'react';
import { CartProvider, UIProvider, AuthProvider, useUI } from './context';
import { 
  DynamicIslandNav, 
  TopBrandHeader, 
  Footer, 
  CartDrawer, 
  SearchModal,
  AuthModal,
  Preloader 
} from './components';
import { 
  HeroSection, 
  PhilosophyBanner, 
  FeaturedDrops, 
  ProductDetailPage,
  AuthPage,
  ProfileDetailsPage 
} from './features';

function MainContent() {
  const { selectedProduct, goHome, showPreloader, finishPreloader, activeView } = useUI();

  const scrollToShop = () => {
    if (selectedProduct || activeView !== 'home') {
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
      {/* 0. Master Animated Preloader */}
      {showPreloader && <Preloader onComplete={finishPreloader} />}

      {/* 1. Global Interactive Navigation */}
      {activeView === 'home' && (
        <>
          <DynamicIslandNav />
          <TopBrandHeader />
        </>
      )}

      {/* 2. Main Viewport Router */}
      <main className="flex-1">
        {activeView === 'auth' ? (
          <AuthPage />
        ) : activeView === 'profile' ? (
          <ProfileDetailsPage />
        ) : selectedProduct ? (
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
      {activeView === 'home' && <Footer />}

      {/* 4. Global Modals and Drawers */}
      <SearchModal />
      <CartDrawer />
      <AuthModal />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <UIProvider>
          <MainContent />
        </UIProvider>
      </CartProvider>
    </AuthProvider>
  );
}
