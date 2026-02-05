// src/app/store.ts
// This file configures the Redux store

import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../features/cart/cartSlice";

// The Redux store combines reducers (we have cart for now)
export const store = configureStore({
    reducer: {
        cart: cartReducer,
    }
})

// Types for TypeScript (so selectors/dispatch are strongly typed)
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch