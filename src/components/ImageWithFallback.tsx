// src/components/ImageWithFallback.tsx
// This component renders an <img> with a reliable fallback if the image fails to load.
//
// Why we want this:
// - FakeStore image URLs sometimes fail (404, CORS, slow network, etc.)
// - We already implemented fallback inside ProductCard,
//   but CartPage also shows images and should be equally robust.
// - Reusable component = cleaner code + consistent behavior.

import { useState } from 'react'

// A tiny inline SVG placeholder image (no extra asset file needed).
// We URI-encode it so it can be used directly as an <img src="...">.
const FALLBACK_IMAGE =
  'data:image/svg+xml;charset=UTF-8,' +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="400" height="300">
      <rect width="100%" height="100%" fill="#f2f2f2"/>
      <text x="50%" y="50%" font-size="18" text-anchor="middle" fill="#777" font-family="Arial">
        Image not available
      </text>
    </svg>
  `)

type ImageWithFallbackProps = {
  // The primary image URL we *want* to load
  src: string

  // Standard image props
  alt: string
  className?: string

  // Optional: allow overriding fallback if you want a different one later
  fallbackSrc?: string
}

export default function ImageWithFallback({
  src,
  alt,
  className,
  fallbackSrc = FALLBACK_IMAGE,
}: ImageWithFallbackProps) {
  // Start by trying the real image first
  const [currentSrc, setCurrentSrc] = useState(src)

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      onError={() => {
        // If the image fails, swap to fallback.
        // This is the entire “image fallback verification” requirement.
        setCurrentSrc(fallbackSrc)
      }}
    />
  )
}
