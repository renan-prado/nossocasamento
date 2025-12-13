'use client'

import Image from 'next/image'

const PHOTOS = [
  { src: '/nos-mesmos/nos-1.webp', alt: 'Nós 1' },
  { src: '/nos-mesmos/nos-2.jpg', alt: 'Nós 2' },
  { src: '/nos-mesmos/nos-3.png', alt: 'Nós 3' },
]

export function PhotosMosaic() {
  return (
    <div className="grid w-full max-w-5xl grid-cols-2 gap-4 sm:grid-cols-4">
      <div className="overflow-hidden rounded-3xl col-span-2 sm:col-span-1 relative h-32 sm:h-48">
        <Image
          src={PHOTOS[0].src}
          alt={PHOTOS[0].alt}
          fill
          className="object-cover grayscale"
          priority
        />
        <div className="absolute inset-0 bg-green/50" />
      </div>
      <div className="overflow-hidden rounded-3xl col-span-2 relative h-32 sm:h-48">
        <Image
          src={PHOTOS[2].src}
          alt={PHOTOS[2].alt}
          fill
          className="object-cover grayscale"
          priority
        />
        <div className="absolute inset-0 bg-green/50" />
      </div>
      <div className="overflow-hidden rounded-3xl col-span-2 sm:col-span-1 relative h-32 sm:h-48">
        <Image
          src={PHOTOS[1].src}
          alt={PHOTOS[1].alt}
          fill
          className="object-cover grayscale"
          priority
        />
        <div className="absolute inset-0 bg-green/50" />
      </div>
    </div>
  )
}

