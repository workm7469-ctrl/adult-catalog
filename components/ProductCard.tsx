import Image from 'next/image'
import { useState } from 'react'
import type { Product } from '@/lib/types'
import { discountPercent, formatPrice } from '@/lib/utils'

export default function ProductCard({ product, onSelect }: { product: Product; onSelect: (p: Product) => void }) {
  const percentOff = discountPercent(product.price, product.original_price)
  const [loaded, setLoaded] = useState(false)

  return (
    <button
      onClick={() => onSelect(product)}
      className="group flex flex-col overflow-hidden rounded-card border border-line bg-surface text-left shadow-soft transition-transform active:scale-[0.98]"
    >
      <div className={`relative aspect-square w-full overflow-hidden ${loaded ? 'bg-surface2' : 'skeleton-shimmer'}`}>
        <Image
          src={product.cover_image_url}
          alt={product.name}
          fill
          sizes="(max-width: 639px) 50vw, (max-width: 767px) 33vw, 25vw"
          onLoad={() => setLoaded(true)}
          className={`object-cover transition-[opacity,transform] duration-300 group-active:scale-105 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
        {percentOff !== null && (
          <span className="absolute left-2 top-2 rounded-pill bg-rose px-2 py-0.5 font-display text-xs font-semibold text-night shadow-soft">
            -{percentOff}%
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 p-3">
        <p className="font-display text-lg font-medium leading-snug text-ink line-clamp-2">{product.name}</p>
        <div className="mt-auto flex flex-wrap items-baseline gap-x-2">
          <p className="font-display text-xl font-semibold text-gold">{formatPrice(product.price)}</p>
          {percentOff !== null && (
            <p className="font-display text-sm text-muted line-through">{formatPrice(product.original_price!)}</p>
          )}
        </div>
      </div>
    </button>
  )
}
