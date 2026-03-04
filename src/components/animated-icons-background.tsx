'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

const ICONS = [
  'nois.svg',
  'Group 8.svg',
  '_x39_Di6q1.tif.svg',
  'wkZYtz.tif.svg',
  'RogRMb.tif.svg',
  'Group 4.svg',
  'Group 5.svg',
  'KDmvU2.tif.svg',
  'Group 1.svg',
  'Group 7.svg',
  'Group 2.svg',
  'Group 3.svg',
  'Vector.svg',
  'B3dr6X.tif.svg',
  'j6kEpO.tif.svg',
  'MWn3Zh.tif.svg',
  'IEPSBm.tif.svg',
  'qA76Ic.tif.svg',
  'dRLrIJ.tif.svg',
  'Zpjw9z.tif.svg',
  'ax4SxL.tif.svg',
  '_x30_wlX0S.tif.svg',
  'd7OENQ.tif.svg',
  'G0MMUU.tif.svg',
  '_x36_Mf1Yy.tif.svg',
  '_x36_ZP1Hq.tif.svg',
  'QP0SW5.tif.svg',
  'AuMMNC.tif.svg',
  'gc9IdA.tif.svg',
  'SJtJYj.tif.svg',
  'yfgWhe.tif.svg',
  'SoTFls.tif.svg',
  'VI4WDF.tif.svg',
  'ecVVBy.tif.svg',
  'Gixcm9.tif.svg',
  'h4ChEl.tif.svg',
]

interface IconPosition {
  icon: string
  x: number
  y: number
  size: number
  duration: number
  delay: number
  rotation: number
}

function generateScatteredPositions(count: number): IconPosition[] {
  const columns = 5
  const rowHeight = 20
  const columnWidth = 20

  return Array.from({ length: count }, (_, index) => {
    const baseX = (index % columns) * columnWidth
    const baseY = Math.floor(index / columns) * rowHeight

    return {
      icon: ICONS[index % ICONS.length],
      x: Math.min(baseX + Math.random() * (columnWidth - 5), 95),
      y: Math.min(baseY + Math.random() * (rowHeight - 5), 95),
      size: Math.random() * 100 + 60,
      duration: Math.random() * 15 + 20,
      delay: Math.random() * 3,
      rotation: Math.random() * 360,
    }
  })
}

export function AnimatedIconsBackground() {
  const [positions, setPositions] = useState<IconPosition[]>([])
  const [scale, setScale] = useState(1)

  useEffect(() => {
    setPositions(generateScatteredPositions(20))
  }, [])

  useEffect(() => {
    const updateScale = () => {
      setScale(window.innerWidth < 768 ? 0.65 : 1)
    }
    updateScale()
    window.addEventListener('resize', updateScale)
    return () => window.removeEventListener('resize', updateScale)
  }, [])
  
  if (positions.length === 0) return null
  
  return (
    <div className="absolute inset-0 w-screen h-screen overflow-hidden pointer-events-none">
      {positions.map((pos, index) => (
        <div
          key={`${pos.icon}-${index}`}
          className="absolute animate-float"
          style={{
            left: `${pos.x}%`,
            top: `${pos.y}%`,
            width: `${pos.size * scale}px`,
            height: `${pos.size * scale}px`,
            '--rotation': `${pos.rotation}deg`,
            '--duration': `${pos.duration}s`,
            '--delay': `${pos.delay}s`,
          } as React.CSSProperties & {
            '--rotation': string
            '--duration': string
            '--delay': string
          }}
        >
          <Image
            src={`/icones/${pos.icon}`}
            alt=""
            width={pos.size}
            height={pos.size}
            className="w-full h-full object-contain opacity-5"
            style={{
              filter: 'brightness(0) invert(1)',
            }}
          />
        </div>
      ))}
    </div>
  )
}

