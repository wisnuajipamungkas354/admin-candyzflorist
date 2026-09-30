import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getAuthToken } from '../services/apiService';

export default function ProtectedRoute() {
  const token = getAuthToken();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
