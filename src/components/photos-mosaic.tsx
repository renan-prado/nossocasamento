'use client'

import Image from 'next/image'

const PHOTOS = Array.from({ length: 29 }, (_, i) => ({
  src: `/mosaico/mosaico%20(${i + 1}).JPG`,
  alt: `Foto ${i + 1}`,
}))

const HEIGHTS: number[] = [
  280, 200, 340, 240, 180, 300, 220, 260,
  200, 320, 240, 180, 300, 220, 280, 200,
  260, 340, 180, 240, 300, 200, 280, 220,
  260, 180, 320, 240, 200,
]

export function PhotosMosaic() {
  return (
    <div
      className="relative w-full max-w-7xl mt-16 flex-1 overflow-hidden opacity-60"
      style={{
        maskImage: 'linear-gradient(to bottom, black 65%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, black 65%, transparent 100%)',
      }}
    >
      <div className="columns-3 sm:columns-4 lg:columns-5 xl:columns-6 gap-2">
        {PHOTOS.map((photo, i) => (
          <div
            key={photo.src}
            className="relative mb-2 overflow-hidden rounded-xl break-inside-avoid"
            style={{ height: HEIGHTS[i] }}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              className="object-cover transition-transform duration-500 hover:scale-110"
              sizes="(max-width: 640px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
