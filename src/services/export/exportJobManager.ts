// ============================================
// Export Job Manager – State machine, concurrency, lifecycle
// ============================================
//
// Singleton that manages every export job from creation through
// completion (or expiration). It enforces limits, controls
// concurrency, handles retries, and coordinates with the
// ExportStore for persistence and the CSVGenerator for file
// generation.

import type {
  ExportJob,
  ExportJobConfig,
  ExportJobEvent,
  ExportLimits,
} from '../../types/export'
import { DEFAULT_EXPORT_LIMITS } from '../../types/export'
import {
  generateCSV,
  buildExportFileName,
  type OrderItemForCSV,
} from './csvGenerator'
import { loadJobs, saveJobs, recoverJobs, cleanExpiredJobs } from './exportStore'
import type { OrderTableColumnId } from '../../components/Chat/OrdersTable'

// ---- Helpers ---- //

/** Generate a pseudo-random ID (good enough for client-side use). */
function generateId(): string {
  return `exp_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

// ---- Types ---- //

export type JobEventListener = (event: ExportJobEvent) => void

export interface DataProvider {
  (): OrderItemForCSV[]
}

// ---- Manager ---- //

export class ExportJobManager {
  private jobs: ExportJob[] = []
  private listeners: Set<JobEventListener> = new Set()
  private limits: ExportLimits
  private abortControllers: Map<string, AbortController> = new Map()
  private expirationTimers: Map<string, ReturnType<typeof setTimeout>> = new Map()
  private timeoutTimers: Map<string, ReturnType<typeof setTimeout>> = new Map()
  private dataProvider: DataProvider

  constructor(dataProvider: DataProvider, limits?: Partial<ExportLimits>) {
    this.limits = { ...DEFAULT_EXPORT_LIMITS, ...limits }
    this.dataProvider = dataProvider

    // Recover persisted jobs from localStorage
    const stored = loadJobs()
    if (stored.length > 0) {
      this.jobs = recoverJobs(stored)
      this.persist()
      // Re-process any jobs that were recovered to 'queued'
      this.processQueue()
    }
  }

  // ---- Public API ---- //

  /** Subscribe to job events. Returns an unsubscribe function. */
  subscribe(listener: JobEventListener): () => void {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  /** Get a snapshot of all jobs (newest first). */
  getJobs(): ExportJob[] {
    return [...this.jobs]
  }

  /** Get a single job by ID. */
  getJob(jobId: string): ExportJob | undefined {
    return this.jobs.find((j) => j.id === jobId)
  }

  /** Get current limits configuration. */
  getLimits(): ExportLimits {
    return { ...this.limits }
  }

  /** How many jobs are currently processing. */
  getActiveCount(): number {
    return this.jobs.filter((j) => j.status === 'processing').length
  }

  /** Whether a new export can be started (concurrency limit not reached). */
  canStartExport(): boolean {
    const active = this.jobs.filter(
      (j) => j.status === 'processing' || j.status === 'queued' || j.status === 'validating',
    ).length
    return active < this.limits.maxConcurrentExports
  }

  /**
   * Request a new export. Validates limits and either starts
   * processing immediately or queues the job.
   *
   * @returns The created job's ID.
   * @throws Error if validation fails (record limit, duplicate, etc.)
   */
  requestExport(config: ExportJobConfig): string {
    const now = Date.now()

    // ---- Validation ---- //

    // Check record limit
    if (config.totalRecords > this.limits.maxRecordsPerExport) {
      throw new Error(
        `O limite máximo de exportação é ${this.limits.maxRecordsPerExport.toLocaleString('pt-BR')} registros. ` +
        `A consulta atual possui ${config.totalRecords.toLocaleString('pt-BR')} registros. ` +
        'Aplique filtros para reduzir o volume.',
      )
    }

    // ---- Create job ---- //

    const job: ExportJob = {
      id: generateId(),
      config,
      status: 'validating',
      progress: 0,
      createdAt: now,
      updatedAt: now,
      retryCount: 0,
    }

    this.jobs.unshift(job)
    this.persist()
    this.emit({ type: 'job_created', job })

    // Simulate brief validation delay then transition
    setTimeout(() => {
      this.transitionToQueued(job.id)
    }, 300)

    return job.id
  }

  /**
   * Cancel an active or queued export job.
   */
  cancelExport(jobId: string): void {
    const job = this.jobs.find((j) => j.id === jobId)
    if (!job) return

    // Abort any in-flight generation
    const controller = this.abortControllers.get(jobId)
    if (controller) {
      controller.abort()
      this.abortControllers.delete(jobId)
    }

    // Clear timers
    this.clearTimers(jobId)

    // Revoke blob URL
    if (job.downloadUrl) {
      try {
        URL.revokeObjectURL(job.downloadUrl)
      } catch {
        // ignore
      }
    }

    this.updateJob(jobId, {
      status: 'failed',
      error: 'Exportação cancelada pelo usuário.',
      progress: 0,
    })
    this.emit({ type: 'job_cancelled', job: this.getJob(jobId)! })

    // Process next in queue
    this.processQueue()
  }

  /**
   * Retry a failed export job.
   */
  retryExport(jobId: string): void {
    const job = this.jobs.find((j) => j.id === jobId)
    if (!job || job.status !== 'failed') return

    if (job.retryCount >= this.limits.maxRetries) {
      this.updateJob(jobId, {
        error: `Número máximo de tentativas (${this.limits.maxRetries}) atingido.`,
      })
      return
    }

    this.updateJob(jobId, {
      status: 'queued',
      progress: 0,
      error: undefined,
      retryCount: job.retryCount + 1,
    })
    this.emit({ type: 'job_updated', job: this.getJob(jobId)! })
    this.processQueue()
  }

  /**
   * Trigger a download for a completed job.
   *
   * Uses a cross-platform strategy:
   *  1. navigator.share() – works on mobile (iOS 15+, Android Chrome)
   *     when sharing files is supported. Lets the user save or share.
   *  2. <a download> click – standard desktop approach (Chrome, Firefox,
   *     Edge). Also works on Android Chrome when share is unavailable.
   *  3. window.open() fallback – last resort for iOS Safari < 15 where
   *     blob URLs can't be downloaded via <a>.
   */
  downloadExport(jobId: string): void {
    const job = this.jobs.find((j) => j.id === jobId)
    if (!job || job.status !== 'completed' || !job.downloadUrl) return

    // Security: only allow blob: URLs created by this app.
    // downloadUrl is never persisted to localStorage (stripped in persist()),
    // so it can only originate from URL.createObjectURL() in startProcessing().
    if (!ExportJobManager.isSafeBlobUrl(job.downloadUrl)) return

    const fileName = job.fileName ?? 'export.csv'
    const safeUrl = job.downloadUrl // validated above

    // Detect iOS (iPhone / iPad / iPod)
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.userAgent.includes('Mac') && 'ontouchend' in document)

    // --- Strategy 1: navigator.share (mobile-native) --- //
    if (isIOS && typeof navigator.share === 'function' && typeof navigator.canShare === 'function') {
      // Fetch the blob from the validated object URL and wrap it in a File
      fetch(safeUrl)
        .then((r) => r.blob())
        .then((blob) => {
          const file = new File([blob], fileName, { type: 'text/csv' })
          const shareData = { files: [file] }
          if (navigator.canShare(shareData)) {
            navigator.share(shareData).catch(() => {
              // User cancelled share sheet – fall through to open
              ExportJobManager.openBlobUrl(safeUrl)
            })
          } else {
            ExportJobManager.openBlobUrl(safeUrl)
          }
        })
        .catch(() => {
          ExportJobManager.openBlobUrl(safeUrl)
        })
      return
    }

    // --- Strategy 2: <a download> click (desktop + Android) --- //
    const a = document.createElement('a')
    a.href = safeUrl
    a.download = fileName
    a.style.display = 'none'
    document.body.appendChild(a)
    a.click()

    // Small delay before cleanup so the browser can start the download
    setTimeout(() => {
      document.body.removeChild(a)
    }, 100)
  }

  /**
   * Validate that a URL is a safe blob: URL created by this origin.
   * Prevents open-redirect or XSS via tampered localStorage data.
   */
  private static isSafeBlobUrl(url: string): boolean {
    if (!url.startsWith('blob:')) return false
    try {
      const parsed = new URL(url)
      // blob: URLs have the origin embedded: blob:https://example.com/uuid
      return parsed.protocol === 'blob:' && parsed.origin === window.location.origin
    } catch {
      return false
    }
  }

  /**
   * Fallback: open a validated blob URL in a new tab (iOS Safari < 15).
   */
  private static openBlobUrl(url: string): void {
    // Double-check safety before opening
    if (!ExportJobManager.isSafeBlobUrl(url)) return
    window.open(url, '_blank')
  }

  /**
   * Remove completed/expired/failed jobs from the list.
   */
  clearCompleted(): void {
    const removable = this.jobs.filter(
      (j) => j.status === 'completed' || j.status === 'expired' || j.status === 'failed',
    )
    for (const job of removable) {
      if (job.downloadUrl) {
        try {
          URL.revokeObjectURL(job.downloadUrl)
        } catch {
          // ignore
        }
      }
      this.clearTimers(job.id)
    }

    this.jobs = this.jobs.filter(
      (j) => j.status !== 'completed' && j.status !== 'expired' && j.status !== 'failed',
    )
    this.persist()
  }

  /**
   * Clean up all resources (call when unmounting the provider).
   */
  destroy(): void {
    for (const controller of this.abortControllers.values()) {
      controller.abort()
    }
    this.abortControllers.clear()
    for (const timer of this.expirationTimers.values()) {
      clearTimeout(timer)
    }
    this.expirationTimers.clear()
    for (const timer of this.timeoutTimers.values()) {
      clearTimeout(timer)
    }
    this.timeoutTimers.clear()
    this.listeners.clear()
  }

  // ---- Internal ---- //

  private transitionToQueued(jobId: string): void {
    const job = this.jobs.find((j) => j.id === jobId)
    if (!job || job.status !== 'validating') return

    this.updateJob(jobId, { status: 'queued' })
    this.emit({ type: 'job_updated', job: this.getJob(jobId)! })
    this.processQueue()
  }

  /**
   * Process the next queued job if there is a free slot.
   */
  private processQueue(): void {
    const processingCount = this.jobs.filter((j) => j.status === 'processing').length
    if (processingCount >= this.limits.maxConcurrentExports) return

    const nextQueued = this.jobs.find((j) => j.status === 'queued')
    if (!nextQueued) return

    this.startProcessing(nextQueued.id)
  }

  /**
   * Begin CSV generation for a job.
   */
  private async startProcessing(jobId: string): Promise<void> {
    const job = this.jobs.find((j) => j.id === jobId)
    if (!job) return

    // Create abort controller for cancellation
    const abortController = new AbortController()
    this.abortControllers.set(jobId, abortController)

    // Set a timeout for the job (3 minutes to accommodate longer simulations)
    const timeoutMs = 180_000 // 180 seconds
    const timeoutTimer = setTimeout(() => {
      const currentJob = this.getJob(jobId)
      if (currentJob && currentJob.status === 'processing') {
        abortController.abort()
        this.updateJob(jobId, {
          status: 'failed',
          error: 'Exportação excedeu o tempo limite. Tente novamente com menos registros.',
        })
        this.emit({ type: 'job_failed', job: this.getJob(jobId)! })
        this.abortControllers.delete(jobId)
        this.processQueue()
      }
    }, timeoutMs)
    this.timeoutTimers.set(jobId, timeoutTimer)

    // Transition to processing
    this.updateJob(jobId, { status: 'processing', progress: 0 })
    this.emit({ type: 'job_updated', job: this.getJob(jobId)! })

    try {
      // Get data from provider
      const allData = this.dataProvider()

      // Check for simulated random failure (5% chance for demonstration)
      if (Math.random() < 0.05) {
        throw new Error('Erro simulado no processamento. Tente novamente.')
      }

      // Determine simulated delay per chunk based on dataset size.
      // Small datasets (< syncThreshold): no delay (feels instant).
      // Large datasets: 750ms per chunk to simulate realistic backend processing.
      // With CHUNK_SIZE=25 and 1000 rows → 40 chunks × 750ms ≈ 30 seconds.
      const isLarge = allData.length > this.limits.syncThreshold
      const chunkDelay = isLarge ? 750 : 0

      // Generate CSV
      const result = await generateCSV({
        data: allData,
        columns: job.config.columns as OrderTableColumnId[],
        onProgress: (progress) => {
          this.updateJob(jobId, { progress })
          this.emit({ type: 'job_updated', job: this.getJob(jobId)! })
        },
        signal: abortController.signal,
        simulatedChunkDelayMs: chunkDelay,
      })

      // Clean up abort controller and timeout
      this.abortControllers.delete(jobId)
      this.clearTimer(jobId, 'timeout')

      // Create download URL
      const downloadUrl = URL.createObjectURL(result.blob)
      const fileName = buildExportFileName(job.config.entityType)

      this.updateJob(jobId, {
        status: 'completed',
        progress: 100,
        completedAt: Date.now(),
        downloadUrl,
        fileName,
        fileSize: result.fileSize,
      })
      this.emit({ type: 'job_completed', job: this.getJob(jobId)! })

      // Schedule expiration
      this.scheduleExpiration(jobId)

      // Process next in queue
      this.processQueue()
    } catch (err) {
      this.abortControllers.delete(jobId)
      this.clearTimer(jobId, 'timeout')

      // Don't overwrite if already set to failed (e.g. by cancel or timeout)
      const currentJob = this.getJob(jobId)
      if (currentJob && currentJob.status === 'processing') {
        const message =
          err instanceof DOMException && err.name === 'AbortError'
            ? 'Exportação cancelada.'
            : err instanceof Error
              ? err.message
              : 'Erro desconhecido durante a exportação.'

        this.updateJob(jobId, {
          status: 'failed',
          error: message,
          progress: 0,
        })
        this.emit({ type: 'job_failed', job: this.getJob(jobId)! })
      }

      this.processQueue()
    }
  }

  /**
   * Schedule a completed job to expire after the configured TTL.
   */
  private scheduleExpiration(jobId: string): void {
    const ttlMs = this.limits.fileTTLSeconds * 1000
    const timer = setTimeout(() => {
      const job = this.getJob(jobId)
      if (job && job.status === 'completed') {
        if (job.downloadUrl) {
          try {
            URL.revokeObjectURL(job.downloadUrl)
          } catch {
            // ignore
          }
        }
        this.updateJob(jobId, {
          status: 'expired',
          downloadUrl: undefined,
        })
        this.emit({ type: 'job_expired', job: this.getJob(jobId)! })
      }
    }, ttlMs)
    this.expirationTimers.set(jobId, timer)
  }

  /**
   * Update a job's fields and persist.
   */
  private updateJob(jobId: string, updates: Partial<ExportJob>): void {
    this.jobs = this.jobs.map((j) =>
      j.id === jobId ? { ...j, ...updates, updatedAt: Date.now() } : j,
    )
    this.persist()
  }

  /**
   * Persist current jobs to localStorage.
   */
  private persist(): void {
    // Clean expired before saving
    this.jobs = cleanExpiredJobs(this.jobs, this.limits.fileTTLSeconds)
    // Strip downloadUrl before persisting (blob URLs are session-scoped)
    const serializable = this.jobs.map((j) => ({
      ...j,
      downloadUrl: undefined,
    }))
    saveJobs(serializable)
  }

  /**
   * Emit an event to all listeners.
   */
  private emit(event: ExportJobEvent): void {
    for (const listener of this.listeners) {
      try {
        listener(event)
      } catch {
        // Don't let a broken listener crash the manager
      }
    }
  }

  /**
   * Clear a specific timer for a job.
   */
  private clearTimer(jobId: string, type: 'expiration' | 'timeout'): void {
    const map = type === 'expiration' ? this.expirationTimers : this.timeoutTimers
    const timer = map.get(jobId)
    if (timer) {
      clearTimeout(timer)
      map.delete(jobId)
    }
  }

  /**
   * Clear all timers for a job.
   */
  private clearTimers(jobId: string): void {
    this.clearTimer(jobId, 'expiration')
    this.clearTimer(jobId, 'timeout')
  }
}
