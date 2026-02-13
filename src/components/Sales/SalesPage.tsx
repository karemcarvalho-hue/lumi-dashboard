import { useState, useMemo, useEffect, useRef } from 'react'
import { Button, SearchInput, ChangeHistoryPanel, HistoryButton } from '../UI'
import type { ChangeHistoryEntry } from '../UI'
import { FilterTabs } from './FilterTabs'
import { SalesTable, Order } from './SalesTable'
import { DownloadIcon, PlusIcon, FilterIcon, CloseIcon } from '../Icons'
import { StatsIcon as NimbusStatsIcon, BagIcon, CloseIcon as NimbusCloseIcon } from '@nimbus-ds/icons'
import { StatsFilter } from '../Chat/StatsCard'

// AI-styled filter chip component (matches Nimbus Chip with AI focus ring)
function AIFilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <div
      className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs text-neutral-text-high border shrink-0"
      style={{
        backgroundColor: 'var(--neutral-surface, #f6f6f6)',
        borderColor: '#0050C3',
        boxShadow: '0px 0px 0px 3px var(--ai-generative-interactive, #e2dcfa)',
      }}
    >
      <span className="leading-4">{label}</span>
      <button
        onClick={onRemove}
        className="flex items-center justify-center w-4 h-4 text-neutral-text-low hover:text-neutral-text-high transition-colors"
        aria-label={`Remover filtro ${label}`}
      >
        <NimbusCloseIcon className="w-3 h-3" />
      </button>
    </div>
  )
}

// Chart icon for stats filter banner - using Nimbus
function ChartIcon({ className }: { className?: string }) {
  return <NimbusStatsIcon className={className} />
}

const tabs = [
  { id: 'to_collect', label: 'Por cobrar', count: 19 },
  { id: 'to_pack', label: 'Por embalar', count: 40 },
  { id: 'to_ship', label: 'Por enviar', count: 1 },
  { id: 'to_pickup', label: 'Por retirar', count: 0 },
  { id: 'to_archive', label: 'Por arquivar', count: 2 },
]

const mockOrders: Order[] = [
  {
    id: '230',
    date: '13 jan',
    time: '14:10',
    customerName: 'Agustin Parraquini',
    total: 'R$ 16,54',
    productsCount: 1,
    paymentStatus: 'refused',
    paymentMethod: 'Nuvem Pago - Cartão de...',
    shippingStatus: 'to_ship',
    shippingCarrier: 'Nuvem Envio - Correios SEDEX',
  },
  {
    id: '229',
    date: '13 jan',
    time: '14:00',
    customerName: 'Agustin Parraquini',
    total: 'R$ 16,54',
    productsCount: 1,
    paymentStatus: 'refused',
    paymentMethod: 'Nuvem Pago - Cartão de...',
    shippingStatus: 'to_pack',
    shippingCarrier: 'Nuvem Envio - Correios SEDEX',
  },
  {
    id: '228',
    date: '9 jan',
    time: '12:34',
    customerName: 'Agustin Parraquini',
    total: 'R$ 16,54',
    productsCount: 1,
    paymentStatus: 'refused',
    paymentMethod: 'Nuvem Pago - Cartão de...',
    shippingStatus: 'to_pack',
    shippingCarrier: 'Nuvem Envio - Correios SEDEX',
  },
  {
    id: '227',
    date: '29 out',
    time: '11:05',
    customerName: 'Juan Pablo Jepik',
    total: 'R$ 15,46',
    productsCount: 2,
    paymentStatus: 'received',
    paymentMethod: 'Personalizado - À vista',
    shippingStatus: 'to_ship',
    shippingCarrier: 'Nuvem Envio - Correios SEDEX',
  },
  {
    id: '226',
    date: '20 out',
    time: '07:29',
    customerName: 'Agustin Parraquini',
    total: 'R$ 17,29',
    productsCount: 1,
    paymentStatus: 'refused',
    paymentMethod: 'Nuvem Pago - Cartão de...',
    shippingStatus: 'to_pack',
    shippingCarrier: 'Nuvem Envio - Correios SEDEX',
  },
  {
    id: '225',
    date: '18 out',
    time: '11:22',
    customerName: 'Agustin Parraquini',
    total: 'R$ 17,29',
    productsCount: 1,
    paymentStatus: 'refused',
    paymentMethod: 'Nuvem Pago - Cartão de...',
    shippingStatus: 'to_pack',
    shippingCarrier: 'Nuvem Envio - Correios SEDEX',
  },
  {
    id: '223',
    date: '8 out',
    time: '11:32',
    customerName: 'Rodrigo Almeida',
    total: 'R$ 4,50',
    productsCount: 1,
    paymentStatus: 'received',
    paymentMethod: 'Nuvem Pago - Cartão de...',
    shippingStatus: 'shipped',
    shippingCarrier: 'Baratiño',
  },
  {
    id: '222',
    date: '6 out',
    time: '14:00',
    customerName: 'Agustin Parraquini',
    total: 'R$ 17,29',
    productsCount: 1,
    paymentStatus: 'refused',
    paymentMethod: 'Nuvem Pago - Cartão de...',
    shippingStatus: 'shipped',
    shippingCarrier: 'Nuvem Envio - Correios SEDEX',
  },
  {
    id: '220',
    date: '1 out',
    time: '11:21',
    customerName: 'Valmir Afonso...',
    total: 'R$ 14,96',
    productsCount: 1,
    paymentStatus: 'received',
    paymentMethod: 'Nuvem Pago - Cartão de...',
    shippingStatus: 'to_pack',
    shippingCarrier: 'Nuvem Pago - Cartão de...',
  },
  // Orders for Lumi filter
  {
    id: '1196',
    date: '06 fev',
    time: '23:45',
    customerName: 'Ana Silva',
    total: 'R$ 420,00',
    productsCount: 3,
    paymentStatus: 'received',
    paymentMethod: 'Nuvem Pago - Cartão de...',
    shippingStatus: 'to_pack',
    shippingCarrier: 'Correios SEDEX',
  },
  {
    id: '1125',
    date: '06 fev',
    time: '22:30',
    customerName: 'Carlos Souza',
    total: 'R$ 180,00',
    productsCount: 1,
    paymentStatus: 'received',
    paymentMethod: 'Nuvem Pago - Cartão de...',
    shippingStatus: 'to_pack',
    shippingCarrier: 'DHL Express',
  },
  {
    id: '1113',
    date: '06 fev',
    time: '21:15',
    customerName: 'Maria Santos',
    total: 'R$ 560,00',
    productsCount: 4,
    paymentStatus: 'received',
    paymentMethod: 'Nuvem Pago - PIX',
    shippingStatus: 'to_pack',
    shippingCarrier: 'Correios SEDEX',
  },
  {
    id: '965',
    date: '05 fev',
    time: '18:45',
    customerName: 'Pedro Lima',
    total: 'R$ 320,00',
    productsCount: 2,
    paymentStatus: 'received',
    paymentMethod: 'Nuvem Pago - Cartão de...',
    shippingStatus: 'to_pack',
    shippingCarrier: 'FedEx',
  },
  {
    id: '968',
    date: '05 fev',
    time: '17:30',
    customerName: 'Julia Costa',
    total: 'R$ 890,00',
    productsCount: 6,
    paymentStatus: 'received',
    paymentMethod: 'Nuvem Pago - Boleto',
    shippingStatus: 'to_pack',
    shippingCarrier: 'Correios PAC',
  },
]

// Sales change history mock data (edits/alterations)
const salesChangeHistory: ChangeHistoryEntry[] = [
  {
    id: 's1',
    entityId: 'NS-1847',
    entityName: 'Pedido #NS-1847',
    userName: 'Maria Silva',
    userInitials: 'MS',
    userColor: '#7C3AED',
    action: 'status_change',
    field: 'Status',
    oldValue: 'Aguardando pagamento',
    newValue: 'Pago',
    timestamp: new Date(2026, 1, 10, 14, 50),
    description: 'Alterou o status do pedido'
  },
  {
    id: 's2',
    entityId: 'NS-1845',
    entityName: 'Pedido #NS-1845',
    userName: 'João Oliveira',
    userInitials: 'JO',
    userColor: '#059669',
    action: 'update',
    field: 'Endereço de entrega',
    oldValue: 'Rua A, 123',
    newValue: 'Av. Brasil, 456 - Apto 12',
    timestamp: new Date(2026, 1, 10, 12, 30),
    description: 'Editou o endereço de entrega'
  },
  {
    id: 's3',
    entityId: 'NS-1842',
    entityName: 'Pedido #NS-1842',
    userName: 'Ana Costa',
    userInitials: 'AC',
    userColor: '#DC2626',
    action: 'update',
    field: 'Observações',
    oldValue: '(vazio)',
    newValue: 'Cliente solicitou embalagem para presente',
    timestamp: new Date(2026, 1, 10, 10, 15),
    description: 'Editou as observações do pedido'
  },
  {
    id: 's4',
    entityId: 'NS-1840',
    entityName: 'Pedido #NS-1840',
    userName: 'Maria Silva',
    userInitials: 'MS',
    userColor: '#7C3AED',
    action: 'status_change',
    field: 'Status',
    oldValue: 'Preparando envio',
    newValue: 'Enviado',
    timestamp: new Date(2026, 1, 9, 16, 0),
    description: 'Alterou o status do pedido'
  },
  {
    id: 's5',
    entityId: 'NS-1838',
    entityName: 'Pedido #NS-1838',
    userName: 'João Oliveira',
    userInitials: 'JO',
    userColor: '#059669',
    action: 'update',
    field: 'Código de rastreio',
    oldValue: '(vazio)',
    newValue: 'BR123456789XX',
    timestamp: new Date(2026, 1, 9, 14, 20),
    description: 'Editou o código de rastreio'
  },
  {
    id: 's6',
    entityId: 'NS-1835',
    entityName: 'Pedido #NS-1835',
    userName: 'Ana Costa',
    userInitials: 'AC',
    userColor: '#DC2626',
    action: 'price_change',
    field: 'Desconto',
    oldValue: '0%',
    newValue: '10% (R$ 29,90)',
    timestamp: new Date(2026, 1, 9, 11, 45),
    description: 'Alterou o desconto do pedido'
  },
  {
    id: 's7',
    entityId: 'NS-1847',
    entityName: 'Pedido #NS-1847',
    userName: 'Maria Silva',
    userInitials: 'MS',
    userColor: '#7C3AED',
    action: 'update',
    field: 'Método de envio',
    oldValue: 'PAC',
    newValue: 'SEDEX',
    timestamp: new Date(2026, 1, 8, 15, 30),
    description: 'Editou o método de envio'
  },
]

const salesHistoryFilters = [
  { key: 'all', label: 'Todos' },
  { key: 'update', label: 'Edições' },
  { key: 'status_change', label: 'Status' },
  { key: 'price_change', label: 'Preço' },
]

interface SalesPageProps {
  onAskLumi?: () => void
  filteredOrderIds?: string[]
  onClearFilter?: () => void
  statsFilters?: StatsFilter[]
  onClearStatsFilter?: () => void
}

export function SalesPage({ filteredOrderIds, onClearFilter, statsFilters, onClearStatsFilter }: SalesPageProps) {
  const [activeTab, setActiveTab] = useState('to_pack')
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isChangeHistoryOpen, setIsChangeHistoryOpen] = useState(false)
  const [removedChipIds, setRemovedChipIds] = useState<string[]>([])

  // Active filter IDs (excluding removed chips)
  const activeFilterIds = useMemo(() => {
    if (!filteredOrderIds || filteredOrderIds.length === 0) return []
    return filteredOrderIds.filter(id => !removedChipIds.includes(id))
  }, [filteredOrderIds, removedChipIds])

  // Reset removed chips when filter changes
  const prevFilterRef = useRef(filteredOrderIds)
  useEffect(() => {
    if (prevFilterRef.current !== filteredOrderIds) {
      setRemovedChipIds([])
      prevFilterRef.current = filteredOrderIds
    }
  }, [filteredOrderIds])

  // Filter orders based on Lumi's filter
  const displayedOrders = useMemo(() => {
    if (activeFilterIds.length > 0) {
      return mockOrders.filter(order => activeFilterIds.includes(order.id))
    }
    if (filteredOrderIds && filteredOrderIds.length > 0) {
      // All chips removed = clear filter
      return mockOrders
    }
    return mockOrders
  }, [activeFilterIds, filteredOrderIds])

  const handleSelectOrder = (orderId: string) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    )
  }

  const handleSelectAll = () => {
    if (selectedOrders.length === displayedOrders.length) {
      setSelectedOrders([])
    } else {
      setSelectedOrders(displayedOrders.map((o) => o.id))
    }
  }

  const isFiltered = activeFilterIds.length > 0
  const hasStatsFilter = statsFilters && statsFilters.length > 0

  // Get stats filter description
  const statsFilterDescription = useMemo(() => {
    if (!statsFilters || statsFilters.length === 0) return ''
    return statsFilters.map(f => f.label).join(', ')
  }, [statsFilters])

  return (
    <div className="min-h-full bg-neutral-background">
      {/* Page Header */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-baseline gap-2">
            <h1 className="text-[32px] font-semibold text-neutral-text-high leading-10">Vendas</h1>
            <span className="text-base text-neutral-text-low">
              98 abertas
            </span>
          </div>

          <div className="flex items-center gap-2">
            <HistoryButton onClick={() => setIsChangeHistoryOpen(true)} />
            <Button variant="neutral">
              Cancelamento automático
            </Button>
            <Button
              variant="neutral"
              leftIcon={<DownloadIcon className="w-4 h-4" />}
            >
              Exportar lista
            </Button>
            <Button
              variant="primary"
              leftIcon={<PlusIcon className="w-4 h-4" />}
            >
              Criar um pedido
            </Button>
          </div>
        </div>

        {/* Filters Row */}
        <div className={`mb-4 bg-white rounded-lg border border-neutral-surface-disabled ${isFiltered ? 'pb-2' : ''}`}>
          <div className="flex items-center justify-between p-1">
            <div className="flex items-center gap-2">
              <SearchInput
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-44"
              />
            </div>

            <div className="flex items-center gap-2">
              <FilterTabs
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={setActiveTab}
              />
              
              <div className="flex items-center gap-1 ml-2 border-l border-neutral-surface-disabled pl-2">
                <button className="p-2 rounded-md hover:bg-neutral-surface text-neutral-text-low" title="Ações em massa">
                  <BagIcon className="w-4 h-4" />
                </button>
                {isFiltered && (
                  <button className="p-2 rounded-md hover:bg-neutral-surface text-neutral-text-low flex items-center gap-1" title="Filtros">
                    <FilterIcon className="w-4 h-4" />
                  </button>
                )}
                <button className="p-2 rounded-md hover:bg-neutral-surface text-neutral-text-low flex items-center gap-1" title="Filtros">
                  <FilterIcon className="w-4 h-4" />
                  <span className="text-sm">Filtrar</span>
                </button>
              </div>
            </div>
          </div>

          {/* AI Filter Chips - shown when Lumi filter is active */}
          {isFiltered && (
            <div className="flex items-center gap-2 px-2 pb-1 flex-wrap">
              {activeFilterIds.map((id) => {
                const order = mockOrders.find(o => o.id === id)
                return (
                  <AIFilterChip
                    key={id}
                    label={order ? `#${id}` : `#${id}`}
                    onRemove={() => {
                      const newRemoved = [...removedChipIds, id]
                      setRemovedChipIds(newRemoved)
                      // If all chips removed, clear the filter entirely
                      if (filteredOrderIds && newRemoved.length >= filteredOrderIds.length) {
                        if (onClearFilter) onClearFilter()
                        setRemovedChipIds([])
                      }
                    }}
                  />
                )
              })}
            </div>
          )}
        </div>

        {/* Filter banner when stats filter is active */}
        {hasStatsFilter && (
          <div className="flex items-center justify-between mb-4 p-3 rounded-lg border"
            style={{
              background: 'linear-gradient(135deg, rgba(0,80,195,0.1) 0%, rgba(70,41,186,0.1) 50%, rgba(216,68,110,0.1) 100%)',
              borderColor: 'rgba(70,41,186,0.3)'
            }}
          >
            <div className="flex items-center gap-2">
              <ChartIcon className="w-4 h-4 text-[#4629BA]" />
              <span className="text-sm text-neutral-text-high">
                Filtro de estatísticas aplicado: <strong>{statsFilterDescription}</strong>
              </span>
            </div>
            <button
              onClick={onClearStatsFilter}
              className="flex items-center gap-1 text-sm text-[#4629BA] hover:text-[#3a1f9e]"
            >
              <CloseIcon className="w-4 h-4" />
              Limpar filtro
            </button>
          </div>
        )}
      </div>

      {/* Data Table */}
      <div className="px-6 pb-6">
        <SalesTable
          orders={displayedOrders}
          selectedOrders={selectedOrders}
          onSelectOrder={handleSelectOrder}
          onSelectAll={handleSelectAll}
          isFiltered={isFiltered}
          totalFilteredCount={isFiltered ? displayedOrders.length : undefined}
        />
      </div>

      {/* Change History Panel */}
      <ChangeHistoryPanel
        isOpen={isChangeHistoryOpen}
        onClose={() => setIsChangeHistoryOpen(false)}
        entries={salesChangeHistory}
        filters={salesHistoryFilters}
      />
    </div>
  )
}
