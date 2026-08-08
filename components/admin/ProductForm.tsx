'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { CATEGORIES, type Product, type ProductCategory } from '@/lib/types'
import { deleteImageByUrl, deleteImagesByUrls, uploadImage } from '@/lib/utils'

type Props = {
  mode: 'add' | 'edit'
  initialProduct?: Product
  onSaved: () => void
  onCancel?: () => void
}

export default function ProductForm({ mode, initialProduct, onSaved, onCancel }: Props) {
  const [name, setName] = useState(initialProduct?.name ?? '')
  const [category, setCategory] = useState<ProductCategory>(initialProduct?.category ?? 'อื่นๆ')
  const [description, setDescription] = useState(initialProduct?.description ?? '')
  const [price, setPrice] = useState(initialProduct?.price != null ? String(initialProduct.price) : '')
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(initialProduct?.cover_image_url ?? null)
  const [existingGallery, setExistingGallery] = useState<string[]>(initialProduct?.gallery_images ?? [])
  const [removedGallery, setRemovedGallery] = useState<string[]>([])
  const [newGalleryFiles, setNewGalleryFiles] = useState<File[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setCoverFile(file)
    setCoverPreview(URL.createObjectURL(file))
  }

  function handleGalleryChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    setNewGalleryFiles((prev) => [...prev, ...files])
    e.target.value = ''
  }

  function removeExistingGalleryImage(url: string) {
    setExistingGallery((prev) => prev.filter((u) => u !== url))
    setRemovedGallery((prev) => [...prev, url])
  }

  function removeNewGalleryFile(index: number) {
    setNewGalleryFiles((prev) => prev.filter((_, i) => i !== index))
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

      const uploadedGalleryUrls: string[] = []
      for (const file of newGalleryFiles) {
        const url = await uploadImage('product-images', file, 'products')
        uploadedGalleryUrls.push(url)
      }

      const finalGallery = [...existingGallery, ...uploadedGalleryUrls]

      const payload = {
        name: name.trim(),
        category,
        description: description.trim() || null,
        price: Number(price),
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
        setCoverFile(null)
        setCoverPreview(null)
        setExistingGallery([])
        setNewGalleryFiles([])
      }
    } catch (err: any) {
      setError(err?.message ?? 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-card border border-line bg-surface p-4">
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

      <label className="block">
        <span className="mb-1 block text-xs text-muted">ราคา (บาท) *</span>
        <input
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          inputMode="numeric"
          className="w-full rounded-lg border border-line bg-surface2 px-3 py-2 text-base text-ink"
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-xs text-muted">รายละเอียดสินค้า</span>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full rounded-lg border border-line bg-surface2 px-3 py-2 text-base text-ink"
        />
      </label>

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
        <span className="mb-1 block text-xs text-muted">รูปประกอบ (Gallery)</span>
        <div className="mb-2 flex flex-wrap gap-2">
          {existingGallery.map((url) => (
            <div key={url} className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="gallery" className="h-14 w-14 rounded-lg border border-line object-cover" />
              <button
                type="button"
                onClick={() => removeExistingGalleryImage(url)}
                className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-danger text-[10px] text-white"
              >
                ✕
              </button>
            </div>
          ))}
          {newGalleryFiles.map((file, i) => (
            <div key={i} className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={URL.createObjectURL(file)} alt="new gallery" className="h-14 w-14 rounded-lg border border-line object-cover" />
              <button
                type="button"
                onClick={() => removeNewGalleryFile(i)}
                className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-danger text-[10px] text-white"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <input type="file" accept="image/*" multiple onChange={handleGalleryChange} className="text-xs text-muted" />
      </div>

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
