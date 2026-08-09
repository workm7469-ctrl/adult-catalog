'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import type { Product } from '@/lib/types'
import { deleteImageByUrl, deleteImagesByUrls, discountPercent, formatPrice } from '@/lib/utils'
import ProductForm from './ProductForm'

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)

  async function loadProducts() {
    setLoading(true)
    const { data } = await supabase.from('products').select('*').order('position', { ascending: true })
    setProducts((data as Product[]) ?? [])
    setLoading(false)
  }

  useEffect(() => {
    loadProducts()
  }, [])

  async function handleDelete(product: Product) {
    const confirmed = window.confirm(`ลบ "${product.name}" ออกจากแค็ตตาล็อกใช่หรือไม่?`)
    if (!confirmed) return

    setBusyId(product.id)
    try {
      const { error } = await supabase.from('products').delete().eq('id', product.id)
      if (error) throw error

      await deleteImageByUrl('product-images', product.cover_image_url)
      if (product.gallery_images?.length) {
        await deleteImagesByUrls('product-images', product.gallery_images)
      }

      setProducts((prev) => prev.filter((p) => p.id !== product.id))
    } catch (err) {
      window.alert('ลบสินค้าไม่สำเร็จ กรุณาลองใหม่อีกครั้ง')
    } finally {
      setBusyId(null)
    }
  }

  async function handleMove(index: number, direction: -1 | 1) {
    const targetIndex = index + direction
    if (targetIndex < 0 || targetIndex >= products.length) return
    const current = products[index]
    const target = products[targetIndex]
    setBusyId(current.id)
    try {
      await Promise.all([
        supabase.from('products').update({ position: target.position }).eq('id', current.id),
        supabase.from('products').update({ position: current.position }).eq('id', target.id),
      ])
      await loadProducts()
    } finally {
      setBusyId(null)
    }
  }

  if (loading) {
    return <p className="py-8 text-center text-sm text-muted">กำลังโหลดรายการสินค้า…</p>
  }

  if (products.length === 0) {
    return <p className="py-8 text-center text-sm text-muted">ยังไม่มีสินค้า</p>
  }

  return (
    <div className="space-y-3">
      {products.map((product, index) => {
        const isEditing = editingId === product.id
        return (
          <div key={product.id} className="rounded-card border border-line bg-surface">
            {isEditing ? (
              <div className="p-3">
                <ProductForm
                  mode="edit"
                  initialProduct={product}
                  onCancel={() => setEditingId(null)}
                  onSaved={() => {
                    setEditingId(null)
                    loadProducts()
                  }}
                />
              </div>
            ) : (
              <div className="flex items-center gap-3 p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.cover_image_url}
                  alt={product.name}
                  className="h-14 w-14 shrink-0 rounded-lg border border-line object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-sm font-medium text-ink">{product.name}</p>
                  <p className="text-[11px] text-muted">{product.category}</p>
                  <div className="flex flex-wrap items-baseline gap-x-1.5">
                    <p className="font-display text-sm font-semibold text-gold">{formatPrice(product.price)}</p>
                    {discountPercent(product.price, product.original_price) !== null && (
                      <p className="text-[11px] text-muted line-through">{formatPrice(product.original_price!)}</p>
                    )}
                  </div>
                </div>
                <div className="flex shrink-0 flex-col gap-1.5">
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => handleMove(index, -1)}
                      disabled={index === 0 || busyId === product.id}
                      className="rounded-pill border border-line px-2 py-1 text-xs text-ink disabled:opacity-30"
                    >
                      ขึ้น
                    </button>
                    <button
                      onClick={() => handleMove(index, 1)}
                      disabled={index === products.length - 1 || busyId === product.id}
                      className="rounded-pill border border-line px-2 py-1 text-xs text-ink disabled:opacity-30"
                    >
                      ลง
                    </button>
                  </div>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => setEditingId(product.id)}
                      className="rounded-pill border border-line px-2.5 py-1 text-xs text-ink"
                    >
                      แก้ไข
                    </button>
                    <button
                      onClick={() => handleDelete(product)}
                      disabled={busyId === product.id}
                      className="rounded-pill border border-danger px-2.5 py-1 text-xs text-danger disabled:opacity-50"
                    >
                      ลบ
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
