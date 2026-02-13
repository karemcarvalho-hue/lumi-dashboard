import { useState } from 'react'

// Types for statistics data
export interface StatItem {
  label: string
  value: number
  color: string
  percentage?: number
}

export interface ChartData {
  type: 'bar' | 'line' | 'pie' | 'donut'
  title: string
  data: StatItem[]
  total?: number
  period?: string
}

export interface StatsFilter {
  type: 'period' | 'status' | 'category' | 'payment'
  value: string
  label: string
}

interface StatsCardProps {
  charts?: ChartData[]
  onApplyFilter?: (filters: StatsFilter[]) => void
  onUndo?: () => void
  title?: string
  isFullscreen?: boolean
}

// Close icon
function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" />
    </svg>
  )
}

// Download/Export icon
function DownloadIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M8 2v8m0 0l-3-3m3 3l3-3M3 12v1a1 1 0 001 1h8a1 1 0 001-1v-1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// Chevron icon for expand button
function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// Chart icon
function ChartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor">
      <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
      <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
    </svg>
  )
}

// Generate mock statistics data
export function generateMockStats(): ChartData[] {
  return [
    {
      type: 'bar',
      title: 'Vendas por período',
      period: 'Últimos 7 dias',
      data: [
        { label: 'Seg', value: 12500, color: '#0050C3' },
        { label: 'Ter', value: 18200, color: '#0050C3' },
        { label: 'Qua', value: 15800, color: '#0050C3' },
        { label: 'Qui', value: 22100, color: '#0050C3' },
        { label: 'Sex', value: 28500, color: '#0050C3' },
        { label: 'Sáb', value: 35200, color: '#0050C3' },
        { label: 'Dom', value: 19800, color: '#0050C3' },
      ],
      total: 152100,
    },
    {
      type: 'donut',
      title: 'Status de pagamento',
      data: [
        { label: 'Recebido', value: 68, color: '#00A650', percentage: 68 },
        { label: 'Pendente', value: 22, color: '#F5A623', percentage: 22 },
        { label: 'Recusado', value: 10, color: '#E53935', percentage: 10 },
      ],
      total: 100,
    },
    {
      type: 'pie',
      title: 'Métodos de envio',
      data: [
        { label: 'Correios SEDEX', value: 45, color: '#0050C3', percentage: 45 },
        { label: 'Correios PAC', value: 30, color: '#4629BA', percentage: 30 },
        { label: 'Jadlog', value: 15, color: '#D8446E', percentage: 15 },
        { label: 'Outros', value: 10, color: '#8E8E93', percentage: 10 },
      ],
      total: 100,
    },
  ]
}

// Bar Chart Component
function BarChart({ data, maxValue }: { data: StatItem[]; maxValue: number }) {
  return (
    <div className="flex items-end justify-between gap-1 h-24">
      {data.map((item, index) => {
        const height = (item.value / maxValue) * 100
        return (
          <div key={index} className="flex flex-col items-center flex-1">
            <div 
              className="w-full rounded-t transition-all duration-300 hover:opacity-80"
              style={{ 
                height: `${height}%`, 
                backgroundColor: item.color,
                minHeight: '4px'
              }}
              title={`${item.label}: R$ ${item.value.toLocaleString('pt-BR')}`}
            />
            <span className="text-[10px] text-neutral-text-low mt-1">{item.label}</span>
          </div>
        )
      })}
    </div>
  )
}

// Donut/Pie Chart Component
function DonutChart({ data, isDonut = true }: { data: StatItem[]; isDonut?: boolean }) {
  let cumulativePercentage = 0
  
  return (
    <div className="relative w-20 h-20 mx-auto">
      <svg viewBox="0 0 36 36" className="w-full h-full">
        {data.map((item, index) => {
          const percentage = item.percentage ?? 0
          const startAngle = cumulativePercentage * 3.6 // Convert to degrees
          cumulativePercentage += percentage
          
          // Calculate the SVG arc
          const radius = isDonut ? 15.9155 : 18
          const circumference = 2 * Math.PI * radius
          const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`
          const rotation = startAngle - 90 // Start from top
          
          return (
            <circle
              key={index}
              cx="18"
              cy="18"
              r={radius}
              fill="none"
              stroke={item.color}
              strokeWidth={isDonut ? 3 : 18}
              strokeDasharray={strokeDasharray}
              transform={`rotate(${rotation} 18 18)`}
              className="transition-all duration-300"
            />
          )
        })}
        {isDonut && (
          <text x="18" y="18" textAnchor="middle" dy="0.3em" className="text-[6px] font-semibold fill-neutral-text-high">
            100%
          </text>
        )}
      </svg>
    </div>
  )
}

// Legend Component
function ChartLegend({ data }: { data: StatItem[] }) {
  return (
    <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
      {data.map((item, index) => (
        <div key={index} className="flex items-center gap-1">
          <div 
            className="w-2 h-2 rounded-full flex-shrink-0" 
            style={{ backgroundColor: item.color }} 
          />
          <span className="text-[10px] text-neutral-text-low">
            {item.label} ({item.percentage ?? item.value}%)
          </span>
        </div>
      ))}
    </div>
  )
}

// Single Chart Card
function ChartCard({ chart, compact = false }: { chart: ChartData; compact?: boolean }) {
  const maxValue = Math.max(...chart.data.map(d => d.value))
  
  return (
    <div className={`bg-neutral-surface/50 rounded-lg ${compact ? 'p-2' : 'p-3'}`}>
      <div className="flex items-center justify-between mb-2">
        <span className={`font-medium text-neutral-text-high ${compact ? 'text-xs' : 'text-sm'}`}>
          {chart.title}
        </span>
        {chart.period && (
          <span className="text-[10px] text-neutral-text-low">{chart.period}</span>
        )}
      </div>
      
      {chart.type === 'bar' && (
        <>
          <BarChart data={chart.data} maxValue={maxValue} />
          {chart.total && (
            <div className="mt-2 text-right">
              <span className="text-xs text-neutral-text-low">Total: </span>
              <span className="text-sm font-semibold text-neutral-text-high">
                R$ {chart.total.toLocaleString('pt-BR')}
              </span>
            </div>
          )}
        </>
      )}
      
      {(chart.type === 'donut' || chart.type === 'pie') && (
        <div className="flex flex-col items-center">
          <DonutChart data={chart.data} isDonut={chart.type === 'donut'} />
          <ChartLegend data={chart.data} />
        </div>
      )}
    </div>
  )
}

// Modal component for expanded stats
function StatsModal({ 
  isOpen, 
  onClose, 
  charts,
  title 
}: { 
  isOpen: boolean
  onClose: () => void
  charts: ChartData[]
  title: string
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50" 
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl w-[95vw] max-w-[900px] max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-surface-disabled">
          <div className="flex items-center gap-2">
            <ChartIcon className="w-5 h-5 text-primary-interactive" />
            <span className="text-base font-semibold text-neutral-text-high">
              {title}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-neutral-text-high border border-neutral-surface-disabled rounded-lg hover:bg-neutral-surface transition-colors">
              <DownloadIcon className="w-4 h-4" />
              Exportar
            </button>
            <button 
              onClick={onClose}
              className="p-1.5 text-neutral-text-low hover:text-neutral-text-high rounded transition-colors"
            >
              <CloseIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {charts.map((chart, index) => (
              <div key={index} className={chart.type === 'bar' ? 'md:col-span-2' : ''}>
                <ChartCard chart={chart} />
              </div>
            ))}
          </div>
          
          {/* Summary stats */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-primary-surface rounded-lg p-4">
              <span className="text-xs text-primary-text-low">Total de vendas</span>
              <p className="text-xl font-semibold text-primary-text-high">R$ 152.100</p>
            </div>
            <div className="bg-success-surface rounded-lg p-4">
              <span className="text-xs text-success-text-low">Pedidos concluídos</span>
              <p className="text-xl font-semibold text-success-text-high">68</p>
            </div>
            <div className="bg-warning-surface rounded-lg p-4">
              <span className="text-xs text-warning-text-low">Pedidos pendentes</span>
              <p className="text-xl font-semibold text-warning-text-high">22</p>
            </div>
            <div className="bg-danger-surface rounded-lg p-4">
              <span className="text-xs text-danger-text-low">Pedidos recusados</span>
              <p className="text-xl font-semibold text-danger-text-high">10</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Stats Content for the card
function StatsContent({ charts, isExpanded, isFullscreen = false }: { charts: ChartData[]; isExpanded: boolean; isFullscreen?: boolean }) {
  // Show first chart collapsed, all expanded
  const visibleCharts = isExpanded ? charts : charts.slice(0, 1)
  
  if (isFullscreen) {
    return (
      <div className="space-y-4 p-3">
        {visibleCharts.map((chart, index) => (
          <ChartCard key={index} chart={chart} />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-3 p-2">
      {visibleCharts.map((chart, index) => (
        <ChartCard key={index} chart={chart} compact />
      ))}
    </div>
  )
}

// Main StatsCard component
export function StatsCard({ 
  charts = generateMockStats(), 
  onApplyFilter,
  onUndo,
  title = 'Estatísticas',
  isFullscreen = false 
}: StatsCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isCardCollapsed, setIsCardCollapsed] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isApplied, setIsApplied] = useState(false)

  const handleButtonClick = () => {
    if (isApplied) {
      // Undo action - call the undo callback
      if (onUndo) {
        onUndo()
      }
      setIsApplied(false)
    } else {
      // Apply action
      if (onApplyFilter) {
        const filters: StatsFilter[] = [
          { type: 'period', value: 'last_7_days', label: 'Últimos 7 dias' },
          { type: 'status', value: 'to_pack', label: 'Por embalar' },
        ]
        onApplyFilter(filters)
      }
      setIsApplied(true)
    }
  }

  return (
    <>
      {/* Card container */}
      <div className="bg-white rounded-lg shadow-[0_0_2px_rgba(136,136,136,0.5)] overflow-hidden">
        {/* Header - clickable to collapse/expand card */}
        <button 
          onClick={() => setIsCardCollapsed(!isCardCollapsed)}
          className="w-full flex items-center gap-2 px-2.5 py-2.5 hover:bg-neutral-surface/50 transition-colors text-left"
        >
          <ChevronDownIcon 
            className={`w-4 h-4 text-neutral-text-low flex-shrink-0 transition-transform duration-200 ${isCardCollapsed ? '-rotate-90' : ''}`} 
          />
          <span className="flex-1 text-sm font-semibold text-neutral-text-high">{title}</span>
          {isCardCollapsed && (
            <span className="text-xs text-neutral-text-low">{charts.length} gráficos</span>
          )}
          <div 
            onClick={(e) => {
              e.stopPropagation()
              setIsModalOpen(true)
            }}
            className="p-1 rounded hover:bg-neutral-surface-disabled transition-colors"
            title="Abrir em tela cheia"
          >
            <svg className="w-4 h-4 text-neutral-text-low" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M10 2h4v4M6 14H2v-4M14 2L9 7M2 14l5-5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </button>

        {/* Collapsible content */}
        <div className={`transition-all duration-200 ease-in-out overflow-hidden ${isCardCollapsed ? 'max-h-0 opacity-0' : 'opacity-100'}`}>
          {/* Charts Content */}
          <StatsContent charts={charts} isExpanded={isExpanded} isFullscreen={isFullscreen} />

          {/* Footer with expand and filter buttons */}
          <div className="px-2.5 py-2.5 space-y-2 border-t border-neutral-surface-disabled bg-white">
            {/* Expand/Collapse button */}
            {charts.length > 1 && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-center gap-1 py-1 text-xs text-neutral-text-low hover:text-neutral-text-high transition-colors"
              >
                <span>{isExpanded ? 'Ver menos' : `Ver mais ${charts.length - 1} gráficos`}</span>
                <ChevronDownIcon className={`w-3 h-3 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
              </button>
            )}
            
            {/* Apply Filter / Undo Button */}
            <button
              onClick={handleButtonClick}
              className={`w-full py-1.5 px-3 text-sm font-medium rounded-md transition-all ${
                isApplied 
                  ? 'bg-neutral-surface border border-neutral-surface-disabled text-neutral-text-high hover:bg-neutral-surface-disabled' 
                  : 'text-white hover:opacity-90'
              }`}
              style={!isApplied ? {
                background: 'linear-gradient(17deg, #0050C3 28%, #4629BA 49%, #D8446E 83%)'
              } : undefined}
            >
              {isApplied ? 'Desfazer' : 'Aplicar filtro'}
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Modal */}
      <StatsModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        charts={charts}
        title={title}
      />
    </>
  )
}
