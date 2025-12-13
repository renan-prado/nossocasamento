import { useEffect, useState } from "react"

export function ScrollIndicator() {
  const [visible, setVisible] = useState(true)
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0)

    const onScroll = () => {
      if (window.scrollY > 50) setVisible(false)
    }

    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div className={`fixed bottom-8 left-1/2 z-50 -translate-x-1/2 transition-all duration-700 ${visible ? 'opacity-60 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
      <div className="relative h-11 w-5 rounded-full border-2 border-white/30 backdrop-blur-sm shadow-lg shadow-white/10 animate-pulse-border">
        <span className={`absolute left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-white/90 shadow-lg shadow-white/30 ${isTouchDevice ? 'animate-scroll-dot-up' : 'animate-scroll-dot-down'}`} />
      </div>
    </div>
  )
}
