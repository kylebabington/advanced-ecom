// src/components/Layout.tsx
// Layout wraps all pages and provides the top navigation.

import { Outlet, Link } from 'react-router-dom'
import { useAppSelector } from '../app/hooks'
import { useAuth } from '../auth/AuthContext'

export default function Layout() {
  const { user, logout } = useAuth()

  const totalQty = useAppSelector((state) =>
    state.cart.items.reduce((sum, item) => sum + item.quantity, 0)
  )

  return (
    <div className="shell">
      <header className="topbar">
        <Link to="/" className="brand">
          <h1 className="brandTitle">Kyle&apos;s Virtual Emporium</h1>
        </Link>

        <nav className="nav">
          <Link to="/">Home</Link>
          <Link to="/cart">Cart <span className="badge">{totalQty}</span></Link>
          <Link to="/orders">Orders</Link>
          <Link to="/manage-products">Manage Products</Link>

          {!user ? (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          ) : (
            <>
              <Link to="/profile">Profile</Link>
              <button
                className="btn"
                type="button"
                onClick={() => logout()}
              >
                Logout
              </button>
            </>
          )}
        </nav>
      </header>

      <Outlet />
    </div>
  )
}