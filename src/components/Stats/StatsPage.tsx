import { useState, useMemo } from 'react'
import { Button, ChangeHistoryPanel, HistoryButton } from '../UI'
import type { ChangeHistoryEntry } from '../UI'
import { DownloadIcon, SparklesIcon, CloseIcon } from '../Icons'
import { StatsFilter } from '../Chat/StatsCard'

// Chart icon
function ChartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor">
      <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
      <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
    </svg>
  )
}

// Calendar icon
function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="4" width="14" height="13" rx="2" />
      <path d="M3 8h14M7 2v4M13 2v4" strokeLinecap="round" />
    </svg>
  )
}

// Stats change history mock data (edits/alterations)
const statsChangeHistory: ChangeHistoryEntry[] = [
  {
    id: 'st1',
    entityId: 'period-config',
    entityName: 'Configuração de período',
    userName: 'Maria Silva',
    userInitials: 'MS',
    userColor: '#7C3AED',
    action: 'update',
    field: 'Período de análise',
    oldValue: 'Últimos 7 dias',
    newValue: 'Últimos 30 dias',
    timestamp: new Date(2026, 1, 10, 14, 10),
    description: 'Alterou o período de análise'
  },
  {
    id: 'st2',
    entityId: 'meta-faturamento',
    entityName: 'Meta de faturamento',
    userName: 'João Oliveira',
    userInitials: 'JO',
    userColor: '#059669',
    action: 'update',
    field: 'Meta mensal',
    oldValue: 'R$ 50.000',
    newValue: 'R$ 75.000',
    timestamp: new Date(2026, 1, 10, 11, 30),
    description: 'Editou a meta de faturamento mensal'
  },
  {
    id: 'st3',
    entityId: 'dashboard-layout',
    entityName: 'Layout do dashboard',
    userName: 'Ana Costa',
    userInitials: 'AC',
    userColor: '#DC2626',
    action: 'update',
    field: 'Métricas visíveis',
    oldValue: '4 métricas',
    newValue: '6 métricas',
    timestamp: new Date(2026, 1, 10, 9, 45),
    description: 'Editou as métricas exibidas'
  },
  {
    id: 'st4',
    entityId: 'comparacao',
    entityName: 'Comparação de períodos',
    userName: 'Maria Silva',
    userInitials: 'MS',
    userColor: '#7C3AED',
    action: 'status_change',
    field: 'Comparação',
    oldValue: 'Desativada',
    newValue: 'Ativada',
    timestamp: new Date(2026, 1, 9, 16, 20),
    description: 'Alterou a exibição de comparação'
  },
  {
    id: 'st5',
    entityId: 'relatorio-export',
    entityName: 'Configuração de exportação',
    userName: 'João Oliveira',
    userInitials: 'JO',
    userColor: '#059669',
    action: 'update',
    field: 'Formato de exportação',
    oldValue: 'PDF',
    newValue: 'CSV',
    timestamp: new Date(2026, 1, 9, 10, 0),
    description: 'Editou o formato de exportação'
  },
]

const statsHistoryFilters = [
  { key: 'all', label: 'Todos' },
  { key: 'update', label: 'Edições' },
  { key: 'status_change', label: 'Status' },
]

interface StatsPageProps {
  onAskLumi?: () => void
  statsFilters?: StatsFilter[]
  onClearStatsFilter?: () => void
}

// Period tabs
const periodTabs = [
  { id: 'today', label: 'Hoje' },
  { id: 'yesterday', label: 'Ontem' },
  { id: 'last_7_days', label: 'Últimos 7 dias' },
  { id: 'last_30_days', label: 'Últimos 30 dias' },
  { id: 'this_month', label: 'Este mês' },
  { id: 'custom', label: 'Personalizado' },
]

// Mock data for charts
interface ChartDataPoint {
  label: string
  value: number
  previousValue?: number
}

const salesByDayData: ChartDataPoint[] = [
  { label: 'Seg', value: 12500, previousValue: 10200 },
  { label: 'Ter', value: 18200, previousValue: 15800 },
  { label: 'Qua', value: 15800, previousValue: 14200 },
  { label: 'Qui', value: 22100, previousValue: 19500 },
  { label: 'Sex', value: 28500, previousValue: 24800 },
  { label: 'Sáb', value: 35200, previousValue: 31000 },
  { label: 'Dom', value: 19800, previousValue: 17600 },
]

const paymentStatusData = [
  { label: 'Recebido', value: 68, color: '#00A650' },
  { label: 'Pendente', value: 22, color: '#F5A623' },
  { label: 'Recusado', value: 10, color: '#E53935' },
]

const shippingMethodData = [
  { label: 'Correios SEDEX', value: 45, color: '#0050C3' },
  { label: 'Correios PAC', value: 30, color: '#4629BA' },
  { label: 'Jadlog', value: 15, color: '#D8446E' },
  { label: 'Outros', value: 10, color: '#8E8E93' },
]

const topProductsData = [
  { name: 'Camiseta Básica Preta', sales: 156, revenue: 'R$ 7.800,00' },
  { name: 'Tênis Running Pro', sales: 89, revenue: 'R$ 17.800,00' },
  { name: 'Calça Jeans Slim', sales: 78, revenue: 'R$ 6.240,00' },
  { name: 'Jaqueta Corta Vento', sales: 65, revenue: 'R$ 9.750,00' },
  { name: 'Mochila Urban', sales: 54, revenue: 'R$ 4.860,00' },
]

// Summary Card Component
function SummaryCard({ 
  title, 
  value, 
  change, 
  changeType,
  icon
}: { 
  title: string
  value: string
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral'
  icon?: React.ReactNode
}) {
  const changeColor = changeType === 'positive' 
    ? 'text-success-text-low' 
    : changeType === 'negative' 
      ? 'text-danger-text-low' 
      : 'text-neutral-text-low'

  return (
    <div className="bg-white rounded-lg border border-neutral-surface-disabled p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-neutral-text-low">{title}</span>
        {icon && <span className="text-neutral-text-low">{icon}</span>}
      </div>
      <p className="text-2xl font-semibold text-neutral-text-high">{value}</p>
      {change && (
        <p className={`text-sm mt-1 ${changeColor}`}>
          {changeType === 'positive' && '+'}{change} vs período anterior
        </p>
      )}
    </div>
  )
}

// Bar Chart Component
function BarChart({ data, showComparison = false }: { data: ChartDataPoint[]; showComparison?: boolean }) {
  const maxValue = Math.max(...data.map(d => Math.max(d.value, d.previousValue ?? 0)))
  
  return (
    <div className="h-64">
      <div className="flex items-end justify-between gap-2 h-52">
        {data.map((item, index) => {
          const height = (item.value / maxValue) * 100
          const prevHeight = item.previousValue ? (item.previousValue / maxValue) * 100 : 0
          
          return (
            <div key={index} className="flex flex-col items-center flex-1 h-full justify-end">
              <div className="flex items-end gap-1 w-full justify-center">
                {showComparison && item.previousValue && (
                  <div 
                    className="w-3 rounded-t bg-neutral-surface-highlight transition-all duration-300"
                    style={{ height: `${prevHeight}%`, minHeight: '4px' }}
                    title={`Anterior: R$ ${item.previousValue.toLocaleString('pt-BR')}`}
                  />
                )}
                <div 
                  className="w-6 rounded-t bg-primary-interactive transition-all duration-300 hover:bg-primary-interactive-hover"
                  style={{ height: `${height}%`, minHeight: '4px' }}
                  title={`R$ ${item.value.toLocaleString('pt-BR')}`}
                />
              </div>
            </div>
          )
        })}
      </div>
      <div className="flex justify-between mt-2">
        {data.map((item, index) => (
          <div key={index} className="flex-1 text-center">
            <span className="text-xs text-neutral-text-low">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// Donut Chart Component
function DonutChart({ data }: { data: { label: string; value: number; color: string }[] }) {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  let cumulativePercentage = 0
  
  return (
    <div className="flex items-center gap-6">
      <div className="relative w-32 h-32">
        <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
          {data.map((item, index) => {
            const percentage = (item.value / total) * 100
            const circumference = 2 * Math.PI * 15.9155
            const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`
            const rotation = (cumulativePercentage / 100) * 360
            cumulativePercentage += percentage
            
            return (
              <circle
                key={index}
                cx="18"
                cy="18"
                r="15.9155"
                fill="none"
                stroke={item.color}
                strokeWidth="3"
                strokeDasharray={strokeDasharray}
                style={{ transform: `rotate(${rotation}deg)`, transformOrigin: '18px 18px' }}
                className="transition-all duration-300"
              />
            )
          })}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-semibold text-neutral-text-high">{total}%</span>
        </div>
      </div>
      
      <div className="flex flex-col gap-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-sm text-neutral-text-high">{item.label}</span>
            <span className="text-sm text-neutral-text-low">({item.value}%)</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// Top Products Table
function TopProductsTable({ data }: { data: typeof topProductsData }) {
  return (
    <div className="overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-neutral-surface-disabled">
            <th className="text-left text-xs font-medium text-neutral-text-low py-3 px-2">#</th>
            <th className="text-left text-xs font-medium text-neutral-text-low py-3 px-2">Produto</th>
            <th className="text-right text-xs font-medium text-neutral-text-low py-3 px-2">Vendas</th>
            <th className="text-right text-xs font-medium text-neutral-text-low py-3 px-2">Receita</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} className="border-b border-neutral-surface-disabled last:border-0">
              <td className="py-3 px-2 text-sm text-neutral-text-low">{index + 1}</td>
              <td className="py-3 px-2 text-sm text-primary-interactive hover:underline cursor-pointer">
                {item.name}
              </td>
              <td className="py-3 px-2 text-sm text-neutral-text-high text-right">{item.sales}</td>
              <td className="py-3 px-2 text-sm text-neutral-text-high text-right">{item.revenue}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function StatsPage({ statsFilters, onClearStatsFilter }: StatsPageProps) {
  const [activePeriod, setActivePeriod] = useState('last_7_days')
  const [showComparison, setShowComparison] = useState(true)
  const [isChangeHistoryOpen, setIsChangeHistoryOpen] = useState(false)

  const hasStatsFilter = statsFilters && statsFilters.length > 0

  // Get stats filter description
  const statsFilterDescription = useMemo(() => {
    if (!statsFilters || statsFilters.length === 0) return ''
    return statsFilters.map(f => f.label).join(', ')
  }, [statsFilters])

  // Calculate totals
  const totalSales = salesByDayData.reduce((sum, d) => sum + d.value, 0)
  const previousTotalSales = salesByDayData.reduce((sum, d) => sum + (d.previousValue ?? 0), 0)
  const salesChange = ((totalSales - previousTotalSales) / previousTotalSales * 100).toFixed(1)

  return (
    <div className="min-h-full bg-neutral-background">
      {/* Page Header */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <ChartIcon className="w-8 h-8 text-primary-interactive" />
            <div>
              <h1 className="text-[32px] font-semibold text-neutral-text-high leading-10">Estatísticas</h1>
              <p className="text-sm text-neutral-text-low">Acompanhe o desempenho da sua loja</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <HistoryButton onClick={() => setIsChangeHistoryOpen(true)} />
            <Button
              variant="neutral"
              leftIcon={<DownloadIcon className="w-4 h-4" />}
            >
              Exportar relatório
            </Button>
          </div>
        </div>

        {/* Period Tabs */}
        <div className="flex items-center gap-2 mb-4 p-1 bg-white rounded-lg border border-neutral-surface-disabled w-fit">
          {periodTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActivePeriod(tab.id)}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                activePeriod === tab.id
                  ? 'bg-primary-surface text-primary-text-high font-medium'
                  : 'text-neutral-text-low hover:bg-neutral-surface'
              }`}
            >
              {tab.label}
            </button>
          ))}
          <button className="p-1.5 text-neutral-text-low hover:bg-neutral-surface rounded-md">
            <CalendarIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Filter banner when Lumi stats filter is active */}
        {hasStatsFilter && (
          <div className="flex items-center justify-between mb-4 p-3 rounded-lg border"
            style={{
              background: 'linear-gradient(135deg, rgba(0,80,195,0.1) 0%, rgba(70,41,186,0.1) 50%, rgba(216,68,110,0.1) 100%)',
              borderColor: 'rgba(70,41,186,0.3)'
            }}
          >
            <div className="flex items-center gap-2">
              <SparklesIcon className="w-4 h-4 text-[#4629BA]" />
              <span className="text-sm text-neutral-text-high">
                Filtro aplicado via Lumi: <strong>{statsFilterDescription}</strong>
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

      {/* Page Content */}
      <div className="px-6 pb-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <SummaryCard
          title="Faturamento total"
          value={`R$ ${totalSales.toLocaleString('pt-BR')}`}
          change={`${salesChange}%`}
          changeType="positive"
        />
        <SummaryCard
          title="Pedidos realizados"
          value="442"
          change="12%"
          changeType="positive"
        />
        <SummaryCard
          title="Ticket médio"
          value="R$ 344,12"
          change="3.2%"
          changeType="negative"
        />
        <SummaryCard
          title="Taxa de conversão"
          value="3.8%"
          change="0.5%"
          changeType="positive"
        />
      </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Sales by Day Chart */}
        <div className="bg-white rounded-lg border border-neutral-surface-disabled p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-neutral-text-high">Vendas por dia</h3>
            <label className="flex items-center gap-2 text-sm text-neutral-text-low">
              <input
                type="checkbox"
                checked={showComparison}
                onChange={(e) => setShowComparison(e.target.checked)}
                className="rounded border-neutral-surface-disabled"
              />
              Comparar com período anterior
            </label>
          </div>
          <BarChart data={salesByDayData} showComparison={showComparison} />
          <div className="flex items-center justify-center gap-6 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-primary-interactive" />
              <span className="text-neutral-text-low">Período atual</span>
            </div>
            {showComparison && (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-neutral-surface-highlight" />
                <span className="text-neutral-text-low">Período anterior</span>
              </div>
            )}
          </div>
        </div>

        {/* Payment Status */}
        <div className="bg-white rounded-lg border border-neutral-surface-disabled p-4">
          <h3 className="text-base font-semibold text-neutral-text-high mb-4">Status de pagamento</h3>
          <div className="flex items-center justify-center py-4">
            <DonutChart data={paymentStatusData} />
          </div>
        </div>

        {/* Shipping Methods */}
        <div className="bg-white rounded-lg border border-neutral-surface-disabled p-4">
          <h3 className="text-base font-semibold text-neutral-text-high mb-4">Métodos de envio</h3>
          <div className="flex items-center justify-center py-4">
            <DonutChart data={shippingMethodData} />
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-lg border border-neutral-surface-disabled p-4">
          <h3 className="text-base font-semibold text-neutral-text-high mb-4">Produtos mais vendidos</h3>
          <TopProductsTable data={topProductsData} />
        </div>
      </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg border border-neutral-surface-disabled p-4">
            <h3 className="text-sm font-medium text-neutral-text-low mb-2">Visitantes únicos</h3>
            <p className="text-2xl font-semibold text-neutral-text-high">11.628</p>
            <p className="text-sm text-success-text-low mt-1">+8.3% vs período anterior</p>
          </div>
          <div className="bg-white rounded-lg border border-neutral-surface-disabled p-4">
            <h3 className="text-sm font-medium text-neutral-text-low mb-2">Carrinhos abandonados</h3>
            <p className="text-2xl font-semibold text-neutral-text-high">234</p>
            <p className="text-sm text-danger-text-low mt-1">+2.1% vs período anterior</p>
          </div>
          <div className="bg-white rounded-lg border border-neutral-surface-disabled p-4">
            <h3 className="text-sm font-medium text-neutral-text-low mb-2">Novos clientes</h3>
            <p className="text-2xl font-semibold text-neutral-text-high">89</p>
            <p className="text-sm text-success-text-low mt-1">+15.2% vs período anterior</p>
          </div>
        </div>
      </div>

      {/* Change History Panel */}
      <ChangeHistoryPanel
        isOpen={isChangeHistoryOpen}
        onClose={() => setIsChangeHistoryOpen(false)}
        entries={statsChangeHistory}
        filters={statsHistoryFilters}
      />
    </div>
  )
}
