// src/components/AdminRoute.tsx
// Protects admin-only routes: redirects to login if not authenticated,
// and to home if authenticated but not admin.

import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

type AdminRouteProps = {
  children: React.ReactNode
}

export default function AdminRoute({ children }: AdminRouteProps) {
  const { user, loading, isAdmin, adminChecked } = useAuth()
  const location = useLocation()

  if (loading || (user && !adminChecked)) {
    return (
      <div className="page">
        <p>Loading...</p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
