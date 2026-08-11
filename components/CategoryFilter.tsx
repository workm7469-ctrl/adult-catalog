import { CATEGORIES } from '@/lib/types'

const TABS = ['ทั้งหมด', ...CATEGORIES]

const CATEGORY_ICONS: Record<string, string> = {
  ทั้งหมด: '🗂️',
  อาหารเสริม: '💊',
  เครื่องดื่ม: '🥤',
  สเปรย์: '🧴',
  ตุ๊กตายาง: '🎎',
  ดิลโด้: '💜',
  ไข่สั่น: '🥚',
  ปลอก: '🛡️',
  อื่นๆ: '🏷️',
}

export default function CategoryFilter({
  active,
  onChange,
}: {
  active: string
  onChange: (category: string) => void
}) {
  return (
    <div className="flex flex-wrap justify-center gap-2 pb-1">
      {TABS.map((tab) => {
        const isActive = tab === active
        return (
          <button
            key={tab}
            onClick={() => onChange(tab)}
            className={`shrink-0 rounded-pill border px-4 py-2 text-base transition-colors ${
              isActive ? 'border-rose bg-rose text-accent-pill' : 'border-line bg-surface text-muted'
            }`}
          >
            <span aria-hidden="true">{CATEGORY_ICONS[tab]}</span> {tab}
          </button>
        )
      })}
    </div>
  )
}
