/**
 * Initial Dummy Data dan LocalStorage Helper untuk Mock Backend CandyzFlorist
 * Mengikuti profil usaha & tema dari candyzflorist
 */

const STORAGE_KEYS = {
  CATEGORIES: 'candyz_categories',
  PRODUCTS: 'candyz_products',
  SETTINGS: 'candyz_settings',
  AUTH: 'candyz_auth',
};

// 11 Kategori dari Katalog
const initialCategories = [
  { id: '1', nama_kategori: 'Bouquet Ready Stock', slug: 'ready-stock' },
  { id: '2', nama_kategori: 'Bouquet Wisuda', slug: 'wisuda' },
  { id: '3', nama_kategori: 'Bag Charm Bouquet', slug: 'bag-charm' },
  { id: '4', nama_kategori: 'Snack Bouquet', slug: 'snack' },
  { id: '5', nama_kategori: 'Mini Bouquet', slug: 'mini' },
  { id: '6', nama_kategori: 'Hand Bouquet Wedding', slug: 'wedding' },
  { id: '7', nama_kategori: 'Flower Box / Bloom Box', slug: 'flower-box' },
  { id: '8', nama_kategori: 'Vase Bouquet', slug: 'vase' },
  { id: '9', nama_kategori: 'Custom Bouquet', slug: 'custom' },
  { id: '10', nama_kategori: 'Karangan Bunga', slug: 'karangan' },
  { id: '11', nama_kategori: 'Money Bouquet', slug: 'money' },
];

// Initial Products Dummy Data
const initialProducts = [
  {
    id: '1',
    nama_produk: 'COLORFUL',
    slug: 'colorful',
    harga: 175000,
    kategori: ['1'],
    deskripsi: 'Buket bunga segar warna-warni ceria pilihan terbaik.',
    foto_produk: ['/catalog/ready-stock/01-colorful.png'],
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    nama_produk: 'TROPHY FLOWERS',
    slug: 'trophy-flowers-1',
    harga: 225000,
    kategori: ['1'],
    deskripsi: 'Rangkaian bunga bentuk piala elegan untuk penghargaan & selebrasi.',
    foto_produk: ['/catalog/ready-stock/02-trophy-flowers.png'],
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    nama_produk: 'CIEL',
    slug: 'ciel',
    harga: 100000,
    kategori: ['1', '3'],
    deskripsi: 'Buket bunga nuansa biru langit yang menenangkan.',
    foto_produk: ['/catalog/ready-stock/03-ciel.png'],
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    nama_produk: 'MOCHI',
    slug: 'mochi',
    harga: 115000,
    kategori: ['1', '3'],
    deskripsi: 'Rangkaian buket manis dan lembut seperti mochi.',
    foto_produk: ['/catalog/ready-stock/04-mochi.png'],
    createdAt: new Date().toISOString(),
  },
  {
    id: '5',
    nama_produk: 'Mila',
    slug: 'mila',
    harga: 115000,
    kategori: ['1', '3'],
    deskripsi: 'Buket cantik bernuansa feminin dan anggun.',
    foto_produk: ['/catalog/ready-stock/05-mila.png'],
    createdAt: new Date().toISOString(),
  },
  {
    id: '6',
    nama_produk: 'THUMBELINA BLOOMBOX',
    slug: 'thumbelina-bloombox',
    harga: 265000,
    kategori: ['1', '7'],
    deskripsi: 'Bloombox eksklusif dengan paduan bunga premium.',
    foto_produk: ['/catalog/ready-stock/06-thumbelina-bloombox.png'],
    createdAt: new Date().toISOString(),
  },
  {
    id: '7',
    nama_produk: 'Baby Blue',
    slug: 'baby-blue',
    harga: 145000,
    kategori: ['1'],
    deskripsi: 'Buket bunga mawar biru pastel dengan wrapping senada.',
    foto_produk: ['/catalog/ready-stock/07-baby-blue.png'],
    createdAt: new Date().toISOString(),
  },
  {
    id: '8',
    nama_produk: 'SOFT PEACH',
    slug: 'soft-peach',
    harga: 147000,
    kategori: ['1'],
    deskripsi: 'Bunga peach lembut cocok untuk hadiah ulang tahun dan anniversary.',
    foto_produk: ['/catalog/ready-stock/08-soft-peach.png'],
    createdAt: new Date().toISOString(),
  },
  {
    id: '9',
    nama_produk: 'BUKET NIMO',
    slug: 'buket-nimo',
    harga: 150000,
    kategori: ['2'],
    deskripsi: 'Buket wisuda spesial boneka dan bunga artificial berkualitas.',
    foto_produk: ['/catalog/wisuda/01-buket-nimo.png'],
    createdAt: new Date().toISOString(),
  },
  {
    id: '10',
    nama_produk: 'BUKET LILAC SNACK',
    slug: 'buket-lilac-snack',
    harga: 150000,
    kategori: ['4'],
    deskripsi: 'Buket snack premium nuansa lilac cantik.',
    foto_produk: ['/catalog/snack/01-buket-lilac.png'],
    createdAt: new Date().toISOString(),
  },
  {
    id: '11',
    nama_produk: 'BUKET SOFT VINTAGE MINI',
    slug: 'buket-soft-vintage-mini',
    harga: 85000,
    kategori: ['5'],
    deskripsi: 'Mini buket bunga gaya vintage rustic.',
    foto_produk: ['/catalog/mini/01-buket-soft-vintage.png'],
    createdAt: new Date().toISOString(),
  },
];

// Initial Settings Dummy Data based on Karawang brief
const initialSettings = {
  whatsapp: '089688035866',
  instagram: 'https://instagram.com/crandyzflorist',
  tiktok: 'https://tiktok.com/@crandyzflorist',
  email: 'crandyzflorist@gmail.com',
  alamat: 'Blok F No. 528, Perumahan Bumi Telukjambe, Kec. Telukjambe Timur, Karawang, Jawa Barat 41361',
  templateWa: 'Halo CandyzFlorist, saya tertarik untuk memesan produk *{nama_produk}* dengan harga *Rp {harga}*. Apakah masih bisa dipesan?',
};

export const initializeDummyData = () => {
  if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(initialCategories));
  }
  if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(initialProducts));
  }
  if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(initialSettings));
  }
};
