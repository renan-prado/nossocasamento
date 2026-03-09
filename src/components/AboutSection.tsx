'use client'

import Image from "next/image"
import { useEffect, useState } from "react"

interface HeartConfig {
  id: number
  left: number
  size: number
  duration: number
  delay: number
}

function FloatingHeartsColumn({ side }: { side: 'left' | 'right' }) {
  const [hearts, setHearts] = useState<HeartConfig[]>([])

  useEffect(() => {
    setHearts(
      Array.from({ length: 14 }, (_, i) => ({
        id: i,
        left: Math.random() * 60 + 10,
        size: Math.floor(Math.random() * 22 + 10),
        duration: Math.random() * 6 + 9,
        delay: Math.random() * -18,
      }))
    )
  }, [])

  const positionStyle = side === 'left' ? { left: 0 } : { right: 0 }

  return (
    <div
      className="absolute inset-y-0 w-14 sm:w-24 md:w-56 lg:w-80 xl:w-96 overflow-hidden pointer-events-none z-0"
      style={positionStyle}
    >
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="absolute bottom-0"
          style={{
            left: `${heart.left}%`,
            width: heart.size,
            height: heart.size,
            animationName: 'floatHeart',
            animationDuration: `${heart.duration}s`,
            animationDelay: `${heart.delay}s`,
            animationTimingFunction: 'ease-in-out',
            animationIterationCount: 'infinite',
          }}
        >
          <Image
            src="/coracao.png"
            alt=""
            width={heart.size}
            height={heart.size}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>
      ))}
    </div>
  )
}

export function AboutSection() {
  return (
    <>
      <style>{`
        @keyframes floatHeart {
          0% {
            transform: translateY(0) translateX(0) scale(0.85) rotate(-15deg);
            opacity: 0;
          }
          8% {
            opacity: 0.5;
          }
          35% {
            transform: translateY(-35vh) translateX(10px) scale(1.05) rotate(10deg);
          }
          65% {
            transform: translateY(-65vh) translateX(-10px) scale(0.95) rotate(-8deg);
          }
          92% {
            opacity: 0.2;
          }
          100% {
            transform: translateY(-102vh) translateX(5px) scale(0.8) rotate(20deg);
            opacity: 0;
          }
        }
      `}</style>

      <FloatingHeartsColumn side="left" />
      <FloatingHeartsColumn side="right" />

      <div className="relative z-10 flex flex-col items-center h-full w-full pt-10 sm:pt-16">
        <div className="flex flex-col items-center gap-2 sm:gap-4 px-6 text-center text-green-foreground max-w-[300px] sm:max-w-sm md:max-w-lg lg:max-w-xl">
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.5em] sm:tracking-[0.6em] text-green-foreground/50 font-semibold">Nossa história</p>
          <h2 className="text-xl sm:text-3xl md:text-4xl font-serif font-bold leading-tight">Sobre nós</h2>
          <div className="flex flex-col gap-2 sm:gap-3 text-xs sm:text-base md:text-sm font-serif leading-relaxed text-green-foreground/75 pt-2 sm:pt-6">
            <p>Antes de sermos nós, já existiam duas histórias sendo escritas.Dois caminhos, duas infâncias e dois jeitos de ver o mundo que um dia iriam se encontrar.</p>
            <p>Nossa história começou no cinema, e talvez isso diga bastante sobre quem somos.Sempre gostamos de arte, cultura e lugares cheios de memória. A Dani, psicóloga, se interessa pelas pessoas e suas histórias. O Renan, programador, gosta de entender como as coisas funcionam e transformar ideias em projetos.</p>
            <p>Entre diferenças e afinidades, descobrimos o prazer das boas conversas, dos filmes marcantes e dos rolês culturais. E assim, o que começou como encontro virou parceria, daquelas que a gente escolhe construir e agora celebrar.</p>
          </div>
        </div>

        <div className="flex-1 min-h-0 w-[88vw] md:w-[60vw] lg:w-[50vw] flex justify-center items-end pointer-events-none overflow-hidden">
          <Image
            src="/vintage-2.png"
            alt=""
            width={1000}
            height={1000}
            className="w-full max-h-full object-contain object-bottom shadow-2xl opacity-80"
            priority={false}
          />
        </div>
      </div>
    </>
  )
}
