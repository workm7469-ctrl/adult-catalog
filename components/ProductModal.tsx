'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import type { ContactSettings, Product } from '@/lib/types'
import { discountPercent, formatPrice, telHref } from '@/lib/utils'

export default function ProductModal({
  product,
  contact,
  onClose,
}: {
  product: Product
  contact: ContactSettings | null
  onClose: () => void
}) {
  const images = useMemo(
    () => [product.cover_image_url, ...product.gallery_images],
    [product.cover_image_url, product.gallery_images]
  )
  const [activeIndex, setActiveIndex] = useState(0)
  const scrollerRef = useRef<HTMLDivElement>(null)
  const percentOff = discountPercent(product.price, product.original_price)

  function handleScroll() {
    const el = scrollerRef.current
    if (!el) return
    const index = Math.round(el.scrollLeft / el.clientWidth)
    setActiveIndex(index)
  }

  function goTo(index: number) {
    const el = scrollerRef.current
    if (!el) return
    const clamped = Math.max(0, Math.min(images.length - 1, index))
    el.scrollTo({ left: clamped * el.clientWidth, behavior: 'smooth' })
    setActiveIndex(clamped)
  }

  // ให้ใช้ลูกศรซ้าย-ขวาบนคีย์บอร์ดเลื่อนดูรูปได้ทันทีตั้งแต่เปิด pop-up
  // (ไม่งั้นต้องคลิกที่รูปก่อนครั้งนึงคีย์ลูกศรถึงจะทำงาน)
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft') goTo(activeIndex - 1)
      else if (e.key === 'ArrowRight') goTo(activeIndex + 1)
      else if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, images.length])

  const hasPhone = !!contact?.phone_number
  const hasLine = !!contact?.line_url

  return (
    <div
      className="animate-fade-in fixed inset-0 z-50 flex items-end justify-center bg-black/70 sm:items-center"
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="animate-sheet-up flex max-h-[85dvh] w-full max-w-lg flex-col overflow-hidden rounded-t-card bg-surface sm:max-h-[92dvh] sm:animate-pop-in sm:rounded-card"
      >
        <div className="relative shrink-0">
          <div
            ref={scrollerRef}
            onScroll={handleScroll}
            className="no-scrollbar snap-x-mandatory flex aspect-square w-full overflow-x-auto [touch-action:pan-x]"
          >
            {images.map((src, i) => (
              <div key={i} className="relative h-full w-full shrink-0 snap-center">
                <Image
                  src={src}
                  alt={`${product.name} รูปที่ ${i + 1}`}
                  fill
                  sizes="(max-width: 639px) 100vw, 512px"
                  className="object-cover"
                />
              </div>
            ))}
          </div>

          {images.length > 1 && (
            <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
              {images.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 w-1.5 rounded-full ${i === activeIndex ? 'bg-white' : 'bg-white/40'}`}
                />
              ))}
            </div>
          )}

          {images.length > 1 && activeIndex > 0 && (
            <button
              onClick={() => goTo(activeIndex - 1)}
              aria-label="รูปก่อนหน้า"
              className="absolute left-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
          )}

          {images.length > 1 && activeIndex < images.length - 1 && (
            <button
              onClick={() => goTo(activeIndex + 1)}
              aria-label="รูปถัดไป"
              className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          )}

          <button
            onClick={onClose}
            aria-label="ปิด"
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white"
          >
            ✕
          </button>

          {percentOff !== null && (
            <span className="absolute left-3 top-3 rounded-pill bg-rose px-2.5 py-1 font-display text-sm font-semibold text-night shadow-soft">
              -{percentOff}%
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col overflow-y-auto p-4">
          <p className="font-display text-3xl font-semibold text-accent-name">{product.name}</p>
          <div className="mt-1 flex flex-wrap items-baseline gap-x-3">
            <p className="font-display text-4xl font-semibold text-accent-price">{formatPrice(product.price)}</p>
            {percentOff !== null && (
              <p className="font-display text-xl text-muted line-through">{formatPrice(product.original_price!)}</p>
            )}
          </div>

          {product.description && (
            <p className="mt-3 whitespace-pre-line text-lg leading-relaxed text-muted">{product.description}</p>
          )}

          <div className="mt-5 flex gap-2">
            {hasPhone && (
              <a
                href={telHref(contact!.phone_number!)}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-pill bg-gold px-4 py-3 font-display text-lg font-semibold text-night"
              >
                โทรสั่งซื้อ
              </a>
            )}
            {hasLine && (
              <a
                href={contact!.line_url!}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-1 items-center justify-center gap-1.5 rounded-pill bg-line_brand px-4 py-3 font-display text-lg font-semibold text-white"
              >
                สั่งซื้อทาง LINE
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
