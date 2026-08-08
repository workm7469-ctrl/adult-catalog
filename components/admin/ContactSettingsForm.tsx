'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import type { ContactSettings } from '@/lib/types'

export default function ContactSettingsForm() {
  const [phone, setPhone] = useState('')
  const [lineUrl, setLineUrl] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [savedAt, setSavedAt] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('contact_settings').select('*').eq('id', 1).maybeSingle()
      const s = data as ContactSettings | null
      setPhone(s?.phone_number ?? '')
      setLineUrl(s?.line_url ?? '')
      setLoading(false)
    }
    load()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSaving(true)
    try {
      const { error: upsertError } = await supabase
        .from('contact_settings')
        .upsert({ id: 1, phone_number: phone.trim() || null, line_url: lineUrl.trim() || null })
      if (upsertError) throw upsertError
      setSavedAt(Date.now())
    } catch (err: any) {
      setError(err?.message ?? 'บันทึกไม่สำเร็จ กรุณาลองใหม่อีกครั้ง')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <p className="py-8 text-center text-sm text-muted">กำลังโหลดข้อมูล…</p>
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-card border border-line bg-surface p-4">
      <label className="block">
        <span className="mb-1 block text-xs text-muted">เบอร์โทร (สำหรับปุ่ม &quot;โทรสั่งซื้อ&quot;)</span>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="เช่น 0812345678"
          className="w-full rounded-lg border border-line bg-surface2 px-3 py-2 text-base text-ink"
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-xs text-muted">ลิงก์ LINE (สำหรับปุ่ม &quot;สั่งซื้อทาง LINE&quot;)</span>
        <input
          value={lineUrl}
          onChange={(e) => setLineUrl(e.target.value)}
          placeholder="เช่น https://line.me/ti/p/xxxxxxx"
          className="w-full rounded-lg border border-line bg-surface2 px-3 py-2 text-base text-ink"
        />
      </label>

      {error && <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">{error}</p>}
      {savedAt && !error && (
        <p className="rounded-lg bg-rose-light/10 px-3 py-2 text-sm text-rose">บันทึกข้อมูลติดต่อเรียบร้อย</p>
      )}

      <button
        type="submit"
        disabled={saving}
        className="w-full rounded-pill bg-rose px-4 py-2.5 text-sm font-semibold text-night disabled:opacity-60"
      >
        {saving ? 'กำลังบันทึก…' : 'บันทึกข้อมูลติดต่อ'}
      </button>
    </form>
  )
}
