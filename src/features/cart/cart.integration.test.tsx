import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Layout from '../../components/Layout'
import ProductCard from '../../components/ProductCard'
import { renderWithProviders } from '../../test-utils/renderWithProviders'
import { vi } from 'vitest'
import { describe } from 'vitest'
import { it } from 'vitest'
import { expect } from 'vitest'

// Mock AuthContext because Layout depends on it
vi.mock('../../auth/AuthContext', () => ({
    useAuth: () => ({
        user: null,
        logout: vi.fn(),
    }),
}))

describe('Cart Integration', () => {
    it('updates badge when adding product', async () => {
        const user = userEvent.setup()

        const product = {
            id: '99',
            title: 'Integration Product',
            price: 5,
            description: '',
            category: '',
            image: '',
            rating: { rate: 5, count: 1 },
        }

        renderWithProviders(
            <>
                <Layout />
                <ProductCard product={product} />
            </>
        )

        // Initially 0
        expect(screen.getByText('0')).toBeInTheDocument()

        await user.click(
            screen.getByRole('button', { name: /add to cart/i })
        )

        expect(screen.getByText('1')).toBeInTheDocument()
    })
})