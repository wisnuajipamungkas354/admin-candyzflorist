import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { kategoriApi } from '../../services/apiService';

export default function KategoriFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [namaKategori, setNamaKategori] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      loadKategoriDetail();
    }
  }, [id, isEdit]);

  const loadKategoriDetail = async () => {
    setFetching(true);
    try {
      const category = await kategoriApi.getById(id);
      if (category) {
        setNamaKategori(category.nama_kategori || '');
      }
    } catch (err) {
      setError(err.message || 'Gagal memuat detail kategori');
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!namaKategori.trim()) {
      setError('Nama kategori wajib diisi.');
      return;
    }

    setLoading(true);
    try {
      if (isEdit) {
        await kategoriApi.update(id, { nama_kategori: namaKategori.trim() });
      } else {
        await kategoriApi.create({ nama_kategori: namaKategori.trim() });
      }
      navigate('/admin/kategori');
    } catch (err) {
      setError(err.message || 'Gagal menyimpan kategori ke server');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-20 gap-2 text-floral-muted text-sm">
        <Loader2 className="w-5 h-5 animate-spin text-floral-pink-500" />
        <span>Memuat data kategori...</span>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          to="/admin/kategori"
          className="p-2 rounded-xl border border-floral-pink-200 dark:border-[#3D2D33] hover:bg-floral-pink-50 dark:hover:bg-slate-800 text-floral-dark dark:text-slate-300 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-floral-dark dark:text-white">
            {isEdit ? 'Edit Kategori Bunga' : 'Tambah Kategori Bunga'}
          </h1>
          <p className="text-xs sm:text-sm text-floral-muted dark:text-slate-400">
            {isEdit ? 'Perbarui nama kategori produk' : 'Buat kategori baru untuk pengelompokan buket'}
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white dark:bg-[#221A1D] border border-floral-pink-200/70 dark:border-[#3D2D33] rounded-3xl p-6 shadow-xs">
        {error && (
          <div className="mb-4 p-3 text-xs sm:text-sm text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Nama Kategori */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-floral-dark dark:text-slate-300 uppercase tracking-wider">
              Nama Kategori <span className="text-floral-pink-500">*</span>
            </label>
            <input
              type="text"
              value={namaKategori}
              onChange={(e) => setNamaKategori(e.target.value)}
              placeholder="Contoh: Fresh Flower Bouquet"
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-[#2E2428] border border-floral-pink-200/80 dark:border-[#3D2D33] rounded-xl text-xs sm:text-sm text-floral-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-floral-pink-500"
              required
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-floral-pink-100 dark:border-[#33262A]">
            <Link
              to="/admin/kategori"
              className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold text-floral-dark dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Batal
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-floral-pink-500 hover:bg-floral-pink-600 active:scale-95 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-floral-pink-500/20 transition-all disabled:opacity-70"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>{isEdit ? 'Simpan Perubahan' : 'Simpan Kategori'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
