// src/pages/CartPage.tsx
// Cart page reads cart contents from Redux Toolkit,
// shows totals, allows removing items, and supports checkout.
//
// Requirements satisfied:
// ✅ Cart is managed by Redux Toolkit
// ✅ Cart persists in sessionStorage (handled in cartSlice/cartStorage)
// ✅ Checkout clears Redux + sessionStorage
// ✅ Image fallback (we add it here too for completeness)

import { useMemo, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { removeFromCart, clearCart } from '../features/cart/cartSlice'
import ImageWithFallback from '../components/ImageWithFallback'

export default function CartPage() {
  const dispatch = useAppDispatch()
  const items = useAppSelector((state) => state.cart.items)

  const [checkedOut, setCheckedOut] = useState(false)

  const totals = useMemo(() => {
    const totalQty = items.reduce((sum, item) => sum + item.quantity, 0)
    const totalPrice = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
    return { totalQty, totalPrice }
  }, [items])

  return (
    <div className="page">
      <header className="pageHeader">
        <h2 className="pageTitle">Cart</h2>
        <div className="muted">
          {items.length > 0 ? `${totals.totalQty} item(s)` : 'No items yet'}
        </div>
      </header>

      {checkedOut && (
        <div className="notice success">
          ✅ Checkout complete. Cart cleared.
        </div>
      )}

      {items.length === 0 && (
        <div className="emptyState">
          <div className="emptyTitle">Your cart is empty.</div>
          <div className="muted">Add something from the Home page to get started.</div>
        </div>
      )}

      {items.length > 0 && (
        <div className="cartList">
          {items.map((item) => (
            <div key={item.product.id} className="cartRow">
              <div className="cartImgWrap">
                <ImageWithFallback
                  src={item.product.image}
                  alt={item.product.title}
                  className="cartImg"
                />
              </div>

              <div className="cartInfo">
                <div className="cartTitle">{item.product.title}</div>
                <div className="muted small">
                  ${item.product.price.toFixed(2)} × {item.quantity}
                </div>
              </div>

              <div className="cartTotal">
                ${(item.product.price * item.quantity).toFixed(2)}
              </div>

              <button
                type="button"
                className="btn"
                onClick={() => dispatch(removeFromCart(item.product.id))}
              >
                Remove
              </button>
            </div>
          ))}

          <div className="cartSummary">
            <div>
              <div className="muted">Items: {totals.totalQty}</div>
              <div className="summaryTotal">Total: ${totals.totalPrice.toFixed(2)}</div>
            </div>

            <button
              type="button"
              className="btn btnPrimary"
              onClick={() => {
                dispatch(clearCart())
                setCheckedOut(true)
              }}
            >
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
