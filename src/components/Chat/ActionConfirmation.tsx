import { ExecutableAction, actionConfigs } from './types'
import { CheckIcon as NimbusCheckIcon, InfoCircleIcon } from '@nimbus-ds/icons'

interface ActionConfirmationProps {
  action: ExecutableAction
  orderCount: number
  onConfirm: () => void
  onCancel: () => void
}

function CheckIcon({ className }: { className?: string }) {
  return <NimbusCheckIcon className={className} />
}

function InfoIcon({ className }: { className?: string }) {
  return <InfoCircleIcon className={className} />
}

export function ActionConfirmation({ 
  action, 
  orderCount, 
  onConfirm, 
  onCancel 
}: ActionConfirmationProps) {
  const config = actionConfigs[action]
  
  const orderText = orderCount === 1 ? '1 pedido' : `${orderCount} pedidos`

  return (
    <div className="bg-white rounded-lg border border-neutral-surface-disabled shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-neutral-surface-disabled bg-neutral-surface/30">
        <div className="flex items-center gap-2">
          <InfoIcon className="w-5 h-5 text-primary-interactive" />
          <span className="text-sm font-semibold text-neutral-text-high">
            {config.title}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-3 space-y-3">
        <p className="text-sm text-neutral-text-high">
          {config.description.replace('os pedidos', orderText).replace('o pagamento', `o pagamento de ${orderText}`)}
        </p>
        
        {/* Impact warning */}
        <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-lg border border-amber-200">
          <InfoIcon className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800">
            {config.impact}
          </p>
        </div>

        <p className="text-sm text-neutral-text-low">
          Essa ação será aplicada a <strong>{orderText}</strong>.
        </p>
      </div>

      {/* Actions */}
      <div className="px-4 py-3 border-t border-neutral-surface-disabled bg-neutral-surface/30 flex items-center justify-end gap-2">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-neutral-text-high bg-white border border-neutral-surface-disabled rounded-lg hover:bg-neutral-surface transition-colors"
        >
          {config.cancelLabel}
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors flex items-center gap-2"
          style={{
            background: 'linear-gradient(17deg, #0050C3 28%, #4629BA 49%, #D8446E 83%)'
          }}
        >
          <CheckIcon className="w-4 h-4" />
          {config.confirmLabel}
        </button>
      </div>
    </div>
  )
}

// Inline confirmation for chat messages (smaller version)
interface InlineConfirmationProps {
  message: string
  onConfirm: () => void
  onCancel: () => void
}

export function InlineConfirmation({ 
  message, 
  onConfirm, 
  onCancel 
}: InlineConfirmationProps) {
  return (
    <div className="mt-3 p-3 bg-neutral-surface rounded-lg border border-neutral-surface-disabled">
      <p className="text-sm text-neutral-text-high mb-3">{message}</p>
      <div className="flex items-center gap-2">
        <button
          onClick={onConfirm}
          className="px-3 py-1.5 text-sm font-medium text-white rounded-md transition-colors"
          style={{
            background: 'linear-gradient(17deg, #0050C3 28%, #4629BA 49%, #D8446E 83%)'
          }}
        >
          Confirmar
        </button>
        <button
          onClick={onCancel}
          className="px-3 py-1.5 text-sm font-medium text-neutral-text-high bg-white border border-neutral-surface-disabled rounded-md hover:bg-neutral-surface transition-colors"
        >
          Cancelar
        </button>
      </div>
    </div>
  )
}
