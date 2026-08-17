import { supabase } from './supabaseClient'

export function formatPrice(price: number): string {
  return `${new Intl.NumberFormat('th-TH').format(price)} บาท`
}

/** เปอร์เซ็นต์ส่วนลด ปัดเศษลง คืนค่า null ถ้าราคาปกติไม่ได้ตั้งไว้หรือไม่มากกว่าราคาขายจริง */
export function discountPercent(price: number, originalPrice: number | null): number | null {
  if (!originalPrice || originalPrice <= price) return null
  return Math.floor(((originalPrice - price) / originalPrice) * 100)
}

function sanitizeFileName(name: string): string {
  const ext = name.includes('.') ? name.split('.').pop() : 'jpg'
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
}

const MAX_IMAGE_DIMENSION = 1600
const IMAGE_QUALITY = 0.8

/** บีบอัดรูปฝั่งเบราว์เซอร์ก่อนอัปโหลด: ย่อด้านยาวสุดไม่เกิน 1600px และแปลงเป็น JPEG คุณภาพ 80% เพื่อประหยัดพื้นที่ Supabase Storage */
async function compressImage(file: File): Promise<File> {
  if (!file.type.startsWith('image/') || file.type === 'image/svg+xml' || file.type === 'image/gif') {
    return file
  }

  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, MAX_IMAGE_DIMENSION / Math.max(bitmap.width, bitmap.height))
  const width = Math.round(bitmap.width * scale)
  const height = Math.round(bitmap.height * scale)

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) return file
  ctx.drawImage(bitmap, 0, 0, width, height)
  bitmap.close()

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, 'image/jpeg', IMAGE_QUALITY)
  )
  if (!blob || blob.size >= file.size) return file

  const newName = file.name.replace(/\.[^.]+$/, '') + '.jpg'
  return new File([blob], newName, { type: 'image/jpeg' })
}

/** อัปโหลดไฟล์รูปขึ้น Supabase Storage แล้วคืนค่า public URL */
export async function uploadImage(
  bucket: 'product-images' | 'banner-images',
  file: File,
  folder?: string
): Promise<string> {
  const compressed = await compressImage(file)
  const path = folder ? `${folder}/${sanitizeFileName(compressed.name)}` : sanitizeFileName(compressed.name)
  const { error } = await supabase.storage.from(bucket).upload(path, compressed, {
    cacheControl: '3600',
    upsert: false,
  })
  if (error) throw error
  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}

function extractStoragePath(bucket: string, url: string): string | null {
  const marker = `/storage/v1/object/public/${bucket}/`
  const idx = url.indexOf(marker)
  if (idx === -1) return null
  return decodeURIComponent(url.slice(idx + marker.length))
}

export async function deleteImageByUrl(
  bucket: 'product-images' | 'banner-images',
  url: string | null | undefined
): Promise<void> {
  if (!url) return
  const path = extractStoragePath(bucket, url)
  if (!path) return
  await supabase.storage.from(bucket).remove([path])
}

export async function deleteImagesByUrls(
  bucket: 'product-images' | 'banner-images',
  urls: (string | null | undefined)[]
): Promise<void> {
  const paths = urls
    .map((u) => (u ? extractStoragePath(bucket, u) : null))
    .filter((p): p is string => !!p)
  if (paths.length === 0) return
  await supabase.storage.from(bucket).remove(paths)
}

/** ทำเบอร์โทรให้เหลือแต่ตัวเลข/เครื่องหมาย + สำหรับ tel: link */
export function telHref(phone: string): string {
  return `tel:${phone.replace(/[^0-9+]/g, '')}`
}
