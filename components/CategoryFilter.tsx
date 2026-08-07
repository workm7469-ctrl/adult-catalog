import { CATEGORIES } from '@/lib/types'

const TABS = ['ทั้งหมด', ...CATEGORIES]

export default function CategoryFilter({
  active,
  onChange,
}: {
  active: string
  onChange: (category: string) => void
}) {
  return (
    <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
      {TABS.map((tab) => {
        const isActive = tab === active
        return (
          <button
            key={tab}
            onClick={() => onChange(tab)}
            className={`shrink-0 rounded-pill border px-4 py-2 text-sm transition-colors ${
              isActive ? 'border-rose bg-rose text-night' : 'border-line bg-surface text-muted'
            }`}
          >
            {tab}
          </button>
        )
      })}
    </div>
  )
}
