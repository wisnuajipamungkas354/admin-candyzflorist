/**
 * Konfigurasi Base URL dan Endpoint API Backend
 * Ubah BASE_URL sesuai server API backend Anda saat sudah siap.
 */

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
    ME: `${API_BASE_URL}/auth/me`,
    CHANGE_PASSWORD: `${API_BASE_URL}/auth/change-password`,
  },

  // Kategori
  KATEGORI: {
    LIST: `${API_BASE_URL}/kategori`,
    DETAIL: (id) => `${API_BASE_URL}/kategori/${id}`,
    CREATE: `${API_BASE_URL}/kategori`,
    UPDATE: (id) => `${API_BASE_URL}/kategori/${id}`,
    DELETE: (id) => `${API_BASE_URL}/kategori/${id}`,
  },

  // Katalog / Produk
  KATALOG: {
    LIST: `${API_BASE_URL}/katalog`,
    DETAIL: (id) => `${API_BASE_URL}/katalog/${id}`,
    CREATE: `${API_BASE_URL}/katalog`,
    UPDATE: (id) => `${API_BASE_URL}/katalog/${id}`,
    DELETE: (id) => `${API_BASE_URL}/katalog/${id}`,
    UPLOAD_IMAGES: `${API_BASE_URL}/katalog/upload`,
  },

  // Pengaturan Sistem
  PENGATURAN: {
    GET: `${API_BASE_URL}/pengaturan`,
    UPDATE: `${API_BASE_URL}/pengaturan`,
  },

  // Dashboard
  DASHBOARD: {
    STATS: `${API_BASE_URL}/dashboard/stats`,
  }
};

export default API_ENDPOINTS;
