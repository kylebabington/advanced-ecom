// src/components/ProductCard.tsx
// Displays a product and allows adding it to the cart.
//
// Requirements satisfied:
// ✅ Displays product details
// ✅ Add to cart uses Redux Toolkit
// ✅ Image fallback if FakeStore image URL fails

import type { Product } from '../api/types'
import { useAppDispatch } from '../app/hooks'
import { addToCart } from '../features/cart/cartSlice'
import ImageWithFallback from './ImageWithFallback'

type ProductCardProps = {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const dispatch = useAppDispatch()

  return (
    <article className="card">
      <div className="cardMedia">
        <ImageWithFallback
          src={product.image}
          alt={product.title}
          className="productImage"
        />
      </div>

      <div className="cardBody">
        <div className="cardTitle">{product.title}</div>

        <div className="cardMetaRow">
          <div className="price">${product.price.toFixed(2)}</div>
          <div className="pill">{product.category}</div>
        </div>

        <div className="muted small">
          Rating: {product.rating?.rate ?? 'N/A'} ({product.rating?.count ?? 0})
        </div>

        <p className="small">
          {product.description.length > 120
            ? product.description.slice(0, 120) + '…'
            : product.description}
        </p>
      </div>

      <button
        type="button"
        className="btn btnPrimary"
        onClick={() => dispatch(addToCart(product))}
      >
        Add to cart
      </button>
    </article>
  )
}
