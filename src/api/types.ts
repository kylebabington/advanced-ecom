// src/api/types.ts
// Firestore-friendly Product type.
// Firestore document IDs are strings, so id must be string now.

export type Product = {
    id: string // Firestore document ID
    title: string
    price: number
    description: string
    category: string
    image: string

    // rating is optional now because Firestore products won't necessarily include it
    rating?: {
        rate: number
        count: number
    }
}