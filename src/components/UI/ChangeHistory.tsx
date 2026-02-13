import { useState, useRef, useEffect } from 'react'
import { SearchIcon, SparklesIcon, CloseIcon } from '../Icons'
import {
  HistoryIcon as NimbusHistoryIcon,
  UserIcon as NimbusUserIcon,
  ArrowRightIcon as NimbusArrowRightIcon,
  ChevronLeftIcon as NimbusChevronLeftIcon,
  MenuIcon,
  LayoutIcon,
  TagIcon as NimbusTagIcon,
} from '@nimbus-ds/icons'

// ─── Icons ───────────────────────────────────────────────

function HistoryIcon({ className }: { className?: string }) {
  return <NimbusHistoryIcon className={className} />
}

function UserIcon({ className }: { className?: string }) {
  return <NimbusUserIcon className={className} />
}

function ArrowRightIcon({ className }: { className?: string }) {
  return <NimbusArrowRightIcon className={className} />
}

function ChevronLeftIcon({ className }: { className?: string }) {
  return <NimbusChevronLeftIcon className={className} />
}

function ExpandIcon({ className }: { className?: string }) {
  return <MenuIcon className={className} />
}

function DetailIcon({ className }: { className?: string }) {
  return <LayoutIcon className={className} />
}

function TagIconSmall({ className }: { className?: string }) {
  return <NimbusTagIcon className={className} />
}

// ─── Types ───────────────────────────────────────────────

export interface ChangeHistoryEntry {
  id: string
  entityId: string
  entityName: string
  userName: string
  userInitials: string
  userColor: string
  action: 'update' | 'delete' | 'status_change' | 'price_change'
  field: string
  oldValue?: string
  newValue?: string
  timestamp: Date
  description: string
  usedAI?: boolean
}

export interface ChangeHistoryFilter {
  key: string
  label: string
}

// ─── Helpers ─────────────────────────────────────────────

function formatRelativeTime(date: Date): string {
  const now = new Date(2026, 1, 10, 15, 0)
  const diffMs = now.getTime() - date.getTime()
  const diffMinutes = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMinutes < 1) return 'Agora mesmo'
  if (diffMinutes < 60) return `Há ${diffMinutes} min`
  if (diffHours < 24) return `Há ${diffHours}h`
  if (diffDays === 1) return 'Ontem'
  if (diffDays < 7) return `Há ${diffDays} dias`
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function formatFullDate(date: Date): string {
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function getActionLabel(action: ChangeHistoryEntry['action']): string {
  switch (action) {
    case 'update': return 'Atualização'
    case 'delete': return 'Exclusão'
    case 'status_change': return 'Status'
    case 'price_change': return 'Preço'
    default: return 'Alteração'
  }
}

function getActionColor(action: ChangeHistoryEntry['action']): string {
  switch (action) {
    case 'delete': return 'bg-danger-surface text-danger-interactive'
    case 'status_change': return 'bg-warning-surface text-warning-text-low'
    case 'price_change': return 'bg-[#FFF4E6] text-[#D97706]'
    default: return 'bg-neutral-surface text-neutral-text-high'
  }
}

// ─── History Button (reutilizável para qualquer página) ──

export function HistoryButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-neutral-text-high bg-white border border-neutral-interactive rounded-lg hover:bg-neutral-surface transition-colors"
    >
      <HistoryIcon className="w-4 h-4" />
      Histórico
    </button>
  )
}

// ─── History Row Icon (para tabelas) ─────────────────────

export function HistoryRowButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="p-1.5 rounded-md hover:bg-neutral-surface-disabled text-neutral-text-low transition-colors"
      title="Histórico de alterações"
    >
      <HistoryIcon className="w-4 h-4" />
    </button>
  )
}

// ─── Change History Panel ────────────────────────────────

interface ChangeHistoryPanelProps {
  isOpen: boolean
  onClose: () => void
  entries: ChangeHistoryEntry[]
  filterEntityId?: string | null
  entityLabel?: string
  filterEntityName?: string | null
  filters?: ChangeHistoryFilter[]
}

const defaultFilters: ChangeHistoryFilter[] = [
  { key: 'all', label: 'Todos' },
  { key: 'update', label: 'Atualizações' },
  { key: 'price_change', label: 'Preço' },
  { key: 'status_change', label: 'Status' },
]

export function ChangeHistoryPanel({
  isOpen,
  onClose,
  entries: allEntries,
  filterEntityId,
  filterEntityName,
  filters = defaultFilters,
}: ChangeHistoryPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const [selectedFilter, setSelectedFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'simple' | 'detailed'>('simple')

  useEffect(() => {
    if (!isOpen) {
      setSelectedFilter('all')
      setSearchQuery('')
    }
  }, [isOpen])

  useEffect(() => {
    function handleEscKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  // Filter entries
  let entries = filterEntityId
    ? allEntries.filter(e => e.entityId === filterEntityId)
    : [...allEntries]

  if (selectedFilter !== 'all') {
    entries = entries.filter(e => e.action === selectedFilter)
  }

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase()
    entries = entries.filter(e =>
      e.entityName.toLowerCase().includes(q) ||
      e.userName.toLowerCase().includes(q) ||
      e.description.toLowerCase().includes(q) ||
      e.field.toLowerCase().includes(q)
    )
  }

  // Group entries by date
  const grouped = entries.reduce<Record<string, ChangeHistoryEntry[]>>((acc, entry) => {
    const dateKey = entry.timestamp.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
    if (!acc[dateKey]) acc[dateKey] = []
    acc[dateKey].push(entry)
    return acc
  }, {})

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Slide-in Panel */}
      <div
        ref={panelRef}
        className={`absolute right-0 top-0 h-full bg-white shadow-xl flex flex-col animate-in slide-in-from-right duration-300 ${
          viewMode === 'detailed' ? 'w-[520px]' : 'w-[420px]'
        } max-w-[95vw] transition-all`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-surface-disabled">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="flex items-center gap-1 p-1.5 text-sm font-medium text-neutral-text-high hover:bg-neutral-surface rounded-lg transition-colors"
            >
              <ChevronLeftIcon className="w-4 h-4" />
            </button>
            <div>
              <h2 className="text-lg font-semibold text-neutral-text-high">Histórico de alterações</h2>
              {filterEntityName && (
                <p className="text-xs text-neutral-text-low mt-0.5">{filterEntityName}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1">
            {/* View mode toggle */}
            <div className="flex items-center bg-neutral-surface rounded-lg p-0.5">
              <button
                onClick={() => setViewMode('simple')}
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === 'simple'
                    ? 'bg-white shadow-sm text-neutral-text-high'
                    : 'text-neutral-text-low hover:text-neutral-text-high'
                }`}
                title="Visualização simples"
              >
                <ExpandIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('detailed')}
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === 'detailed'
                    ? 'bg-white shadow-sm text-neutral-text-high'
                    : 'text-neutral-text-low hover:text-neutral-text-high'
                }`}
                title="Visualização detalhada"
              >
                <DetailIcon className="w-4 h-4" />
              </button>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-neutral-surface transition-colors">
              <CloseIcon className="w-4 h-4 text-neutral-text-low" />
            </button>
          </div>
        </div>

        {/* Search - only in detailed mode */}
        {viewMode === 'detailed' && (
          <div className="px-5 pt-4 pb-2">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-text-disabled" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar no histórico..."
                className="w-full pl-10 pr-4 py-2 text-sm border border-neutral-interactive rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-interactive focus:border-transparent bg-white"
              />
            </div>
          </div>
        )}

        {/* Filter chips - only in detailed mode */}
        {viewMode === 'detailed' && (
          <div className="px-5 py-2 flex items-center gap-2 flex-wrap">
            {filters.map(filter => (
              <button
                key={filter.key}
                onClick={() => setSelectedFilter(filter.key)}
                className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
                  selectedFilter === filter.key
                    ? 'bg-primary-interactive text-white border-primary-interactive'
                    : 'bg-white text-neutral-text-high border-neutral-interactive hover:bg-neutral-surface'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        )}

        {/* History entries */}
        <div className="flex-1 overflow-y-auto">
          {entries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center px-5">
              <HistoryIcon className="w-12 h-12 text-neutral-text-disabled mb-3" />
              <p className="text-sm font-medium text-neutral-text-high">Nenhuma alteração encontrada</p>
              <p className="text-xs text-neutral-text-low mt-1">
                {searchQuery ? 'Tente buscar por outro termo' : 'As alterações aparecerão aqui'}
              </p>
            </div>
          ) : viewMode === 'simple' ? (
            /* ========== SIMPLE VIEW ========== */
            <div className="divide-y divide-neutral-surface-disabled">
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center gap-3 px-5 py-3 hover:bg-neutral-surface/40 transition-colors"
                >
                  {/* User avatar */}
                  <div className="relative shrink-0">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
                      style={{ backgroundColor: entry.userColor }}
                    >
                      {entry.userInitials}
                    </div>
                    {entry.usedAI && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-white flex items-center justify-center shadow-sm border border-neutral-surface-disabled">
                        <SparklesIcon className="w-2 h-2 text-primary-interactive" />
                      </div>
                    )}
                  </div>

                  {/* Main info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-neutral-text-high leading-snug">
                      <span className="font-medium">{entry.userName}</span>
                      <span className="text-neutral-text-low"> {entry.description.toLowerCase()}</span>
                    </p>
                    {!filterEntityId && (
                      <p className="text-xs text-neutral-text-disabled truncate mt-0.5">
                        {entry.entityName}
                      </p>
                    )}
                  </div>

                  {/* Time */}
                  <span className="text-[11px] text-neutral-text-disabled shrink-0" title={formatFullDate(entry.timestamp)}>
                    {formatRelativeTime(entry.timestamp)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            /* ========== DETAILED VIEW ========== */
            <div className="px-5 py-3">
              {Object.entries(grouped).map(([dateKey, dateEntries]) => (
                <div key={dateKey} className="mb-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-semibold text-neutral-text-low uppercase tracking-wide">{dateKey}</span>
                    <div className="flex-1 h-px bg-neutral-surface-disabled" />
                  </div>

                  <div className="space-y-3">
                    {dateEntries.map((entry) => (
                      <div
                        key={entry.id}
                        className="group relative flex gap-3 p-3 rounded-lg border border-neutral-surface-disabled hover:border-neutral-interactive hover:shadow-sm transition-all bg-white"
                      >
                        {/* User avatar */}
                        <div className="relative shrink-0">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                            style={{ backgroundColor: entry.userColor }}
                          >
                            {entry.userInitials}
                          </div>
                          {entry.usedAI && (
                            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-white flex items-center justify-center shadow-sm border border-neutral-surface-disabled">
                              <SparklesIcon className="w-2.5 h-2.5 text-primary-interactive" />
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-neutral-text-high truncate">
                              {entry.userName}
                            </span>
                            <span className={`px-1.5 py-0.5 text-[10px] font-medium rounded-full ${getActionColor(entry.action)}`}>
                              {getActionLabel(entry.action)}
                            </span>
                            {entry.usedAI && (
                              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-medium rounded-full bg-primary-surface text-primary-interactive border border-primary-surface-highlight">
                                <SparklesIcon className="w-2.5 h-2.5" />
                                com IA
                              </span>
                            )}
                            <span className="text-[11px] text-neutral-text-disabled ml-auto shrink-0" title={formatFullDate(entry.timestamp)}>
                              {formatRelativeTime(entry.timestamp)}
                            </span>
                          </div>

                          <p className="text-xs text-neutral-text-low mb-1.5">
                            {entry.description}
                          </p>

                          {!filterEntityId && (
                            <div className="flex items-center gap-1 mb-1.5">
                              <TagIconSmall className="w-3 h-3 text-neutral-text-disabled" />
                              <span className="text-xs text-primary-interactive">{entry.entityName}</span>
                            </div>
                          )}

                          {(entry.oldValue || entry.newValue) && (
                            <div className="mt-2 p-2 bg-neutral-surface/50 rounded-md border border-neutral-surface-disabled">
                              <span className="text-[10px] font-medium text-neutral-text-low uppercase tracking-wide">{entry.field}</span>
                              <div className="flex items-start gap-2 mt-1">
                                {entry.oldValue && (
                                  <div className="flex-1 min-w-0">
                                    <span className="text-[10px] text-neutral-text-disabled block mb-0.5">Antes</span>
                                    <span className="text-xs text-neutral-text-low line-through block truncate">
                                      {entry.oldValue}
                                    </span>
                                  </div>
                                )}
                                {entry.oldValue && entry.newValue && (
                                  <ArrowRightIcon className="w-3 h-3 text-neutral-text-disabled mt-3 shrink-0" />
                                )}
                                {entry.newValue && (
                                  <div className="flex-1 min-w-0">
                                    <span className="text-[10px] text-neutral-text-disabled block mb-0.5">Depois</span>
                                    <span className="text-xs text-neutral-text-high font-medium block truncate">
                                      {entry.newValue}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-neutral-surface-disabled bg-neutral-surface/30">
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-text-low">
              {entries.length} {entries.length === 1 ? 'alteração' : 'alterações'}
            </span>
            <div className="flex items-center gap-3 text-xs text-neutral-text-disabled">
              <span className="flex items-center gap-1">
                <UserIcon className="w-3 h-3" />
                {new Set(entries.map(e => e.userName)).size} {new Set(entries.map(e => e.userName)).size === 1 ? 'usuário' : 'usuários'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
