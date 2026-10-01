import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Flower2, Lock, Mail, ArrowRight, Sparkles } from 'lucide-react';
import { authApi } from '../services/apiService';
import ThemeToggle from '../components/ThemeToggle';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Email atau username wajib diisi.');
      return;
    }

    if (!password) {
      setError('Password wajib diisi.');
      return;
    }

    setLoading(true);
    try {
      await authApi.login(email.trim(), password);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message || 'Login gagal. Pastikan backend Go aktif.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center bg-floral-cream dark:bg-slate-950 p-4 sm:p-6 transition-colors relative overflow-hidden">
      {/* Decorative floral background blurs */}
      <div className="absolute -top-32 -left-32 w-80 h-80 bg-floral-pink-200/50 dark:bg-floral-pink-900/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-floral-gold-200/40 dark:bg-floral-gold-900/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top right theme toggle */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Card Container */}
        <div className="bg-white dark:bg-slate-900 border border-floral-pink-200/70 dark:border-slate-800 rounded-3xl shadow-xl shadow-floral-pink-500/5 p-6 sm:p-9 space-y-6">
          {/* Brand Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-floral-pink-50 dark:bg-floral-pink-950/60 text-floral-pink-500 mb-2 border border-floral-pink-200/60 dark:border-floral-pink-900/40 shadow-xs">
              <Flower2 className="w-7 h-7" />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-floral-pink-50 dark:bg-floral-pink-950/50 text-[11px] font-semibold text-floral-pink-600 dark:text-floral-pink-400 border border-floral-pink-200/60">
              <Sparkles className="w-3 h-3" />
              <span>Florist Karawang Admin</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-floral-dark dark:text-white font-sans">
              CandyzFlorist
            </h1>
            <p className="text-xs sm:text-sm text-floral-muted dark:text-slate-400">
              Masuk ke panel manajemen katalog & kontak toko
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 text-xs sm:text-sm text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-floral-dark/80 dark:text-slate-300">
                Email / Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@candyzflorist.com"
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck="false"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-floral-pink-200/80 dark:border-slate-700 rounded-xl text-floral-dark dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-floral-pink-500 transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-floral-dark/80 dark:text-slate-300">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-floral-pink-200/80 dark:border-slate-700 rounded-xl text-floral-dark dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-floral-pink-500 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-floral-pink-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-floral-pink-500 hover:bg-floral-pink-600 active:scale-[0.99] text-white font-semibold rounded-xl shadow-lg shadow-floral-pink-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed text-xs sm:text-sm"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Menghubungkan ke Server...
                  </span>
                ) : (
                  <>
                    <span>Masuk ke Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Demo helper */}
          <div className="pt-2 text-center text-[11px] text-floral-muted dark:text-slate-500 border-t border-floral-pink-100 dark:border-slate-800">
            <p>Akun Default: <span className="font-mono text-floral-dark dark:text-slate-300">admin@candyzflorist.com</span> / <span className="font-mono text-floral-dark dark:text-slate-300">admin123</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}
