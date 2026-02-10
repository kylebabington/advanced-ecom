// src/pages/HomePage.tsx
// Home page loads products from Firestore using React Query.
// It also filters products by selected category (using CategorySelect).
//
// Requirements satisfied:
// ✅ Home page shows products from Firestore (React Query)
// ✅ Category dropdown (React Query) filters products by category

import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import CategorySelect from '../components/CategorySelect'
import ProductCard from '../components/ProductCard'
import { fetchAllProducts, fetchProductsByCategory } from '../firebase/products'
import type { Product } from '../api/types'

export default function HomePage() {
  // "" means "All categories"
  const [selectedCategory, setSelectedCategory] = useState('')

  // Decide which query function to run based on selectedCategory
  const queryFn = useMemo(() => {
    if (!selectedCategory) {
      // All products
      return fetchAllProducts
    }
    // Products by category
    return () => fetchProductsByCategory(selectedCategory)
  }, [selectedCategory])

  // React Query fetch products, keyed by selectedCategory so it caches correctly
  const {
    data: products,
    isLoading,
    isError,
    error,
  } = useQuery<Product[]>({
    queryKey: ['products', selectedCategory],
    queryFn,
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="pageHeader" style={{ display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <h2 className="pageTitle" style={{ margin: 0 }}>My Products</h2>

        {/* Category dropdown */}
        <CategorySelect value={selectedCategory} onChange={setSelectedCategory} />
      </div>

      {/* Loading state */}
      {isLoading && <div>Loading products…</div>}

      {/* Error state */}
      {isError && (
        <div style={{ padding: 12, border: '1px solid #ccc', borderRadius: 8 }}>
          <strong>Could not load products.</strong>
          <div style={{ marginTop: 6, fontSize: 12 }}>
            {(error as Error)?.message ?? 'Unknown error'}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !isError && (products?.length ?? 0) === 0 && (
        <div>No products found for this category.</div>
      )}

      {/* Product grid */}
      {!isLoading && !isError && products && (
        <div className="grid">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  )
}
