// src/firebase/products.ts
// Firestore CRUD operations for products
// This replaces FakeStore API calls.

import {
    collection,
    doc,
    getDoc,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    type QueryDocumentSnapshot,
} from 'firebase/firestore'

import { db } from './firebase'
import type { Product } from '../api/types'

// Firestore collection reference: /products
const productsCol = collection(db, 'products')

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
    const q = query(productsCol, where('category', '==', category))
    const snap = await getDocs(q)
    return snap.docs.map(docToProduct)
}

// Simple categories approach: derive categories from products
// For real scaling: store a /categories collection instead.
export async function fetchCategories(): Promise<string[]> {
    const products = await fetchAllProducts()
    const unique = Array.from(new Set(products.map((p) => p.category).filter(Boolean)))
    unique.sort()
    return unique
}

export async function getProductById(productId: string): Promise<Product | null> {
    const ref = doc(db, 'products', productId)
    const snap = await getDoc(ref)
    if (!snap.exists()) return null
    return { id: snap.id, ...(snap.data() as Omit<Product, 'id'>)}
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