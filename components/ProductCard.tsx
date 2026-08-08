import Image from 'next/image'
import type { Product } from '@/lib/types'
import { formatPrice } from '@/lib/utils'

export default function ProductCard({ product, onSelect }: { product: Product; onSelect: (p: Product) => void }) {
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
      </div>

      <div className="flex flex-1 flex-col gap-1 p-3">
        <p className="font-display text-lg font-medium leading-snug text-ink line-clamp-2">{product.name}</p>
        <p className="mt-auto font-display text-xl font-semibold text-gold">{formatPrice(product.price)}</p>
      </div>
    </button>
  )
}
