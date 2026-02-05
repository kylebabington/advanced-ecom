// src/App.tsx
// This file is the main app component
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import CartPage from './pages/CartPage'

export default function App() {
  return (
    <Routes>
      {/* ✅ Layout wraps the pages so we can share nav/header */}
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/cart" element={<CartPage />} />

        {/* ✅ Catch-all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
