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

export interface ContactSettings {
  id: number
  phone_number: string | null
  line_url: string | null
  updated_at: string
}
