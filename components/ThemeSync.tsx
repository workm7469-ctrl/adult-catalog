'use client'

import { useEffect } from 'react'
import type { StoreTheme } from '@/lib/types'
import { themeToRgbSpace } from '@/lib/types'

export interface StorefrontThemes {
  theme: StoreTheme | null | undefined
  nameTheme: StoreTheme | null | undefined
  priceTheme: StoreTheme | null | undefined
  taglineTheme: StoreTheme | null | undefined
  descriptionTheme: StoreTheme | null | undefined
  bgTheme: StoreTheme | null | undefined
  pillTextTheme: StoreTheme | null | undefined
  badgeTextTheme: StoreTheme | null | undefined
  callBgTheme: StoreTheme | null | undefined
  callTextTheme: StoreTheme | null | undefined
}

// ตั้ง data-store-theme ที่ <html> ตามธีมสีปุ่มกดที่ร้านค้าเลือกไว้
// ให้ CSS var --brand ต่างๆ ใน globals.css สลับสีตามได้ทั่วทั้งเว็บ
//
// ธีมสีข้อความ/พื้นหลังจุดอื่นๆ แยกอิสระจากกันทีละจุด เลยตั้งเป็น CSS var ตรงๆ
// ผ่าน inline style แทน แทนที่จะใช้ data-attribute แบบธีมสีปุ่มกด
export default function ThemeSync({
  theme,
  nameTheme,
  priceTheme,
  taglineTheme,
  descriptionTheme,
  bgTheme,
  pillTextTheme,
  badgeTextTheme,
  callBgTheme,
  callTextTheme,
}: StorefrontThemes) {
  useEffect(() => {
    document.documentElement.setAttribute('data-store-theme', theme || 'rose')
  }, [theme])

  useEffect(() => {
    const root = document.documentElement.style
    root.setProperty('--name-brand', themeToRgbSpace(nameTheme, 'white'))
    root.setProperty('--price-brand', themeToRgbSpace(priceTheme, 'gold'))
    root.setProperty('--tagline-brand', themeToRgbSpace(taglineTheme, 'pastel-gray'))
    root.setProperty('--description-brand', themeToRgbSpace(descriptionTheme, 'pastel-gray'))
    root.setProperty('--bg-brand', themeToRgbSpace(bgTheme, 'black'))
    root.setProperty('--pill-text-brand', themeToRgbSpace(pillTextTheme, 'black'))
    root.setProperty('--badge-text-brand', themeToRgbSpace(badgeTextTheme, 'black'))
    root.setProperty('--call-bg-brand', themeToRgbSpace(callBgTheme, 'gold'))
    root.setProperty('--call-text-brand', themeToRgbSpace(callTextTheme, 'black'))
  }, [
    nameTheme,
    priceTheme,
    taglineTheme,
    descriptionTheme,
    bgTheme,
    pillTextTheme,
    badgeTextTheme,
    callBgTheme,
    callTextTheme,
  ])

  return null
}
