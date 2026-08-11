export type ProductCategory =
  | 'อาหารเสริม'
  | 'เครื่องดื่ม'
  | 'สเปรย์'
  | 'ตุ๊กตายาง'
  | 'ดิลโด้'
  | 'ไข่สั่น'
  | 'ปลอก'
  | 'อื่นๆ'

export const CATEGORIES: ProductCategory[] = [
  'อาหารเสริม',
  'เครื่องดื่ม',
  'สเปรย์',
  'ตุ๊กตายาง',
  'ดิลโด้',
  'ไข่สั่น',
  'ปลอก',
  'อื่นๆ',
]

export interface Banner {
  id: string
  image_url: string
  position: number
  created_at: string
}

export interface Product {
  id: string
  name: string
  category: ProductCategory
  description: string | null
  price: number
  original_price: number | null
  cover_image_url: string
  gallery_images: string[]
  position: number
  created_at: string
}

export type StoreTheme =
  | 'rose'
  | 'blue'
  | 'indigo'
  | 'violet'
  | 'purple'
  | 'pink'
  | 'red'
  | 'orange'
  | 'amber'
  | 'green'
  | 'emerald'
  | 'cyan'
  | 'sky'
  | 'slate'
  | 'pastel-blue'
  | 'pastel-pink'
  | 'pastel-mint'
  | 'pastel-lavender'
  | 'pastel-gray'
  | 'black'
  | 'white'
  | 'gold'

// พรีเซ็ตธีมสี — ให้เลือกจากชุดที่คุมคอนทราสต์ไว้แล้วแทนกรอกสีอิสระ กันสีอ่านยาก/มืดไป
export const THEME_PRESETS: { value: StoreTheme; label: string; swatch: string }[] = [
  { value: 'rose', label: 'ชมพูโรส (ค่าเริ่มต้น)', swatch: '#D68FA0' },
  { value: 'blue', label: 'น้ำเงิน', swatch: '#2563EB' },
  { value: 'indigo', label: 'คราม', swatch: '#4F46E5' },
  { value: 'violet', label: 'ม่วง', swatch: '#7C3AED' },
  { value: 'purple', label: 'ม่วงเข้ม', swatch: '#9333EA' },
  { value: 'pink', label: 'ชมพูเข้ม', swatch: '#DB2777' },
  { value: 'red', label: 'แดง', swatch: '#DC2626' },
  { value: 'orange', label: 'ส้ม', swatch: '#EA580C' },
  { value: 'amber', label: 'เหลืองอำพัน', swatch: '#D97706' },
  { value: 'green', label: 'เขียว', swatch: '#16A34A' },
  { value: 'emerald', label: 'เขียวมรกต', swatch: '#059669' },
  { value: 'cyan', label: 'ฟ้าอมเขียว', swatch: '#0891B2' },
  { value: 'sky', label: 'ฟ้า', swatch: '#0284C7' },
  { value: 'slate', label: 'เทาเข้ม', swatch: '#334155' },
  { value: 'pastel-blue', label: 'ฟ้าพาสเทล', swatch: '#60A5FA' },
  { value: 'pastel-pink', label: 'ชมพูพาสเทล', swatch: '#F472B6' },
  { value: 'pastel-mint', label: 'มินต์พาสเทล', swatch: '#34D399' },
  { value: 'pastel-lavender', label: 'ลาเวนเดอร์พาสเทล', swatch: '#A78BFA' },
  { value: 'pastel-gray', label: 'เทาอ่อน', swatch: '#9CA3AF' },
  { value: 'black', label: 'ดำ', swatch: '#18181B' },
  { value: 'white', label: 'ขาว', swatch: '#F3EEF0' },
  { value: 'gold', label: 'ทอง', swatch: '#C9A227' },
]

/** แปลง swatch hex ของธีมที่เลือกเป็น "R G B" สำหรับตั้งเป็น CSS custom property */
export function themeToRgbSpace(theme: StoreTheme | null | undefined, fallback: StoreTheme = 'gold'): string {
  const hex = (THEME_PRESETS.find((p) => p.value === theme) ?? THEME_PRESETS.find((p) => p.value === fallback))!.swatch
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `${r} ${g} ${b}`
}

export interface ContactSettings {
  id: number
  phone_number: string | null
  line_url: string | null
  tagline: string | null
  theme: StoreTheme
  name_theme: StoreTheme
  price_theme: StoreTheme
  tagline_theme: StoreTheme
  description_theme: StoreTheme
  bg_theme: StoreTheme
  updated_at: string
}
