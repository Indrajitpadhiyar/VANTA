import React, { useState } from 'react';
import { 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  AlertCircle, 
  Loader2, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { useAuth, useUI } from '../../context';

export default function AuthForm({ initialMode = 'login', onSuccess }) {
  const { login, register, googleLogin, loading, authError, setAuthError } = useAuth();
  const { authMode, setAuthMode, closeAuth, goHome } = useUI();

  const currentMode = authMode || initialMode;

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [acceptTerms, setAcceptTerms] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');

  // Password strength calculation
  const getPasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, label: '', color: 'bg-neutral-700' };
    let score = 0;
    if (pwd.length >= 6) score += 1;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd) || /[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score <= 1) return { score: 25, label: 'Weak', color: 'bg-red-500' };
    if (score === 2) return { score: 50, label: 'Fair', color: 'bg-amber-500' };
    if (score === 3) return { score: 75, label: 'Good', color: 'bg-blue-500' };
    return { score: 100, label: 'Strong', color: 'bg-emerald-500' };
  };

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError(null);
    setSuccessMessage('');

    if (currentMode === 'login') {
      if (!email.trim() || !password) {
        setAuthError('Please enter both email and password.');
        return;
      }

      const res = await login(email.trim(), password);
      if (res.success) {
        setSuccessMessage(`Welcome back, ${res.data.user.name}!`);
        setTimeout(() => {
          if (onSuccess) onSuccess();
          closeAuth();
        }, 800);
      }
    } else {
      // Register Mode
      if (!name.trim()) {
        setAuthError('Please enter your full name.');
        return;
      }
      if (!email.trim()) {
        setAuthError('Please enter a valid email address.');
        return;
      }
      if (password.length < 6) {
        setAuthError('Password must be at least 6 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setAuthError('Passwords do not match.');
        return;
      }
      if (!acceptTerms) {
        setAuthError('Please accept the Terms of Service to create an account.');
        return;
      }

      const res = await register(name.trim(), email.trim(), password);
      if (res.success) {
        setSuccessMessage('Account created successfully! Welcome to VANTA.');
        setTimeout(() => {
          if (onSuccess) onSuccess();
          closeAuth();
        }, 800);
      }
    }
  };

  const handleGoogleSignIn = async () => {
    setAuthError(null);
    setSuccessMessage('');
    const res = await googleLogin({
      name: 'VANTA Collector',
      email: 'collector@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    });

    if (res.success) {
      setSuccessMessage(`Signed in via Google as ${res.data.user.name}`);
      setTimeout(() => {
        if (onSuccess) onSuccess();
        closeAuth();
      }, 800);
    }
  };

  const fillQuickAccount = (quickEmail, quickPassword) => {
    setEmail(quickEmail);
    setPassword(quickPassword);
    setAuthError(null);
  };

  return (
    <div className="w-full">
      {/* Tab Switcher */}
      <div className="flex p-1 bg-neutral-900/90 rounded-2xl border border-white/10 mb-6 backdrop-blur-md">
        <button
          type="button"
          onClick={() => {
            setAuthMode('login');
            setAuthError(null);
          }}
          className={`flex-1 py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-300 ${
            currentMode === 'login'
              ? 'bg-orange-500 text-white shadow-[0_4px_20px_rgba(255,107,0,0.35)]'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => {
            setAuthMode('register');
            setAuthError(null);
          }}
          className={`flex-1 py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-300 ${
            currentMode === 'register'
              ? 'bg-orange-500 text-white shadow-[0_4px_20px_rgba(255,107,0,0.35)]'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          Create Account
        </button>
      </div>

      {/* 1. GOOGLE LOGIN SECTION */}
      <div className="mb-6">
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="group relative w-full flex items-center justify-center gap-3 py-3 px-4 rounded-2xl
            bg-neutral-900/90 hover:bg-neutral-800/90 border border-white/15 hover:border-orange-500/50 
            text-white font-medium text-sm transition-all duration-300 shadow-md hover:shadow-[0_0_25px_rgba(255,107,0,0.2)]
            disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
        >
          {/* Multi-Color Google G SVG Icon */}
          <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
          <span>Continue with Google</span>
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/10 text-neutral-300 group-hover:bg-orange-500/20 group-hover:text-orange-300 transition-colors">
            1-Click
          </span>
        </button>

        {/* Divider with subtle glowing badge */}
        <div className="relative flex items-center justify-center my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10" />
          </div>
          <span className="relative bg-neutral-950 px-3 text-[11px] font-semibold uppercase tracking-widest text-neutral-400">
            or continue with email
          </span>
        </div>
      </div>

      {/* Error Alert */}
      {authError && (
        <div className="mb-5 p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2.5 animate-shake">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span className="flex-1">{authError}</span>
        </div>
      )}

      {/* Success Alert */}
      {successMessage && (
        <div className="mb-5 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span className="flex-1 font-medium">{successMessage}</span>
        </div>
      )}

      {/* FORM */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name (Register Mode Only) */}
        {currentMode === 'register' && (
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1.5 uppercase tracking-wider">
              Full Name
            </label>
            <div className="relative flex items-center">
              <User className="absolute left-3.5 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Mathio"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-900 border border-white/10 
                  focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-sm text-white placeholder:text-neutral-500
                  outline-none transition-colors"
                required
              />
            </div>
          </div>
        )}

        {/* Email Address */}
        <div>
          <label className="block text-xs font-medium text-neutral-300 mb-1.5 uppercase tracking-wider">
            Email Address
          </label>
          <div className="relative flex items-center">
            <Mail className="absolute left-3.5 w-4 h-4 text-neutral-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@domain.com"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-900 border border-white/10 
                focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-sm text-white placeholder:text-neutral-500
                outline-none transition-colors"
              required
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="block text-xs font-medium text-neutral-300 uppercase tracking-wider">
              Password
            </label>
            {currentMode === 'login' && (
              <button
                type="button"
                onClick={() => alert('Please contact support or use demo accounts to sign in.')}
                className="text-[11px] text-orange-400 hover:text-orange-300 transition-colors"
              >
                Forgot password?
              </button>
            )}
          </div>
          <div className="relative flex items-center">
            <Lock className="absolute left-3.5 w-4 h-4 text-neutral-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-neutral-900 border border-white/10 
                focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-sm text-white placeholder:text-neutral-500
                outline-none transition-colors"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 text-neutral-400 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Password Strength Meter (Register Mode) */}
          {currentMode === 'register' && password && (
            <div className="mt-2">
              <div className="flex justify-between items-center text-[10px] text-neutral-400 mb-1">
                <span>Strength:</span>
                <span className="font-semibold text-white">{strength.label}</span>
              </div>
              <div className="w-full h-1 bg-neutral-800 rounded-full overflow-hidden">
                <div
                  className={`h-full ${strength.color} transition-all duration-300`}
                  style={{ width: `${strength.score}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password (Register Mode Only) */}
        {currentMode === 'register' && (
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1.5 uppercase tracking-wider">
              Confirm Password
            </label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3.5 w-4 h-4 text-neutral-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-900 border border-white/10 
                  focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-sm text-white placeholder:text-neutral-500
                  outline-none transition-colors"
                required
              />
              {confirmPassword && password === confirmPassword && (
                <CheckCircle2 className="absolute right-3.5 w-4 h-4 text-emerald-400" />
              )}
            </div>
          </div>
        )}

        {/* Remember Me / Terms */}
        {currentMode === 'login' ? (
          <div className="flex items-center">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-400 select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded bg-neutral-900 border-white/20 text-orange-500 focus:ring-orange-500"
              />
              Remember my session
            </label>
          </div>
        ) : (
          <div className="flex items-start gap-2 pt-1">
            <input
              type="checkbox"
              id="terms"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              className="mt-0.5 rounded bg-neutral-900 border-white/20 text-orange-500 focus:ring-orange-500"
            />
            <label htmlFor="terms" className="text-xs text-neutral-400 leading-tight">
              I agree to the <span className="text-white hover:underline cursor-pointer">VANTA Terms of Service</span> & <span className="text-white hover:underline cursor-pointer">Privacy Policy</span>.
            </label>
          </div>
        )}

        {/* Submit CTA */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700
            text-white font-semibold text-sm tracking-wide shadow-[0_10px_30px_rgba(255,107,0,0.35)] 
            hover:shadow-[0_15px_40px_rgba(255,107,0,0.5)] transition-all duration-300 
            flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer mt-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Verifying...</span>
            </>
          ) : currentMode === 'login' ? (
            <>
              <span>Sign In to VANTA</span>
              <ArrowRight className="w-4 h-4" />
            </>
          ) : (
            <>
              <span>Create Account</span>
              <Sparkles className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* QUICK DEMO CREDENTIALS (FOR FAST EVALUATION) */}
      {currentMode === 'login' && (
        <div className="mt-6 pt-5 border-t border-white/10">
          <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-neutral-400 mb-2.5">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-orange-400" />
              Quick Demo Accounts
            </span>
            <span className="text-[10px] text-neutral-400">1-Click autofill</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => fillQuickAccount('admin@vanta.com', 'Admin@123456')}
              className="px-3 py-2 rounded-xl bg-white/5 hover:bg-orange-500/10 border border-white/10 hover:border-orange-500/40 text-left transition-all group cursor-pointer"
            >
              <div className="text-[11px] font-bold text-white group-hover:text-orange-400">
                Admin
              </div>
              <div className="text-[10px] text-neutral-400 truncate">
                admin@vanta.com
              </div>
            </button>

            <button
              type="button"
              onClick={() => fillQuickAccount('alex@vanta.com', 'Customer@123456')}
              className="px-3 py-2 rounded-xl bg-white/5 hover:bg-orange-500/10 border border-white/10 hover:border-orange-500/40 text-left transition-all group cursor-pointer"
            >
              <div className="text-[11px] font-bold text-white group-hover:text-orange-400">
                Customer
              </div>
              <div className="text-[10px] text-neutral-400 truncate">
                alex@vanta.com
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
