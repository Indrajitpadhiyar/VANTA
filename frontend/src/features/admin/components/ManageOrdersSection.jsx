import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Truck, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  RefreshCw, 
  ChevronDown, 
  ChevronUp, 
  Package, 
  Download,
  AlertCircle,
  X
} from 'lucide-react';
import { ordersApi } from '../../../services';

const STATUS_OPTIONS = ['All', 'Placed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

export default function ManageOrdersSection() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [notification, setNotification] = useState({ text: '', type: 'success' });

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await ordersApi.getAllOrders();
      if (res.success && Array.isArray(res.data)) {
        setOrders(res.data);
      }
    } catch (err) {
      console.warn('Orders query note:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      const res = await ordersApi.updateOrderStatus(orderId, { orderStatus: newStatus });
      if (res.success || res.data) {
        setNotification({
          text: `Consignment #${String(orderId).slice(-6)} updated to status "${newStatus}".`,
          type: 'success',
        });
        // Optimistically update local order status
        setOrders((prev) =>
          prev.map((o) => ((o._id || o.id) === orderId ? { ...o, orderStatus: newStatus } : o))
        );
      }
    } catch (err) {
      setNotification({
        text: err.message || 'Failed to update order status.',
        type: 'error',
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const toggleExpand = (id) => {
    setExpandedOrderId((prev) => (prev === id ? null : id));
  };

  // Filtered orders
  const filteredOrders = orders.filter((ord) => {
    const matchesStatus = statusFilter === 'All' || ord.orderStatus === statusFilter;
    const search = searchQuery.toLowerCase();
    const matchesSearch =
      !search ||
      (ord.orderNumber && ord.orderNumber.toLowerCase().includes(search)) ||
      (ord._id && ord._id.toLowerCase().includes(search)) ||
      (ord.shippingAddress?.fullName && ord.shippingAddress.fullName.toLowerCase().includes(search)) ||
      (ord.user?.email && ord.user.email.toLowerCase().includes(search));

    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Shipped':
      case 'In Transit':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Processing':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Cancelled':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-neutral-100 text-neutral-700 border-neutral-200';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in font-['Outfit',sans-serif]">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-200 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-orange-500 text-white">
              Logistics Dispatch
            </span>
            <span className="text-xs text-neutral-500 font-semibold">
              Client Consignments
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
            Manage Client Orders
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            Track parcels, inspect shipping dossiers, and update fulfillment states.
          </p>
        </div>

        <button
          onClick={fetchOrders}
          disabled={loading}
          className="px-3.5 py-2 rounded-xl bg-white hover:bg-neutral-100 border border-neutral-200 text-xs font-semibold text-neutral-700 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-orange-500' : ''}`} />
          <span>Sync Consignments</span>
        </button>
      </div>

      {/* Notification Banner */}
      {notification.text && (
        <div className={`p-4 rounded-2xl text-xs flex items-center justify-between animate-fade-in ${
          notification.type === 'success' ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span className="font-semibold">{notification.text}</span>
          </div>
          <button 
            onClick={() => setNotification({ text: '', type: 'success' })}
            className="p-1 hover:opacity-75 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-3xl bg-white border border-neutral-200 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Order ID, Client, or Email..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-neutral-50 border border-neutral-200 focus:border-orange-500 focus:bg-white text-xs text-neutral-900 outline-none transition-all"
          />
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap items-center gap-1.5">
          {STATUS_OPTIONS.map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === st
                  ? 'bg-neutral-950 text-white shadow-xs'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List Container */}
      {loading ? (
        <div className="p-12 text-center rounded-3xl bg-white border border-neutral-200 shadow-xs">
          <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-neutral-500">Querying consignment orders...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white border border-neutral-200 text-neutral-500 text-xs shadow-xs">
          <ShoppingBag className="w-10 h-10 text-neutral-300 mx-auto mb-2" />
          <h4 className="text-sm font-bold text-neutral-800">No Consignments Found</h4>
          <p className="text-xs text-neutral-400 mt-1">
            {statusFilter !== 'All' ? `No orders in "${statusFilter}" status.` : 'Customer orders placed will be managed from this terminal.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const id = order._id || order.id;
            const isExpanded = expandedOrderId === id;
            const isUpdating = updatingId === id;
            const items = order.orderItems || order.items || [];
            const shipping = order.shippingAddress || {};

            return (
              <div
                key={id}
                className="rounded-3xl bg-white border border-neutral-200 shadow-sm overflow-hidden transition-all hover:border-neutral-300"
              >
                {/* Header Summary Row */}
                <div className="p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left: ID & Date */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-neutral-900 text-white flex items-center justify-center font-bold text-xs shrink-0 font-mono">
                      #{String(order.orderNumber || id).slice(-4).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2.5">
                        <span className="font-black text-sm text-neutral-900 tracking-wide font-mono">
                          {order.orderNumber || id}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusBadge(order.orderStatus || 'Placed')}`}>
                          {order.orderStatus || 'Placed'}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500 mt-0.5">
                        Client: <span className="font-semibold text-neutral-800">{shipping.fullName || order.user?.name || 'Verified Member'}</span>
                        {shipping.phone && ` • Tel: ${shipping.phone}`}
                        {` • Placed on ${new Date(order.createdAt || Date.now()).toLocaleDateString()}`}
                      </p>
                    </div>
                  </div>

                  {/* Middle / Right: Status Changer & Actions */}
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="text-right mr-2">
                      <span className="text-xs text-neutral-400 block font-semibold">Total Price</span>
                      <span className="text-base font-black text-neutral-900 font-cute">
                        ₹{(order.totalPrice || 0).toFixed(2)}
                      </span>
                    </div>

                    {/* Change Status Dropdown Selector */}
                    <div className="flex items-center gap-1.5 bg-neutral-50 p-1.5 rounded-2xl border border-neutral-200">
                      <span className="text-[10px] font-bold text-neutral-500 uppercase px-2">Set:</span>
                      {['Processing', 'Shipped', 'Delivered'].map((st) => (
                        <button
                          key={st}
                          disabled={isUpdating || order.orderStatus === st}
                          onClick={() => handleUpdateStatus(id, st)}
                          className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                            order.orderStatus === st
                              ? 'bg-neutral-900 text-white shadow-2xs'
                              : 'text-neutral-600 hover:bg-white hover:text-neutral-900'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>

                    {/* Expand Details Trigger */}
                    <button
                      onClick={() => toggleExpand(id)}
                      className="p-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors cursor-pointer flex items-center gap-1 text-xs font-semibold"
                      title="Inspect Consignment Line Items"
                    >
                      <span>{items.length} items</span>
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Line Items & Address Dossier */}
                {isExpanded && (
                  <div className="px-6 pb-6 pt-2 bg-neutral-50/80 border-t border-neutral-200 space-y-4 animate-fade-in">
                    {/* Shipping Address & Carrier Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-2xl bg-white border border-neutral-200 text-xs">
                      <div>
                        <span className="font-bold uppercase text-[10px] text-neutral-400 tracking-wider block mb-1">
                          Delivery Destination
                        </span>
                        <div className="font-semibold text-neutral-900">{shipping.fullName || 'Recipient'}</div>
                        <div className="text-neutral-600">{shipping.address || 'Standard Address'}</div>
                        <div className="text-neutral-600">
                          {shipping.city ? `${shipping.city}, ${shipping.postalCode || ''}` : 'Domestic Hub'} - {shipping.country || 'India'}
                        </div>
                      </div>

                      <div>
                        <span className="font-bold uppercase text-[10px] text-neutral-400 tracking-wider block mb-1">
                          Payment & Security Verification
                        </span>
                        <div className="text-neutral-800">
                          Method: <span className="font-bold">{order.paymentMethod || 'COD / Card'}</span>
                        </div>
                        <div className="text-neutral-800">
                          Payment State: <span className={`font-bold ${order.isPaid ? 'text-emerald-600' : 'text-amber-600'}`}>
                            {order.isPaid ? 'Paid' : 'Pending Clearance / Upon Delivery'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Order Line Items */}
                    <div className="space-y-2">
                      <span className="font-bold uppercase text-[10px] text-neutral-400 tracking-wider block">
                        Included Capsule Items ({items.length})
                      </span>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {items.map((item, idx) => (
                          <div
                            key={idx}
                            className="p-3 rounded-2xl bg-white border border-neutral-200 flex items-center justify-between"
                          >
                            <div className="flex items-center gap-3">
                              {item.image && (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-12 h-12 rounded-xl object-cover ring-1 ring-neutral-200 shrink-0"
                                />
                              )}
                              <div>
                                <h5 className="text-xs font-bold text-neutral-900 line-clamp-1">
                                  {item.name}
                                </h5>
                                <p className="text-[11px] text-neutral-500">
                                  Size: <span className="font-bold text-neutral-800">{item.size || 'M'}</span> • Qty: {item.quantity || item.qty || 1}
                                </p>
                              </div>
                            </div>
                            <span className="font-bold text-xs text-neutral-900 font-cute">
                              ₹{((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
