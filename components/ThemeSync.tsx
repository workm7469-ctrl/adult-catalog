'use client'

import { useEffect } from 'react'
import type { StoreTheme } from '@/lib/types'

// ตั้ง data-store-theme / data-store-text-theme ที่ <html> ตามธีมที่ร้านค้าเลือกไว้ใน "ช่องทางสั่งซื้อ"
// ให้ CSS var --brand / --text-brand ใน globals.css สลับสีตามได้ทั่วทั้งเว็บ
export default function ThemeSync({
  theme,
  textTheme,
}: {
  theme: StoreTheme | null | undefined
  textTheme: StoreTheme | null | undefined
}) {
  useEffect(() => {
    document.documentElement.setAttribute('data-store-theme', theme || 'rose')
  }, [theme])

  useEffect(() => {
    document.documentElement.setAttribute('data-store-text-theme', textTheme || 'gold')
  }, [textTheme])

  return null
}
