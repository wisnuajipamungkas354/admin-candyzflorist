import API_ENDPOINTS from '../config/api';

const TOKEN_KEY = 'candyz_auth';

export const getAuthToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setAuthToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeAuthToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

// Base Fetch Helper
async function request(url, options = {}) {
  const token = getAuthToken();
  const headers = {
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Jika body bukan FormData, tambahkan default Content-Type: application/json
  if (options.body && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);

    // Auto logout if 401
    if (response.status === 401) {
      removeAuthToken();
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
      throw new Error('Sesi telah berakhir atau tidak valid. Silakan login kembali.');
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Terjadi kesalahan (Status: ${response.status})`);
    }

    return data;
  } catch (error) {
    console.error(`API Error [${url}]:`, error);
    throw error;
  }
}

// 1. Auth API
export const authApi = {
  login: async (email, password) => {
    const res = await request(API_ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (res.data?.token) {
      setAuthToken(res.data.token);
    }
    return res;
  },

  logout: async () => {
    try {
      await request(API_ENDPOINTS.AUTH.LOGOUT, { method: 'POST' });
    } finally {
      removeAuthToken();
    }
  },

  getMe: async () => {
    return request(API_ENDPOINTS.AUTH.ME, { method: 'GET' });
  },

  changePassword: async (oldPassword, newPassword) => {
    return request(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, {
      method: 'PUT',
      body: JSON.stringify({
        old_password: oldPassword,
        new_password: newPassword,
      }),
    });
  },
};

// 2. Kategori API
export const kategoriApi = {
  getAll: async () => {
    const res = await request(API_ENDPOINTS.KATEGORI.LIST, { method: 'GET' });
    return res.data || [];
  },

  getById: async (id) => {
    const res = await request(API_ENDPOINTS.KATEGORI.DETAIL(id), { method: 'GET' });
    return res.data;
  },

  create: async (data) => {
    const res = await request(API_ENDPOINTS.KATEGORI.CREATE, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res.data;
  },

  update: async (id, data) => {
    const res = await request(API_ENDPOINTS.KATEGORI.UPDATE(id), {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return res.data;
  },

  delete: async (id) => {
    return request(API_ENDPOINTS.KATEGORI.DELETE(id), { method: 'DELETE' });
  },
};

// 3. Katalog API
export const katalogApi = {
  getAll: async (params = {}) => {
    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 10;
    const search = params.search || '';
    const kategoriId = params.kategori_id || '';

    const searchParams = new URLSearchParams();
    if (page) searchParams.append('page', page);
    if (limit) searchParams.append('limit', limit);
    if (search) searchParams.append('search', search);
    if (kategoriId && kategoriId !== 'ALL') searchParams.append('kategori_id', kategoriId);

    const queryString = searchParams.toString();
    const url = queryString ? `${API_ENDPOINTS.KATALOG.LIST}?${queryString}` : API_ENDPOINTS.KATALOG.LIST;

    try {
      const res = await request(url, { method: 'GET' });
      if (res.data && res.data.items && res.data.pagination) {
        return res.data;
      }

      // If backend returned plain array, handle filtering and slicing manually
      let list = Array.isArray(res.data) ? res.data : (res.data?.items || []);
      
      if (search) {
        const q = search.toLowerCase();
        list = list.filter((p) => p.nama_produk?.toLowerCase().includes(q) || p.deskripsi?.toLowerCase().includes(q));
      }

      if (kategoriId && kategoriId !== 'ALL') {
        list = list.filter((p) => {
          return p.kategori?.some((c) => {
            const cId = typeof c === 'object' ? String(c.id) : String(c);
            return cId === String(kategoriId);
          });
        });
      }

      const totalItems = list.length;
      const totalPages = Math.ceil(totalItems / limit) || 1;
      const startIndex = (page - 1) * limit;
      const slicedItems = list.slice(startIndex, startIndex + limit);

      return {
        items: slicedItems,
        pagination: {
          current_page: page,
          per_page: limit,
          total_items: totalItems,
          total_pages: totalPages,
        },
      };
    } catch (error) {
      console.error('katalogApi.getAll error:', error);
      throw error;
    }
  },

  getById: async (id) => {
    const res = await request(API_ENDPOINTS.KATALOG.DETAIL(id), { method: 'GET' });
    return res.data;
  },

  create: async (formData) => {
    const res = await request(API_ENDPOINTS.KATALOG.CREATE, {
      method: 'POST',
      body: formData,
    });
    return res.data;
  },

  update: async (id, formData) => {
    const res = await request(API_ENDPOINTS.KATALOG.UPDATE(id), {
      method: 'PUT',
      body: formData,
    });
    return res.data;
  },

  delete: async (id) => {
    return request(API_ENDPOINTS.KATALOG.DELETE(id), { method: 'DELETE' });
  },

  uploadImages: async (formData) => {
    const res = await request(API_ENDPOINTS.KATALOG.UPLOAD_IMAGES, {
      method: 'POST',
      body: formData,
    });
    return res.data;
  },
};

// 4. Pengaturan API
export const pengaturanApi = {
  get: async () => {
    const res = await request(API_ENDPOINTS.PENGATURAN.GET, { method: 'GET' });
    return res.data || {};
  },

  update: async (data) => {
    const res = await request(API_ENDPOINTS.PENGATURAN.UPDATE, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return res.data;
  },
};

// 5. Dashboard API
export const dashboardApi = {
  getStats: async () => {
    const res = await request(API_ENDPOINTS.DASHBOARD.STATS, { method: 'GET' });
    return res.data || {};
  },
};

export default {
  auth: authApi,
  kategori: kategoriApi,
  katalog: katalogApi,
  pengaturan: pengaturanApi,
  dashboard: dashboardApi,
};
