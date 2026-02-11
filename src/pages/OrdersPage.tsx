// src/pages/OrdersPage.tsx
// Shows order history for the logged in user. Admins see all orders.

import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../auth/AuthContext'
import { fetchOrdersForUser, fetchAllOrders } from '../firebase/orders'
import { Link } from 'react-router-dom'

export default function OrdersPage() {
    const { user, loading, isAdmin } = useAuth()

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['orders', user?.uid, isAdmin],
        queryFn: () => (isAdmin ? fetchAllOrders() : user ? fetchOrdersForUser(user.uid) : []),
        enabled: !!user,
    })

    if (loading) return <div className="page">Loading...</div>
    if (!user) return <div className="page">Please login to view orders.</div>

    return (
        <div className="page">
            <h2 className="pageTitle">{isAdmin ? 'All Orders' : 'Order History'}</h2>

            {isLoading && <div>Loading orders...</div>}
            {isError && <div className="notice">{(error as Error)?.message ?? 'Error'}</div>}

            {!isLoading && !isError && (data?.length ?? 0) === 0 && (
                <div className="emptyState">
                    <div className="emptyTitle">No orders yet.</div>
                    <div className="muted">Checkout your cart to create your first order.</div>
                </div>
            )}

            {!isLoading && !isError && data && (
                <div style={{ display: 'grid', gap: 12 }}>
                    {data.map((o) => {
                        const createdDate = o.createdAt?.toDate?.()
                        const createdLabel = createdDate ? createdDate.toLocaleString() : '—'
                        return (
                            <Link key={o.id} to={`/orders/${o.id}`} className="card" style={{ padding: 12 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                                    <div>
                                        <div className="muted small">Order ID</div>
                                        <div>{o.id}</div>
                                    </div>
                                    <div>
                                        <div className="muted small">Date</div>
                                        <div>{createdLabel}</div>
                                    </div>
                                    <div>
                                        <div className="muted small">Total</div>
                                        <div>${o.totalPrice.toFixed(2)}</div>
                                    </div>
                                    {isAdmin && (
                                        <div>
                                            <div className="muted small">User ID</div>
                                            <div className="small" style={{ fontFamily: 'monospace' }}>{o.userId}</div>
                                        </div>
                                    )}
                                </div>
                            </Link>
                        )
                    })}
                </div>
            )}
        </div>
    )
}