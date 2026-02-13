// ============================================
// useExport – React hook for export functionality
// ============================================

import { useContext } from 'react'
import { ExportContext, type ExportContextValue } from '../context/ExportContext'

/**
 * Hook to access the export system from any component.
 *
 * Must be used within an <ExportProvider>.
 *
 * @example
 * ```tsx
 * function ExportButton() {
 *   const { startExport, canExport } = useExport()
 *
 *   const handleClick = () => {
 *     try {
 *       startExport({
 *         entityType: 'orders',
 *         columns: ['venda', 'customer', 'total'],
 *         totalRecords: 1000,
 *         format: 'csv',
 *       })
 *     } catch (err) {
 *       alert(err.message)
 *     }
 *   }
 *
 *   return (
 *     <button onClick={handleClick} disabled={!canExport}>
 *       Exportar
 *     </button>
 *   )
 * }
 * ```
 */
export function useExport(): ExportContextValue {
  const context = useContext(ExportContext)
  if (!context) {
    throw new Error(
      'useExport must be used within an <ExportProvider>. ' +
      'Wrap your app (or the relevant subtree) with <ExportProvider>.',
    )
  }
  return context
}
