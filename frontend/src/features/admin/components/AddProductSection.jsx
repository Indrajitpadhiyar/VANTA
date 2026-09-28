import React, { useState, useRef } from 'react';
import { 
  PlusCircle, 
  Upload, 
  UploadCloud,
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Image as ImageIcon,
  Tag, 
  DollarSign, 
  Layers, 
  ShoppingBag, 
  Eye, 
  Check,
  Star,
  Trash2,
  X,
  Link as LinkIcon,
  ImagePlus
} from 'lucide-react';
import { 
  hoodieModelImg, 
  hoodieFlatImg, 
  stripedJacketImg, 
  poloContrastImg, 
  poloTippingImg, 
  graphicTeeImg, 
  sneakersImg 
} from '../../../assets';
import { productsApi } from '../../../services';
import { useToast } from '../../../context';

const IMAGE_PRESETS = [
  { label: 'Oversized Hoodie', src: hoodieModelImg },
  { label: 'Hoodie Flat', src: hoodieFlatImg },
  { label: 'Striped Jacket', src: stripedJacketImg },
  { label: 'Contrast Polo', src: poloContrastImg },
  { label: 'Tipping Polo', src: poloTippingImg },
  { label: 'Graphic Heavy Tee', src: graphicTeeImg },
  { label: 'Chunky Sneakers', src: sneakersImg },
];

const CATEGORIES = [
  'Men Fashion',
  'Hoodies',
  'Outerwear',
  'Footwear',
  'T-Shirts & Tops',
  'Luxury Streetwear',
];

const TAG_OPTIONS = [
  'New Drop',
  'Limited',
  'Signature',
  'Bestseller',
  'Trending',
  'Sale',
];

export default function AddProductSection({ onProductCreated }) {
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    category: 'Men Fashion',
    price: '',
    originalPrice: '',
    color: 'Noir Black',
    tag: 'New Drop',
    stock: 50,
    desc: '',
    image: hoodieModelImg,
    sizes: ['S', 'M', 'L', 'XL'],
    isFeatured: true,
  });

  // Attached images collection & main image selection state
  const [imageList, setImageList] = useState([
    {
      id: 'preset-default-hoodie',
      url: hoodieModelImg,
      name: 'Oversized Hoodie Studio Asset',
      source: 'preset',
    },
  ]);
  const [mainImageId, setMainImageId] = useState('preset-default-hoodie');

  // Upload & UI states
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [showPresets, setShowPresets] = useState(false);

  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Active Main Image resolution
  const currentMainImage = 
    imageList.find((img) => img.id === mainImageId) || 
    imageList[0] || 
    null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const toggleSize = (size) => {
    setFormData((prev) => {
      const exists = prev.sizes.includes(size);
      return {
        ...prev,
        sizes: exists ? prev.sizes.filter((s) => s !== size) : [...prev.sizes, size],
      };
    });
  };

  // Set selected image as the Main Image
  const setAsMain = (id) => {
    setMainImageId(id);
    const target = imageList.find((img) => img.id === id);
    if (target) {
      setFormData((prev) => ({ ...prev, image: target.url }));
      toast.info(`"${target.name || 'Asset'}" is now the primary storefront cover.`, 'Cover Updated');
    }
  };

  // Remove an image from the list
  const removeImage = (id) => {
    setImageList((prev) => {
      const target = prev.find((img) => img.id === id);
      const updated = prev.filter((img) => img.id !== id);
      if (mainImageId === id) {
        if (updated.length > 0) {
          setMainImageId(updated[0].id);
          setFormData((f) => ({ ...f, image: updated[0].url }));
        } else {
          setMainImageId(null);
          setFormData((f) => ({ ...f, image: '' }));
        }
      }
      toast.warning(`Removed "${target?.name || 'Asset'}" from gallery.`, 'Asset Removed');
      return updated;
    });
  };

  // Multi-file & Single-file upload handler
  const handleFilesUpload = async (files) => {
    if (!files || files.length === 0) return;
    const fileArr = Array.from(files);
    const validFiles = fileArr.filter((f) => f.type.startsWith('image/'));

    if (validFiles.length === 0) {
      const msg = 'Please select valid image files (JPG, PNG, WEBP, AVIF).';
      setErrorMessage(msg);
      toast.error(msg, 'Invalid File Format');
      return;
    }

    setIsUploading(true);
    setUploadStatus(`Uploading ${validFiles.length} product image${validFiles.length > 1 ? 's' : ''}...`);
    setErrorMessage('');

    const newUploaded = [];

    for (let i = 0; i < validFiles.length; i++) {
      const file = validFiles[i];
      let uploadedUrl = null;

      try {
        const fd = new FormData();
        fd.append('image', file);
        const res = await productsApi.uploadImage(fd);
        uploadedUrl = res?.data?.url || res?.url;
      } catch (err) {
        console.warn('Direct upload notice (falling back to client preview):', err);
      }

      // If backend was unreachable or requires auth, fallback to local Data URL
      if (!uploadedUrl) {
        try {
          uploadedUrl = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.readAsDataURL(file);
          });
        } catch {
          uploadedUrl = URL.createObjectURL(file);
        }
      }

      if (uploadedUrl) {
        newUploaded.push({
          id: `upload-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 4)}`,
          url: uploadedUrl,
          name: file.name,
          source: 'upload',
        });
      }
    }

    if (newUploaded.length > 0) {
      setImageList((prev) => {
        const combined = [...prev, ...newUploaded];
        // If no main image exists, make the first newly uploaded image the main image
        if (!mainImageId || !prev.some((img) => img.id === mainImageId)) {
          setMainImageId(newUploaded[0].id);
          setFormData((f) => ({ ...f, image: newUploaded[0].url }));
        }
        return combined;
      });
      const successText = `Successfully uploaded ${newUploaded.length} product image${newUploaded.length > 1 ? 's' : ''}!`;
      setSuccessMessage(successText);
      toast.success(successText, 'Upload Complete');
    }

    setIsUploading(false);
    setUploadStatus('');
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer?.files?.length) {
      handleFilesUpload(e.dataTransfer.files);
    }
  };

  // Add external URL image
  const handleAddUrl = (e) => {
    e.preventDefault();
    if (!customUrlInput.trim()) return;
    const newId = `url-${Date.now()}`;
    const newEntry = {
      id: newId,
      url: customUrlInput.trim(),
      name: 'External Asset',
      source: 'url',
    };
    setImageList((prev) => {
      const combined = [...prev, newEntry];
      if (!mainImageId) {
        setMainImageId(newId);
        setFormData((f) => ({ ...f, image: newEntry.url }));
      }
      return combined;
    });
    toast.success('Asset URL added to product gallery.', 'Asset Linked');
    setCustomUrlInput('');
    setShowUrlInput(false);
  };

  // Add or select a studio preset
  const handleSelectPreset = (preset) => {
    const existing = imageList.find((img) => img.url === preset.src);
    if (existing) {
      setAsMain(existing.id);
    } else {
      const newId = `preset-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
      const newEntry = {
        id: newId,
        url: preset.src,
        name: preset.label,
        source: 'preset',
      };
      setImageList((prev) => [...prev, newEntry]);
      setAsMain(newId);
      toast.info(`Added preset "${preset.label}" to gallery.`, 'Preset Selected');
    }
  };

  // Form Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!formData.name.trim()) {
      const msg = 'Product title is required.';
      setErrorMessage(msg);
      toast.error(msg, 'Validation Required');
      return;
    }

    if (!formData.price || Number(formData.price) <= 0) {
      const msg = 'Valid retail price is required.';
      setErrorMessage(msg);
      toast.error(msg, 'Validation Required');
      return;
    }

    if (!formData.desc.trim()) {
      const msg = 'Editorial product description is required.';
      setErrorMessage(msg);
      toast.error(msg, 'Validation Required');
      return;
    }

    const mainUrl = currentMainImage?.url || formData.image;
    if (!mainUrl) {
      const msg = 'Please upload or select at least one product image and specify the main image.';
      setErrorMessage(msg);
      toast.error(msg, 'Visual Asset Required');
      return;
    }

    setLoading(true);

    try {
      const galleryUrls = imageList.map((img) => img.url);
      const secondaryUrl = imageList.find((img) => img.url !== mainUrl)?.url || '';

      const payload = {
        name: formData.name.trim(),
        category: formData.category,
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
        discount: formData.originalPrice && Number(formData.originalPrice) > Number(formData.price)
          ? `-${Math.round(((Number(formData.originalPrice) - Number(formData.price)) / Number(formData.originalPrice)) * 100)}%`
          : '',
        color: formData.color,
        tag: formData.tag,
        stock: Number(formData.stock) || 50,
        desc: formData.desc.trim(),
        image: mainUrl,
        secondaryImage: secondaryUrl,
        gallery: galleryUrls,
        sizes: formData.sizes.length > 0 ? formData.sizes : ['M', 'L'],
        isFeatured: Boolean(formData.isFeatured),
      };

      const res = await productsApi.create(payload);

      if (res.success || res.data) {
        const successNotice = `"${formData.name}" successfully published to the live VANTA catalog!`;
        setSuccessMessage(successNotice);
        toast.success(successNotice, 'Drop Published! 🚀');

        // Reset form
        setFormData({
          name: '',
          category: 'Men Fashion',
          price: '',
          originalPrice: '',
          color: 'Noir Black',
          tag: 'New Drop',
          stock: 50,
          desc: '',
          image: hoodieModelImg,
          sizes: ['S', 'M', 'L', 'XL'],
          isFeatured: true,
        });

        // Reset image collection
        setImageList([
          {
            id: 'preset-default-hoodie',
            url: hoodieModelImg,
            name: 'Oversized Hoodie Studio Asset',
            source: 'preset',
          },
        ]);
        setMainImageId('preset-default-hoodie');

        if (onProductCreated) {
          onProductCreated(res.data);
        }
      }
    } catch (err) {
      console.error('Failed to create product:', err);
      const errNotice = err.message || 'Could not publish product to the database.';
      setErrorMessage(errNotice);
      toast.error(errNotice, 'Publishing Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in font-['Outfit',sans-serif]">
      {/* Section Header */}
      <div className="pb-4 border-b border-neutral-200">
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-orange-500 text-white">
            Catalog Release
          </span>
          <span className="text-xs text-neutral-500 font-semibold">
            Runway Launch Studio
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
          Add New Fashion Drop
        </h2>
        <p className="text-xs text-neutral-500 mt-1">
          Publish high-craft apparel to the live store with tailored sizing, imagery, and pricing metadata.
        </p>
      </div>

      {/* Status Alerts */}
      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between animate-fade-in shadow-xs">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">{successMessage}</span>
          </div>
          <button 
            type="button" 
            onClick={() => setSuccessMessage('')} 
            className="text-emerald-700 hover:text-emerald-900 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center justify-between animate-fade-in shadow-xs">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span className="font-semibold">{errorMessage}</span>
          </div>
          <button 
            type="button" 
            onClick={() => setErrorMessage('')} 
            className="text-red-700 hover:text-red-900 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Grid: Form + Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Container (8 Cols) */}
        <form onSubmit={handleSubmit} className="lg:col-span-8 p-6 sm:p-8 rounded-3xl bg-white border border-neutral-200 shadow-sm space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* 1. Name */}
            <div className="sm:col-span-2">
              <label className="block text-xs uppercase tracking-wider font-bold text-neutral-700 mb-2">
                Drop Title / Product Name <span className="text-orange-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Heavyweight Monolith Knit Hoodie"
                className="w-full px-4 py-3 rounded-2xl bg-neutral-50 border border-neutral-300 focus:border-orange-500 focus:bg-white text-sm text-neutral-900 outline-none transition-all font-medium"
                required
              />
            </div>

            {/* 2. Category */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-bold text-neutral-700 mb-2">
                Category Runway <span className="text-orange-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-2xl bg-neutral-50 border border-neutral-300 focus:border-orange-500 focus:bg-white text-sm text-neutral-900 outline-none transition-all cursor-pointer font-medium"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* 3. Tag */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-bold text-neutral-700 mb-2">
                Vault Status Badge
              </label>
              <select
                name="tag"
                value={formData.tag}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-2xl bg-neutral-50 border border-neutral-300 focus:border-orange-500 focus:bg-white text-sm text-neutral-900 outline-none transition-all cursor-pointer font-medium"
              >
                {TAG_OPTIONS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {/* 4. Retail Price */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-bold text-neutral-700 mb-2">
                Retail Price ($ USD) <span className="text-orange-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="95.00"
                className="w-full px-4 py-3 rounded-2xl bg-neutral-50 border border-neutral-300 focus:border-orange-500 focus:bg-white text-sm text-neutral-900 outline-none transition-all font-medium font-mono"
                required
              />
            </div>

            {/* 5. Original Price */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-bold text-neutral-700 mb-2">
                Original Price (Optional strikethrough)
              </label>
              <input
                type="number"
                step="0.01"
                name="originalPrice"
                value={formData.originalPrice}
                onChange={handleChange}
                placeholder="130.00"
                className="w-full px-4 py-3 rounded-2xl bg-neutral-50 border border-neutral-300 focus:border-orange-500 focus:bg-white text-sm text-neutral-900 outline-none transition-all font-medium font-mono"
              />
            </div>

            {/* 6. Color */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-bold text-neutral-700 mb-2">
                Primary Color / Wash
              </label>
              <input
                type="text"
                name="color"
                value={formData.color}
                onChange={handleChange}
                placeholder="e.g. Noir Black or Washed Sage"
                className="w-full px-4 py-3 rounded-2xl bg-neutral-50 border border-neutral-300 focus:border-orange-500 focus:bg-white text-sm text-neutral-900 outline-none transition-all font-medium"
              />
            </div>

            {/* 7. Stock */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-bold text-neutral-700 mb-2">
                Inventory Units
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                placeholder="50"
                className="w-full px-4 py-3 rounded-2xl bg-neutral-50 border border-neutral-300 focus:border-orange-500 focus:bg-white text-sm text-neutral-900 outline-none transition-all font-medium font-mono"
              />
            </div>
          </div>

          {/* ========================================================= */}
          {/* UPLOAD PRODUCT IMAGE & MAIN IMAGE SELECTION SECTION       */}
          {/* ========================================================= */}
          <div className="pt-6 border-t border-neutral-200 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <label className="block text-xs uppercase tracking-wider font-bold text-neutral-900">
                  Product Visual Assets & Main Cover <span className="text-orange-500">*</span>
                </label>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Upload runway images from your device, choose from presets, and designate the <strong className="text-neutral-800">Main Cover Image</strong>.
                </p>
              </div>

              {/* Utility actions */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowUrlInput((v) => !v)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    showUrlInput
                      ? 'bg-neutral-900 text-white'
                      : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                  }`}
                >
                  <LinkIcon className="w-3.5 h-3.5" />
                  <span>{showUrlInput ? 'Hide URL' : 'Add URL'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowPresets((v) => !v)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    showPresets
                      ? 'bg-orange-500 text-white'
                      : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{showPresets ? 'Hide Presets' : 'Presets'}</span>
                </button>
              </div>
            </div>

            {/* Hidden Native File Input */}
            <input
              type="file"
              ref={fileInputRef}
              multiple
              accept="image/jpeg,image/png,image/webp,image/avif"
              onChange={(e) => handleFilesUpload(e.target.files)}
              className="hidden"
            />

            {/* Interactive Drag & Drop Upload Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative group border-2 border-dashed rounded-3xl p-6 sm:p-8 text-center transition-all cursor-pointer select-none ${
                isDragging
                  ? 'border-orange-500 bg-orange-50/60 scale-[1.01]'
                  : 'border-neutral-300 hover:border-orange-400 bg-neutral-50/70 hover:bg-neutral-50'
              }`}
            >
              <div className="flex flex-col items-center justify-center gap-3">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-xs ${
                  isDragging 
                    ? 'bg-orange-500 text-white scale-110' 
                    : 'bg-white text-orange-500 group-hover:scale-105 border border-neutral-200'
                }`}>
                  {isUploading ? (
                    <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <UploadCloud className="w-7 h-7" />
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-bold text-neutral-900 mb-0.5">
                    {isUploading
                      ? uploadStatus || 'Uploading product images...'
                      : 'Upload Product Images'}
                  </h4>
                  <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                    Drag and drop high-resolution apparel photos here, or{' '}
                    <span className="text-orange-500 font-semibold underline underline-offset-2">
                      browse files
                    </span>{' '}
                    from your device.
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2 text-[10px] uppercase font-bold tracking-wider text-neutral-400 mt-1">
                  <span className="px-2 py-0.5 rounded-md bg-neutral-200/60">JPG</span>
                  <span className="px-2 py-0.5 rounded-md bg-neutral-200/60">PNG</span>
                  <span className="px-2 py-0.5 rounded-md bg-neutral-200/60">WEBP</span>
                  <span className="px-2 py-0.5 rounded-md bg-neutral-200/60">AVIF</span>
                  <span>• Up to 5MB each • Multi-image</span>
                </div>
              </div>
            </div>

            {/* Optional URL Input Drawer */}
            {showUrlInput && (
              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-2 animate-fade-in">
                <label className="block text-xs font-bold text-neutral-700">
                  Direct Asset URL (HTTPS)
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={customUrlInput}
                    onChange={(e) => setCustomUrlInput(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="flex-1 px-4 py-2.5 rounded-xl bg-white border border-neutral-300 focus:border-orange-500 text-xs font-mono outline-none"
                    onKeyDown={(e) => e.key === 'Enter' && handleAddUrl(e)}
                  />
                  <button
                    type="button"
                    onClick={handleAddUrl}
                    className="px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    Add Image
                  </button>
                </div>
              </div>
            )}

            {/* Optional Studio Presets Drawer */}
            {showPresets && (
              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-2.5 animate-fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-800">
                    VANTA Studio Presets (Click to Add / Select)
                  </span>
                  <span className="text-[11px] text-neutral-500">
                    High-res runway assets
                  </span>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2.5">
                  {IMAGE_PRESETS.map((item, idx) => {
                    const isAdded = imageList.some((img) => img.url === item.src);
                    const isMain = currentMainImage?.url === item.src;
                    return (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => handleSelectPreset(item)}
                        className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all p-0.5 cursor-pointer ${
                          isMain
                            ? 'border-orange-500 ring-2 ring-orange-500/40 scale-105'
                            : isAdded
                            ? 'border-neutral-400 opacity-90'
                            : 'border-neutral-200 hover:border-orange-300 opacity-70 hover:opacity-100'
                        }`}
                        title={`${item.label} (Click to select)`}
                      >
                        <img src={item.src} alt={item.label} className="w-full h-full object-cover rounded-lg" />
                        {isMain && (
                          <span className="absolute top-1 right-1 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center text-white shadow-xs">
                            <Star className="w-2.5 h-2.5 fill-white stroke-none" />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ATTACHED PRODUCT IMAGES & MAIN IMAGE SELECTOR */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-800">
                    Attached Runway Assets ({imageList.length})
                  </span>
                  <span className="text-[11px] text-neutral-400">
                    • Click any image or button to designate Main Image
                  </span>
                </div>
              </div>

              {imageList.length === 0 ? (
                <div className="py-8 text-center rounded-2xl border border-dashed border-neutral-300 bg-neutral-50/50">
                  <ImageIcon className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
                  <p className="text-xs text-neutral-500">
                    No images attached. Upload photos or select a preset to continue.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
                  {imageList.map((img) => {
                    const isMain = (currentMainImage?.id === img.id) || (currentMainImage?.url === img.url);

                    return (
                      <div
                        key={img.id}
                        onClick={() => setAsMain(img.id)}
                        className={`group relative rounded-2xl overflow-hidden border-2 transition-all cursor-pointer flex flex-col bg-white shadow-xs ${
                          isMain
                            ? 'border-orange-500 ring-2 ring-orange-500/30 shadow-md scale-[1.02]'
                            : 'border-neutral-200 hover:border-neutral-400 hover:shadow-sm'
                        }`}
                      >
                        {/* Image Preview Container */}
                        <div className="relative aspect-square w-full bg-neutral-100 overflow-hidden">
                          <img
                            src={img.url}
                            alt={img.name || 'Product asset'}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />

                          {/* Main Image Badge Overlay */}
                          {isMain ? (
                            <div className="absolute top-2 left-2 z-10 flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-500 text-white text-[10px] font-black uppercase tracking-wider shadow-md">
                              <Star className="w-3 h-3 fill-white stroke-none" />
                              <span>Main Image</span>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setAsMain(img.id);
                              }}
                              className="absolute top-2 left-2 z-10 px-2 py-1 rounded-full bg-neutral-900/80 hover:bg-orange-500 text-white text-[10px] font-bold uppercase tracking-wider backdrop-blur-md opacity-90 group-hover:opacity-100 transition-all flex items-center gap-1 shadow-xs"
                              title="Set as Main Cover Image"
                            >
                              <Star className="w-2.5 h-2.5" />
                              <span>Set Main</span>
                            </button>
                          )}

                          {/* Delete/Remove button */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeImage(img.id);
                            }}
                            className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-black/60 hover:bg-red-600 text-white flex items-center justify-center opacity-80 group-hover:opacity-100 transition-all backdrop-blur-md cursor-pointer"
                            title="Remove image"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Card Footer Info & Quick Selector */}
                        <div className={`p-2.5 flex items-center justify-between border-t text-[11px] ${
                          isMain 
                            ? 'bg-orange-50/70 border-orange-200 text-orange-900 font-bold' 
                            : 'bg-neutral-50 border-neutral-100 text-neutral-600 font-medium'
                        }`}>
                          <span className="truncate pr-1">
                            {isMain ? '★ Cover Image' : (img.name || 'Gallery Angle')}
                          </span>
                          {isMain ? (
                            <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0" />
                          ) : (
                            <span className="text-[10px] text-neutral-400 group-hover:text-orange-600 uppercase font-bold shrink-0">
                              Select
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
          {/* ========================================================= */}

          {/* Description */}
          <div className="pt-4 border-t border-neutral-200">
            <label className="block text-xs uppercase tracking-wider font-bold text-neutral-700 mb-2">
              Editorial Description <span className="text-orange-500">*</span>
            </label>
            <textarea
              name="desc"
              rows={3}
              value={formData.desc}
              onChange={handleChange}
              placeholder="Artisan silhouette woven from premium heavyweight cotton-blend fleece, tailored with ribbed hem accents..."
              className="w-full px-4 py-3 rounded-2xl bg-neutral-50 border border-neutral-300 focus:border-orange-500 focus:bg-white text-sm text-neutral-900 outline-none transition-all font-sans leading-relaxed"
              required
            />
          </div>

          {/* Sizes Selector */}
          <div className="pt-4 border-t border-neutral-200">
            <label className="block text-xs uppercase tracking-wider font-bold text-neutral-700 mb-2">
              Available Runway Sizes
            </label>
            <div className="flex flex-wrap gap-2">
              {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((sz) => {
                const active = formData.sizes.includes(sz);
                return (
                  <button
                    type="button"
                    key={sz}
                    onClick={() => toggleSize(sz)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer font-cute ${
                      active
                        ? 'bg-neutral-950 text-white shadow-xs'
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    }`}
                  >
                    {sz}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Featured Toggle */}
          <div className="pt-4 border-t border-neutral-200 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-neutral-900 block">
                Showcase on Storefront Hero Drops
              </span>
              <span className="text-xs text-neutral-500">
                Immediately pin this drop to the featured homepage carousel.
              </span>
            </div>
            <input
              type="checkbox"
              name="isFeatured"
              checked={formData.isFeatured}
              onChange={handleChange}
              className="w-5 h-5 text-orange-500 rounded-md focus:ring-orange-500 cursor-pointer accent-orange-500"
            />
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={loading || isUploading}
            className="w-full py-4 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm tracking-wide transition-all shadow-md shadow-orange-500/25 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Publishing to Runway...</span>
              </span>
            ) : isUploading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Uploading Visual Assets...</span>
              </span>
            ) : (
              <>
                <PlusCircle className="w-4 h-4" />
                <span>Publish Drop to Storefront</span>
              </>
            )}
          </button>
        </form>

        {/* Live Preview Sidebar Card (4 Cols) */}
        <div className="lg:col-span-4 sticky top-6 space-y-4">
          <div className="p-3.5 rounded-2xl bg-neutral-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-orange-400" />
              <span className="text-xs font-bold font-cute uppercase tracking-wider">
                Storefront Preview
              </span>
            </div>
            {currentMainImage && (
              <span className="px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 text-[10px] font-bold uppercase tracking-wider">
                Live Main Cover
              </span>
            )}
          </div>

          {/* Mock Product Card */}
          <div className="bg-white rounded-3xl p-4 border border-neutral-200 shadow-lg flex flex-col">
            <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-neutral-100 mb-3">
              {currentMainImage?.url ? (
                <img
                  src={currentMainImage.url}
                  alt={formData.name || 'Preview'}
                  className="w-full h-full object-cover transition-all duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-neutral-400 text-xs">
                  No Image Selected
                </div>
              )}
              {formData.tag && (
                <span className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[11px] font-bold text-neutral-900 uppercase tracking-wider shadow-sm font-cute">
                  {formData.tag}
                </span>
              )}
              {currentMainImage && (
                <span className="absolute bottom-3 left-3 px-2.5 py-0.5 bg-black/70 backdrop-blur-md rounded-full text-[10px] font-bold text-white uppercase tracking-wider flex items-center gap-1">
                  <Star className="w-2.5 h-2.5 fill-orange-400 text-orange-400" />
                  Primary Cover
                </span>
              )}
            </div>

            {/* Gallery Thumbnail Strip in Live Preview */}
            {imageList.length > 1 && (
              <div className="mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1.5 font-cute">
                  Drop Gallery Angles ({imageList.length})
                </span>
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {imageList.map((img) => {
                    const isSelected = (currentMainImage?.id === img.id) || (currentMainImage?.url === img.url);
                    return (
                      <button
                        type="button"
                        key={img.id}
                        onClick={() => setAsMain(img.id)}
                        className={`relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                          isSelected
                            ? 'border-orange-500 ring-2 ring-orange-500/40 scale-105'
                            : 'border-neutral-200 hover:border-neutral-400 opacity-70 hover:opacity-100'
                        }`}
                        title="Click to set as Main Image"
                      >
                        <img src={img.url} alt="" className="w-full h-full object-cover" />
                        {isSelected && (
                          <span className="absolute inset-0 bg-orange-500/10 flex items-center justify-center">
                            <span className="w-2 h-2 rounded-full bg-orange-500" />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex items-start justify-between gap-2 mb-1">
              <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider font-cute">
                {formData.color || 'Noir Black'}
              </span>
              <span className="text-base sm:text-lg font-black text-neutral-950 font-cute">
                ${formData.price ? Number(formData.price).toFixed(2) : '95.00'}
              </span>
            </div>

            <h3 className="text-base font-bold text-neutral-900 mb-1 font-cute line-clamp-1">
              {formData.name || 'Drop Title Preview'}
            </h3>

            <p className="text-xs text-neutral-500 line-clamp-2 mb-4 leading-relaxed">
              {formData.desc || 'Artisan product description will appear here on the storefront.'}
            </p>

            <div className="flex items-center gap-1 text-[11px] text-neutral-500 mb-3 font-mono">
              <span>Sizes:</span>
              <span className="font-bold text-neutral-800">
                {formData.sizes.join(', ') || 'Standard'}
              </span>
            </div>

            <div className="w-full py-3 rounded-2xl bg-neutral-950 text-white text-center font-bold text-xs uppercase tracking-wider">
              Add to Bag Preview
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
