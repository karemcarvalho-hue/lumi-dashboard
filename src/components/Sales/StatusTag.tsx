type PaymentStatus = 'received' | 'refused' | 'pending'
type ShippingStatus = 'shipped' | 'to_ship' | 'to_pack' | 'picked_up'

interface PaymentStatusTagProps {
  status: PaymentStatus
}

interface ShippingStatusTagProps {
  status: ShippingStatus
}

const paymentStatusConfig: Record<PaymentStatus, {
  label: string
  bgColor: string
  textColor: string
  borderColor: string
}> = {
  received: {
    label: 'Recebido',
    bgColor: 'bg-success-surface',
    textColor: 'text-success-text-low',
    borderColor: 'border-success-surface-highlight',
  },
  refused: {
    label: 'Recusado',
    bgColor: 'bg-danger-surface',
    textColor: 'text-danger-text-low',
    borderColor: 'border-danger-surface-highlight',
  },
  pending: {
    label: 'Pendente',
    bgColor: 'bg-warning-surface',
    textColor: 'text-warning-text-low',
    borderColor: 'border-warning-surface-highlight',
  },
}

const shippingStatusConfig: Record<ShippingStatus, {
  label: string
  bgColor: string
  textColor: string
  borderColor: string
}> = {
  shipped: {
    label: 'Enviada',
    bgColor: 'bg-success-surface',
    textColor: 'text-success-text-low',
    borderColor: 'border-success-surface-highlight',
  },
  to_ship: {
    label: 'Por enviar',
    bgColor: 'bg-neutral-surface',
    textColor: 'text-neutral-text-low',
    borderColor: 'border-neutral-surface-highlight',
  },
  to_pack: {
    label: 'Por embalar',
    bgColor: 'bg-neutral-surface',
    textColor: 'text-neutral-text-low',
    borderColor: 'border-neutral-surface-highlight',
  },
  picked_up: {
    label: 'Retirada',
    bgColor: 'bg-success-surface',
    textColor: 'text-success-text-low',
    borderColor: 'border-success-surface-highlight',
  },
}

export function PaymentStatusTag({ status }: PaymentStatusTagProps) {
  const config = paymentStatusConfig[status]

  return (
    <span
      className={`
        inline-flex items-center w-fit
        px-2 py-0.5
        text-xs font-medium leading-4
        border rounded-full
        ${config.bgColor}
        ${config.textColor}
        ${config.borderColor}
      `}
    >
      {config.label}
    </span>
  )
}

export function ShippingStatusTag({ status }: ShippingStatusTagProps) {
  const config = shippingStatusConfig[status]

  return (
    <span
      className={`
        inline-flex items-center w-fit
        px-2 py-0.5
        text-xs font-medium leading-4
        border rounded-full
        ${config.bgColor}
        ${config.textColor}
        ${config.borderColor}
      `}
    >
      {config.label}
    </span>
  )
}
