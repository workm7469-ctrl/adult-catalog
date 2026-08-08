'use client'

import { useState } from 'react'
import BannerManager from '@/components/admin/BannerManager'
import ProductForm from '@/components/admin/ProductForm'
import ProductList from '@/components/admin/ProductList'
import ContactSettingsForm from '@/components/admin/ContactSettingsForm'

type Tab = 'banners' | 'add' | 'products' | 'contact'

const TABS: { key: Tab; label: string }[] = [
  { key: 'products', label: 'สินค้า' },
  { key: 'add', label: 'เพิ่มสินค้า' },
  { key: 'banners', label: 'แบนเนอร์' },
  { key: 'contact', label: 'ช่องทางสั่งซื้อ' },
]

export default function AdminManagePage() {
  const [tab, setTab] = useState<Tab>('products')
  const [refreshKey, setRefreshKey] = useState(0)

  return (
    <main className="min-h-screen bg-night pb-16">
      <header className="sticky top-0 z-30 border-b border-line bg-surface">
        <div className="mx-auto max-w-2xl px-4 py-3 lg:max-w-5xl">
          <p className="font-display text-lg font-semibold text-ink">แผงควบคุมแค็ตตาล็อก</p>
          <p className="mt-0.5 text-[11px] uppercase tracking-wide text-muted">
            หน้านี้เข้าถึงได้ผ่านลิงก์ตรงเท่านั้น — อย่าเผยแพร่ลิงก์นี้
          </p>
        </div>
      </header>

      <div className="sticky top-[64px] z-20 border-b border-line bg-night/95 backdrop-blur">
        <div className="no-scrollbar mx-auto flex max-w-2xl gap-2 overflow-x-auto px-4 py-2.5 [touch-action:pan-x] lg:max-w-5xl">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`shrink-0 rounded-pill border px-3 py-2 text-xs ${
                tab === t.key ? 'border-rose bg-rose text-night' : 'border-line bg-surface text-muted'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-4 lg:max-w-5xl">
        {tab === 'products' && <ProductList key={refreshKey} />}

        {tab === 'add' && (
          <ProductForm
            mode="add"
            onSaved={() => {
              setRefreshKey((k) => k + 1)
            }}
          />
        )}

        {tab === 'banners' && <BannerManager />}

        {tab === 'contact' && <ContactSettingsForm />}
      </div>
    </main>
  )
}
