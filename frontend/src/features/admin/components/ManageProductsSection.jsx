import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Search, 
  Edit3, 
  Trash2, 
  PlusCircle, 
  RefreshCw, 
  Check, 
  X, 
  AlertTriangle,
  ExternalLink,
  Layers,
  Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { productsApi } from '../../../services';

export default function ManageProductsSection({ onNavigateAdd }) {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [actionMessage, setActionMessage] = useState({ text: '', type: 'success' });

  // Quick Edit Modal State
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', price: '', stock: '', category: '' });
  const [updating, setUpdating] = useState(false);

  // Delete Confirm State
  const [deletingId, setDeletingId] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await productsApi.getAll({ limit: 50 });
      if (res.success && Array.isArray(res.data)) {
        setProducts(res.data);
      }
    } catch (err) {
      console.warn('Could not load products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openEditModal = (prod) => {
    setEditingProduct(prod);
    setEditForm({
      name: prod.name || '',
      price: prod.price || '',
      stock: prod.stock || 50,
      category: prod.category || 'Men Fashion',
    });
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;

    setUpdating(true);
    try {
      const id = editingProduct._id || editingProduct.id;
      const res = await productsApi.update(id, {
        name: editForm.name,
        price: Number(editForm.price),
        stock: Number(editForm.stock),
        category: editForm.category,
      });

      if (res.success || res.data) {
        setActionMessage({ text: `Product "${editForm.name}" updated successfully!`, type: 'success' });
        setEditingProduct(null);
        fetchProducts();
      }
    } catch (err) {
      setActionMessage({ text: err.message || 'Failed to update product.', type: 'error' });
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteProduct = async (id, name) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${name}" from the store catalog?`)) {
      return;
    }

    setDeletingId(id);
    try {
      await productsApi.delete(id);
      setActionMessage({ text: `Product "${name}" deleted from catalog.`, type: 'success' });
      setProducts((prev) => prev.filter((p) => (p._id || p.id) !== id));
    } catch (err) {
      setActionMessage({ text: err.message || 'Failed to delete product.', type: 'error' });
    } finally {
      setDeletingId(null);
    }
  };

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesSearch = 
      p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;

    return matchesSearch && matchesCat;
  });

  const categories = ['All', ...new Set(products.map((p) => p.category).filter(Boolean))];

  return (
    <div className="space-y-6 animate-fade-in font-['Outfit',sans-serif]">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-200 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-orange-500 text-white">
              Inventory Vault
            </span>
            <span className="text-xs text-neutral-500 font-semibold">
              Live MongoDB Catalog
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
            Manage Catalog Drops
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            Audit inventory levels, modify retail pricing, or retire capsule drops.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchProducts}
            disabled={loading}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-neutral-100 border border-neutral-200 text-xs font-semibold text-neutral-700 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-orange-500' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={onNavigateAdd}
            className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-all shadow-md shadow-orange-500/20 flex items-center gap-1.5 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Drop</span>
          </button>
        </div>
      </div>

      {/* Action Notification Alert */}
      {actionMessage.text && (
        <div className={`p-4 rounded-2xl text-xs flex items-center justify-between animate-fade-in ${
          actionMessage.type === 'success' ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          <span className="font-semibold">{actionMessage.text}</span>
          <button 
            onClick={() => setActionMessage({ text: '', type: 'success' })}
            className="p-1 hover:opacity-75 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-3xl bg-white border border-neutral-200 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search drops by title or category..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-neutral-50 border border-neutral-200 focus:border-orange-500 focus:bg-white text-xs text-neutral-900 outline-none transition-all"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-neutral-950 text-white shadow-xs'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div className="rounded-3xl bg-white border border-neutral-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-neutral-500">Querying product catalog from MongoDB Atlas...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center text-neutral-500 text-xs">
            <Package className="w-10 h-10 text-neutral-300 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-neutral-800">No Drops Match Criteria</h4>
            <p className="text-xs text-neutral-400 mt-1">Try modifying your search query or add a new drop.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 uppercase tracking-wider font-bold text-[10px]">
                <tr>
                  <th className="py-3.5 px-6">Product Item</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Stock</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 font-medium">
                {filteredProducts.map((p) => {
                  const id = p._id || p.id;
                  const isDeleting = deletingId === id;

                  return (
                    <tr key={id} className="hover:bg-neutral-50/60 transition-colors">
                      {/* Product Item Info */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3.5">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-12 h-12 rounded-xl object-cover ring-1 ring-neutral-200 shrink-0"
                          />
                          <div>
                            <div className="font-bold text-neutral-900 font-cute text-sm hover:text-orange-600 transition-colors">
                              {p.name}
                            </div>
                            <div className="text-[11px] text-neutral-400 mt-0.5 flex items-center gap-2">
                              <span>Color: {p.color || 'Default'}</span>
                              <span>•</span>
                              <span className="font-mono">ID: {String(id).slice(-6)}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-4 px-4 text-neutral-700 font-semibold">
                        {p.category}
                      </td>

                      {/* Price */}
                      <td className="py-4 px-4">
                        <span className="font-bold text-neutral-900 font-cute text-sm">
                          ₹{typeof p.price === 'number' ? p.price.toFixed(2) : p.price}
                        </span>
                        {p.originalPrice && (
                          <span className="block text-[10px] text-neutral-400 line-through font-mono">
                            ₹{Number(p.originalPrice).toFixed(2)}
                          </span>
                        )}
                      </td>

                      {/* Stock */}
                      <td className="py-4 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          (p.stock || 50) > 10 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {p.stock !== undefined ? p.stock : 50} units
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-neutral-800">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          <span>Active</span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => navigate(`/product/${p.slug || id}`)}
                            className="p-2 rounded-xl text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer"
                            title="View on Storefront"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => openEditModal(p)}
                            className="p-2 rounded-xl text-neutral-700 hover:text-orange-600 hover:bg-orange-50 transition-colors cursor-pointer"
                            title="Quick Edit Product"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleDeleteProduct(id, p.name)}
                            disabled={isDeleting}
                            className="p-2 rounded-xl text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-neutral-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-md w-full rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-neutral-200 animate-island-pop">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-200 mb-5">
              <div>
                <h3 className="text-base font-bold text-neutral-900 font-cute">
                  Edit Runway Drop
                </h3>
                <p className="text-xs text-neutral-500">
                  Update name, pricing, and stock count
                </p>
              </div>
              <button
                onClick={() => setEditingProduct(null)}
                className="p-1 rounded-xl text-neutral-400 hover:text-neutral-900 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 text-xs text-neutral-900 focus:border-orange-500 outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Price (₹ INR)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editForm.price}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, price: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 text-xs text-neutral-900 focus:border-orange-500 outline-none font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    value={editForm.stock}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, stock: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 text-xs text-neutral-900 focus:border-orange-500 outline-none font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Category
                </label>
                <input
                  type="text"
                  value={editForm.category}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 text-xs text-neutral-900 focus:border-orange-500 outline-none"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-neutral-600 hover:bg-neutral-100 cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={updating}
                  className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs transition-all shadow-md shadow-orange-500/20 cursor-pointer"
                >
                  {updating ? 'Saving Changes...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
