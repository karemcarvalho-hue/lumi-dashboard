// ============================================
// Export System - Type Definitions
// ============================================

/**
 * Possible states for an export job lifecycle.
 *
 * idle        -> No export requested yet
 * validating  -> Checking permissions, limits, duplicates
 * queued      -> Waiting for a processing slot
 * processing  -> CSV generation in progress
 * completed   -> File ready for download
 * failed      -> An error occurred (may be retried)
 * expired     -> Download link is no longer available
 */
export type ExportStatus =
  | 'idle'
  | 'validating'
  | 'queued'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'expired'

/** Supported export file formats (extensible). */
export type ExportFormat = 'csv'

/** Supported entity types that can be exported. */
export type ExportEntityType = 'orders' | 'products' | 'clients'

/**
 * Configuration snapshot captured at the moment the user clicks "Export".
 * This freezes the current table state so the export reflects exactly
 * what the user was seeing.
 */
export interface ExportJobConfig {
  /** The type of entity being exported. */
  entityType: ExportEntityType
  /** Column IDs active at export time – determines CSV headers and cell values. */
  columns: string[]
  /** Active filters (opaque to the export system, passed through to the data source). */
  filters?: Record<string, unknown>
  /** Sort field. */
  sortBy?: string
  /** Sort direction. */
  sortDirection?: 'asc' | 'desc'
  /** Total record count for the current filtered dataset. */
  totalRecords: number
  /** Output format. */
  format: ExportFormat
}

/**
 * Represents a single export job with its full lifecycle state.
 * Persisted to localStorage so the user can recover status after
 * navigating away or refreshing.
 */
export interface ExportJob {
  /** Unique job identifier (UUID-like). */
  id: string
  /** Frozen configuration from the moment of request. */
  config: ExportJobConfig
  /** Current lifecycle status. */
  status: ExportStatus
  /** Progress percentage (0–100). Only meaningful during 'processing'. */
  progress: number
  /** Epoch ms when the job was created. */
  createdAt: number
  /** Epoch ms of the last status change. */
  updatedAt: number
  /** Epoch ms when processing finished (success or failure). */
  completedAt?: number
  /** Human-readable error message when status is 'failed'. */
  error?: string
  /** How many times this job has been retried after failure. */
  retryCount: number
  /**
   * Object URL created via URL.createObjectURL.
   * Only present when status is 'completed'.
   * Revoked automatically when the job expires.
   */
  downloadUrl?: string
  /** Suggested file name for the download. */
  fileName?: string
  /** Generated file size in bytes. */
  fileSize?: number
}

/**
 * Configurable limits that govern the export system behaviour.
 * All values have sensible defaults in the ExportJobManager.
 */
export interface ExportLimits {
  /** Maximum number of records allowed in a single export. */
  maxRecordsPerExport: number
  /** Maximum number of exports that can run simultaneously. */
  maxConcurrentExports: number
  /** Maximum automatic retry attempts for a failed job. */
  maxRetries: number
  /** Seconds before a completed export's download link expires. */
  fileTTLSeconds: number
  /**
   * Record-count threshold below which the export is considered "small"
   * and processed synchronously (no progress bar / queuing).
   */
  syncThreshold: number
}

/** Default limits used when none are provided. */
export const DEFAULT_EXPORT_LIMITS: ExportLimits = {
  maxRecordsPerExport: 50_000,
  maxConcurrentExports: 2,
  maxRetries: 3,
  fileTTLSeconds: 3600, // 1 hour
  syncThreshold: 500,
}

/**
 * Callback signature for progress reporting during CSV generation.
 * @param progress - Value between 0 and 100.
 */
export type ProgressCallback = (progress: number) => void

/**
 * Event emitted by the ExportJobManager whenever a job changes state.
 * Consumed by the ExportContext to update React state.
 */
export interface ExportJobEvent {
  type:
    | 'job_created'
    | 'job_updated'
    | 'job_completed'
    | 'job_failed'
    | 'job_expired'
    | 'job_cancelled'
  job: ExportJob
}

/**
 * Notification to display to the user (toast).
 */
export interface ExportNotification {
  id: string
  jobId: string
  type: 'info' | 'success' | 'error'
  title: string
  message: string
  timestamp: number
  /** Whether the notification includes a download action. */
  hasDownload?: boolean
  /** Auto-dismiss timeout in ms (0 = manual dismiss only). */
  autoDismissMs: number
}
