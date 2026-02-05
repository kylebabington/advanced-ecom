// src/api/fakeStore.ts
// This file fetches data from the fake store API

import type { Product } from "./types";

// Base URL for the fake store API
const BASE_URL = "https://fakestoreapi.com";

// Fetch all products
export async function fetchAllProducts(): Promise<Product[]> {
    // Call the endpoint
    const res = await fetch(`${BASE_URL}/products`)

    // If the response is not ok, throw an error
    if (!res.ok) {
        throw new Error('Failed to fetch products')
    }

    // Parse JSON into product []
    return res.json()
}

// Fetch categories (array of strings)
export async function fetchCategories(): Promise<string[]> {
    const res = await fetch(`${BASE_URL}/products/categories`)
    if (!res.ok) {
        throw new Error('Failed to fetch categories')
    }
    return res.json()
}

// Fetch products by category
export async function fetchProductsByCategory(category: string): Promise<Product[]> {
    // FakeStore expects category in URL
    const res = await fetch(`${BASE_URL}/products/category/${encodeURIComponent(category)}`)
    if (!res.ok) {
        throw new Error('Failed to fetch products by category')
    }
    return res.json()
}
