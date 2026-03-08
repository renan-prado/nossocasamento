'use client'

import Image from "next/image"

type MenuItem = {
  id: string
  label: string
  image: string
}

const items: MenuItem[] = [
  { id: "rsvp", label: "Confirme sua presença", image: "/mosaico/mosaico (1).JPG" },
  { id: "gifts", label: "Presenteie os noivos", image: "/mosaico/mosaico (3).JPG" },
  { id: "venue", label: "Local e espaço", image: "/mosaico/mosaico (9).JPG" },
  { id: "countdown", label: "Data e horário", image: "/mosaico/mosaico (5).JPG" },
  { id: "about", label: "Sobre nós", image: "/mosaico/mosaico (6).JPG" },
  { id: "photos", label: "Galeria de fotos", image: "/mosaico/mosaico (7).JPG" },
]

function scrollToSection(id: string) {
  const el = document.getElementById(id)
  el?.scrollIntoView({ behavior: "smooth", block: "start" })
}

export function MenuSection() {
  return (
    <div className="relative z-10 flex flex-col items-center gap-16 px-6 text-center">
      <h2 className="text-2xl opacity-85 sm:text-3xl font-serif font-bold text-white">
        Explore nosso site...
      </h2>
      <nav className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-6 sm:gap-x-12 sm:gap-y-10">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => scrollToSection(item.id)}
            className="flex flex-col items-center gap-2 group cursor-pointer"
          >
            <div className="relative w-16 h-16 sm:w-24 sm:h-24 rounded-full overflow-hidden ring-2 ring-green/20 group-hover:ring-green/60 transition-all duration-300 shadow-md group-hover:shadow-lg group-hover:scale-105">
              <Image
                src={item.image}
                alt={item.label}
                fill
                className="object-cover grayscale-0 sm:grayscale sm:group-hover:grayscale-0 transition-all duration-300"
              />
            </div>
            <span className="text-xs sm:text-sm font-semibold text-white/70 group-hover:text-white transition-colors duration-300 tracking-wide mt-1 font-mono text-center leading-tight">
              {item.label}
            </span>
          </button>
        ))}
      </nav>
    </div>
  )
}
