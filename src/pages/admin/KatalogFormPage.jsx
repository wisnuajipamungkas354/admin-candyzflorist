import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  Upload, 
  X, 
  AlertCircle, 
  Check, 
  Tag, 
  Loader2,
  Crop as CropIcon,
  Sparkles
} from 'lucide-react';
import { katalogApi, kategoriApi } from '../../services/apiService';
import ImageCropperModal from '../../components/ImageCropperModal';

const generateSlug = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
};

const MAX_FILE_SIZE_MB = 2;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export default function KatalogFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [categories, setCategories] = useState([]);
  const [namaProduk, setNamaProduk] = useState('');
  const [slug, setSlug] = useState('');
  const [isManualSlug, setIsManualSlug] = useState(false);
  const [harga, setHarga] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  
  // Existing photo URLs (from backend) and new File objects
  const [existingPhotos, setExistingPhotos] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [newFilePreviews, setNewFilePreviews] = useState([]);

  // Cropper Modal State
  const [cropperState, setCropperState] = useState({
    isOpen: false,
    imageSrc: '',
    fileName: 'product.jpg',
    targetType: 'new', // 'new' | 'existing'
    targetIndex: 0,
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    initForm();
  }, [id, isEdit]);

  const initForm = async () => {
    setFetching(true);
    try {
      const catData = await kategoriApi.getAll();
      setCategories(catData);

      if (isEdit) {
        const product = await katalogApi.getById(id);
        if (product) {
          setNamaProduk(product.nama_produk || '');
          setSlug(product.slug || '');
          setIsManualSlug(true);
          setHarga(product.harga || '');
          setDeskripsi(product.deskripsi || '');
          
          const catIds = (product.kategori || []).map((c) => (typeof c === 'object' ? String(c.id) : String(c)));
          setSelectedCategories(catIds);
          setExistingPhotos(product.foto_produk || []);
        }
      }
    } catch (err) {
      setError(err.message || 'Gagal memuat data dari server');
    } finally {
      setFetching(false);
    }
  };

  const handleNamaChange = (e) => {
    const value = e.target.value;
    setNamaProduk(value);
    if (!isManualSlug) {
      setSlug(generateSlug(value));
    }
  };

  const handleSlugChange = (e) => {
    setIsManualSlug(true);
    setSlug(generateSlug(e.target.value));
  };

  const handleToggleCategory = (catId) => {
    const idStr = String(catId);
    setSelectedCategories((prev) =>
      prev.includes(idStr) ? prev.filter((i) => i !== idStr) : [...prev, idStr]
    );
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    setError('');

    const validNewFiles = [];
    const validNewPreviews = [];

    for (let file of files) {
      if (file.size > MAX_FILE_SIZE_BYTES) {
        setError(`Ukuran file "${file.name}" melebihi batas 2MB.`);
        return;
      }

      if (!file.type.startsWith('image/')) {
        setError(`File "${file.name}" bukan format gambar yang didukung.`);
        return;
      }

      validNewFiles.push(file);
      validNewPreviews.push(URL.createObjectURL(file));
    }

    if (validNewFiles.length === 0) return;

    const currentNewCount = newFiles.length;
    setNewFiles((prev) => [...prev, ...validNewFiles]);
    setNewFilePreviews((prev) => [...prev, ...validNewPreviews]);

    // Jika upload 1 foto, langsung buka modal crop untuk kenyamanan
    if (validNewFiles.length === 1) {
      setCropperState({
        isOpen: true,
        imageSrc: validNewPreviews[0],
        fileName: validNewFiles[0].name,
        targetType: 'new',
        targetIndex: currentNewCount,
      });
    }

    e.target.value = '';
  };

  const handleOpenCropModal = (type, index) => {
    const src = type === 'existing' ? existingPhotos[index] : newFilePreviews[index];
    const name = type === 'existing' ? `existing-${index}.jpg` : (newFiles[index]?.name || `photo-${index}.jpg`);

    setCropperState({
      isOpen: true,
      imageSrc: src,
      fileName: name,
      targetType: type,
      targetIndex: index,
    });
  };

  const handleCropComplete = ({ file, url }) => {
    const { targetType, targetIndex } = cropperState;

    if (targetType === 'new') {
      setNewFiles((prev) => {
        const next = [...prev];
        next[targetIndex] = file;
        return next;
      });
      setNewFilePreviews((prev) => {
        const next = [...prev];
        next[targetIndex] = url;
        return next;
      });
    } else if (targetType === 'existing') {
      // Hapus dari existing, tambahkan sebagai new file hasil crop
      setExistingPhotos((prev) => prev.filter((_, idx) => idx !== targetIndex));
      setNewFiles((prev) => [...prev, file]);
      setNewFilePreviews((prev) => [...prev, url]);
    }
  };

  const handleRemoveExistingPhoto = (indexToRemove) => {
    setExistingPhotos((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleRemoveNewPhoto = (indexToRemove) => {
    setNewFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    setNewFilePreviews((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!namaProduk.trim()) {
      setError('Nama produk wajib diisi.');
      return;
    }

    if (!slug.trim()) {
      setError('Slug wajib diisi.');
      return;
    }

    if (!harga || Number(harga) <= 0) {
      setError('Harga produk harus diisi dengan angka valid.');
      return;
    }

    if (existingPhotos.length === 0 && newFiles.length === 0) {
      setError('Harap upload setidaknya 1 foto produk.');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('nama_produk', namaProduk.trim());
      formData.append('slug', slug.trim());
      formData.append('harga', String(harga));
      formData.append('deskripsi', deskripsi.trim());
      formData.append('kategori_ids', selectedCategories.join(','));

      // Attach new/cropped files
      for (let file of newFiles) {
        formData.append('images', file);
      }

      if (isEdit) {
        await katalogApi.update(id, formData);
      } else {
        await katalogApi.create(formData);
      }

      navigate('/admin/katalog');
    } catch (err) {
      setError(err.message || 'Gagal menyimpan produk ke backend');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-20 gap-2 text-floral-muted text-sm">
        <Loader2 className="w-5 h-5 animate-spin text-floral-pink-500" />
        <span>Memuat data produk...</span>
      </div>
    );
  }

  const totalPhotosCount = existingPhotos.length + newFilePreviews.length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          to="/admin/katalog"
          className="p-2 rounded-xl border border-floral-pink-200 dark:border-[#3D2D33] hover:bg-floral-pink-50 dark:hover:bg-slate-800 text-floral-dark dark:text-slate-300 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-floral-dark dark:text-white">
            {isEdit ? 'Edit Produk Bunga' : 'Tambah Produk Bunga'}
          </h1>
          <p className="text-xs sm:text-sm text-floral-muted dark:text-slate-400">
            {isEdit ? 'Perbarui informasi dan foto produk katalog' : 'Tambahkan buket atau rangkaian bunga baru ke etalase CandyzFlorist'}
          </p>
        </div>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-4 text-xs sm:text-sm text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-2xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info (Col 1 & 2) */}
          <div className="lg:col-span-2 bg-white dark:bg-[#221A1D] border border-floral-pink-200/70 dark:border-[#3D2D33] rounded-3xl p-6 space-y-5 shadow-xs">
            <h2 className="text-sm font-bold text-floral-dark dark:text-white uppercase tracking-wider">
              Informasi Utama Produk
            </h2>

            {/* Nama Produk */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-floral-dark dark:text-slate-300 uppercase tracking-wider">
                Nama Produk <span className="text-floral-pink-500">*</span>
              </label>
              <input
                type="text"
                value={namaProduk}
                onChange={handleNamaChange}
                placeholder="Contoh: Blushing Rose & Baby Breath Bouquet"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-[#2E2428] border border-floral-pink-200/80 dark:border-[#3D2D33] rounded-xl text-xs sm:text-sm text-floral-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-floral-pink-500"
                required
              />
            </div>

            {/* Slug */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-floral-dark dark:text-slate-300 uppercase tracking-wider">
                  Slug URL <span className="text-floral-pink-500">*</span>
                </label>
                <span className="text-[11px] text-floral-muted">Auto-generate dari nama</span>
              </div>
              <input
                type="text"
                value={slug}
                onChange={handleSlugChange}
                placeholder="contoh: blushing-rose-baby-breath-bouquet"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-[#2E2428] border border-floral-pink-200/80 dark:border-[#3D2D33] rounded-xl text-xs sm:text-sm font-mono text-floral-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-floral-pink-500"
                required
              />
            </div>

            {/* Harga */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-floral-dark dark:text-slate-300 uppercase tracking-wider">
                Harga (Rupiah) <span className="text-floral-pink-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-xs font-bold text-floral-muted">
                  Rp
                </span>
                <input
                  type="number"
                  value={harga}
                  onChange={(e) => setHarga(e.target.value)}
                  placeholder="285000"
                  min="0"
                  className="w-full pl-12 pr-4 py-2.5 bg-slate-50 dark:bg-[#2E2428] border border-floral-pink-200/80 dark:border-[#3D2D33] rounded-xl text-xs sm:text-sm text-floral-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-floral-pink-500"
                  required
                />
              </div>
              {harga && (
                <p className="text-[11px] text-floral-pink-600 dark:text-floral-pink-400 font-semibold">
                  Tampilan: Rp {Number(harga).toLocaleString('id-ID')}
                </p>
              )}
            </div>

            {/* Deskripsi (Optional) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-floral-dark dark:text-slate-300 uppercase tracking-wider">
                  Deskripsi Produk
                </label>
                <span className="text-[11px] text-floral-muted font-normal">Opsional</span>
              </div>
              <textarea
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                placeholder="Jelaskan detail bunga, jenis wrapping, pilihan warna pita..."
                rows={4}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-[#2E2428] border border-floral-pink-200/80 dark:border-[#3D2D33] rounded-xl text-xs sm:text-sm text-floral-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-floral-pink-500"
              />
            </div>
          </div>

          {/* Photo & Categories (Col 3) */}
          <div className="space-y-6">
            {/* Foto Upload Card */}
            <div className="bg-white dark:bg-[#221A1D] border border-floral-pink-200/70 dark:border-[#3D2D33] rounded-3xl p-6 space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-floral-dark dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <span>Foto Produk</span>
                  <span className="text-floral-pink-500">*</span>
                </h2>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-floral-pink-600 bg-floral-pink-50 dark:bg-floral-pink-950/60 px-2 py-0.5 rounded-full border border-floral-pink-200/60">
                  <Sparkles className="w-3 h-3" />
                  <span>Bisa Crop</span>
                </span>
              </div>

              {/* Upload Drop Area */}
              <label className="border-2 border-dashed border-floral-pink-200 dark:border-[#3D2D33] hover:border-floral-pink-400 dark:hover:border-floral-pink-600 rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-floral-pink-50/40 dark:bg-[#2E2428]">
                <Upload className="w-6 h-6 text-floral-pink-500 mb-2" />
                <span className="text-xs font-bold text-floral-dark dark:text-slate-200">
                  Upload Foto Produk
                </span>
                <span className="text-[11px] text-floral-muted mt-1">
                  Maks. 2MB per gambar • Auto Crop Tool
                </span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {/* Photo Previews */}
              <div className="space-y-2">
                <span className="text-[11px] font-semibold text-floral-muted block uppercase">
                  Preview ({totalPhotosCount} Foto)
                </span>

                <div className="grid grid-cols-2 gap-2.5">
                  {/* Existing Photos */}
                  {existingPhotos.map((src, idx) => (
                    <div
                      key={`existing-${idx}`}
                      className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-floral-pink-200 dark:border-[#3D2D33] group bg-floral-cream dark:bg-[#2E2428]"
                    >
                      <img
                        src={src}
                        alt={`Existing ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Action buttons overlay */}
                      <div className="absolute top-1.5 right-1.5 flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenCropModal('existing', idx)}
                          className="p-1.5 bg-black/75 hover:bg-floral-pink-600 text-white rounded-lg transition-colors shadow-xs"
                          title="Edit / Crop Foto"
                        >
                          <CropIcon className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveExistingPhoto(idx)}
                          className="p-1.5 bg-black/75 hover:bg-rose-600 text-white rounded-lg transition-colors shadow-xs"
                          title="Hapus foto"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {idx === 0 && (
                        <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 bg-floral-pink-500 text-[10px] text-white font-bold rounded-md shadow-xs">
                          Sampul
                        </span>
                      )}
                    </div>
                  ))}

                  {/* New Upload Previews */}
                  {newFilePreviews.map((src, idx) => (
                    <div
                      key={`new-${idx}`}
                      className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-emerald-300 dark:border-emerald-800 group bg-floral-cream dark:bg-[#2E2428]"
                    >
                      <img
                        src={src}
                        alt={`New ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />

                      {/* Action buttons overlay */}
                      <div className="absolute top-1.5 right-1.5 flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenCropModal('new', idx)}
                          className="p-1.5 bg-black/75 hover:bg-floral-pink-600 text-white rounded-lg transition-colors shadow-xs"
                          title="Edit / Crop Foto"
                        >
                          <CropIcon className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveNewPhoto(idx)}
                          className="p-1.5 bg-black/75 hover:bg-rose-600 text-white rounded-lg transition-colors shadow-xs"
                          title="Hapus foto baru"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 bg-emerald-500 text-[10px] text-white font-bold rounded-md shadow-xs">
                        Baru
                      </span>
                    </div>
                  ))}

                  {totalPhotosCount === 0 && (
                    <div className="col-span-2 py-6 text-center text-xs text-floral-muted border border-dashed border-floral-pink-200 dark:border-[#3D2D33] rounded-2xl">
                      Belum ada foto dipilih
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Kategori Multi-select Card */}
            <div className="bg-white dark:bg-[#221A1D] border border-floral-pink-200/70 dark:border-[#3D2D33] rounded-3xl p-6 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-floral-dark dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Tag className="w-4 h-4 text-floral-pink-500" />
                  <span>Pilih Kategori</span>
                </h2>
                <span className="text-[11px] text-floral-pink-600 font-semibold">
                  {selectedCategories.length} Dipilih
                </span>
              </div>
              <p className="text-xs text-floral-muted">
                Klik kartu atau badge kategori di bawah ini untuk memilih:
              </p>

              <div className="space-y-2 pt-1 max-h-60 overflow-y-auto pr-1">
                {categories.map((c) => {
                  const idStr = String(c.id);
                  const isChecked = selectedCategories.includes(idStr);
                  return (
                    <div
                      key={c.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => handleToggleCategory(c.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleToggleCategory(c.id);
                        }
                      }}
                      className={`w-full flex items-center justify-between p-3 rounded-2xl border cursor-pointer select-none transition-all duration-150 ${
                        isChecked
                          ? 'border-floral-pink-500 bg-floral-pink-50 dark:bg-floral-pink-950/50 text-floral-pink-700 dark:text-floral-pink-300 font-bold shadow-xs'
                          : 'border-floral-pink-200/80 dark:border-[#3D2D33] hover:bg-floral-pink-50/40 dark:hover:bg-[#2E2428] text-floral-dark dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-all ${
                            isChecked
                              ? 'bg-floral-pink-500 border-floral-pink-500 text-white shadow-xs'
                              : 'border-floral-pink-300 dark:border-slate-600 bg-white dark:bg-[#2E2428]'
                          }`}
                        >
                          {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <span className="text-xs font-medium">{c.nama_kategori}</span>
                      </div>

                      {isChecked && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-floral-pink-200/60 dark:bg-floral-pink-900/60 text-floral-pink-700 dark:text-floral-pink-200">
                          Aktif
                        </span>
                      )}
                    </div>
                  );
                })}

                {categories.length === 0 && (
                  <p className="text-xs text-floral-muted py-2">
                    Belum ada kategori.{' '}
                    <Link to="/admin/kategori/tambah" className="text-floral-pink-500 underline font-semibold">
                      Buat kategori dulu
                    </Link>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="bg-white dark:bg-[#221A1D] border border-floral-pink-200/70 dark:border-[#3D2D33] rounded-3xl p-4 flex items-center justify-end gap-3 shadow-xs">
          <Link
            to="/admin/katalog"
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
            <span>{isEdit ? 'Simpan Perubahan' : 'Simpan Produk'}</span>
          </button>
        </div>
      </form>

      {/* Image Cropper Modal */}
      <ImageCropperModal
        isOpen={cropperState.isOpen}
        imageSrc={cropperState.imageSrc}
        fileName={cropperState.fileName}
        onClose={() => setCropperState((prev) => ({ ...prev, isOpen: false }))}
        onCropComplete={handleCropComplete}
      />
    </div>
  );
}
