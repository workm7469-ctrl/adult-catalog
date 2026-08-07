'use client'

import { useMemo, useRef, useState } from 'react'
import type { ContactSettings, Product } from '@/lib/types'
import { formatPrice, telHref } from '@/lib/utils'

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

  function handleScroll() {
    const el = scrollerRef.current
    if (!el) return
    const index = Math.round(el.scrollLeft / el.clientWidth)
    setActiveIndex(index)
  }

  const hasPhone = !!contact?.phone_number
  const hasLine = !!contact?.line_url

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 sm:items-center" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-card bg-surface sm:rounded-card"
      >
        <div className="relative shrink-0">
          <div
            ref={scrollerRef}
            onScroll={handleScroll}
            className="no-scrollbar snap-x-mandatory flex aspect-square w-full overflow-x-auto"
          >
            {images.map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                src={src}
                alt={`${product.name} รูปที่ ${i + 1}`}
                className="h-full w-full shrink-0 snap-center object-cover"
              />
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

          <button
            onClick={onClose}
            aria-label="ปิด"
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-1 flex-col overflow-y-auto p-4">
          <p className="font-display text-xl font-semibold text-ink">{product.name}</p>
          <p className="mt-1 font-display text-2xl font-semibold text-gold">{formatPrice(product.price)}</p>

          {product.description && (
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted">{product.description}</p>
          )}

          <div className="mt-5 flex gap-2">
            {hasPhone && (
              <a
                href={telHref(contact!.phone_number!)}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-pill bg-gold px-4 py-3 font-display text-sm font-semibold text-night"
              >
                โทรสั่งซื้อ
              </a>
            )}
            {hasLine && (
              <a
                href={contact!.line_url!}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-1 items-center justify-center gap-1.5 rounded-pill bg-line_brand px-4 py-3 font-display text-sm font-semibold text-white"
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
