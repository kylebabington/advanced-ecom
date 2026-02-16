// src/App.tsx
// This file is the main app component
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import AdminRoute from './components/AdminRoute'
import HomePage from './pages/HomePage'
import CartPage from './pages/CartPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProfilePage from './pages/ProfilePage'
import OrdersPage from './pages/OrdersPage'
import ManageProductsPage from './pages/ManageProductsPage'
import OrderDetailPage from './pages/OrderDetailPage'

export default function App() {
  return (
    <Routes>
      {/* ✅ Layout wraps the pages so we can share nav/header */}
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/cart" element={<CartPage />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<ProfilePage />} />

        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/orders/:id" element={<OrderDetailPage />} />
        <Route path="/manage-products" element={<AdminRoute><ManageProductsPage /></AdminRoute>} />

        {/* ✅ Catch-all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
