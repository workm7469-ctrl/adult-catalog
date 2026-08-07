import type { Product } from '@/lib/types'
import { formatPrice } from '@/lib/utils'

export default function ProductCard({ product, onSelect }: { product: Product; onSelect: (p: Product) => void }) {
  return (
    <button
      onClick={() => onSelect(product)}
      className="group flex flex-col overflow-hidden rounded-card border border-line bg-surface text-left shadow-soft transition-transform active:scale-[0.98]"
    >
      <div className="aspect-square w-full overflow-hidden bg-surface2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.cover_image_url}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 group-active:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col gap-1 p-3">
        <p className="font-display text-lg font-medium leading-snug text-ink line-clamp-2">{product.name}</p>
        <p className="mt-auto font-display text-xl font-semibold text-gold">{formatPrice(product.price)}</p>
      </div>
    </button>
  )
}
