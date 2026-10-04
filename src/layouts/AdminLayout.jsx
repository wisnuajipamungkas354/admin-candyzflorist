import React from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Tag, 
  Settings, 
  LogOut, 
  Flower2
} from 'lucide-react';
import { authApi } from '../services/apiService';
import ThemeToggle from '../components/ThemeToggle';

const navigationItems = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Katalog', path: '/admin/katalog', icon: Package },
  { name: 'Kategori', path: '/admin/kategori', icon: Tag },
  { name: 'Pengaturan', path: '/admin/pengaturan', icon: Settings },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await authApi.logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-floral-cream dark:bg-[#181315] text-floral-dark dark:text-floral-cream flex flex-col md:flex-row transition-colors">
      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside className="hidden md:flex md:w-64 flex-col fixed inset-y-0 left-0 bg-white dark:bg-[#221A1D] border-r border-floral-pink-200/70 dark:border-[#3D2D33] z-30 shadow-xs">
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-floral-pink-100 dark:border-[#33262A]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full overflow-hidden border border-floral-pink-200/80 dark:border-floral-pink-900/60 shadow-xs shrink-0">
              <img className="w-full h-full object-cover" src="/logo.jpg" alt="CandyzFlorist Logo" />
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-floral-dark dark:text-white block leading-none">
                CandyzFlorist
              </span>
              <span className="text-[11px] font-semibold text-floral-pink-600 dark:text-floral-pink-400">
                Admin Panel
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-floral-muted dark:text-slate-400">
            Menu Navigasi
          </div>
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-floral-pink-50 dark:bg-floral-pink-950/50 text-floral-pink-600 dark:text-floral-pink-400 font-bold border border-floral-pink-200/60 dark:border-floral-pink-900/40 shadow-xs'
                    : 'text-floral-muted dark:text-slate-300 hover:bg-floral-pink-50/50 dark:hover:bg-slate-800/60 hover:text-floral-dark dark:hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-floral-pink-500 dark:text-floral-pink-400' : 'text-slate-400'}`} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Sidebar Footer with Theme Toggle & Logout */}
        <div className="p-4 border-t border-floral-pink-100 dark:border-[#33262A] space-y-2">
          <div className="flex items-center justify-between px-2 py-1">
            <span className="text-xs text-floral-muted dark:text-slate-400">Ganti Tema</span>
            <ThemeToggle />
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar (Logout)</span>
          </button>
        </div>
      </aside>

      {/* ================= MOBILE TOP APP BAR ================= */}
      <header className="md:hidden sticky top-0 z-30 bg-white/95 dark:bg-[#221A1D]/95 backdrop-blur border-b border-floral-pink-200/70 dark:border-[#3D2D33] px-4 h-14 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full overflow-hidden border border-floral-pink-200/80 dark:border-floral-pink-900/60 shadow-xs shrink-0">
            <img className="w-full h-full object-cover" src="/logo.jpg" alt="CandyzFlorist Logo" />
          </div>
          <span className="font-bold text-sm tracking-tight text-floral-dark dark:text-white">
            CandyzFlorist
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <ThemeToggle />
          <button
            onClick={handleLogout}
            className="p-2 text-floral-muted hover:text-rose-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Keluar"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ================= MAIN CONTENT AREA ================= */}
      <main className="flex-1 md:ml-64 p-4 sm:p-6 lg:p-8 pb-24 md:pb-8 max-w-7xl w-full mx-auto">
        <Outlet />
      </main>

      {/* ================= MOBILE BOTTOM NAVIGATION (Android Style) ================= */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white/95 dark:bg-[#221A1D]/95 backdrop-blur border-t border-floral-pink-200/70 dark:border-[#3D2D33] z-40 px-2 py-1 shadow-lg shadow-black/5">
        <div className="grid grid-cols-4 items-center">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all ${
                  isActive
                    ? 'text-floral-pink-600 dark:text-floral-pink-400 font-bold'
                    : 'text-floral-muted dark:text-slate-400 hover:text-floral-dark dark:hover:text-white'
                }`}
              >
                <div
                  className={`p-1 rounded-xl transition-colors ${
                    isActive ? 'bg-floral-pink-50 dark:bg-floral-pink-950/60' : ''
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] mt-0.5 tracking-tight font-medium">
                  {item.name}
                </span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
