'use client'

import { useEffect } from 'react'
import type { StoreTheme } from '@/lib/types'
import { themeToRgbSpace } from '@/lib/types'

// ตั้ง data-store-theme ที่ <html> ตามธีมสีปุ่มกดที่ร้านค้าเลือกไว้ใน "ช่องทางสั่งซื้อ"
// ให้ CSS var --brand ต่างๆ ใน globals.css สลับสีตามได้ทั่วทั้งเว็บ
//
// ธีมสีข้อความ/พื้นหลังแยกอิสระจากกันทีละจุด เลยตั้งเป็น CSS var ตรงๆ ผ่าน inline
// style แทน แทนที่จะใช้ data-attribute แบบธีมสีปุ่มกด
export default function ThemeSync({
  theme,
  nameTheme,
  priceTheme,
  taglineTheme,
  descriptionTheme,
  bgTheme,
}: {
  theme: StoreTheme | null | undefined
  nameTheme: StoreTheme | null | undefined
  priceTheme: StoreTheme | null | undefined
  taglineTheme: StoreTheme | null | undefined
  descriptionTheme: StoreTheme | null | undefined
  bgTheme: StoreTheme | null | undefined
}) {
  useEffect(() => {
    document.documentElement.setAttribute('data-store-theme', theme || 'rose')
  }, [theme])

  useEffect(() => {
    document.documentElement.style.setProperty('--name-brand', themeToRgbSpace(nameTheme, 'white'))
  }, [nameTheme])

  useEffect(() => {
    document.documentElement.style.setProperty('--price-brand', themeToRgbSpace(priceTheme, 'gold'))
  }, [priceTheme])

  useEffect(() => {
    document.documentElement.style.setProperty('--tagline-brand', themeToRgbSpace(taglineTheme, 'pastel-gray'))
  }, [taglineTheme])

  useEffect(() => {
    document.documentElement.style.setProperty('--description-brand', themeToRgbSpace(descriptionTheme, 'pastel-gray'))
  }, [descriptionTheme])

  useEffect(() => {
    document.documentElement.style.setProperty('--bg-brand', themeToRgbSpace(bgTheme, 'black'))
  }, [bgTheme])

  return null
}
