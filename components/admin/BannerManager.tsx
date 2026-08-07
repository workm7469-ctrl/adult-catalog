'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import type { Banner } from '@/lib/types'
import { deleteImageByUrl, uploadImage } from '@/lib/utils'

export default function BannerManager() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)

  async function loadBanners() {
    setLoading(true)
    const { data } = await supabase.from('banners').select('*').order('position', { ascending: true })
    setBanners((data as Banner[]) ?? [])
    setLoading(false)
  }

  useEffect(() => {
    loadBanners()
  }, [])

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''
    setError(null)
    setUploading(true)
    try {
      const imageUrl = await uploadImage('banner-images', file, 'banners')
      const nextPosition = banners.length > 0 ? Math.max(...banners.map((b) => b.position)) + 1 : 0
      const { error: insertError } = await supabase
        .from('banners')
        .insert([{ image_url: imageUrl, position: nextPosition }])
      if (insertError) throw insertError
      await loadBanners()
    } catch (err: any) {
      setError(err?.message ?? 'อัปโหลดไม่สำเร็จ กรุณาลองใหม่อีกครั้ง')
    } finally {
      setUploading(false)
    }
  }

  async function handleDelete(banner: Banner) {
    const confirmed = window.confirm('ลบแบนเนอร์นี้ใช่หรือไม่?')
    if (!confirmed) return
    setBusyId(banner.id)
    try {
      await supabase.from('banners').delete().eq('id', banner.id)
      await deleteImageByUrl('banner-images', banner.image_url)
      setBanners((prev) => prev.filter((b) => b.id !== banner.id))
    } finally {
      setBusyId(null)
    }
  }

  async function handleMove(index: number, direction: -1 | 1) {
    const targetIndex = index + direction
    if (targetIndex < 0 || targetIndex >= banners.length) return
    const current = banners[index]
    const target = banners[targetIndex]
    setBusyId(current.id)
    try {
      await Promise.all([
        supabase.from('banners').update({ position: target.position }).eq('id', current.id),
        supabase.from('banners').update({ position: current.position }).eq('id', target.id),
      ])
      await loadBanners()
    } finally {
      setBusyId(null)
    }
  }

  if (loading) {
    return <p className="py-8 text-center text-sm text-muted">กำลังโหลดแบนเนอร์…</p>
  }

  return (
    <div className="space-y-4">
      <label className="flex items-center justify-center rounded-card border border-dashed border-line bg-surface px-4 py-6 text-center">
        <div>
          <p className="font-display text-sm font-medium text-ink">
            {uploading ? 'กำลังอัปโหลด…' : '+ เพิ่มแบนเนอร์ใหม่'}
          </p>
          <p className="mt-1 text-xs text-muted">แนะนำอัตราส่วน 16:9 หรือกว้างกว่า</p>
        </div>
        <input type="file" accept="image/*" onChange={handleUpload} disabled={uploading} className="hidden" />
      </label>

      {error && <p className="rounded-card bg-danger/10 px-3 py-2 text-sm text-danger">{error}</p>}

      {banners.length === 0 && <p className="py-4 text-center text-sm text-muted">ยังไม่มีแบนเนอร์</p>}

      <div className="space-y-2">
        {banners.map((banner, index) => (
          <div key={banner.id} className="flex items-center gap-3 rounded-card border border-line bg-surface p-2.5">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gold font-display text-sm font-semibold text-night">
              {index + 1}
            </span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={banner.image_url} alt="banner" className="h-14 w-24 rounded-lg object-cover" />
            <div className="flex flex-1 justify-end gap-1.5">
              <button
                onClick={() => handleMove(index, -1)}
                disabled={index === 0 || busyId === banner.id}
                className="rounded-pill border border-line px-2.5 py-1.5 text-xs text-ink disabled:opacity-30"
              >
                ขึ้น
              </button>
              <button
                onClick={() => handleMove(index, 1)}
                disabled={index === banners.length - 1 || busyId === banner.id}
                className="rounded-pill border border-line px-2.5 py-1.5 text-xs text-ink disabled:opacity-30"
              >
                ลง
              </button>
              <button
                onClick={() => handleDelete(banner)}
                disabled={busyId === banner.id}
                className="rounded-pill border border-danger px-2.5 py-1.5 text-xs text-danger disabled:opacity-50"
              >
                ลบ
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
