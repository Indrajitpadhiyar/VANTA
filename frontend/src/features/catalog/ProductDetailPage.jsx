import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { hoodieModelImg, hoodieFlatImg } from '../../assets';
import { RELATED_PRODUCTS, REVIEWS } from '../../data/products';
import { useUI } from '../../context';
import { productsApi } from '../../services';
import { ProductGallery, BuyBox, ReviewSection } from './components';

export default function ProductDetailPage({ product: propProduct }) {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { goHome, viewProduct, selectedProduct } = useUI();

  const [loading, setLoading] = useState(false);
  const [fetchedProduct, setFetchedProduct] = useState(null);

  // Determine initial product from props, location state, or context
  const directProduct = propProduct || location.state?.product || (selectedProduct && (selectedProduct.slug === id || selectedProduct._id === id || String(selectedProduct.id) === String(id)) ? selectedProduct : null);

  useEffect(() => {
    // If we have an id param from URL and no product in memory matching it, fetch from API
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
          console.warn('Could not fetch product by ID from backend:', err);
        })
        .finally(() => {
          if (isMounted) setLoading(false);
        });

      return () => {
        isMounted = false;
      };
    }
  }, [id, directProduct]);

  // Fallback defaults matching screenshot if no product is passed
  const currentProduct = directProduct || fetchedProduct || {
    id: 1,
    name: 'Loose Fit Hoodie',
    category: 'Men Fashion',
    price: 24.99,
    image: hoodieModelImg,
    secondaryImage: hoodieFlatImg,
    detailImage: hoodieModelImg,
    desc: 'Loose-fit sweatshirt hoodie in medium weight cotton-blend fabric with a generous, but not oversized silhouette. Jersey-lined, drawstring hood, dropped shoulders, long sleeves, and a kangaroo pocket. Wide ribbing at cuffs and hem. Soft, brushed inside.'
  };

  // Gallery images (main image + alternate angles)
  const gallery = currentProduct.gallery || [
    currentProduct.image || hoodieModelImg,
    currentProduct.secondaryImage || hoodieFlatImg,
    currentProduct.detailImage || currentProduct.image || hoodieModelImg,
  ];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id, propProduct]);

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
        <ReviewSection reviews={REVIEWS} />

        {/* 3. "You might also like" Section */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-950 font-cute tracking-tight">
              You might also like
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {RELATED_PRODUCTS.map((item) => (
              <div 
                key={item.id}
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
                  <span className="font-semibold text-neutral-700 ml-1">{item.rating}/5</span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2 mt-auto">
                  <span className="text-sm font-extrabold text-neutral-950 font-cute">
                    ${item.price}
                  </span>
                  {item.originalPrice && (
                    <span className="text-xs text-neutral-400 line-through font-cute">
                      ${item.originalPrice}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
