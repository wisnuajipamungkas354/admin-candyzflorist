import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, 
  Tag, 
  Settings, 
  Plus, 
  ArrowUpRight, 
  ShoppingBag, 
  MessageSquare,
  LayoutDashboard,
  Loader2
} from 'lucide-react';
import { dashboardApi } from '../../services/apiService';

export default function DashboardPage() {
  const [statsData, setStatsData] = useState({
    total_produk: 0,
    total_kategori: 0,
    nomor_wa: '-',
    produk_terbaru: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    setLoading(true);
    try {
      const data = await dashboardApi.getStats();
      setStatsData(data);
    } catch (err) {
      console.error('Gagal mengambil data dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      label: 'Katalog Produk',
      value: statsData.total_produk ?? 0,
      desc: 'Buket & rangkaian aktif',
      icon: Package,
      color: 'text-floral-pink-600 bg-floral-pink-50 dark:bg-floral-pink-950/40 border-floral-pink-200 dark:border-floral-pink-900/30',
      link: '/admin/katalog'
    },
    {
      label: 'Kategori Bunga',
      value: statsData.total_kategori ?? 0,
      desc: 'Grup klasifikasi buket',
      icon: Tag,
      color: 'text-floral-gold-600 bg-floral-gold-50 dark:bg-floral-gold-950/40 border-floral-gold-200 dark:border-floral-gold-900/30',
      link: '/admin/kategori'
    },
    {
      label: 'Nomor WhatsApp CS',
      value: statsData.nomor_wa || '0896-8803-5866',
      desc: 'Order WhatsApp langsung',
      icon: MessageSquare,
      color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/30',
      link: '/admin/pengaturan'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-floral-dark dark:text-white flex items-center gap-2">
            <LayoutDashboard className="w-6 h-6 text-floral-pink-500" />
            <span>Dashboard Admin</span>
          </h1>
          <p className="text-xs sm:text-sm text-floral-muted dark:text-slate-400 mt-1">
            Ringkasan data katalog, kategori, dan kontak operasional CandyzFlorist
          </p>
        </div>

        <Link
          to="/admin/katalog/tambah"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-floral-pink-500 hover:bg-floral-pink-600 active:scale-95 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-lg shadow-floral-pink-500/20 transition-all w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Produk</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Link
              key={i}
              to={stat.link}
              className="bg-white dark:bg-[#221A1D] border border-floral-pink-200/70 dark:border-[#3D2D33] rounded-2xl p-5 hover:border-floral-pink-400 dark:hover:border-floral-pink-700 transition-all group flex flex-col justify-between shadow-xs hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className={`p-3 rounded-xl border ${stat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-floral-muted/40 group-hover:text-floral-pink-500 transition-colors" />
              </div>
              <div className="mt-4">
                <span className="text-xs text-floral-muted dark:text-slate-400 font-medium block">
                  {stat.label}
                </span>
                <span className="text-2xl font-extrabold text-floral-dark dark:text-white mt-1 block">
                  {loading ? '...' : stat.value}
                </span>
                <span className="text-[11px] text-floral-muted/80 dark:text-slate-500 mt-0.5 block">
                  {stat.desc}
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Action & Recent Products Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Products List */}
        <div className="lg:col-span-2 bg-white dark:bg-[#221A1D] border border-floral-pink-200/70 dark:border-[#3D2D33] rounded-2xl p-5 sm:p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-floral-pink-100 dark:border-[#33262A] pb-3">
            <h2 className="text-sm font-bold text-floral-dark dark:text-white flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-floral-pink-500" />
              <span>Produk Katalog Terbaru</span>
            </h2>
            <Link
              to="/admin/katalog"
              className="text-xs font-semibold text-floral-pink-600 hover:text-floral-pink-700 hover:underline"
            >
              Lihat Semua
            </Link>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8 text-floral-muted gap-2 text-xs">
              <Loader2 className="w-4 h-4 animate-spin text-floral-pink-500" />
              <span>Memuat data...</span>
            </div>
          ) : (
            <div className="divide-y divide-floral-pink-100 dark:divide-[#33262A]">
              {(statsData.produk_terbaru || []).map((item) => (
                <div key={item.id} className="py-3 flex items-center gap-3">
                  <img
                    src={item.foto || 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=150&q=80'}
                    alt={item.nama_produk}
                    className="w-12 h-16 rounded-xl object-cover border border-floral-pink-200/60 dark:border-[#3D2D33] flex-shrink-0 aspect-[3/4]"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs sm:text-sm font-bold text-floral-dark dark:text-white truncate">
                      {item.nama_produk}
                    </h3>
                    <p className="text-xs text-floral-pink-600 dark:text-floral-pink-400 font-bold">
                      Rp {Number(item.harga || 0).toLocaleString('id-ID')}
                    </p>
                  </div>
                  <Link
                    to={`/admin/katalog/edit/${item.id}`}
                    className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-floral-pink-200 dark:border-[#3D2D33] hover:bg-floral-pink-50 dark:hover:bg-slate-800 text-floral-dark dark:text-white transition-colors"
                  >
                    Edit
                  </Link>
                </div>
              ))}
              {(!statsData.produk_terbaru || statsData.produk_terbaru.length === 0) && (
                <p className="text-xs text-slate-400 py-6 text-center">Belum ada produk yang ditambahkan.</p>
              )}
            </div>
          )}
        </div>

        {/* Quick Shortcuts */}
        <div className="bg-white dark:bg-[#221A1D] border border-floral-pink-200/70 dark:border-[#3D2D33] rounded-2xl p-5 sm:p-6 space-y-4 shadow-xs">
          <h2 className="text-sm font-bold text-floral-dark dark:text-white border-b border-floral-pink-100 dark:border-[#33262A] pb-3">
            Pintasan Menu
          </h2>

          <div className="space-y-2.5">
            <Link
              to="/admin/katalog/tambah"
              className="flex items-center gap-3 p-3 rounded-xl border border-floral-pink-100 dark:border-[#33262A] hover:border-floral-pink-300 hover:bg-floral-pink-50/50 dark:hover:bg-floral-pink-950/20 transition-all text-sm font-medium"
            >
              <div className="p-2 rounded-xl bg-floral-pink-100 dark:bg-floral-pink-950/60 text-floral-pink-600">
                <Plus className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <span className="block text-floral-dark dark:text-white text-xs font-bold">
                  Tambah Produk Baru
                </span>
                <span className="text-[11px] text-floral-muted dark:text-slate-400">
                  Upload buket atau bunga ke katalog
                </span>
              </div>
            </Link>

            <Link
              to="/admin/kategori/tambah"
              className="flex items-center gap-3 p-3 rounded-xl border border-floral-gold-100 dark:border-[#3D2D33] hover:border-floral-gold-300 hover:bg-floral-gold-50/50 dark:hover:bg-floral-gold-950/20 transition-all text-sm font-medium"
            >
              <div className="p-2 rounded-xl bg-floral-gold-100 dark:bg-floral-gold-950/60 text-floral-gold-600">
                <Tag className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <span className="block text-floral-dark dark:text-white text-xs font-bold">
                  Tambah Kategori Baru
                </span>
                <span className="text-[11px] text-floral-muted dark:text-slate-400">
                  Buat klasifikasi buket/vas
                </span>
              </div>
            </Link>

            <Link
              to="/admin/pengaturan"
              className="flex items-center gap-3 p-3 rounded-xl border border-floral-pink-100 dark:border-[#33262A] hover:border-floral-pink-300 hover:bg-floral-pink-50/50 dark:hover:bg-floral-pink-950/20 transition-all text-sm font-medium"
            >
              <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                <Settings className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <span className="block text-floral-dark dark:text-white text-xs font-bold">
                  Pengaturan Kontak WA
                </span>
                <span className="text-[11px] text-floral-muted dark:text-slate-400">
                  Atur nomor WA & link medsos
                </span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
