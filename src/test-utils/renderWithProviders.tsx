import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { render } from '@testing-library/react'
import cartReducer from '../features/cart/cartSlice'
import { MemoryRouter } from 'react-router-dom'
import React from 'react'

export function renderWithProviders(ui: React.ReactElement) {
    const store = configureStore({
        reducer: {
            cart: cartReducer,
        },
    })

    function Wrapper({ children }: { children: React.ReactNode }) {
        return (
            <Provider store={store}>
                <MemoryRouter>
                    {children}
                </MemoryRouter>
            </Provider>
        )
    }

    return {
        store,
        ...render(ui, { wrapper: Wrapper }),
    }
}