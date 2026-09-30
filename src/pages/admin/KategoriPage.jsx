import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, Tag, Search, AlertCircle, Loader2 } from 'lucide-react';
import { kategoriApi } from '../../services/apiService';

export default function KategoriPage() {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const data = await kategoriApi.getAll();
      setCategories(data);
    } catch (err) {
      setErrorMsg(err.message || 'Gagal memuat kategori dari server');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await kategoriApi.delete(deleteTarget.id);
      setDeleteTarget(null);
      await loadCategories();
    } catch (err) {
      alert(err.message || 'Gagal menghapus kategori');
    } finally {
      setDeleting(false);
    }
  };

  const filteredCategories = categories.filter((c) =>
    c.nama_kategori?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-floral-dark dark:text-white flex items-center gap-2">
            <Tag className="w-6 h-6 text-floral-pink-500" />
            <span>Kategori Bunga & Buket</span>
          </h1>
          <p className="text-xs sm:text-sm text-floral-muted dark:text-slate-400 mt-1">
            Kelola kategori untuk mengelompokkan katalog produk toko CandyzFlorist
          </p>
        </div>

        <Link
          to="/admin/kategori/tambah"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-floral-pink-500 hover:bg-floral-pink-600 active:scale-95 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-lg shadow-floral-pink-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Kategori</span>
        </Link>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs sm:text-sm text-rose-600 dark:text-rose-400 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Table Container & Filter */}
      <div className="bg-white dark:bg-[#221A1D] border border-floral-pink-200/70 dark:border-[#3D2D33] rounded-2xl overflow-hidden shadow-xs">
        {/* Search Header */}
        <div className="p-4 border-b border-floral-pink-100 dark:border-[#33262A] flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama kategori..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-[#2E2428] border border-floral-pink-200/80 dark:border-[#3D2D33] rounded-xl focus:outline-none focus:ring-2 focus:ring-floral-pink-500"
            />
          </div>
          <span className="text-xs text-floral-muted dark:text-slate-400 font-medium">
            Total: {filteredCategories.length} Kategori
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-floral-pink-50/50 dark:bg-[#2A2024] text-floral-muted dark:text-slate-400 border-b border-floral-pink-200/60 dark:border-[#3D2D33] uppercase text-[11px] tracking-wider font-semibold">
              <tr>
                <th className="px-5 py-3.5 w-16">No</th>
                <th className="px-5 py-3.5">Nama Kategori</th>
                <th className="px-5 py-3.5 text-right w-28">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-floral-pink-100 dark:divide-[#33262A] text-floral-dark dark:text-slate-300 font-medium">
              {loading ? (
                <tr>
                  <td colSpan="3" className="text-center py-12 text-floral-muted">
                    <div className="inline-flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-floral-pink-500" />
                      <span>Memuat data dari server backend...</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredCategories.map((item, index) => (
                  <tr key={item.id} className="hover:bg-floral-pink-50/30 dark:hover:bg-[#2A2024]/40 transition-colors">
                    <td className="px-5 py-4 text-floral-muted dark:text-slate-500 font-mono text-xs">{index + 1}</td>
                    <td className="px-5 py-4 font-bold text-floral-dark dark:text-white">
                      {item.nama_kategori}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <Link
                          to={`/admin/kategori/edit/${item.id}`}
                          className="p-2 rounded-lg text-floral-muted hover:text-floral-pink-600 hover:bg-floral-pink-50 dark:hover:bg-slate-800 transition-colors"
                          title="Edit Kategori"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => setDeleteTarget(item)}
                          className="p-2 rounded-lg text-floral-muted hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                          title="Hapus Kategori"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}

              {!loading && filteredCategories.length === 0 && (
                <tr>
                  <td colSpan="3" className="text-center py-12 text-floral-muted">
                    Tidak ada kategori yang ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#221A1D] border border-floral-pink-200 dark:border-[#3D2D33] rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1.5">
              <h3 className="text-base font-bold text-floral-dark dark:text-white">
                Hapus Kategori?
              </h3>
              <p className="text-xs text-floral-muted dark:text-slate-400">
                Apakah Anda yakin ingin menghapus kategori <span className="font-bold text-floral-dark dark:text-slate-200">"{deleteTarget.nama_kategori}"</span>?
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
