// src/features/cart/cartSlice.ts
// This file defines the Redux slice for the cart

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Product } from "../../api/types";
import type { CartItem } from "./cartTypes";
import { loadCartFromSession, saveCartToSession, clearCartSession } from "./cartStorage";

// Our Redux state shape for the cart
type CartState = {
    items: CartItem[]
}

// Initial state loads from sessionStorage (persistence requirement)
const initialState: CartState = {
    items: loadCartFromSession(),
}

// Small helper keep sessionStorage synced whenever cart changes
function sync(state: CartState) {
    saveCartToSession(state.items)
}

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        // Add product to cart (or increase quantity)
        addToCart: (state, action: PayloadAction<Product>) => {
            const product = action.payload
            
            //Try to find existing cart item
            const existing = state.items.find((i) => i.product.id === product.id)

            if (existing) {
                existing.quantity += 1
            } else {
                state.items.push({ product, quantity: 1 })
            }

            sync(state)
        },

        // Remove product entirely from cart
        removeFromCart: (state, action: PayloadAction<number>) => {
            const productId = action.payload
            state.items = state.items.filter((i) => i.product.id !== productId)
            sync(state)
        },

        // Clear cart (used for checkout)
        clearCart: (state) => {
            state.items = []
            clearCartSession()
        },
    },
})

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions
export default cartSlice.reducer