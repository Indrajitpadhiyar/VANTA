import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, PackageOpen } from 'lucide-react';
import { useUI } from '../../context';
import { productsApi, reviewsApi } from '../../services';
import { ProductGallery, BuyBox, ReviewSection } from './components';

export default function ProductDetailPage({ product: propProduct }) {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { goHome, viewProduct, selectedProduct } = useUI();

  const [loading, setLoading] = useState(false);
  const [fetchedProduct, setFetchedProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);

  // Determine initial product from props, location state, or context
  const directProduct =
    propProduct ||
    location.state?.product ||
    (selectedProduct &&
    (selectedProduct.slug === id ||
      selectedProduct._id === id ||
      String(selectedProduct.id) === String(id))
      ? selectedProduct
      : null);

  // 1. Fetch current product from backend API if not in memory
  useEffect(() => {
    if (id && !directProduct) {
      let isMounted = true;
      setLoading(true);
      productsApi
        .getByIdOrSlug(id)
        .then((res) => {
          if (isMounted && res.success && res.data) {
            setFetchedProduct(res.data);
          }
        })
        .catch((err) => {
          console.warn('Could not fetch product from backend:', err);
        })
        .finally(() => {
          if (isMounted) setLoading(false);
        });

      return () => {
        isMounted = false;
      };
    }
  }, [id, directProduct]);

  const currentProduct = directProduct || fetchedProduct;
  const prodId = currentProduct?._id || currentProduct?.id;

  // 2. Fetch Related Products & Reviews from Database when currentProduct is available
  useEffect(() => {
    if (!prodId) return;
    let isMounted = true;

    // Fetch related products
    productsApi
      .getRelated(prodId, currentProduct.category)
      .then((res) => {
        if (isMounted && res?.data && Array.isArray(res.data)) {
          // Exclude current product if returned
          const filtered = res.data.filter((p) => (p._id || p.id) !== prodId);
          setRelatedProducts(filtered);
        }
      })
      .catch((err) => {
        console.warn('Could not fetch related products from database:', err);
      });

    // Fetch live product reviews
    reviewsApi
      .getByProduct(prodId)
      .then((res) => {
        if (isMounted && res?.data && Array.isArray(res.data)) {
          setReviews(res.data);
        }
      })
      .catch((err) => {
        console.warn('Could not fetch reviews from database:', err);
      });

    return () => {
      isMounted = false;
    };
  }, [prodId, currentProduct?.category]);

  // Gallery images (main image + alternate angles or empty fallback)
  const gallery = currentProduct?.gallery && currentProduct.gallery.length > 0
    ? currentProduct.gallery
    : currentProduct?.image
    ? [currentProduct.image]
    : [];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id, propProduct]);

  if (loading) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center pt-28 pb-20">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin mb-4" />
        <p className="text-neutral-500 text-sm font-cute">Loading product details...</p>
      </div>
    );
  }

  if (!currentProduct) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center pt-28 pb-20 text-center px-4">
        <PackageOpen className="w-12 h-12 text-neutral-300 mb-3" />
        <h2 className="text-xl font-bold text-neutral-900 font-cute mb-1">Product Not Found</h2>
        <p className="text-sm text-neutral-500 font-cute mb-6">
          The requested product may have been moved or removed from our catalog.
        </p>
        <button
          onClick={goHome}
          className="px-6 py-2.5 bg-neutral-950 text-white font-cute text-sm font-semibold rounded-full hover:bg-orange-500 transition-colors cursor-pointer"
        >
          Return to Storefront
        </button>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#fdfdfd] text-neutral-900 font-sans selection:bg-orange-500 selection:text-white pt-24 sm:pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs font-medium text-neutral-500 mb-8">
          <button 
            onClick={goHome}
            className="flex items-center gap-1.5 hover:text-neutral-950 transition-colors font-semibold group cursor-pointer font-cute"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
            Home
          </button>
          <span>•</span>
          <span className="text-neutral-900 font-semibold font-cute">Product details</span>
        </div>

        {/* 1. Main Product Showcase Grid (Left: Gallery, Right: Buy Box) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 mb-20">
          <div className="lg:col-span-6">
            <ProductGallery gallery={gallery} productName={currentProduct.name} />
          </div>
          <div className="lg:col-span-6">
            <BuyBox product={currentProduct} />
          </div>
        </div>

        {/* 2. Rating & Reviews Section */}
        <ReviewSection reviews={reviews} />

        {/* 3. "You might also like" Section */}
        {relatedProducts.length > 0 && (
          <div className="mb-16">
            <div className="text-center mb-10">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-950 font-cute tracking-tight">
                You might also like
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((item) => (
                <div 
                  key={item._id || item.id}
                  onClick={() => viewProduct(item)}
                  className="group relative bg-white rounded-3xl p-3 border border-neutral-100 shadow-sm hover:shadow-xl hover:border-orange-200 transition-all duration-300 cursor-pointer flex flex-col hover:-translate-y-1.5"
                >
                  {/* Image */}
                  <div className="relative aspect-square rounded-2xl overflow-hidden bg-neutral-100 mb-3">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500" 
                    />
                    {item.discount && (
                      <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-red-600 text-white text-[10px] font-extrabold tracking-wider font-cute">
                        {item.discount}
                      </span>
                    )}
                  </div>

                  {/* Details */}
                  <h3 className="text-sm font-bold text-neutral-900 line-clamp-1 mb-1 font-cute group-hover:text-orange-600 transition-colors">
                    {item.name}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center gap-1 text-xs text-neutral-500 mb-1.5 font-cute">
                    <div className="flex items-center text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-xs">★</span>
                      ))}
                    </div>
                    <span className="font-semibold text-neutral-700 ml-1">{item.rating || 5}/5</span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-2 mt-auto">
                    <span className="text-sm font-extrabold text-neutral-950 font-cute">
                      ₹{item.price}
                    </span>
                    {item.originalPrice && (
                      <span className="text-xs text-neutral-400 line-through font-cute">
                        ₹{item.originalPrice}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
