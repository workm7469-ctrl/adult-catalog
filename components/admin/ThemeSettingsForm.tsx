'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import type { ContactSettings, StoreTheme } from '@/lib/types'
import ThemePicker from './ThemePicker'

export default function ThemeSettingsForm() {
  const [theme, setTheme] = useState<StoreTheme>('rose')
  const [nameTheme, setNameTheme] = useState<StoreTheme>('white')
  const [priceTheme, setPriceTheme] = useState<StoreTheme>('gold')
  const [taglineTheme, setTaglineTheme] = useState<StoreTheme>('pastel-gray')
  const [descriptionTheme, setDescriptionTheme] = useState<StoreTheme>('pastel-gray')
  const [bgTheme, setBgTheme] = useState<StoreTheme>('black')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [savedAt, setSavedAt] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('contact_settings').select('*').eq('id', 1).maybeSingle()
      const s = data as ContactSettings | null
      setTheme(s?.theme ?? 'rose')
      setNameTheme(s?.name_theme ?? 'white')
      setPriceTheme(s?.price_theme ?? 'gold')
      setTaglineTheme(s?.tagline_theme ?? 'pastel-gray')
      setDescriptionTheme(s?.description_theme ?? 'pastel-gray')
      setBgTheme(s?.bg_theme ?? 'black')
      setLoading(false)
    }
    load()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSaving(true)
    try {
      const { error: upsertError } = await supabase.from('contact_settings').upsert({
        id: 1,
        theme,
        name_theme: nameTheme,
        price_theme: priceTheme,
        tagline_theme: taglineTheme,
        description_theme: descriptionTheme,
        bg_theme: bgTheme,
      })
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
      <ThemePicker label="ธีมสีพื้นหลังหน้าร้าน" value={bgTheme} onChange={setBgTheme} />
      <ThemePicker label="ธีมสีปุ่มกด" value={theme} onChange={setTheme} />
      <ThemePicker label="ธีมสีชื่อสินค้า" value={nameTheme} onChange={setNameTheme} />
      <ThemePicker label="ธีมสีราคาสินค้า" value={priceTheme} onChange={setPriceTheme} />
      <ThemePicker label="ธีมสีข้อความสั้นๆ เหนือหมวดหมู่" value={taglineTheme} onChange={setTaglineTheme} />
      <ThemePicker label="ธีมสีรายละเอียดสินค้า" value={descriptionTheme} onChange={setDescriptionTheme} />

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
