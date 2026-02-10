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

export async function createProduct(input: ProductInput): Promise<string> {
    const ref = await addDoc(productsCol, input)
    return ref.id
}

export async function updateProduct(productId: string, input: Partial<ProductInput>): Promise<void> {
    const ref = doc(db, 'products', productId)
    await updateDoc(ref, input)
}

export async function deleteProduct(productId: string): Promise<void> {
    const ref = doc(db, 'products', productId)
    await deleteDoc(ref)
}