import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';

// Public & Layouts
import LoginPage from './pages/LoginPage';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Admin Pages
import DashboardPage from './pages/admin/DashboardPage';
import KatalogPage from './pages/admin/KatalogPage';
import KatalogFormPage from './pages/admin/KatalogFormPage';
import KategoriPage from './pages/admin/KategoriPage';
import KategoriFormPage from './pages/admin/KategoriFormPage';
import PengaturanPage from './pages/admin/PengaturanPage';

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Auth Route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Admin Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              
              {/* Katalog */}
              <Route path="katalog" element={<KatalogPage />} />
              <Route path="katalog/tambah" element={<KatalogFormPage />} />
              <Route path="katalog/edit/:id" element={<KatalogFormPage />} />

              {/* Kategori */}
              <Route path="kategori" element={<KategoriPage />} />
              <Route path="kategori/tambah" element={<KategoriFormPage />} />
              <Route path="kategori/edit/:id" element={<KategoriFormPage />} />

              {/* Pengaturan Sistem */}
              <Route path="pengaturan" element={<PengaturanPage />} />
            </Route>
          </Route>

          {/* Fallback Redirect */}
          <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
