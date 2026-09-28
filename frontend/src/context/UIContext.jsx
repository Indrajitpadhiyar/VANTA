import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const UIContext = createContext(null);

export function UIProvider({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [draggingProduct, setDraggingProduct] = useState(null);
  const [showPreloader, setShowPreloader] = useState(true);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login"); // 'login' | 'register'
  const [activeView, setActiveView] = useState("home"); // 'home' | 'auth' | 'profile'
  const [activeProfileTab, setActiveProfileTab] = useState("orders"); // 'orders' | 'details' | 'addresses' | 'vip' | 'security' | 'cart' | 'wallet'

  // Synchronize activeView and activeProfileTab when browser location changes (e.g. Back/Forward)
  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith("/admin")) {
      setActiveView("admin");
    } else if (path.startsWith("/profile")) {
      setActiveView("profile");
      const parts = path.split("/").filter(Boolean);
      if (parts[1]) {
        setActiveProfileTab(parts[1]);
      }
    } else if (path.startsWith("/auth")) {
      setActiveView("auth");
    } else {
      setActiveView("home");
      if (!path.startsWith("/product")) {
        setSelectedProduct(null);
      }
    }
  }, [location.pathname]);

  const openSearch = () => setIsSearchOpen(true);
  const closeSearch = () => setIsSearchOpen(false);

  const openAuth = (mode = "login") => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };
  const closeAuth = () => setIsAuthOpen(false);

  const goToAuthPage = (mode = "login") => {
    setAuthMode(mode);
    setActiveView("auth");
    setSelectedProduct(null);
    navigate("/auth");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goToProfilePage = (tab = "orders") => {
    setActiveProfileTab(tab);
    setActiveView("profile");
    setSelectedProduct(null);
    navigate(tab ? `/profile/${tab}` : "/profile");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goToAdminPage = () => {
    setActiveView("admin");
    setSelectedProduct(null);
    navigate("/admin");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const viewProduct = (product) => {
    setSelectedProduct(product);
    setActiveView("home");
    const id = product?.slug || product?._id || product?.id;
    if (id) {
      navigate(`/product/${id}`, { state: { product } });
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goHome = () => {
    setSelectedProduct(null);
    setActiveView("home");
    navigate("/");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const replayPreloader = () => {
    setShowPreloader(true);
  };

  const finishPreloader = () => {
    setShowPreloader(false);
  };

  return (
    <UIContext.Provider
      value={{
        isSearchOpen,
        setIsSearchOpen,
        openSearch,
        closeSearch,
        selectedProduct,
        setSelectedProduct,
        viewProduct,
        goHome,
        draggingProduct,
        setDraggingProduct,
        showPreloader,
        replayPreloader,
        finishPreloader,
        isAuthOpen,
        setIsAuthOpen,
        authMode,
        setAuthMode,
        openAuth,
        closeAuth,
        activeView,
        setActiveView,
        goToAuthPage,
        activeProfileTab,
        setActiveProfileTab,
        goToProfilePage,
        goToAdminPage,
      }}
    >
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error("useUI must be used within a UIProvider");
  }
  return context;
}
