import Image from 'next/image'
import type { Product } from '@/lib/types'
import { discountPercent, formatPrice } from '@/lib/utils'

export default function ProductCard({ product, onSelect }: { product: Product; onSelect: (p: Product) => void }) {
  const percentOff = discountPercent(product.price, product.original_price)

  return (
    <button
      onClick={() => onSelect(product)}
      className="group flex flex-col overflow-hidden rounded-card border border-line bg-surface text-left shadow-soft transition-transform active:scale-[0.98]"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-surface2">
        <Image
          src={product.cover_image_url}
          alt={product.name}
          fill
          sizes="(max-width: 639px) 50vw, (max-width: 767px) 33vw, 25vw"
          className="object-cover transition-transform duration-300 group-active:scale-105"
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
