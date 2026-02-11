import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ProductCard from './ProductCard'
import { renderWithProviders } from '../test-utils/renderWithProviders'
import { expect } from 'vitest'
import { it } from 'vitest'
import { describe } from 'vitest'

describe('ProductCard', () => {
    it('adds item to cart when button is clicked', async () => {
        const user = userEvent.setup()

        const product = {
            id: '1',
            title: 'Test Product',
            price: 10,
            description: 'This is a test product',
            category: 'tools',
            image: 'https://via.placeholder.com/150',
            rating: { rate: 5, count: 1 },
        }

        const { store } = renderWithProviders(
            <ProductCard product={product} />
        )

        await user.click(
            screen.getByRole('button', { name: /add to cart/i })
        )

        const state = store.getState()

        expect(state.cart.items.length).toBe(1)
        expect(state.cart.items[0].product.id).toBe('1')
    })
})