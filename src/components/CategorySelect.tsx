// src/components/CategorySelect.tsx
// Renders a dropdown with the three canonical categories (Plants, Tools, Materials).
// Selecting a category filters products; matching is case-insensitive and
// Tools includes "Garden Tools", Materials includes "Garden Materials".

import { CANONICAL_CATEGORIES } from '../firebase/products'

// Props define what the parent controls:
// - value: currently selected category (or "" for "All")
// - onChange: callback to update the selected category
type CategorySelectProps = {
  value: string
  onChange: (newValue: string) => void
}

export default function CategorySelect({ value, onChange }: CategorySelectProps) {
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
        <option value="">All</option>
        {CANONICAL_CATEGORIES.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
    </div>
  )
}
