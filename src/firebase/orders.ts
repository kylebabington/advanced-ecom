// src/firebase/orders.ts
// Firestore order creation and querying.

import {
    addDoc,
    collection,
    getDocs,
    query,
    where,
    orderBy,
    Timestamp,
    doc,
    getDoc,
} from 'firebase/firestore'
import { db } from './firebase'
import type { CartItem } from '../features/cart/cartTypes'

export type OrderDoc = {
    id: string
    userId: string
    createdAt: Timestamp
    totalPrice: number
    items: Array<{
        productId: string
        title: string
        price: number
        image: string
        quantity: number
    }>
}

const ordersCol = collection(db, 'orders')

export async function createOrder(params: {
    userId: string
    cartItems: CartItem[]
}): Promise<string> {
    const totalPrice = params.cartItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
    )

    const items = params.cartItems.map((item) => ({
        productId: item.product.id,
        title: item.product.title,
        price: item.product.price,
        image: item.product.image,
        quantity: item.quantity,
    }))

    const ref = await addDoc(ordersCol, {
        userId: params.userId,
        createdAt: Timestamp.now(),
        totalPrice,
        items,
    })

    return ref.id
}

export async function fetchOrdersForUser(userId: string): Promise<OrderDoc[]> {
    const q = query(
        ordersCol,
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
    )
    const snap = await getDocs(q)
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<OrderDoc, 'id'>) }))
}

/** Fetch all orders (admin only). Firestore rules enforce admin access. */
export async function fetchAllOrders(): Promise<OrderDoc[]> {
    const q = query(ordersCol, orderBy('createdAt', 'desc'))
    const snap = await getDocs(q)
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<OrderDoc, 'id'>) }))
}

export async function getOrderById(orderId: string): Promise<OrderDoc | null> {
    const ref = doc(db, 'orders', orderId)
    const snap = await getDoc(ref)
    if (!snap.exists()) return null
    return { id: snap.id, ...(snap.data() as Omit<OrderDoc, 'id'>) }
}