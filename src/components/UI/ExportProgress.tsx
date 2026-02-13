// ============================================
// ExportProgress – Export button / progress UI for modals
// ============================================
//
// Renders different states depending on the current export status:
//   idle       -> "Exportar lista" button
//   validating -> Disabled button with spinner
//   queued     -> "Na fila" badge
//   processing -> Progress bar with cancel
//   completed  -> "Exportar" button
//   failed     -> Error message + retry
//   expired    -> "Expirado" label

import { useState } from 'react'
import type { ExportJob } from '../../types/export'
import {
  DownloadIcon as NimbusDownloadIcon,
  CloseIcon as NimbusCloseIcon,
  RedoIcon,
  CheckCircleIcon as NimbusCheckCircleIcon,
  ExclamationTriangleIcon,
} from '@nimbus-ds/icons'

// ---- Icons ---- //

function DownloadIcon({ className }: { className?: string }) {
  return <NimbusDownloadIcon className={className} />
}

function SpinnerIcon({ className }: { className?: string }) {
  return (
    <svg className={`animate-spin ${className ?? ''}`} viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" opacity="0.25" />
      <path d="M14 8a6 6 0 00-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function CloseSmallIcon({ className }: { className?: string }) {
  return <NimbusCloseIcon className={className} />
}

function RetryIcon({ className }: { className?: string }) {
  return <RedoIcon className={className} />
}

function CheckCircleIcon({ className }: { className?: string }) {
  return <NimbusCheckCircleIcon className={className} />
}

function AlertIcon({ className }: { className?: string }) {
  return <ExclamationTriangleIcon className={className} />
}

// ---- Helpers ---- //

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

// ---- Component ---- //

interface ExportProgressProps {
  /** The current export job for this entity, if any. */
  job: ExportJob | null
  /** Whether a new export can be started (concurrency check). */
  canExport: boolean
  /** Called when the user clicks "Exportar lista". */
  onExport: () => void
  /** Called when the user cancels an active export. */
  onCancel: (jobId: string) => void
  /** Called when the user retries a failed export. */
  onRetry: (jobId: string) => void
  /** Called when the user clicks download. */
  onDownload: (jobId: string) => void
}

export function ExportProgress({
  job,
  canExport,
  onExport,
  onCancel,
  onRetry,
  onDownload,
}: ExportProgressProps) {
  const [error, setError] = useState<string | null>(null)

  // No active job – show default export button
  if (!job || job.status === 'idle' || job.status === 'expired') {
    return (
      <div className="flex flex-col gap-1">
        {error && (
          <div className="flex items-center gap-1.5 px-2 py-1 text-xs text-danger-text-low bg-danger-surface rounded-md">
            <AlertIcon className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="flex-1">{error}</span>
            <button
              onClick={() => setError(null)}
              className="p-0.5 hover:bg-danger-surface-highlight rounded"
            >
              <CloseSmallIcon className="w-3 h-3" />
            </button>
          </div>
        )}
        <button
          onClick={() => {
            setError(null)
            try {
              onExport()
            } catch (err) {
              setError(err instanceof Error ? err.message : 'Erro ao iniciar exportação.')
            }
          }}
          disabled={!canExport}
          className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-white bg-primary-interactive rounded-lg hover:bg-primary-interactive-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <DownloadIcon className="w-4 h-4" />
          Exportar lista
        </button>
      </div>
    )
  }

  // Validating
  if (job.status === 'validating') {
    return (
      <button
        disabled
        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-primary-interactive rounded-lg opacity-70 cursor-not-allowed"
      >
        <SpinnerIcon className="w-4 h-4" />
        Validando...
      </button>
    )
  }

  // Queued
  if (job.status === 'queued') {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-neutral-text-high bg-neutral-surface border border-neutral-surface-highlight rounded-lg">
          <SpinnerIcon className="w-4 h-4 text-primary-interactive" />
          Na fila...
        </div>
        <button
          onClick={() => onCancel(job.id)}
          className="p-1.5 text-neutral-text-low hover:text-neutral-text-high hover:bg-neutral-surface rounded-md transition-colors"
          title="Cancelar"
        >
          <CloseSmallIcon className="w-3.5 h-3.5" />
        </button>
      </div>
    )
  }

  // Processing
  if (job.status === 'processing') {
    return (
      <div className="flex items-center gap-2 min-w-[200px]">
        <div className="flex-1 flex flex-col gap-1">
          <div className="flex items-center justify-between text-xs text-neutral-text-low">
            <span>Exportando...</span>
            <span>{job.progress}%</span>
          </div>
          <div className="w-full h-1.5 bg-neutral-surface-disabled rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300 ease-out"
              style={{
                width: `${job.progress}%`,
                background: 'linear-gradient(90deg, #0050C3, #4629BA)',
              }}
            />
          </div>
        </div>
        <button
          onClick={() => onCancel(job.id)}
          className="p-1.5 text-neutral-text-low hover:text-neutral-text-high hover:bg-neutral-surface rounded-md transition-colors flex-shrink-0"
          title="Cancelar exportação"
        >
          <CloseSmallIcon className="w-3.5 h-3.5" />
        </button>
      </div>
    )
  }

  // Completed
  if (job.status === 'completed') {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={() => onDownload(job.id)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-success-interactive rounded-lg hover:bg-success-interactive-hover transition-colors"
        >
          <CheckCircleIcon className="w-4 h-4" />
          Exportar
          {job.fileSize != null && (
            <span className="text-xs opacity-80">
              ({formatFileSize(job.fileSize)})
            </span>
          )}
        </button>
      </div>
    )
  }

  // Failed
  if (job.status === 'failed') {
    return (
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-1.5 text-xs text-danger-text-low">
          <AlertIcon className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="flex-1 line-clamp-2">{job.error ?? 'Erro na exportação'}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onRetry(job.id)}
            className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-neutral-text-high bg-neutral-surface border border-neutral-interactive rounded-lg hover:bg-neutral-surface-disabled transition-colors"
          >
            <RetryIcon className="w-4 h-4" />
            Tentar novamente
          </button>
          <span className="text-xs text-neutral-text-low">
            Tentativa {job.retryCount + 1}
          </span>
        </div>
      </div>
    )
  }

  return null
}
