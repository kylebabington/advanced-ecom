// src/features/cart/cartStorage.ts
// This file handles the storage of the cart in sessionStorage

import type { CartItem } from "./cartTypes";

const STORAGE_KEY = 'cart';

// Read cart from sessionStorage (or return empty cart)
export function loadCartFromSession(): CartItem[] {
    try {
        const raw = sessionStorage.getItem(STORAGE_KEY)
        if (!raw) return []
        return JSON.parse(raw) as CartItem[]
    } catch {
        // If JSON is corrupted or blocked, fail safely
        return []
    }
}

// Save cart to sessionStorage
export function saveCartToSession(cart: CartItem[]) {
    try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(cart))
    } catch {
        // If storage is blocked, we do nothing (app still works)
    }
}

// Clear cart from sessionStorage
export function clearCartSession() {
    try {
        sessionStorage.removeItem(STORAGE_KEY)
    } catch {
        // Ignore
    }
}

