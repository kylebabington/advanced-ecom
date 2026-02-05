// src/components/Layout.tsx
// Layout wraps all pages and provides the top navigation.

import { Outlet, Link } from 'react-router-dom'
import { useAppSelector } from '../app/hooks'

export default function Layout() {
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
          <Link to="/cart">
            Cart <span className="badge">{totalQty}</span>
          </Link>
        </nav>
      </header>

      <Outlet />
    </div>
  )
}
