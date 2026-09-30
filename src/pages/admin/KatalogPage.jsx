import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Package, 
  Search, 
  AlertCircle, 
  Image as ImageIcon, 
  Loader2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react';
import { katalogApi, kategoriApi } from '../../services/apiService';

export default function KatalogPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCatFilter, setSelectedCatFilter] = useState('ALL');
  const [deleteTarget, setDeleteTarget] = useState(null);
  
  // Pagination State
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 10,
    total_items: 0,
    total_pages: 1,
  });

  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [page, limit, selectedCatFilter]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      loadProducts();
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const loadCategories = async () => {
    try {
      const catData = await kategoriApi.getAll();
      setCategories(catData);
    } catch (err) {
      console.error('Gagal mengambil kategori:', err);
    }
  };

  const loadProducts = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await katalogApi.getAll({
        page,
        limit,
        search: searchTerm,
        kategori_id: selectedCatFilter !== 'ALL' ? selectedCatFilter : '',
      });

      let items = res.items || [];
      let pag = res.pagination || {
        current_page: page,
        per_page: limit,
        total_items: items.length,
        total_pages: Math.ceil(items.length / limit) || 1,
      };

      // Safety: Jika data belum dipotong backend, potong di client
      if (items.length > limit) {
        const total = items.length;
        const totalP = Math.ceil(total / limit) || 1;
        const start = (page - 1) * limit;
        items = items.slice(start, start + limit);
        pag = {
          current_page: page,
          per_page: limit,
          total_items: total,
          total_pages: totalP,
        };
      }

      setProducts(items);
      setPagination(pag);
    } catch (err) {
      setErrorMsg(err.message || 'Gagal memuat produk dari server backend');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await katalogApi.delete(deleteTarget.id);
      setDeleteTarget(null);
      await loadProducts();
    } catch (err) {
      alert(err.message || 'Gagal menghapus produk');
    } finally {
      setDeleting(false);
    }
  };

  const getCategoryNames = (kategoriList) => {
    if (!kategoriList || !Array.isArray(kategoriList)) return [];
    return kategoriList.map((c) => (typeof c === 'object' ? c.nama_kategori : c));
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.total_pages && newPage !== page) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const startItem = pagination.total_items === 0 ? 0 : (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, pagination.total_items);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-floral-dark dark:text-white flex items-center gap-2">
            <Package className="w-6 h-6 text-floral-pink-500" />
            <span>Katalog Produk & Buket</span>
          </h1>
          <p className="text-xs sm:text-sm text-floral-muted dark:text-slate-400 mt-1">
            Kelola foto, harga, dan variasi buket bunga yang tersedia untuk pelanggan CandyzFlorist
          </p>
        </div>

        <Link
          to="/admin/katalog/tambah"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-floral-pink-500 hover:bg-floral-pink-600 active:scale-95 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-lg shadow-floral-pink-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Produk</span>
        </Link>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs sm:text-sm text-rose-600 dark:text-rose-400 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-[#221A1D] border border-floral-pink-200/70 dark:border-[#3D2D33] rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="relative w-full sm:max-w-xs">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama atau deskripsi produk..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-[#2E2428] border border-floral-pink-200/80 dark:border-[#3D2D33] rounded-xl focus:outline-none focus:ring-2 focus:ring-floral-pink-500"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2.5 w-full sm:w-auto">
          {/* Category Filter */}
          <select
            value={selectedCatFilter}
            onChange={(e) => {
              setSelectedCatFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-[#2E2428] border border-floral-pink-200/80 dark:border-[#3D2D33] rounded-xl text-floral-dark dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-floral-pink-500"
          >
            <option value="ALL">Semua Kategori</option>
            {categories.map((c) => (
              <option key={c.id} value={String(c.id)}>
                {c.nama_kategori}
              </option>
            ))}
          </select>

          {/* Limit / Per-Page Filter */}
          <div className="flex items-center gap-1.5 text-xs text-floral-muted">
            <span>Tampil:</span>
            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
              className="px-2.5 py-2 text-xs bg-slate-50 dark:bg-[#2E2428] border border-floral-pink-200/80 dark:border-[#3D2D33] rounded-xl text-floral-dark dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-floral-pink-500 font-semibold"
            >
              <option value="6">6</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="bg-white dark:bg-[#221A1D] border border-floral-pink-200/70 dark:border-[#3D2D33] rounded-2xl p-12 text-center text-xs text-floral-muted flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-floral-pink-500" />
          <span>Memuat data katalog dari server backend...</span>
        </div>
      ) : (
        <>
          {/* ================= MOBILE VIEW: E-COMMERCE STYLE 2-COLUMN GRID ================= */}
          <div className="block md:hidden">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {products.map((item) => {
                const catNames = getCategoryNames(item.kategori);
                const mainPhoto = item.foto_produk?.[0];
                const totalPhotos = item.foto_produk?.length || 0;

                return (
                  <div
                    key={item.id}
                    className="bg-white dark:bg-[#221A1D] border border-floral-pink-200/70 dark:border-[#3D2D33] rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between"
                  >
                    {/* Product Image (3:4 Portrait) */}
                    <div className="relative aspect-[3/4] w-full bg-floral-cream dark:bg-[#2E2428] overflow-hidden border-b border-floral-pink-100 dark:border-[#33262A]">
                      {mainPhoto ? (
                        <img
                          src={mainPhoto}
                          alt={item.nama_produk}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-floral-muted">
                          <ImageIcon className="w-8 h-8" />
                        </div>
                      )}

                      {totalPhotos > 1 && (
                        <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-[10px] text-white font-mono">
                          +{totalPhotos - 1} Foto
                        </span>
                      )}
                    </div>

                    {/* Content info */}
                    <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                      <div className="space-y-1">
                        {/* Category Badges */}
                        {catNames.length > 0 && (
                          <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold bg-floral-pink-50 dark:bg-floral-pink-950/60 text-floral-pink-600 dark:text-floral-pink-400 border border-floral-pink-200/70 dark:border-floral-pink-900/40 line-clamp-1 max-w-full">
                            {catNames[0]} {catNames.length > 1 ? `+${catNames.length - 1}` : ''}
                          </span>
                        )}

                        {/* Product Name */}
                        <h3 className="font-bold text-xs text-floral-dark dark:text-white line-clamp-2 leading-snug">
                          {item.nama_produk}
                        </h3>

                        {/* Price */}
                        <div className="text-xs sm:text-sm font-extrabold text-floral-pink-600 dark:text-floral-pink-400 pt-0.5">
                          Rp {Number(item.harga || 0).toLocaleString('id-ID')}
                        </div>
                      </div>

                      {/* Mobile Action Buttons (Edit & Hapus) */}
                      <div className="pt-2 grid grid-cols-2 gap-1.5 border-t border-floral-pink-100 dark:border-[#33262A]">
                        <Link
                          to={`/admin/katalog/edit/${item.id}`}
                          className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl bg-floral-pink-50 hover:bg-floral-pink-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-floral-pink-700 dark:text-floral-pink-300 text-[11px] font-bold border border-floral-pink-200/60 dark:border-[#3D2D33] transition-colors"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>Edit</span>
                        </Link>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(item)}
                          className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/50 text-rose-600 dark:text-rose-400 text-[11px] font-bold border border-rose-200 dark:border-rose-900/40 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Hapus</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {products.length === 0 && (
              <div className="bg-white dark:bg-[#221A1D] border border-floral-pink-200/70 dark:border-[#3D2D33] rounded-2xl p-8 text-center text-xs text-floral-muted">
                Tidak ada produk katalog yang ditemukan.
              </div>
            )}
          </div>

          {/* ================= DESKTOP VIEW: FULL DATA TABLE ================= */}
          <div className="hidden md:block bg-white dark:bg-[#221A1D] border border-floral-pink-200/70 dark:border-[#3D2D33] rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-floral-pink-50/50 dark:bg-[#2A2024] text-floral-muted dark:text-slate-400 border-b border-floral-pink-200/60 dark:border-[#3D2D33] uppercase text-[11px] tracking-wider font-semibold">
                  <tr>
                    <th className="px-5 py-3.5 w-20">Foto</th>
                    <th className="px-5 py-3.5">Nama Produk</th>
                    <th className="px-5 py-3.5">Kategori</th>
                    <th className="px-5 py-3.5">Harga</th>
                    <th className="px-5 py-3.5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-floral-pink-100 dark:divide-[#33262A] text-floral-dark dark:text-slate-300 font-medium">
                  {products.map((item) => {
                    const catNames = getCategoryNames(item.kategori);
                    const mainPhoto = item.foto_produk?.[0];
                    const totalPhotos = item.foto_produk?.length || 0;

                    return (
                      <tr key={item.id} className="hover:bg-floral-pink-50/30 dark:hover:bg-[#2A2024]/40 transition-colors">
                        {/* Thumbnail (3:4 Portrait) */}
                        <td className="px-5 py-3">
                          <div className="relative w-12 h-16 aspect-[3/4] rounded-xl overflow-hidden bg-floral-cream dark:bg-[#2E2428] border border-floral-pink-200 dark:border-[#3D2D33] flex-shrink-0">
                            {mainPhoto ? (
                              <img
                                src={mainPhoto}
                                alt={item.nama_produk}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-floral-muted">
                                <ImageIcon className="w-6 h-6" />
                              </div>
                            )}
                            {totalPhotos > 1 && (
                              <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded-md bg-black/70 text-[10px] text-white font-mono">
                                +{totalPhotos - 1}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Nama Produk & Slug */}
                        <td className="px-5 py-4">
                          <div className="font-bold text-floral-dark dark:text-white">
                            {item.nama_produk}
                          </div>
                          <div className="text-[11px] font-mono text-floral-muted mt-0.5">
                            {item.slug}
                          </div>
                        </td>

                        {/* Kategori Tags */}
                        <td className="px-5 py-4">
                          <div className="flex flex-wrap gap-1">
                            {catNames.length > 0 ? (
                              catNames.map((name, i) => (
                                <span
                                  key={i}
                                  className="inline-block px-2 py-0.5 rounded-md text-[11px] font-semibold bg-floral-pink-50 dark:bg-floral-pink-950/50 text-floral-pink-600 dark:text-floral-pink-400 border border-floral-pink-200/80 dark:border-floral-pink-900/30"
                                >
                                  {name}
                                </span>
                              ))
                            ) : (
                              <span className="text-xs text-floral-muted">-</span>
                            )}
                          </div>
                        </td>

                        {/* Harga */}
                        <td className="px-5 py-4 font-bold text-floral-dark dark:text-white">
                          Rp {Number(item.harga || 0).toLocaleString('id-ID')}
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <Link
                              to={`/admin/katalog/edit/${item.id}`}
                              className="p-2 rounded-lg text-floral-muted hover:text-floral-pink-600 hover:bg-floral-pink-50 dark:hover:bg-slate-800 transition-colors"
                              title="Edit Produk"
                            >
                              <Edit2 className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => setDeleteTarget(item)}
                              className="p-2 rounded-lg text-floral-muted hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                              title="Hapus Produk"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {products.length === 0 && (
                    <tr>
                      <td colSpan="5" className="text-center py-12 text-floral-muted">
                        Tidak ada produk katalog yang ditemukan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* ================= PAGINATION CONTROLS ================= */}
          {pagination.total_items > 0 && (
            <div className="bg-white dark:bg-[#221A1D] border border-floral-pink-200/70 dark:border-[#3D2D33] rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
              {/* Summary Text */}
              <div className="text-xs text-floral-muted dark:text-slate-400 text-center sm:text-left font-medium">
                Menampilkan <span className="font-bold text-floral-dark dark:text-white">{startItem}</span> –{' '}
                <span className="font-bold text-floral-dark dark:text-white">{endItem}</span> dari{' '}
                <span className="font-bold text-floral-dark dark:text-white">{pagination.total_items}</span> produk (Halaman {pagination.current_page} dari {pagination.total_pages})
              </div>

              {/* Navigation Buttons */}
              <div className="flex items-center gap-1">
                {/* First Page */}
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => handlePageChange(1)}
                  className="p-2 rounded-xl border border-floral-pink-200/80 dark:border-[#3D2D33] text-floral-dark dark:text-slate-300 hover:bg-floral-pink-50 dark:hover:bg-[#2E2428] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  title="Halaman Pertama"
                >
                  <ChevronsLeft className="w-4 h-4" />
                </button>

                {/* Prev */}
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => handlePageChange(page - 1)}
                  className="p-2 rounded-xl border border-floral-pink-200/80 dark:border-[#3D2D33] text-floral-dark dark:text-slate-300 hover:bg-floral-pink-50 dark:hover:bg-[#2E2428] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  title="Halaman Sebelumnya"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Page Number Pills */}
                {Array.from({ length: pagination.total_pages }, (_, i) => i + 1)
                  .filter((pNum) => {
                    // Show current page, first, last, and adjacent pages
                    return (
                      pNum === 1 ||
                      pNum === pagination.total_pages ||
                      Math.abs(pNum - page) <= 1
                    );
                  })
                  .map((pNum, index, arr) => {
                    const isCurrent = pNum === page;
                    const prevPNum = arr[index - 1];
                    const showEllipsis = prevPNum && pNum - prevPNum > 1;

                    return (
                      <React.Fragment key={pNum}>
                        {showEllipsis && (
                          <span className="px-2 text-xs text-floral-muted">...</span>
                        )}
                        <button
                          type="button"
                          onClick={() => handlePageChange(pNum)}
                          className={`min-w-8 h-8 px-2.5 rounded-xl text-xs font-bold transition-all ${
                            isCurrent
                              ? 'bg-floral-pink-500 text-white shadow-xs shadow-floral-pink-500/30 scale-105'
                              : 'border border-floral-pink-200/80 dark:border-[#3D2D33] text-floral-dark dark:text-slate-300 hover:bg-floral-pink-50 dark:hover:bg-[#2E2428]'
                          }`}
                        >
                          {pNum}
                        </button>
                      </React.Fragment>
                    );
                  })}

                {/* Next */}
                <button
                  type="button"
                  disabled={page >= pagination.total_pages}
                  onClick={() => handlePageChange(page + 1)}
                  className="p-2 rounded-xl border border-floral-pink-200/80 dark:border-[#3D2D33] text-floral-dark dark:text-slate-300 hover:bg-floral-pink-50 dark:hover:bg-[#2E2428] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  title="Halaman Selanjutnya"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                {/* Last Page */}
                <button
                  type="button"
                  disabled={page >= pagination.total_pages}
                  onClick={() => handlePageChange(pagination.total_pages)}
                  className="p-2 rounded-xl border border-floral-pink-200/80 dark:border-[#3D2D33] text-floral-dark dark:text-slate-300 hover:bg-floral-pink-50 dark:hover:bg-[#2E2428] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  title="Halaman Terakhir"
                >
                  <ChevronsRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#221A1D] border border-floral-pink-200 dark:border-[#3D2D33] rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1.5">
              <h3 className="text-base font-bold text-floral-dark dark:text-white">
                Hapus Produk?
              </h3>
              <p className="text-xs text-floral-muted dark:text-slate-400">
                Apakah Anda yakin ingin menghapus produk <span className="font-bold text-floral-dark dark:text-slate-200">"{deleteTarget.nama_produk}"</span> dari katalog?
              </p>
            </div>
            <div className="flex gap-2.5 pt-2">
              <button
                disabled={deleting}
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold text-floral-dark dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-60"
              >
                Batal
              </button>
              <button
                disabled={deleting}
                onClick={handleDeleteConfirm}
                className="flex-1 py-2.5 px-4 rounded-xl bg-rose-500 hover:bg-rose-600 text-xs sm:text-sm font-semibold text-white transition-colors disabled:opacity-60 flex items-center justify-center gap-1.5"
              >
                {deleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{deleting ? 'Menghapus...' : 'Ya, Hapus'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
