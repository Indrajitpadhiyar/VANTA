import React from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  AlertTriangle, 
  Info, 
  X,
  Sparkles 
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const TOAST_ICONS = {
  success: CheckCircle2,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const TOAST_STYLES = {
  success: {
    bg: 'bg-white/95 dark:bg-neutral-900/95',
    border: 'border-emerald-500/30',
    iconBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    barBg: 'bg-emerald-500',
    titleColor: 'text-neutral-900 dark:text-white',
    ring: 'ring-1 ring-emerald-500/20',
  },
  error: {
    bg: 'bg-white/95 dark:bg-neutral-900/95',
    border: 'border-red-500/30',
    iconBg: 'bg-red-500/10 text-red-600 dark:text-red-400',
    barBg: 'bg-red-500',
    titleColor: 'text-neutral-900 dark:text-white',
    ring: 'ring-1 ring-red-500/20',
  },
  warning: {
    bg: 'bg-white/95 dark:bg-neutral-900/95',
    border: 'border-amber-500/30',
    iconBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    barBg: 'bg-amber-500',
    titleColor: 'text-neutral-900 dark:text-white',
    ring: 'ring-1 ring-amber-500/20',
  },
  info: {
    bg: 'bg-white/95 dark:bg-neutral-900/95',
    border: 'border-orange-500/30',
    iconBg: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
    barBg: 'bg-orange-500',
    titleColor: 'text-neutral-900 dark:text-white',
    ring: 'ring-1 ring-orange-500/20',
  },
};

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div 
      className="fixed top-5 right-5 z-[99999] flex flex-col gap-3 max-w-sm sm:max-w-md w-full pointer-events-none p-4 sm:p-0 font-['Outfit',sans-serif]"
      aria-live="polite"
    >
      {toasts.map((toast) => {
        const IconComponent = TOAST_ICONS[toast.type] || Info;
        const style = TOAST_STYLES[toast.type] || TOAST_STYLES.info;

        return (
          <div
            key={toast.id}
            role="alert"
            className={`pointer-events-auto relative overflow-hidden rounded-2xl p-4 shadow-xl backdrop-blur-xl border transition-all duration-300 transform translate-y-0 opacity-100 animate-slide-in-right ${style.bg} ${style.border} ${style.ring}`}
          >
            <div className="flex items-start gap-3">
              {/* Icon Container */}
              <div className={`p-2 rounded-xl shrink-0 ${style.iconBg}`}>
                <IconComponent className="w-4 h-4" />
              </div>

              {/* Message Content */}
              <div className="flex-1 min-w-0 pt-0.5">
                {toast.title && (
                  <h5 className={`text-xs font-bold uppercase tracking-wider mb-0.5 font-cute ${style.titleColor}`}>
                    {toast.title}
                  </h5>
                )}
                <p className="text-xs text-neutral-600 dark:text-neutral-300 font-medium leading-relaxed break-words">
                  {toast.message}
                </p>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="p-1 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer shrink-0"
                title="Dismiss"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Countdown Progress Indicator Bar */}
            {toast.duration > 0 && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-100 dark:bg-neutral-800">
                <div 
                  className={`h-full ${style.barBg}`}
                  style={{
                    animation: `shrinkWidth ${toast.duration}ms linear forwards`
                  }}
                />
              </div>
            )}
          </div>
        );
      })}

      <style>{`
        @keyframes shrinkWidth {
          from { width: 100%; }
          to { width: 0%; }
        }
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in-right {
          animation: slideInRight 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}
