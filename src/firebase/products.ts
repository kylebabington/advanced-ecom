// src/firebase/products.ts
// Firestore CRUD operations for products
// This replaces FakeStore API calls.

import {
    collection,
    doc,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    type QueryDocumentSnapshot,
} from 'firebase/firestore'

import { db } from './firebase'
import type { Product } from '../api/types'

// Firestore collection reference: /products
const productsCol = collection(db, 'products')

// Canonical categories shown in the UI. Product category strings (any case) map to these.
export const CANONICAL_CATEGORIES = ['Plants', 'Tools', 'Materials'] as const
export type CanonicalCategory = (typeof CANONICAL_CATEGORIES)[number]

// Maps a product's raw category (e.g. "Garden Tools", "plants") to a canonical category or null.
export function getCanonicalCategory(rawCategory: string): CanonicalCategory | null {
    const raw = (rawCategory ?? '').trim().toLowerCase()
    if (raw === 'plants') return 'Plants'
    if (raw === 'tools' || raw === 'garden tools') return 'Tools'
    if (raw === 'materials' || raw === 'garden materials') return 'Materials'
    return null
}

// Convert Firestore docs -> Procuct objects with id
function docToProduct(d: QueryDocumentSnapshot): Product {
    //Firestore gives fields without id; doc.id is the id.
    return { id: d.id, ...(d.data() as Omit<Product, 'id'>) }
}

export async function fetchAllProducts(): Promise<Product[]> {
    const snap = await getDocs(productsCol)
    return snap.docs.map(docToProduct)
}

export async function fetchProductsByCategory(category: string): Promise<Product[]> {
    const canonical = (category ?? '').trim()
    if (!canonical) {
        return fetchAllProducts()
    }
    // For our three categories, we include products whose category (any case) maps to this one.
    const all = await fetchAllProducts()
    return all.filter((p) => getCanonicalCategory(p.category) === canonical)
}

// Simple categories approach: derive categories from products
// For real scaling: store a /categories collection instead.
export async function fetchCategories(): Promise<string[]> {
    const products = await fetchAllProducts()
    const unique = Array.from(new Set(products.map((p) => p.category).filter(Boolean)))
    unique.sort()
    return unique
}

export type ProductInput = Omit<Product, 'id'>

/** Validation for product create/update. Returns list of error messages (empty if valid). */
export function validateProductInput(input: Partial<ProductInput>, isUpdate: boolean): string[] {
    const errors: string[] = []
    const title = (input.title ?? '').trim()
    const category = (input.category ?? '').trim()
    const price = input.price ?? 0

    if (!title) errors.push('Title is required.')
    if (!category) errors.push('Category is required.')
    if (!isUpdate && price <= 0) errors.push('Price must be greater than 0.')
    if (isUpdate && input.price !== undefined && input.price <= 0) errors.push('Price must be greater than 0.')

    return errors
}

export async function createProduct(input: ProductInput): Promise<string> {
    const errors = validateProductInput(input, false)
    if (errors.length) throw new Error(errors.join(' '))
    const ref = await addDoc(productsCol, input)
    return ref.id
}

export async function updateProduct(productId: string, input: Partial<ProductInput>): Promise<void> {
    const errors = validateProductInput(input, true)
    if (errors.length) throw new Error(errors.join(' '))
    const ref = doc(db, 'products', productId)
    await updateDoc(ref, input)
}

export async function deleteProduct(productId: string): Promise<void> {
    const ref = doc(db, 'products', productId)
    await deleteDoc(ref)
}