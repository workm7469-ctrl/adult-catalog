'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

type Props = {
  id: string
  src: string
  onRemove: () => void
}

export default function SortableGalleryThumb({ id, src, onRemove }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} className="relative touch-none">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt="gallery"
        {...attributes}
        {...listeners}
        className="h-14 w-14 cursor-grab rounded-lg border border-line object-cover active:cursor-grabbing"
      />
      <button
        type="button"
        onClick={onRemove}
        className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-danger text-[10px] text-white"
      >
        ✕
      </button>
    </div>
  )
}
