// ============================================
// CSV Generator
// ============================================
//
// Generates CSV files from order data with:
// - BOM UTF-8 prefix for Excel compatibility
// - Proper field escaping (RFC 4180)
// - Human-readable status labels (pt-BR)
// - Chunked processing to avoid blocking the UI
// - Progress reporting via callback

import type { ProgressCallback } from '../../types/export'
import type { OrderTableColumnId } from '../../components/Chat/OrdersTable'

// ---- Status label mappings (pt-BR) ---- //

const PAYMENT_STATUS_LABELS: Record<string, string> = {
  received: 'Recebido',
  pending: 'Pendente',
  refused: 'Recusado',
}

const SHIPPING_STATUS_LABELS: Record<string, string> = {
  to_pack: 'Por embalar',
  to_ship: 'Por enviar',
  shipped: 'Enviada',
  archived: 'Arquivado',
  cancelled: 'Cancelado',
}

// ---- Column header mappings ---- //

const COLUMN_HEADERS: Record<string, string> = {
  venda: 'Venda',
  date: 'Data',
  time: 'Hora',
  customer: 'Cliente',
  email: 'E-mail',
  phone: 'Telefone',
  total: 'Total',
  products: 'Produtos',
  payment: 'Pagamento',
  paymentMethod: 'Forma de pagamento',
  shipping: 'Envio',
  shippingCarrier: 'Transportadora',
}

// ---- Order item interface (matches OrdersTable.tsx) ---- //

export interface OrderItemForCSV {
  id: string
  date: string
  time: string
  customer: string
  email: string
  phone: string
  total: string
  products: string
  payment: {
    status: string
    method: string
  }
  shipping: {
    status: string
    carrier: string
  }
}

/**
 * Escape a CSV field value according to RFC 4180.
 * Fields containing commas, double-quotes, or newlines are wrapped in
 * double-quotes, with any existing double-quotes doubled.
 */
function escapeCSVField(value: string): string {
  if (
    value.includes(',') ||
    value.includes('"') ||
    value.includes('\n') ||
    value.includes('\r')
  ) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

/**
 * Extract the plain-text value from an order for a given column ID.
 */
function getCellValue(order: OrderItemForCSV, columnId: string): string {
  switch (columnId) {
    case 'venda':
      return `#${order.id}`
    case 'date':
      return order.date
    case 'time':
      return order.time
    case 'customer':
      return order.customer
    case 'email':
      return order.email
    case 'phone':
      return order.phone
    case 'total':
      return order.total
    case 'products':
      return order.products
    case 'payment':
      return PAYMENT_STATUS_LABELS[order.payment.status] ?? order.payment.status
    case 'paymentMethod':
      return order.payment.method
    case 'shipping':
      return SHIPPING_STATUS_LABELS[order.shipping.status] ?? order.shipping.status
    case 'shippingCarrier':
      return order.shipping.carrier
    default:
      return ''
  }
}

/**
 * How many rows to process before yielding to the main thread.
 * Smaller chunks = more granular progress updates + smoother UI.
 * With 1000 rows and CHUNK_SIZE=25, we get 40 progress ticks.
 */
const CHUNK_SIZE = 25

/**
 * Wait for a given number of milliseconds.
 * Used both to yield to the main thread and to simulate realistic
 * processing time in prototype mode.
 */
function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export interface CSVGeneratorOptions {
  /** The data rows to export. */
  data: OrderItemForCSV[]
  /** Which columns to include, in order. The 'actions' column is always excluded. */
  columns: OrderTableColumnId[]
  /** Optional callback invoked with progress 0-100. */
  onProgress?: ProgressCallback
  /** AbortSignal to allow cancellation mid-generation. */
  signal?: AbortSignal
  /**
   * Artificial delay in ms added per chunk to simulate realistic
   * backend processing time. Set to 0 for maximum speed.
   * Default: 300ms (good for prototype demos).
   */
  simulatedChunkDelayMs?: number
}

export interface CSVGeneratorResult {
  /** The generated CSV as a Blob (BOM-prefixed UTF-8). */
  blob: Blob
  /** File size in bytes. */
  fileSize: number
  /** Number of data rows in the CSV (excluding header). */
  rowCount: number
}

/**
 * Generate a CSV Blob from order data.
 *
 * Processing is chunked: every CHUNK_SIZE rows we yield to the main
 * thread so the UI remains responsive. Progress is reported via the
 * onProgress callback.
 *
 * @throws {DOMException} If the operation is aborted via the signal.
 */
export async function generateCSV(
  options: CSVGeneratorOptions,
): Promise<CSVGeneratorResult> {
  const { data, columns: rawColumns, onProgress, signal, simulatedChunkDelayMs = 300 } = options

  // Filter out the 'actions' column – it has no data meaning
  const columns = rawColumns.filter((c) => c !== 'actions')

  // ---- Header row ---- //
  const headerRow = columns
    .map((col) => escapeCSVField(COLUMN_HEADERS[col] ?? col))
    .join(',')

  // Collect all CSV lines; start with the header
  const lines: string[] = [headerRow]
  const totalRows = data.length

  // ---- Data rows (chunked) ---- //
  for (let i = 0; i < totalRows; i++) {
    // Check for cancellation
    if (signal?.aborted) {
      throw new DOMException('Export cancelled', 'AbortError')
    }

    const order = data[i]
    const row = columns
      .map((col) => escapeCSVField(getCellValue(order, col)))
      .join(',')
    lines.push(row)

    // Yield, report progress, and simulate delay at chunk boundaries
    if ((i + 1) % CHUNK_SIZE === 0 || i === totalRows - 1) {
      const progress = Math.round(((i + 1) / totalRows) * 100)
      onProgress?.(progress)
      // Yield to main thread + simulated delay for visible progress
      if (i < totalRows - 1) {
        await wait(simulatedChunkDelayMs)
      }
    }
  }

  // ---- Build final CSV with BOM ---- //
  const BOM = '\uFEFF'
  const csvContent = BOM + lines.join('\r\n') + '\r\n'
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' })

  return {
    blob,
    fileSize: blob.size,
    rowCount: totalRows,
  }
}

/**
 * Build a human-readable filename for the export.
 * Format: `pedidos_YYYY-MM-DD_HHmmss.csv`
 */
export function buildExportFileName(entityType: string): string {
  const now = new Date()
  const date = now.toISOString().slice(0, 10) // YYYY-MM-DD
  const time = now.toTimeString().slice(0, 8).replace(/:/g, '') // HHmmss
  return `${entityType}_${date}_${time}.csv`
}
