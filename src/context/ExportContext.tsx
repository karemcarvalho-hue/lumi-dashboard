// ============================================
// Export Context – Global React state for exports
// ============================================

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import type {
  ExportJob,
  ExportJobConfig,
  ExportJobEvent,
  ExportNotification,
} from '../types/export'
import { ExportService, getExportService } from '../services/export/exportService'
import type { DataProvider } from '../services/export/exportJobManager'

// ---- Context value shape ---- //

export interface ExportContextValue {
  /** All export jobs, newest first. */
  jobs: ExportJob[]
  /** Pending notifications (toasts). */
  notifications: ExportNotification[]
  /** Whether any export is currently processing or queued. */
  isExporting: boolean
  /** Whether the user can start a new export (concurrency limit). */
  canExport: boolean

  /** Start a new export. Throws on validation error. */
  startExport: (config: ExportJobConfig) => string
  /** Cancel an active or queued export. */
  cancelExport: (jobId: string) => void
  /** Retry a failed export. */
  retryExport: (jobId: string) => void
  /** Download a completed export. */
  downloadExport: (jobId: string) => void
  /** Clear completed / failed / expired jobs. */
  clearCompleted: () => void
  /** Dismiss a notification. */
  dismissNotification: (notificationId: string) => void
}

export const ExportContext = createContext<ExportContextValue | null>(null)

// ---- Notification helpers ---- //

function generateNotificationId(): string {
  return `notif_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
}

function createNotification(
  event: ExportJobEvent,
): ExportNotification | null {
  const { type, job } = event

  switch (type) {
    case 'job_created':
      return {
        id: generateNotificationId(),
        jobId: job.id,
        type: 'info',
        title: 'Exportação iniciada',
        message: `Preparando exportação de ${job.config.totalRecords.toLocaleString('pt-BR')} registros...`,
        timestamp: Date.now(),
        autoDismissMs: 4000,
      }

    case 'job_completed':
      return {
        id: generateNotificationId(),
        jobId: job.id,
        type: 'success',
        title: 'Exportação concluída',
        message: job.fileName
          ? `O arquivo ${job.fileName} está pronto para download.`
          : 'Arquivo pronto para download.',
        timestamp: Date.now(),
        hasDownload: true,
        autoDismissMs: 8000,
      }

    case 'job_failed':
      return {
        id: generateNotificationId(),
        jobId: job.id,
        type: 'error',
        title: 'Erro na exportação',
        message: job.error ?? 'Ocorreu um erro inesperado.',
        timestamp: Date.now(),
        autoDismissMs: 8000,
      }

    case 'job_expired':
      return {
        id: generateNotificationId(),
        jobId: job.id,
        type: 'info',
        title: 'Exportação expirada',
        message: 'O link de download expirou. Exporte novamente se necessário.',
        timestamp: Date.now(),
        autoDismissMs: 6000,
      }

    case 'job_cancelled':
      return {
        id: generateNotificationId(),
        jobId: job.id,
        type: 'info',
        title: 'Exportação cancelada',
        message: 'A exportação foi cancelada.',
        timestamp: Date.now(),
        autoDismissMs: 4000,
      }

    default:
      return null
  }
}

// ---- Provider ---- //

interface ExportProviderProps {
  children: ReactNode
  /** Function that returns the current dataset for CSV generation. */
  dataProvider: DataProvider
}

export function ExportProvider({ children, dataProvider }: ExportProviderProps) {
  const serviceRef = useRef<ExportService | null>(null)

  // Initialize service once
  if (!serviceRef.current) {
    serviceRef.current = getExportService(dataProvider)
  }
  const service = serviceRef.current

  const [jobs, setJobs] = useState<ExportJob[]>(() => service.getJobs())
  const [notifications, setNotifications] = useState<ExportNotification[]>([])

  // Auto-dismiss timers
  const dismissTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())

  const scheduleDismiss = useCallback((notification: ExportNotification) => {
    if (notification.autoDismissMs > 0) {
      const timer = setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== notification.id))
        dismissTimers.current.delete(notification.id)
      }, notification.autoDismissMs)
      dismissTimers.current.set(notification.id, timer)
    }
  }, [])

  // Subscribe to job events
  useEffect(() => {
    const unsubscribe = service.subscribe((event: ExportJobEvent) => {
      // Update jobs list
      setJobs(service.getJobs())

      // Create notification (skip 'job_updated' – it's just progress)
      if (event.type !== 'job_updated') {
        const notification = createNotification(event)
        if (notification) {
          setNotifications((prev) => [notification, ...prev].slice(0, 10))
          scheduleDismiss(notification)
        }
      }
    })

    return () => {
      unsubscribe()
    }
  }, [service, scheduleDismiss])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      for (const timer of dismissTimers.current.values()) {
        clearTimeout(timer)
      }
    }
  }, [])

  // ---- Actions ---- //

  const startExport = useCallback(
    (config: ExportJobConfig): string => {
      const jobId = service.requestExport(config)
      setJobs(service.getJobs())
      return jobId
    },
    [service],
  )

  const cancelExport = useCallback(
    (jobId: string) => {
      service.cancelExport(jobId)
      setJobs(service.getJobs())
    },
    [service],
  )

  const retryExport = useCallback(
    (jobId: string) => {
      service.retryExport(jobId)
      setJobs(service.getJobs())
    },
    [service],
  )

  const downloadExport = useCallback(
    (jobId: string) => {
      service.downloadExport(jobId)
    },
    [service],
  )

  const clearCompleted = useCallback(() => {
    service.clearCompleted()
    setJobs(service.getJobs())
  }, [service])

  const dismissNotification = useCallback((notificationId: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId))
    const timer = dismissTimers.current.get(notificationId)
    if (timer) {
      clearTimeout(timer)
      dismissTimers.current.delete(notificationId)
    }
  }, [])

  // ---- Derived state ---- //

  const isExporting = useMemo(
    () =>
      jobs.some(
        (j) =>
          j.status === 'processing' ||
          j.status === 'queued' ||
          j.status === 'validating',
      ),
    [jobs],
  )

  const canExport = useMemo(() => service.canExport(), [jobs, service])

  // ---- Context value ---- //

  const value = useMemo<ExportContextValue>(
    () => ({
      jobs,
      notifications,
      isExporting,
      canExport,
      startExport,
      cancelExport,
      retryExport,
      downloadExport,
      clearCompleted,
      dismissNotification,
    }),
    [
      jobs,
      notifications,
      isExporting,
      canExport,
      startExport,
      cancelExport,
      retryExport,
      downloadExport,
      clearCompleted,
      dismissNotification,
    ],
  )

  return (
    <ExportContext.Provider value={value}>{children}</ExportContext.Provider>
  )
}
