'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import type { ContactSettings, StoreTheme } from '@/lib/types'
import ThemePicker from './ThemePicker'

type ThemeField =
  | 'bg_theme'
  | 'theme'
  | 'name_theme'
  | 'price_theme'
  | 'tagline_theme'
  | 'description_theme'
  | 'pill_text_theme'
  | 'badge_text_theme'
  | 'call_bg_theme'
  | 'call_text_theme'

const THEME_FIELDS: { key: ThemeField; label: string; fallback: StoreTheme }[] = [
  { key: 'bg_theme', label: 'ธีมสีพื้นหลังหน้าร้าน', fallback: 'black' },
  { key: 'theme', label: 'ธีมสีปุ่มกด', fallback: 'rose' },
  { key: 'name_theme', label: 'ธีมสีชื่อสินค้า', fallback: 'white' },
  { key: 'price_theme', label: 'ธีมสีราคาสินค้า', fallback: 'gold' },
  { key: 'tagline_theme', label: 'ธีมสีข้อความสั้นๆ เหนือหมวดหมู่', fallback: 'pastel-gray' },
  { key: 'description_theme', label: 'ธีมสีรายละเอียดสินค้า', fallback: 'pastel-gray' },
  { key: 'pill_text_theme', label: 'ธีมสีตัวหนังสือปุ่มหมวดหมู่ (ตอนถูกเลือก)', fallback: 'black' },
  { key: 'badge_text_theme', label: 'ธีมสีตัวหนังสือป้ายส่วนลด', fallback: 'black' },
  { key: 'call_bg_theme', label: 'ธีมสีพื้นหลังปุ่มโทรสั่งซื้อ', fallback: 'gold' },
  { key: 'call_text_theme', label: 'ธีมสีตัวหนังสือปุ่มโทรสั่งซื้อ', fallback: 'black' },
]

function defaultValues(): Record<ThemeField, StoreTheme> {
  return Object.fromEntries(THEME_FIELDS.map((f) => [f.key, f.fallback])) as Record<ThemeField, StoreTheme>
}

export default function ThemeSettingsForm() {
  const [values, setValues] = useState<Record<ThemeField, StoreTheme>>(defaultValues)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [savedAt, setSavedAt] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('contact_settings').select('*').eq('id', 1).maybeSingle()
      const s = data as ContactSettings | null
      setValues(
        Object.fromEntries(THEME_FIELDS.map((f) => [f.key, s?.[f.key] ?? f.fallback])) as Record<ThemeField, StoreTheme>
      )
      setLoading(false)
    }
    load()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSaving(true)
    try {
      const { error: upsertError } = await supabase.from('contact_settings').upsert({ id: 1, ...values })
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
      {THEME_FIELDS.map((f) => (
        <ThemePicker
          key={f.key}
          label={f.label}
          value={values[f.key]}
          onChange={(v) => setValues((prev) => ({ ...prev, [f.key]: v }))}
        />
      ))}

      {error && <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">{error}</p>}
      {savedAt && !error && (
        <p className="rounded-lg bg-rose-light/10 px-3 py-2 text-sm text-rose">บันทึกธีมสีเรียบร้อย</p>
      )}

      <button
        type="submit"
        disabled={saving}
        className="w-full rounded-pill bg-rose px-4 py-2.5 text-sm font-semibold text-night disabled:opacity-60"
      >
        {saving ? 'กำลังบันทึก…' : 'บันทึกธีมสี'}
      </button>
    </form>
  )
}
