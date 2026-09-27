import React, { createContext, useContext, useState } from 'react';

const UIContext = createContext(null);

export function UIProvider({ children }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [draggingProduct, setDraggingProduct] = useState(null);
  const [showPreloader, setShowPreloader] = useState(true);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [activeView, setActiveView] = useState('home'); // 'home' | 'auth' | 'profile'
  const [activeProfileTab, setActiveProfileTab] = useState('orders'); // 'orders' | 'details' | 'addresses' | 'vip' | 'security'

  const openSearch = () => setIsSearchOpen(true);
  const closeSearch = () => setIsSearchOpen(false);

  const openAuth = (mode = 'login') => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };
  const closeAuth = () => setIsAuthOpen(false);

  const goToAuthPage = (mode = 'login') => {
    setAuthMode(mode);
    setActiveView('auth');
    setSelectedProduct(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToProfilePage = (tab = 'orders') => {
    setActiveProfileTab(tab);
    setActiveView('profile');
    setSelectedProduct(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const viewProduct = (product) => {
    setSelectedProduct(product);
    setActiveView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goHome = () => {
    setSelectedProduct(null);
    setActiveView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
      }}
    >
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
}
