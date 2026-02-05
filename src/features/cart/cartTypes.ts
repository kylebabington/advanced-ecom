// src/features/cart/cartTypes.ts
// This file defines the types for the cart

import type { Product } from "../../api/types";

//Cart item = product + quantity
export type CartItem = {
    product: Product;
    quantity: number;
};