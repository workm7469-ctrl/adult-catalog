'use client'

import { useState } from 'react'
import BannerManager from '@/components/admin/BannerManager'
import ProductForm from '@/components/admin/ProductForm'
import ProductList from '@/components/admin/ProductList'
import ContactSettingsForm from '@/components/admin/ContactSettingsForm'
import ThemeSettingsForm from '@/components/admin/ThemeSettingsForm'

type Tab = 'banners' | 'add' | 'products' | 'contact' | 'theme'

const TABS: { key: Tab; label: string; icon: string }[] = [
  { key: 'products', label: 'สินค้า', icon: '📦' },
  { key: 'add', label: 'เพิ่มสินค้า', icon: '➕' },
  { key: 'banners', label: 'แบนเนอร์', icon: '🖼️' },
  { key: 'contact', label: 'ช่องทางสั่งซื้อ', icon: '📞' },
  { key: 'theme', label: 'ธีมสี', icon: '🎨' },
]

export default function AdminManagePage() {
  const [tab, setTab] = useState<Tab>('products')
  const [refreshKey, setRefreshKey] = useState(0)

  return (
    <main className="min-h-screen bg-night pb-24 sm:pb-10">
      <header className="sticky top-0 z-30 border-b border-line bg-surface">
        <div className="mx-auto max-w-2xl px-4 py-3 lg:max-w-5xl">
          <p className="font-display text-lg font-semibold text-ink">แผงควบคุมแค็ตตาล็อก</p>
          <p className="mt-0.5 text-[11px] uppercase tracking-wide text-muted">
            หน้านี้เข้าถึงได้ผ่านลิงก์ตรงเท่านั้น — อย่าเผยแพร่ลิงก์นี้
          </p>
        </div>
      </header>

      {/* จอกว้าง (คอมพิวเตอร์) — แถบแท็บติดกับเนื้อหา เพราะ bottom nav แบบมือถือจะดูลอยแยกจากเนื้อหาไปไกล */}
      <div className="sticky top-[64px] z-20 hidden border-b border-line bg-night/95 backdrop-blur sm:block">
        <div className="mx-auto flex max-w-2xl justify-center gap-2 px-4 py-2.5 lg:max-w-5xl">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex shrink-0 items-center gap-1.5 rounded-pill border px-3 py-2 text-xs transition-colors ${
                tab === t.key ? 'border-rose bg-rose text-night' : 'border-line bg-surface text-muted'
              }`}
            >
              <span className="text-sm leading-none">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div key={tab} className="animate-fade-in mx-auto max-w-2xl px-4 py-4 lg:max-w-5xl">
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

        {tab === 'theme' && <ThemeSettingsForm />}
      </div>

      {/* จอเล็ก (มือถือ) — bottom nav แบบแอป */}
      <nav
        className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface/95 backdrop-blur sm:hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="mx-auto flex max-w-2xl lg:max-w-5xl">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] uppercase tracking-wide transition-colors ${
                tab === t.key ? 'text-rose' : 'text-muted'
              }`}
            >
              <span className="text-lg leading-none">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>
      </nav>
    </main>
  )
}
