import { supabase } from './supabaseClient'

export function formatPrice(price: number): string {
  return `${new Intl.NumberFormat('th-TH').format(price)} บาท`
}

function sanitizeFileName(name: string): string {
  const ext = name.includes('.') ? name.split('.').pop() : 'jpg'
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
}

/** อัปโหลดไฟล์รูปขึ้น Supabase Storage แล้วคืนค่า public URL */
export async function uploadImage(
  bucket: 'product-images' | 'banner-images',
  file: File,
  folder?: string
): Promise<string> {
  const path = folder ? `${folder}/${sanitizeFileName(file.name)}` : sanitizeFileName(file.name)
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
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
