'use client'

import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import type { Banner, ContactSettings, Product } from '@/lib/types'
import BannerCarousel from '@/components/BannerCarousel'
import CategoryFilter from '@/components/CategoryFilter'
import ProductCard from '@/components/ProductCard'
import ProductModal from '@/components/ProductModal'

export default function StorefrontPage() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [contact, setContact] = useState<ContactSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Product | null>(null)
  const [category, setCategory] = useState('ทั้งหมด')

  useEffect(() => {
    let active = true

    async function load() {
      setLoading(true)
      const [{ data: bannersData }, { data: productsData }, { data: contactData }] = await Promise.all([
        supabase.from('banners').select('*').order('position', { ascending: true }),
        supabase.from('products').select('*').order('position', { ascending: true }),
        supabase.from('contact_settings').select('*').eq('id', 1).maybeSingle(),
      ])
      if (!active) return
      setBanners((bannersData as Banner[]) ?? [])
      setProducts((productsData as Product[]) ?? [])
      setContact((contactData as ContactSettings) ?? null)
      setLoading(false)
    }

    load()
    return () => {
      active = false
    }
  }, [])

  const filteredProducts = useMemo(() => {
    if (category === 'ทั้งหมด') return products
    return products.filter((p) => p.category === category)
  }, [products, category])

  return (
    <main className="min-h-screen bg-night pb-10">
      <BannerCarousel banners={banners} />

      <div className="mx-auto max-w-3xl px-4 pt-4 lg:max-w-6xl">
        <div className="mb-3">
          <CategoryFilter active={category} onChange={setCategory} />
        </div>

        {loading && (
          <p className="py-16 text-center text-sm text-muted">กำลังโหลดสินค้า…</p>
        )}

        {!loading && filteredProducts.length === 0 && (
          <p className="py-16 text-center text-sm text-muted">ยังไม่มีสินค้าในหมวดนี้</p>
        )}

        {!loading && filteredProducts.length > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} onSelect={setSelected} />
            ))}
          </div>
        )}
      </div>

      {selected && <ProductModal product={selected} contact={contact} onClose={() => setSelected(null)} />}
    </main>
  )
}
