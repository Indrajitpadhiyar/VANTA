import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { CartProvider, UIProvider, AuthProvider, ToastProvider, useUI } from "./context";
import {
  DynamicIslandNav,
  TopBrandHeader,
  Footer,
  CartDrawer,
  SearchModal,
  AuthModal,
  Preloader,
  ToastContainer,
} from "./components";
import {
  HeroSection,
  PhilosophyBanner,
  FeaturedDrops,
  ProductDetailPage,
  AuthPage,
  ProfileDetailsPage,
  AdminDashboard,
  NotFoundPage,
} from "./features";

function HomeView({ scrollToShop: shouldScroll = false }) {
  useEffect(() => {
    if (shouldScroll) {
      setTimeout(() => {
        const el = document.getElementById("shop");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [shouldScroll]);

  const handleExplore = () => {
    const el = document.getElementById("shop");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <HeroSection onExploreClick={handleExplore} />
      <FeaturedDrops />
      <PhilosophyBanner />
    </>
  );
}

function MainContent() {
  const location = useLocation();
  const { showPreloader, finishPreloader } = useUI();

  const isAuthRoute = location.pathname.startsWith("/auth");
  const isProfileRoute = location.pathname.startsWith("/profile");
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div className="min-h-screen bg-white text-neutral-900 selection:bg-orange-500 selection:text-white flex flex-col font-['Outfit',sans-serif] relative">
      {/* 0. Master Animated Preloader */}
      {showPreloader && <Preloader onComplete={finishPreloader} />}

      {/* 1. Global Interactive Navigation (Hidden on Auth, Profile, and Admin Views) */}
      {!isAuthRoute && !isProfileRoute && !isAdminRoute && (
        <>
          <DynamicIslandNav />
          <TopBrandHeader />
        </>
      )}

      {/* 2. React Router Master Viewport */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomeView />} />
          <Route path="/shop" element={<HomeView scrollToShop={true} />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/profile" element={<ProfileDetailsPage />} />
          <Route path="/profile/:tab" element={<ProfileDetailsPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/:section" element={<AdminDashboard />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      {/* 3. Global Footer (Hidden on Auth and Admin views) */}
      {!isAuthRoute && !isProfileRoute && !isAdminRoute && <Footer />}

      {/* 4. Global Modals, Drawers and Toast Notifications */}
      <SearchModal />
      <CartDrawer />
      <AuthModal />
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <UIProvider>
            <MainContent />
          </UIProvider>
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

