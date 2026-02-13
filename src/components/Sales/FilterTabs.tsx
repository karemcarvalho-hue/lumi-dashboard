interface Tab {
  id: string
  label: string
  count: number
}

interface FilterTabsProps {
  tabs: Tab[]
  activeTab: string
  onTabChange: (tabId: string) => void
}

export function FilterTabs({ tabs, activeTab, onTabChange }: FilterTabsProps) {
  return (
    <div className="flex items-center gap-1">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab
        
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              flex items-center gap-1.5 px-3 py-1.5
              text-sm transition-colors rounded-md
              ${isActive
                ? 'text-primary-interactive font-medium'
                : 'text-neutral-text-low hover:text-neutral-text-high hover:bg-neutral-surface'
              }
            `}
          >
            {tab.label}
            <span
              className={`
                min-w-[20px] h-5 px-1.5 flex items-center justify-center
                text-xs font-medium rounded-full
                ${isActive 
                  ? 'bg-primary-interactive text-white' 
                  : 'bg-neutral-surface-disabled text-neutral-text-low'
                }
              `}
            >
              {tab.count}
            </span>
          </button>
        )
      })}
    </div>
  )
}
