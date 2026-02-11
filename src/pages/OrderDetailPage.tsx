// src/pages/OrderDetailPage.tsx
// Shows full details for a single order.
// -Order ID
// -Date
// -Total Price
// -List of items (titls, quantity, price)
//
// USers can click an order from history to view full details.

import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { getOrderById } from '../firebase/orders'
import ImageWithFallback from '../components/ImageWithFallback'
import { Link } from 'react-router-dom'

export default function OrderDetailPage() {
    const { user, loading, isAdmin } = useAuth()

    // Grab the :id from /orders/:id
    const { id } = useParams<{ id: string }>()

    const {
        data: order,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ['order', id],
        queryFn: async () => {
            // If the route is somehow missing ad id, treat as not found
            if (!id) return null
            return getOrderById(id)
        },
        enabled: !!id,
    })

    // Auth loading state
    if (loading) return <div className="page">Loading...</div>

    // Not logged in -> must login to see order details.
    if (!user) {
        return (
            <div className="page">
                <h2 className="pageTitle">Order Details</h2>
                <div className="notice">Please login to view order details.</div>
                <Link to="/login" className="btn btnPrimary" style={{ marginTop: 12, display: 'inline-block' }}>
                    Go to Login
                </Link>
            </div>
        )
    }

    // Loading the order doc
    if (isLoading) return <div className="page">Loading order...</div>

    // Error from Firestore
    if (isError) {
        return (
            <div className="page">
                <h2 className="pageTitle">Order Details</h2>
                <div className="notice">
                    {(error as Error)?.message ?? 'Could not load order.'}
                </div>
                <Link to="/orders" className="btn" style={{ marginTop: 12, display: 'inline-block' }}>
                    Back to Orders
                </Link>
            </div>
        )
    }

    // Not found (bad id or deleted doc)

    if (!order) {
        return (
            <div className="page">
                <h2 className="pageTitle">Order Details</h2>
                <div className="notice">Order not found.</div>
                <Link to="/orders" className="btn" style={{ marginTop: 12, display: 'inline-block' }}>
                    Back to Orders
                </Link>
            </div>
        )
    }

    // Client-side check: user can view own order; admins can view any order.
    // Firestore rules enforce the same access.
    const canView = order.userId === user.uid || isAdmin
    if (!canView) {
        return (
            <div className="page">
                <h2 className="pageTitle">Order Details</h2>
                <div className="notice">You do not have access to this order.</div>
                <Link to="/orders" className="btn" style={{ marginTop: 12, display: 'inline-block' }}>
                    Back to Orders
                </Link>
            </div>
        )
    }

    // Firestore Timestamp -> readable date
    const createdDate = order.createdAt?.toDate?.()
    const createdLabel = createdDate ? createdDate.toLocaleString() : 'Unknown Date'

    return (
        <div className="page">
            <header className="pageHeader">
                <div>
                    <h2 className="pageTitle">Order Details</h2>
                    <div className="muted small">Order ID: {order.id}</div>
                    <div className="muted small">Created: {createdLabel}</div>
                    {isAdmin && (
                        <div className="muted small" style={{ marginTop: 8 }}>
                            User ID: <span style={{ fontFamily: 'monospace' }}>{order.userId}</span>
                        </div>
                    )}
                </div>

                <Link to="/orders" className="btn">
                    Back
                </Link>
            </header>

            <div className="card" style={{ padding: 12, marginTop: 12 }}>
                <div className="muted">Total</div>
                <div style={{ fontSize: 22, fontWeight: 800 }}>${order.totalPrice.toFixed(2)}</div>
            </div>

            <div className="card" style={{ padding: 12, marginTop: 12 }}>
                <h3 style={{ marginTop: 0 }}>Items</h3>
                <div className="cartList">
                    {order.items.map((item) => (
                        <div key={item.productId} className="cartRow">
                            <div className="cartImgWrap">
                                <ImageWithFallback
                                    src={item.image}
                                    alt={item.title}
                                    className="cartImg"
                                />
                            </div>

                            <div className="cartInfo">
                                <div className="cartTitle">{item.title}</div>
                                <div className="muted small">
                                    ${item.price.toFixed(2)} x {item.quantity}
                                </div>
                            </div>

                            <div className="cartTotal">
                                ${(item.price * item.quantity).toFixed(2)}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}