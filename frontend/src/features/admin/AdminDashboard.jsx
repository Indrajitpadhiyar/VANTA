import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Menu, ArrowLeft, ShieldCheck, ExternalLink, Bell } from 'lucide-react';
import AdminSidebar from './components/AdminSidebar';
import DashboardOverview from './components/DashboardOverview';
import AddProductSection from './components/AddProductSection';
import ManageProductsSection from './components/ManageProductsSection';
import ManageOrdersSection from './components/ManageOrdersSection';
import { useAuth } from '../../context';

export default function AdminDashboard() {
  const { section: urlSection } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();

  // Normalize active section from URL path or local state
  const getSectionFromPath = () => {
    const path = location.pathname;
    if (path.includes('add-product')) return 'add-product';
    if (path.includes('manage-products') || path.includes('products')) return 'manage-products';
    if (path.includes('manage-orders') || path.includes('orders')) return 'manage-orders';
    return 'dashboard';
  };

  const [activeSection, setActiveSection] = useState(urlSection || getSectionFromPath());
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    setActiveSection(urlSection || getSectionFromPath());
  }, [location.pathname, urlSection]);

  const handleSelectSection = (sectionId) => {
    setActiveSection(sectionId);
    navigate(`/admin/${sectionId}`);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-neutral-900 flex font-['Outfit',sans-serif] selection:bg-orange-500 selection:text-white">
      {/* 1. Admin Sidebar (Desktop Sticky / Mobile Drawer) */}
      <AdminSidebar
        activeSection={activeSection}
        onSelectSection={handleSelectSection}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* 2. Main Content Canvas */}
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0">
        {/* Top Operational Header */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-neutral-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMobileOpen(true)}
              className="p-2 rounded-xl text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 lg:hidden cursor-pointer"
              title="Open Sidebar Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb Info */}
            <div className="flex items-center gap-2 text-xs">
              <span className="font-bold text-neutral-400 uppercase tracking-wider font-cute">
                VANTA Studio
              </span>
              <span className="text-neutral-300">/</span>
              <span className="font-bold text-neutral-900 capitalize font-cute">
                {activeSection.replace('-', ' ')}
              </span>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-xs font-semibold text-neutral-700 transition-colors cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Storefront</span>
            </button>

            <div className="w-px h-4 bg-neutral-200" />

            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-xs font-bold text-neutral-800 hidden sm:inline">
                {user?.role === 'admin' ? 'SuperAdmin' : 'Studio Director'}
              </span>
            </div>
          </div>
        </header>

        {/* 3. Section Viewport (NO Dynamic Island) */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {activeSection === 'dashboard' && (
            <DashboardOverview onNavigateTab={handleSelectSection} />
          )}

          {activeSection === 'add-product' && (
            <AddProductSection onProductCreated={() => handleSelectSection('manage-products')} />
          )}

          {activeSection === 'manage-products' && (
            <ManageProductsSection onNavigateAdd={() => handleSelectSection('add-product')} />
          )}

          {activeSection === 'manage-orders' && (
            <ManageOrdersSection />
          )}
        </main>
      </div>
    </div>
  );
}
