import { useState } from 'react'
import { Checkbox, Link } from '../UI'
import { PaymentStatusTag, ShippingStatusTag } from './StatusTag'
import { ChevronDownIcon, MoreVerticalIcon } from '../Icons'
import { ChevronLeftIcon, ChevronRightIcon, BoxPackedIcon } from '@nimbus-ds/icons'

export interface OrderProductItem {
  id: string
  name: string
  sku: string
  quantity: number
  unitPrice: string
}

export interface Order {
  id: string
  date: string
  time: string
  customerName: string
  total: string
  productsCount: number
  productItems?: OrderProductItem[]
  paymentStatus: 'received' | 'refused' | 'pending'
  paymentMethod: string
  shippingStatus: 'shipped' | 'to_ship' | 'to_pack' | 'picked_up'
  shippingCarrier: string
}

// Mock product names for generating product details
const PRODUCT_NAMES = [
  'Camiseta Básica Algodão',
  'Calça Jeans Slim Fit',
  'Tênis Esportivo Runner',
  'Vestido Floral Midi',
  'Bolsa de Couro Marrom',
  'Relógio Digital Sport',
  'Óculos de Sol Aviador',
  'Boné Trucker Premium',
  'Kit 3 Pares de Meias',
  'Jaqueta Impermeável',
  'Shorts Fitness Dry',
  'Sandália Rasteira',
  'Camisa Polo Classic',
  'Saia Midi Plissada',
  'Mochila Notebook 15"',
]

// Stable product generation using order ID as seed
function getOrderProducts(order: Order): OrderProductItem[] {
  if (order.productItems) return order.productItems
  const seed = parseInt(order.id, 10) || 0
  const numProducts = Math.min(((seed * 7 + 3) % 4) + 1, order.productsCount)
  let remaining = order.productsCount

  return Array.from({ length: numProducts }, (_, i) => {
    const isLast = i === numProducts - 1
    const qty = isLast ? remaining : Math.max(1, Math.floor(remaining / (numProducts - i)))
    remaining -= qty
    if (remaining < 1) remaining = 1
    const nameIdx = (seed + i * 3) % PRODUCT_NAMES.length
    return {
      id: `${order.id}-prod-${i}`,
      name: PRODUCT_NAMES[nameIdx],
      sku: `SKU-${String(((seed * 13 + i * 7) % 9000) + 1000)}`,
      quantity: Math.max(1, qty),
      unitPrice: `R$ ${(((seed * 17 + i * 31) % 500) + 50).toFixed(2).replace('.', ',')}`,
    }
  })
}

interface SalesTableProps {
  orders: Order[]
  selectedOrders: string[]
  onSelectOrder: (orderId: string) => void
  onSelectAll: () => void
  isFiltered?: boolean
  totalFilteredCount?: number
}

export function SalesTable({ orders, selectedOrders, onSelectOrder, onSelectAll, isFiltered, totalFilteredCount }: SalesTableProps) {
  const allSelected = orders.length > 0 && selectedOrders.length === orders.length
  const someSelected = selectedOrders.length > 0 && selectedOrders.length < orders.length

  return (
    <div className="bg-white rounded-lg border border-neutral-surface-disabled overflow-hidden">
      {/* Bulk Actions Bar */}
      {selectedOrders.length > 0 ? (
        <div className="bg-neutral-surface border-b border-neutral-surface-disabled">
          <div className="flex items-center gap-4 px-4 py-2">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={allSelected}
                indeterminate={someSelected}
                onChange={onSelectAll}
              />
              <span className="text-sm text-neutral-text-high">
                {selectedOrders.length} selecionadas
              </span>
            </div>
            <button className="text-sm text-primary-interactive hover:underline">
              Selecionar todas ({orders.length})
            </button>
            <select className="px-3 py-1.5 text-sm border border-neutral-surface-highlight rounded-lg bg-white text-neutral-text-low focus:outline-none focus:ring-2 focus:ring-primary-interactive">
              <option>Escolher uma ação</option>
              <option>Marcar como enviado</option>
              <option>Imprimir etiquetas</option>
              <option>Arquivar</option>
            </select>
          </div>
        </div>
      ) : null}

      {/* Responsive wrapper */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px]">
          {/* Table Header */}
          {selectedOrders.length === 0 && (
            <thead>
              <tr className="bg-neutral-surface border-b border-neutral-surface-disabled">
                <th className="w-12 px-3 py-2.5 text-left">
                  <div className="flex items-center justify-center">
                    <Checkbox
                      checked={allSelected}
                      indeterminate={someSelected}
                      onChange={onSelectAll}
                    />
                  </div>
                </th>
                <th className="w-[80px] px-3 py-2.5 text-left">
                  <span className="text-xs font-medium text-neutral-text-high">Venda</span>
                </th>
                <th className="px-3 py-2.5 text-left">
                  <span className="text-xs font-medium text-neutral-text-high">Cliente</span>
                </th>
                <th className="w-[100px] px-3 py-2.5 text-left">
                  <span className="text-xs font-medium text-neutral-text-high">Total</span>
                </th>
                <th className="w-[80px] px-3 py-2.5 text-left">
                  <span className="text-xs font-medium text-neutral-text-high">Produtos</span>
                </th>
                <th className="w-[160px] px-3 py-2.5 text-left">
                  <span className="text-xs font-medium text-neutral-text-high">Pagamento</span>
                </th>
                <th className="w-[160px] px-3 py-2.5 text-left">
                  <span className="text-xs font-medium text-neutral-text-high">Envio</span>
                </th>
                <th className="w-12 px-3 py-2.5">
                  <span className="sr-only">Ações</span>
                </th>
              </tr>
            </thead>
          )}

          {/* Table Body */}
          <tbody className="divide-y divide-neutral-surface-disabled">
            {orders.map((order) => (
              <SalesTableRow
                key={`${order.id}-${order.date}`}
                order={order}
                selected={selectedOrders.includes(order.id)}
                onSelect={() => onSelectOrder(order.id)}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Table Footer - shows pagination info when filtered */}
      {isFiltered && totalFilteredCount !== undefined && (
        <div className="flex items-center justify-between px-2 py-2 border-t border-neutral-surface-disabled">
          <span className="text-sm text-neutral-text-low pl-1">
            Mostrando 1-{orders.length} vendas de {totalFilteredCount}
          </span>
          <div className="flex items-center gap-0.5">
            <button className="p-1 rounded text-neutral-text-low hover:text-neutral-text-high transition-colors" aria-label="Página anterior">
              <ChevronLeftIcon className="w-4 h-4" />
            </button>
            <button className="w-[26px] h-[26px] flex items-center justify-center rounded text-sm font-normal text-white" style={{ backgroundColor: 'var(--primary-interactive, #0059D5)' }}>1</button>
            {Array.from({ length: Math.min(4, Math.ceil(totalFilteredCount / orders.length) - 1) }, (_, i) => (
              <button key={i + 2} className="w-[26px] h-[26px] flex items-center justify-center rounded text-sm text-primary-text-low hover:bg-neutral-surface transition-colors">
                {i + 2}
              </button>
            ))}
            <button className="p-1 rounded text-neutral-text-low hover:text-neutral-text-high transition-colors" aria-label="Próxima página">
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

interface SalesTableRowProps {
  order: Order
  selected: boolean
  onSelect: () => void
}

function SalesTableRow({ order, selected, onSelect }: SalesTableRowProps) {
  const [productsOpen, setProductsOpen] = useState(false)
  const products = getOrderProducts(order)

  return (
    <>
      <tr
        className={`
          transition-colors
          ${selected ? 'bg-primary-surface' : 'hover:bg-neutral-surface/50'}
        `}
      >
        {/* Checkbox */}
        <td className="w-12 px-3 py-3">
          <div className="flex items-center justify-center">
            <Checkbox checked={selected} onChange={onSelect} />
          </div>
        </td>

        {/* Order ID */}
        <td className="w-[80px] px-3 py-3">
          <Link variant="primary" className="text-sm font-medium whitespace-nowrap">
            #{order.id}
          </Link>
        </td>

        {/* Customer */}
        <td className="px-3 py-3">
          <Link variant="primary" className="text-sm truncate block max-w-[200px]">
            {order.customerName}
          </Link>
        </td>

        {/* Total */}
        <td className="w-[100px] px-3 py-3">
          <span className="text-sm text-neutral-text-high whitespace-nowrap">{order.total}</span>
        </td>

        {/* Products */}
        <td className="w-[80px] px-3 py-3">
          <button
            onClick={() => setProductsOpen(!productsOpen)}
            className="inline-flex items-center gap-0.5 text-sm text-primary-interactive hover:text-primary-interactive-hover whitespace-nowrap"
          >
            {order.productsCount} unid.
            <ChevronDownIcon
              className={`w-4 h-4 transition-transform duration-200 ${productsOpen ? 'rotate-180' : ''}`}
            />
          </button>
        </td>

        {/* Payment Status */}
        <td className="w-[160px] px-3 py-3">
          <div className="flex flex-col gap-0.5">
            <PaymentStatusTag status={order.paymentStatus} />
            <span className="text-xs text-neutral-text-low truncate max-w-[140px]">{order.paymentMethod}</span>
          </div>
        </td>

        {/* Shipping Status */}
        <td className="w-[160px] px-3 py-3">
          <div className="flex flex-col gap-0.5">
            <ShippingStatusTag status={order.shippingStatus} />
            <span className="text-xs text-neutral-text-low truncate max-w-[140px]">{order.shippingCarrier}</span>
          </div>
        </td>

        {/* Actions Menu */}
        <td className="w-12 px-3 py-3">
          <div className="flex items-center justify-center">
            <button className="p-1.5 rounded-md hover:bg-neutral-surface-disabled text-neutral-text-low">
              <MoreVerticalIcon className="w-4 h-4" />
            </button>
          </div>
        </td>
      </tr>

      {/* Expanded Products Row */}
      {productsOpen && (
        <tr>
          <td colSpan={8} className="px-0 py-0">
            <div className="bg-neutral-surface/60 border-b border-neutral-surface-disabled px-6 py-2.5">
              <div className="space-y-1.5">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-3 py-2 px-3 bg-white rounded-lg"
                  >
                    <div className="w-9 h-9 bg-neutral-surface-disabled rounded-md flex items-center justify-center flex-shrink-0">
                      <BoxPackedIcon className="w-4 h-4 text-neutral-text-low" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link variant="primary" className="text-sm truncate block">
                        {product.name}
                      </Link>
                      <span className="text-[11px] text-neutral-text-low">{product.sku}</span>
                    </div>
                    <span className="text-sm text-neutral-text-low flex-shrink-0">{product.quantity}x</span>
                    <span className="text-sm text-neutral-text-high flex-shrink-0 min-w-[80px] text-right font-medium">
                      {product.unitPrice}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  )
}
