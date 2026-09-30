import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Save, 
  KeyRound, 
  Phone, 
  Mail, 
  MapPin, 
  MessageSquare, 
  CheckCircle2, 
  AlertCircle,
  Video,
  Camera,
  Loader2
} from 'lucide-react';
import { pengaturanApi, authApi } from '../../services/apiService';

export default function PengaturanPage() {
  // Settings Form State
  const [whatsapp, setWhatsapp] = useState('');
  const [instagram, setInstagram] = useState('');
  const [tiktok, setTiktok] = useState('');
  const [email, setEmail] = useState('');
  const [alamat, setAlamat] = useState('');
  const [templateWa, setTemplateWa] = useState('');

  // Password Form State
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Feedback State
  const [settingsSuccess, setSettingsSuccess] = useState(false);
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsError, setSettingsError] = useState('');

  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setPageLoading(true);
    try {
      const data = await pengaturanApi.get();
      if (data) {
        setWhatsapp(data.whatsapp || '');
        setInstagram(data.instagram || '');
        setTiktok(data.tiktok || '');
        setEmail(data.email || '');
        setAlamat(data.alamat || '');
        setTemplateWa(data.template_wa || data.templateWa || '');
      }
    } catch (err) {
      setSettingsError(err.message || 'Gagal memuat pengaturan dari server backend');
    } finally {
      setPageLoading(false);
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSettingsError('');
    setSettingsSuccess(false);
    setSettingsLoading(true);

    try {
      await pengaturanApi.update({
        whatsapp: whatsapp.trim(),
        instagram: instagram.trim(),
        tiktok: tiktok.trim(),
        email: email.trim(),
        alamat: alamat.trim(),
        template_wa: templateWa.trim(),
      });

      setSettingsSuccess(true);
      setTimeout(() => setSettingsSuccess(false), 3000);
    } catch (err) {
      setSettingsError(err.message || 'Gagal menyimpan pengaturan ke server');
    } finally {
      setSettingsLoading(false);
    }
  };

  const handleSavePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess(false);

    if (!oldPassword) {
      setPasswordError('Password lama wajib diisi.');
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError('Password baru minimal 8 karakter.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Konfirmasi password tidak cocok dengan password baru.');
      return;
    }

    setPasswordLoading(true);

    try {
      await authApi.changePassword(oldPassword, newPassword);
      setPasswordSuccess(true);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (err) {
      setPasswordError(err.message || 'Gagal memperbarui password');
    } finally {
      setPasswordLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center py-20 gap-2 text-floral-muted text-sm">
        <Loader2 className="w-5 h-5 animate-spin text-floral-pink-500" />
        <span>Memuat data pengaturan...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-floral-dark dark:text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-floral-pink-500" />
          <span>Pengaturan Sistem Toko</span>
        </h1>
        <p className="text-xs sm:text-sm text-floral-muted dark:text-slate-400 mt-1">
          Atur informasi kontak toko Karawang, media sosial, template pesan WhatsApp, dan keamanan akun
        </p>
      </div>

      {/* ================= SECTION 1: BUSINESS & SOCIAL CONTACTS ================= */}
      <div className="bg-white dark:bg-[#221A1D] border border-floral-pink-200/70 dark:border-[#3D2D33] rounded-3xl p-6 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-floral-pink-100 dark:border-[#33262A] pb-4">
          <div>
            <h2 className="text-base font-bold text-floral-dark dark:text-white">
              Informasi Kontak & Media Sosial
            </h2>
            <p className="text-xs text-floral-muted dark:text-slate-400">
              Data ini digunakan untuk integrasi pemesanan WhatsApp & profil toko
            </p>
          </div>
          {settingsSuccess && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 text-xs font-semibold rounded-xl border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="w-4 h-4" />
              <span>Pengaturan Tersimpan!</span>
            </div>
          )}
        </div>

        {settingsError && (
          <div className="p-3.5 bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 text-xs sm:text-sm font-semibold rounded-xl border border-rose-200 dark:border-rose-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{settingsError}</span>
          </div>
        )}

        <form onSubmit={handleSaveSettings} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Nomor WhatsApp */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-floral-dark dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-floral-pink-500" />
                <span>Nomor WhatsApp Toko</span>
              </label>
              <input
                type="text"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="089688035866"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-[#2E2428] border border-floral-pink-200/80 dark:border-[#3D2D33] rounded-xl text-xs sm:text-sm text-floral-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-floral-pink-500"
                required
              />
            </div>

            {/* Email Usaha */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-floral-dark dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-floral-pink-500" />
                <span>Email Usaha</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="crandyzflorist@gmail.com"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-[#2E2428] border border-floral-pink-200/80 dark:border-[#3D2D33] rounded-xl text-xs sm:text-sm text-floral-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-floral-pink-500"
                required
              />
            </div>

            {/* Link Instagram */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-floral-dark dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-floral-pink-500" />
                <span>Link Instagram</span>
              </label>
              <input
                type="url"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="https://instagram.com/crandyzflorist"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-[#2E2428] border border-floral-pink-200/80 dark:border-[#3D2D33] rounded-xl text-xs sm:text-sm text-floral-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-floral-pink-500"
              />
            </div>

            {/* Link TikTok */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-floral-dark dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5 text-floral-pink-500" />
                <span>Link TikTok</span>
              </label>
              <input
                type="url"
                value={tiktok}
                onChange={(e) => setTiktok(e.target.value)}
                placeholder="https://tiktok.com/@crandyzflorist"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-[#2E2428] border border-floral-pink-200/80 dark:border-[#3D2D33] rounded-xl text-xs sm:text-sm text-floral-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-floral-pink-500"
              />
            </div>
          </div>

          {/* Alamat Usaha */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-floral-dark dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-floral-pink-500" />
              <span>Alamat Usaha / Toko Fisik (Karawang)</span>
            </label>
            <textarea
              rows={2}
              value={alamat}
              onChange={(e) => setAlamat(e.target.value)}
              placeholder="Blok F No. 528, Perumahan Bumi Telukjambe, Kec. Telukjambe Timur, Karawang..."
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-[#2E2428] border border-floral-pink-200/80 dark:border-[#3D2D33] rounded-xl text-xs sm:text-sm text-floral-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-floral-pink-500"
            />
          </div>

          {/* Template Pesan WA */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-floral-dark dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-floral-pink-500" />
                <span>Template Pesan WhatsApp Pelanggan</span>
              </label>
              <span className="text-[11px] text-floral-muted">
                Variabel: <code className="text-floral-pink-600 font-semibold">{'{nama_produk}'}</code>, <code className="text-floral-pink-600 font-semibold">{'{harga}'}</code>
              </span>
            </div>
            <textarea
              rows={3}
              value={templateWa}
              onChange={(e) => setTemplateWa(e.target.value)}
              placeholder="Halo CandyzFlorist, saya tertarik memesan {nama_produk} seharga Rp {harga}..."
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-[#2E2428] border border-floral-pink-200/80 dark:border-[#3D2D33] rounded-xl text-xs sm:text-sm text-floral-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-floral-pink-500"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={settingsLoading}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-floral-pink-500 hover:bg-floral-pink-600 active:scale-95 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-floral-pink-500/20 transition-all disabled:opacity-70"
            >
              {settingsLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>Simpan Informasi Kontak</span>
            </button>
          </div>
        </form>
      </div>

      {/* ================= SECTION 2: GANTI PASSWORD ================= */}
      <div className="bg-white dark:bg-[#221A1D] border border-floral-pink-200/70 dark:border-[#3D2D33] rounded-3xl p-6 shadow-xs space-y-6">
        <div className="border-b border-floral-pink-100 dark:border-[#33262A] pb-4">
          <h2 className="text-base font-bold text-floral-dark dark:text-white flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-floral-pink-500" />
            <span>Ganti Password Admin</span>
          </h2>
          <p className="text-xs text-floral-muted dark:text-slate-400">
            Perbarui kata sandi akun login untuk keamanan panel toko Anda
          </p>
        </div>

        {passwordSuccess && (
          <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm font-semibold rounded-xl border border-emerald-200 dark:border-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>Password admin berhasil diperbarui di server backend!</span>
          </div>
        )}

        {passwordError && (
          <div className="p-3.5 bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 text-xs sm:text-sm font-semibold rounded-xl border border-rose-200 dark:border-rose-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{passwordError}</span>
          </div>
        )}

        <form onSubmit={handleSavePassword} className="space-y-4 max-w-lg">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-floral-dark dark:text-slate-300 uppercase tracking-wider">
              Password Lama
            </label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-[#2E2428] border border-floral-pink-200/80 dark:border-[#3D2D33] rounded-xl text-xs sm:text-sm text-floral-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-floral-pink-500"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-floral-dark dark:text-slate-300 uppercase tracking-wider">
              Password Baru (Minimal 8 Karakter)
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-[#2E2428] border border-floral-pink-200/80 dark:border-[#3D2D33] rounded-xl text-xs sm:text-sm text-floral-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-floral-pink-500"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-floral-dark dark:text-slate-300 uppercase tracking-wider">
              Konfirmasi Password Baru
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-[#2E2428] border border-floral-pink-200/80 dark:border-[#3D2D33] rounded-xl text-xs sm:text-sm text-floral-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-floral-pink-500"
              required
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={passwordLoading}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-floral-dark hover:bg-black dark:bg-floral-cream dark:hover:bg-white dark:text-floral-dark text-white active:scale-95 text-xs sm:text-sm font-semibold transition-all disabled:opacity-70"
            >
              {passwordLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <KeyRound className="w-4 h-4" />
              )}
              <span>Ubah Password</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
