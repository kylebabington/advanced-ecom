// src/components/CategorySelect.tsx
// This component loads product categories from the FakeStore API (via React Query)
// and renders a dropdown that lets the user choose a category.
//
// Requirements satisfied:
// ✅ Category dropdown pulls categories from API (React Query)
// ✅ Selecting a category will be used by HomePage to filter products

import { useQuery } from '@tanstack/react-query'
import { fetchCategories } from '../api/fakeStore'

// Props define what the parent controls:
// - value: currently selected category (or "" for "All")
// - onChange: callback to update the selected category
type CategorySelectProps = {
  value: string
  onChange: (newValue: string) => void
}

export default function CategorySelect({ value, onChange }: CategorySelectProps) {
  // React Query fetch for categories
  const {
    data: categories,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  })

  // Loading state: keep UI simple and readable
  if (isLoading) {
    return (
      <div>
        <label>
          Category:{' '}
          <select disabled>
            <option>Loading categories…</option>
          </select>
        </label>
      </div>
    )
  }

  // Error state: show a useful message
  if (isError) {
    return (
      <div style={{ padding: 12, border: '1px solid #ccc', borderRadius: 8 }}>
        <strong>Could not load categories.</strong>
        <div style={{ marginTop: 6, fontSize: 12 }}>
          {(error as Error)?.message ?? 'Unknown error'}
        </div>
      </div>
    )
  }

  // Happy path: render dropdown
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <label htmlFor="category-select" style={{ fontWeight: 600 }}>
        Category:
      </label>

      <select
        id="category-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ padding: 8, borderRadius: 8 }}
      >
        {/* "" means "All categories" */}
        <option value="">All</option>

        {/* Render each category */}
        {categories?.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
    </div>
  )
}
