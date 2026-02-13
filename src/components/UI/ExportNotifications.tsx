// ============================================
// ExportNotifications – Toast notification system
// ============================================
//
// Fixed position toasts (bottom-right) that notify the user about
// export lifecycle events. Mounted at the App level so they persist
// across page navigations.

import { useEffect, useRef } from 'react'
import { useExport } from '../../hooks/useExport'
import type { ExportNotification } from '../../types/export'
import {
  CloseIcon as NimbusCloseIcon,
  InfoCircleIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  DownloadIcon as NimbusDownloadIcon,
} from '@nimbus-ds/icons'

// ---- Icons ---- //

function CloseSmallIcon({ className }: { className?: string }) {
  return <NimbusCloseIcon className={className} />
}

function InfoIcon({ className }: { className?: string }) {
  return <InfoCircleIcon className={className} />
}

function SuccessIcon({ className }: { className?: string }) {
  return <CheckCircleIcon className={className} />
}

function ErrorIcon({ className }: { className?: string }) {
  return <ExclamationCircleIcon className={className} />
}

function DownloadSmallIcon({ className }: { className?: string }) {
  return <NimbusDownloadIcon className={className} />
}

// ---- Style config per notification type ---- //

const NOTIFICATION_STYLES: Record<
  ExportNotification['type'],
  { icon: typeof InfoIcon; iconColor: string; borderColor: string; bgColor: string }
> = {
  info: {
    icon: InfoIcon,
    iconColor: 'text-primary-interactive',
    borderColor: 'border-primary-surface-highlight',
    bgColor: 'bg-white',
  },
  success: {
    icon: SuccessIcon,
    iconColor: 'text-success-interactive',
    borderColor: 'border-success-surface-highlight',
    bgColor: 'bg-white',
  },
  error: {
    icon: ErrorIcon,
    iconColor: 'text-danger-interactive',
    borderColor: 'border-danger-surface-highlight',
    bgColor: 'bg-white',
  },
}

// ---- Single toast component ---- //

function Toast({
  notification,
  onDismiss,
  onDownload,
}: {
  notification: ExportNotification
  onDismiss: () => void
  onDownload?: () => void
}) {
  const toastRef = useRef<HTMLDivElement>(null)
  const style = NOTIFICATION_STYLES[notification.type]
  const Icon = style.icon

  // Slide-in animation
  useEffect(() => {
    const el = toastRef.current
    if (el) {
      el.style.opacity = '0'
      el.style.transform = 'translateX(20px)'
      requestAnimationFrame(() => {
        el.style.transition = 'all 300ms ease-out'
        el.style.opacity = '1'
        el.style.transform = 'translateX(0)'
      })
    }
  }, [])

  return (
    <div
      ref={toastRef}
      className={`relative flex gap-2.5 p-3 rounded-lg shadow-lg border ${style.borderColor} ${style.bgColor} max-w-[340px] min-w-[280px]`}
      role="alert"
    >
      {/* Icon */}
      <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${style.iconColor}`} />

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-neutral-text-high leading-5">
          {notification.title}
        </p>
        <p className="text-xs text-neutral-text-low mt-0.5 leading-4">
          {notification.message}
        </p>

        {/* Download action */}
        {notification.hasDownload && onDownload && (
          <button
            onClick={onDownload}
            className="flex items-center gap-1 mt-2 text-xs font-medium text-primary-interactive hover:text-primary-interactive-hover transition-colors"
          >
            <DownloadSmallIcon className="w-3.5 h-3.5" />
            Baixar arquivo
          </button>
        )}
      </div>

      {/* Dismiss button */}
      <button
        onClick={onDismiss}
        className="p-1 text-neutral-text-low hover:text-neutral-text-high rounded transition-colors flex-shrink-0 self-start"
        aria-label="Fechar notificação"
      >
        <CloseSmallIcon className="w-3 h-3" />
      </button>
    </div>
  )
}

// ---- Main component ---- //

export function ExportNotifications() {
  const { notifications, dismissNotification, downloadExport } = useExport()

  if (notifications.length === 0) return null

  return (
    <div
      className="fixed bottom-4 right-4 z-[9999] flex flex-col-reverse gap-2 pointer-events-none"
      aria-live="polite"
    >
      {notifications.map((notification) => (
        <div key={notification.id} className="pointer-events-auto">
          <Toast
            notification={notification}
            onDismiss={() => dismissNotification(notification.id)}
            onDownload={
              notification.hasDownload
                ? () => downloadExport(notification.jobId)
                : undefined
            }
          />
        </div>
      ))}
    </div>
  )
}
