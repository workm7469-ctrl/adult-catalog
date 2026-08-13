'use client'

import { useState } from 'react'
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core'
import { SortableContext, arrayMove, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import { supabase } from '@/lib/supabaseClient'
import { CATEGORIES, type Product, type ProductCategory } from '@/lib/types'
import { deleteImageByUrl, deleteImagesByUrls, uploadImage } from '@/lib/utils'
import SortableGalleryThumb from './SortableGalleryThumb'

type Props = {
  mode: 'add' | 'edit'
  initialProduct?: Product
  onSaved: () => void
  onCancel?: () => void
}

type GalleryItem = { id: string; kind: 'existing'; url: string } | { id: string; kind: 'new'; file: File; preview: string }

function makeId() {
  return Math.random().toString(36).slice(2)
}

export default function ProductForm({ mode, initialProduct, onSaved, onCancel }: Props) {
  const [name, setName] = useState(initialProduct?.name ?? '')
  const [category, setCategory] = useState<ProductCategory>(initialProduct?.category ?? 'อื่นๆ')
  const [description, setDescription] = useState(initialProduct?.description ?? '')
  const [price, setPrice] = useState(initialProduct?.price != null ? String(initialProduct.price) : '')
  const [originalPrice, setOriginalPrice] = useState(
    initialProduct?.original_price != null ? String(initialProduct.original_price) : ''
  )
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(initialProduct?.cover_image_url ?? null)
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(
    (initialProduct?.gallery_images ?? []).map((url) => ({ id: url, kind: 'existing', url }))
  )
  const [removedGallery, setRemovedGallery] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const gallerySensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))

  function handleCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setCoverFile(file)
    setCoverPreview(URL.createObjectURL(file))
  }

  function handleGalleryChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    const newItems: GalleryItem[] = files.map((file) => ({
      id: makeId(),
      kind: 'new',
      file,
      preview: URL.createObjectURL(file),
    }))
    setGalleryItems((prev) => [...prev, ...newItems])
    e.target.value = ''
  }

  function removeGalleryItem(item: GalleryItem) {
    setGalleryItems((prev) => prev.filter((i) => i.id !== item.id))
    if (item.kind === 'existing') {
      setRemovedGallery((prev) => [...prev, item.url])
    }
  }

  function handleGalleryDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    setGalleryItems((prev) => {
      const oldIndex = prev.findIndex((i) => i.id === active.id)
      const newIndex = prev.findIndex((i) => i.id === over.id)
      return arrayMove(prev, oldIndex, newIndex)
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!name.trim()) {
      setError('กรุณากรอกชื่อสินค้า')
      return
    }
    if (!price || Number.isNaN(Number(price))) {
      setError('กรุณากรอกราคาเป็นตัวเลข')
      return
    }
    if (originalPrice && Number.isNaN(Number(originalPrice))) {
      setError('กรุณากรอกราคาปกติเป็นตัวเลข')
      return
    }
    if (originalPrice && Number(originalPrice) <= Number(price)) {
      setError('ราคาปกติต้องมากกว่าราคาขายจริง ไม่งั้นป้ายส่วนลดจะไม่ขึ้น')
      return
    }
    if (mode === 'add' && !coverFile) {
      setError('กรุณาเลือกรูปปกสินค้า')
      return
    }

    setSaving(true)
    try {
      let coverUrl = initialProduct?.cover_image_url ?? ''
      if (coverFile) {
        coverUrl = await uploadImage('product-images', coverFile, 'products')
      }

      // อัปโหลดทีละรูปตามลำดับที่จัดไว้ (รวมทั้งรูปเดิมและรูปใหม่) เพื่อให้ gallery_images เก็บลำดับที่ผู้ใช้จัดไว้จริง
      const finalGallery: string[] = []
      for (const item of galleryItems) {
        if (item.kind === 'existing') {
          finalGallery.push(item.url)
        } else {
          const url = await uploadImage('product-images', item.file, 'products')
          finalGallery.push(url)
        }
      }

      const payload = {
        name: name.trim(),
        category,
        description: description.trim() || null,
        price: Number(price),
        original_price: originalPrice ? Number(originalPrice) : null,
        cover_image_url: coverUrl,
        gallery_images: finalGallery,
      }

      if (mode === 'add') {
        const { data: maxRow } = await supabase
          .from('products')
          .select('position')
          .order('position', { ascending: false })
          .limit(1)
          .maybeSingle()
        const nextPosition = maxRow ? (maxRow as { position: number }).position + 1 : 0
        const { error: insertError } = await supabase
          .from('products')
          .insert([{ ...payload, position: nextPosition }])
        if (insertError) throw insertError
      } else if (initialProduct) {
        const { error: updateError } = await supabase.from('products').update(payload).eq('id', initialProduct.id)
        if (updateError) throw updateError

        if (removedGallery.length > 0) {
          await deleteImagesByUrls('product-images', removedGallery)
        }
        if (coverFile && initialProduct.cover_image_url) {
          await deleteImageByUrl('product-images', initialProduct.cover_image_url)
        }
      }

      onSaved()
      if (mode === 'add') {
        setName('')
        setCategory('อื่นๆ')
        setDescription('')
        setPrice('')
        setOriginalPrice('')
        setCoverFile(null)
        setCoverPreview(null)
        setGalleryItems([])
      }
    } catch (err: any) {
      setError(err?.message ?? 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-card border border-line bg-surface p-4">
      <div>
        <span className="mb-1 block text-xs text-muted">รูปปก (Cover) {mode === 'add' && '*'}</span>
        <div className="flex items-center gap-3">
          {coverPreview && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={coverPreview} alt="cover preview" className="h-16 w-16 rounded-lg border border-line object-cover" />
          )}
          <input type="file" accept="image/*" onChange={handleCoverChange} className="text-xs text-muted" />
        </div>
      </div>

      <div>
        <span className="mb-1 block text-xs text-muted">รูปประกอบ (Gallery) — ลากรูปเพื่อสลับตำแหน่งได้</span>
        <div className="mb-2 flex flex-wrap gap-2">
          <DndContext sensors={gallerySensors} collisionDetection={closestCenter} onDragEnd={handleGalleryDragEnd}>
            <SortableContext items={galleryItems.map((i) => i.id)} strategy={horizontalListSortingStrategy}>
              {galleryItems.map((item) => (
                <SortableGalleryThumb
                  key={item.id}
                  id={item.id}
                  src={item.kind === 'existing' ? item.url : item.preview}
                  onRemove={() => removeGalleryItem(item)}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>
        <input type="file" accept="image/*" multiple onChange={handleGalleryChange} className="text-xs text-muted" />
      </div>

      <label className="block">
        <span className="mb-1 block text-xs text-muted">ชื่อสินค้า *</span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border border-line bg-surface2 px-3 py-2 text-base text-ink"
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-xs text-muted">หมวดหมู่</span>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as ProductCategory)}
          className="w-full rounded-lg border border-line bg-surface2 px-3 py-2 text-base text-ink"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>

      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className="mb-1 block text-xs text-muted">ราคาขายจริง (บาท) *</span>
          <input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            inputMode="numeric"
            className="w-full rounded-lg border border-line bg-surface2 px-3 py-2 text-base text-ink"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs text-muted">ราคาปกติ (ถ้ามี)</span>
          <input
            value={originalPrice}
            onChange={(e) => setOriginalPrice(e.target.value)}
            inputMode="numeric"
            placeholder="เว้นว่างได้"
            className="w-full rounded-lg border border-line bg-surface2 px-3 py-2 text-base text-ink"
          />
        </label>
      </div>
      <p className="-mt-2 text-xs text-muted">
        ใส่ &quot;ราคาปกติ&quot; ไว้ถ้าอยากโชว์ป้ายราคาขีดฆ่า + เปอร์เซ็นต์ส่วนลดที่หน้าบ้าน ต้องมากกว่าราคาขายจริงเสมอ
        เว้นว่างไว้ถ้าไม่ต้องการโชว์ส่วนลด
      </p>

      <label className="block">
        <span className="mb-1 block text-xs text-muted">รายละเอียดสินค้า</span>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full rounded-lg border border-line bg-surface2 px-3 py-2 text-base text-ink"
        />
      </label>

      {error && <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">{error}</p>}

      <div className="flex gap-2 pt-1">
        <button
          type="submit"
          disabled={saving}
          className="flex-1 rounded-pill bg-rose px-4 py-2.5 text-sm font-semibold text-night disabled:opacity-60"
        >
          {saving ? 'กำลังบันทึก…' : mode === 'add' ? 'เพิ่มสินค้า' : 'บันทึกการแก้ไข'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-pill border border-line px-4 py-2.5 text-sm text-muted"
          >
            ยกเลิก
          </button>
        )}
      </div>
    </form>
  )
}
