'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { Banner } from '@/lib/types'

const AUTOPLAY_MS = 4500

export default function BannerCarousel({ banners }: { banners: Banner[] }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const scrollerRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const scrollToIndex = useCallback((index: number) => {
    const el = scrollerRef.current
    if (!el) return
    el.scrollTo({ left: index * el.clientWidth, behavior: 'smooth' })
  }, [])

  const startAutoplay = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    if (banners.length <= 1) return
    timerRef.current = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % banners.length
        scrollToIndex(next)
        return next
      })
    }, AUTOPLAY_MS)
  }, [banners.length, scrollToIndex])

  useEffect(() => {
    startAutoplay()
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [startAutoplay])

  function handleScroll() {
    const el = scrollerRef.current
    if (!el) return
    const index = Math.round(el.scrollLeft / el.clientWidth)
    setActiveIndex(index)
  }

  if (banners.length === 0) return null

  return (
    <div className="relative w-full">
      <div
        ref={scrollerRef}
        onScroll={handleScroll}
        onTouchStart={() => timerRef.current && clearInterval(timerRef.current)}
        onTouchEnd={startAutoplay}
        className="no-scrollbar snap-x-mandatory flex aspect-[16/9] w-full overflow-x-auto [touch-action:pan-x] sm:aspect-[21/9]"
      >
        {banners.map((banner) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={banner.id}
            src={banner.image_url}
            alt="โปรโมชั่น"
            className="h-full w-full shrink-0 snap-center object-cover"
          />
        ))}
      </div>

      {banners.length > 1 && (
        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
          {banners.map((b, i) => (
            <button
              key={b.id}
              aria-label={`ไปที่แบนเนอร์ที่ ${i + 1}`}
              onClick={() => {
                scrollToIndex(i)
                setActiveIndex(i)
                startAutoplay()
              }}
              className={`h-1.5 rounded-pill transition-all ${
                i === activeIndex ? 'w-5 bg-rose' : 'w-1.5 bg-white/40'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
