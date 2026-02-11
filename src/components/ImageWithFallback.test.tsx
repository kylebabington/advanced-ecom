import { render, screen, fireEvent } from '@testing-library/react'
import ImageWithFallback from './ImageWithFallback'

describe('ImageWithFallback', () => {
    it('switches to fallback image when error occurs', () => {
        const fallback = 'https://example.com/fallback.png'

        render(
            <ImageWithFallback
                src="https://example.com/broken.png"
                alt="Test Image"
                fallbackSrc={fallback}
            />
        )

        const img = screen.getByAltText('Test Image') as HTMLImageElement

        fireEvent.error(img)

        expect(img.src).toContain('fallback.png')

    })
})