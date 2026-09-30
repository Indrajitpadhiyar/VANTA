import React, { useState, useEffect, useRef } from 'react';
import { 
  Upload, 
  Image as ImageIcon, 
  Sparkles, 
  RotateCcw, 
  CheckCircle2, 
  ExternalLink, 
  AlertCircle, 
  Layers, 
  Eye,
  Sliders,
  Loader2
} from 'lucide-react';
import { heroModel } from '../../../assets';
import { settingsApi, productsApi } from '../../../services';

const PRESET_LOOKS = [
  {
    name: 'Original Sunset Tracksuit',
    url: heroModel,
    badge: 'VANTA SIGNATURE FIT'
  },
  {
    name: 'Vintage Street Hooded Editorial',
    url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1000&auto=format&fit=crop&q=80',
    badge: 'SPRING DROP 2026'
  },
  {
    name: 'Oversized Noir Monochrome Look',
    url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1000&auto=format&fit=crop&q=80',
    badge: 'EXCLUSIVE ATELIER'
  },
  {
    name: 'Chunky Court Sneakers Aesthetic',
    url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1000&auto=format&fit=crop&q=80',
    badge: 'LIMITED FOOTWEAR'
  }
];

export default function CustomizeHeroSection() {
  const [currentImage, setCurrentImage] = useState(heroModel);
  const [badgeText, setBadgeText] = useState('VANTA SIGNATURE FIT');
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef(null);

  // Load saved hero configuration on mount
  useEffect(() => {
    settingsApi.getHeroConfig().then((cfg) => {
      if (cfg) {
        if (cfg.heroImage) {
          setCurrentImage(cfg.heroImage);
          if (cfg.heroImage.startsWith('http')) {
            setImageUrlInput(cfg.heroImage);
          }
        }
        if (cfg.badgeText) {
          setBadgeText(cfg.badgeText);
        }
      }
    });
  }, []);

  // Handle local image file upload (upload to Cloudinary or base64)
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate image format
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file (PNG, JPG, WEBP).');
      return;
    }

    setIsUploading(true);
    setErrorMsg('');

    try {
      const formData = new FormData();
      formData.append('image', file);

      const res = await productsApi.uploadImage(formData);
      if (res?.data?.url) {
        setCurrentImage(res.data.url);
        setImageUrlInput(res.data.url);
      } else {
        // Fallback to local FileReader base64 URL
        const reader = new FileReader();
        reader.onloadend = () => {
          setCurrentImage(reader.result);
          setImageUrlInput('');
        };
        reader.readAsDataURL(file);
      }
    } catch {
      // Fallback: direct browser base64 read
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentImage(reader.result);
        setImageUrlInput('');
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploading(false);
    }
  };

  // Handle URL input apply
  const handleApplyUrl = () => {
    if (!imageUrlInput.trim()) return;
    setCurrentImage(imageUrlInput.trim());
    setErrorMsg('');
  };

  // Save changes to backend & localStorage
  const handleSave = async () => {
    setIsSaving(true);
    setErrorMsg('');
    setSaveSuccess(false);

    try {
      const newConfig = {
        heroImage: currentImage,
        badgeText: badgeText.trim() || 'VANTA SIGNATURE FIT',
        updatedAt: new Date().toISOString(),
      };

      await settingsApi.saveHeroConfig(newConfig);

      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
      }, 4000);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to save hero configuration.');
    } finally {
      setIsSaving(false);
    }
  };

  // Reset to default original model photo
  const handleReset = async () => {
    setCurrentImage(heroModel);
    setBadgeText('VANTA SIGNATURE FIT');
    setImageUrlInput('');
    setErrorMsg('');

    const defaultConfig = {
      heroImage: heroModel,
      badgeText: 'VANTA SIGNATURE FIT',
      updatedAt: new Date().toISOString(),
    };

    await settingsApi.saveHeroConfig(defaultConfig);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 4000);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200/60 text-orange-600 text-xs font-bold uppercase tracking-wider mb-2 font-cute">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Storefront Brand Identity</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 font-cute tracking-tight">
            Hero Mosaic Customizer
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Customize the prominent geometric mosaic photo and floating badge displayed on the homepage.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => window.open('/', '_blank')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-bold font-cute transition-colors cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Live Site</span>
          </button>
        </div>
      </div>

      {/* Success / Error Feedback Alerts */}
      {saveSuccess && (
        <div className="flex items-center gap-2.5 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-cute animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Hero mosaic photo and badge updated successfully! Changes are live on the storefront.</span>
        </div>
      )}

      {errorMsg && (
        <div className="flex items-center gap-2.5 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-sm font-cute animate-fade-in">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main 2-Column Studio Grid: Left Controls, Right Real Mosaic Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Customization Controls */}
        <div className="lg:col-span-6 space-y-6">
          {/* Card 1: Upload or URL Input */}
          <div className="bg-white rounded-3xl p-6 border border-neutral-200/80 shadow-sm space-y-5">
            <h3 className="text-base font-bold text-neutral-900 font-cute flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-orange-500" />
              <span>Select Hero Photo</span>
            </h3>

            {/* Drag & Drop File Upload Box */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="group border-2 border-dashed border-neutral-300 hover:border-orange-500 rounded-3xl p-6 text-center cursor-pointer bg-neutral-50 hover:bg-orange-50/30 transition-all flex flex-col items-center justify-center space-y-3"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-neutral-200 flex items-center justify-center text-neutral-600 group-hover:text-orange-500 group-hover:border-orange-300 transition-colors">
                {isUploading ? (
                  <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
                ) : (
                  <Upload className="w-6 h-6" />
                )}
              </div>
              <div>
                <p className="text-sm font-bold text-neutral-800 font-cute">
                  Click to upload a new model or lookbook photo
                </p>
                <p className="text-xs text-neutral-400 mt-1">
                  Supports High-Res JPG, PNG, WEBP (Vertical / Portrait recommended)
                </p>
              </div>
            </div>

            {/* Direct Image URL input */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-600 font-cute uppercase tracking-wider">
                Or Paste Image URL
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="flex-1 px-4 py-2.5 rounded-2xl bg-neutral-50 border border-neutral-200 text-xs sm:text-sm text-neutral-900 focus:outline-none focus:border-orange-500 font-mono"
                />
                <button
                  type="button"
                  onClick={handleApplyUrl}
                  className="px-4 py-2.5 bg-neutral-900 hover:bg-orange-500 text-white rounded-2xl text-xs font-bold font-cute transition-colors cursor-pointer"
                >
                  Preview
                </button>
              </div>
            </div>

            {/* Curated High-Fashion Presets */}
            <div className="space-y-2.5 pt-2 border-t border-neutral-100">
              <label className="text-xs font-bold text-neutral-600 font-cute uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-orange-500" />
                <span>Curated Lookbook Presets</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {PRESET_LOOKS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setCurrentImage(preset.url);
                      setBadgeText(preset.badge);
                      setImageUrlInput(preset.url.startsWith('http') ? preset.url : '');
                    }}
                    className={`flex items-center gap-2.5 p-2 rounded-2xl border text-left transition-all cursor-pointer ${
                      currentImage === preset.url
                        ? 'bg-orange-50/60 border-orange-400 text-orange-950 font-bold'
                        : 'bg-neutral-50 hover:bg-neutral-100 border-neutral-200/80 text-neutral-700'
                    }`}
                  >
                    <img
                      src={preset.url}
                      alt={preset.name}
                      className="w-10 h-10 rounded-xl object-cover bg-neutral-200 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-cute truncate">{preset.name}</p>
                      <p className="text-[10px] text-neutral-400 truncate">{preset.badge}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Card 2: Floating Badge Customization */}
          <div className="bg-white rounded-3xl p-6 border border-neutral-200/80 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-neutral-900 font-cute flex items-center gap-2">
              <Sliders className="w-4 h-4 text-orange-500" />
              <span>Floating Badge Text</span>
            </h3>

            <div>
              <label className="text-xs font-bold text-neutral-600 font-cute uppercase tracking-wider block mb-2">
                Badge Headline
              </label>
              <input
                type="text"
                value={badgeText}
                maxLength={26}
                onChange={(e) => setBadgeText(e.target.value)}
                placeholder="VANTA SIGNATURE FIT"
                className="w-full px-4 py-2.5 rounded-2xl bg-neutral-50 border border-neutral-200 text-sm text-neutral-900 font-cute font-bold focus:outline-none focus:border-orange-500"
              />
              <p className="text-[11px] text-neutral-400 mt-1.5 font-cute">
                Max 26 characters. Displayed over the lower mosaic horizontal bar.
              </p>
            </div>
          </div>

          {/* Action Buttons: Save & Reset */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-neutral-950 hover:bg-orange-500 text-white font-cute font-extrabold text-sm shadow-lg hover:shadow-orange-500/25 transition-all cursor-pointer disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Publishing Changes...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Save & Publish Live</span>
                </>
              )}
            </button>

            <button
              onClick={handleReset}
              className="flex items-center justify-center gap-1.5 px-5 py-3.5 rounded-2xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-cute font-bold text-sm transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset to Default</span>
            </button>
          </div>
        </div>

        {/* Right Column: Live Interactive SVG Mosaic Preview */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-neutral-200/80 shadow-sm sticky top-20">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-100">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-bold text-neutral-900 font-cute">
                Live Storefront Mosaic Preview
              </span>
            </div>
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider font-cute">
              Scale 1:1
            </span>
          </div>

          <div className="relative w-full max-w-[480px] mx-auto select-none bg-neutral-50/50 p-4 rounded-3xl border border-neutral-100">
            {/* Real SVG Geometric Cutout Mask */}
            <svg 
              viewBox="0 0 600 660" 
              className="w-full h-auto drop-shadow-[0_15px_30px_rgba(0,0,0,0.08)] overflow-visible"
            >
              <defs>
                <filter id="adminTileShadow" x="-10%" y="-10%" width="120%" height="125%">
                  <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#000000" floodOpacity="0.08" />
                </filter>

                <linearGradient id="adminOrangeTileGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FF6B00" />
                  <stop offset="100%" stopColor="#FFA000" />
                </linearGradient>

                <mask id="adminMosaicCutoutMask">
                  <rect width="600" height="660" fill="black" />
                  
                  {/* Row 1 */}
                  <rect x="200" y="20" width="180" height="120" rx="24" fill="white" />
                  <rect x="395" y="20" width="180" height="120" rx="24" fill="white" />

                  {/* Row 2 */}
                  <rect x="180" y="155" width="225" height="180" rx="28" fill="white" />
                  <rect x="420" y="155" width="155" height="180" rx="28" fill="white" />

                  {/* Row 3 */}
                  <rect x="90" y="350" width="485" height="120" rx="28" fill="white" />

                  {/* Row 4 */}
                  <rect x="110" y="485" width="225" height="145" rx="26" fill="white" />
                  <rect x="350" y="485" width="225" height="145" rx="26" fill="white" />
                </mask>
              </defs>

              {/* Decorative Ambient Chips */}
              <g transform="rotate(-5 120 70)">
                <rect x="65" y="15" width="115" height="115" rx="26" fill="#EAECEF" filter="url(#adminTileShadow)" />
              </g>
              <g transform="rotate(12 35 50)">
                <rect x="10" y="20" width="50" height="62" rx="18" fill="url(#adminOrangeTileGrad)" filter="url(#adminTileShadow)" />
              </g>
              <g transform="rotate(4 105 237)">
                <rect x="45" y="180" width="120" height="115" rx="26" fill="#ECEEF2" filter="url(#adminTileShadow)" />
              </g>
              <g transform="rotate(-6 65 560)">
                <rect x="10" y="510" width="115" height="95" rx="24" fill="#ECEEF2" filter="url(#adminTileShadow)" />
              </g>

              {/* The Live Masked Image */}
              <image
                href={currentImage || heroModel}
                x="75"
                y="15"
                width="510"
                height="625"
                preserveAspectRatio="xMidYMid slice"
                mask="url(#adminMosaicCutoutMask)"
              />

              {/* Subtle Box Borders */}
              <rect x="200" y="20" width="180" height="120" rx="24" fill="transparent" stroke="rgba(0,0,0,0.08)" strokeWidth="1.5" />
              <rect x="395" y="20" width="180" height="120" rx="24" fill="transparent" stroke="rgba(0,0,0,0.08)" strokeWidth="1.5" />
              <rect x="180" y="155" width="225" height="180" rx="28" fill="transparent" stroke="rgba(0,0,0,0.08)" strokeWidth="1.5" />
              <rect x="420" y="155" width="155" height="180" rx="28" fill="transparent" stroke="rgba(0,0,0,0.08)" strokeWidth="1.5" />
              <rect x="90" y="350" width="485" height="120" rx="28" fill="transparent" stroke="rgba(0,0,0,0.08)" strokeWidth="1.5" />
              <rect x="110" y="485" width="225" height="145" rx="26" fill="transparent" stroke="rgba(0,0,0,0.08)" strokeWidth="1.5" />
              <rect x="350" y="485" width="225" height="145" rx="26" fill="transparent" stroke="rgba(0,0,0,0.08)" strokeWidth="1.5" />

              {/* Floating Badge */}
              <g transform="translate(400, 368)">
                <rect width="155" height="28" rx="14" fill="#FF6500" filter="url(#adminTileShadow)" />
                <text
                  x="77.5"
                  y="18"
                  textAnchor="middle"
                  fill="#FFFFFF"
                  fontSize="10.5"
                  fontWeight="800"
                  letterSpacing="0.08em"
                  fontFamily="Fredoka, Outfit, sans-serif"
                >
                  {badgeText || 'VANTA SIGNATURE FIT'}
                </text>
              </g>
            </svg>
          </div>

          <p className="text-center text-xs text-neutral-400 mt-4 font-cute">
            This preview demonstrates the exact geometry and cutouts as seen by storefront visitors.
          </p>
        </div>
      </div>
    </div>
  );
}
