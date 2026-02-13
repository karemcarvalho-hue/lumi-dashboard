// ============================================
// Export Service – Public façade (mock)
// ============================================
//
// This module is the ONLY layer that would need to change when
// connecting to a real backend. Today it delegates to the
// ExportJobManager which runs everything client-side.
//
// To switch to a real backend:
//   1. Replace requestExport / getExportStatus / etc. with fetch() calls
//   2. The rest of the system (context, hooks, UI) stays the same

import type { ExportJob, ExportJobConfig } from '../../types/export'
import { ExportJobManager, type DataProvider, type JobEventListener } from './exportJobManager'

/**
 * ExportService is the singleton façade consumed by the React layer.
 * It wraps ExportJobManager and exposes a clean, promise-based API.
 */
export class ExportService {
  private manager: ExportJobManager

  constructor(dataProvider: DataProvider) {
    this.manager = new ExportJobManager(dataProvider)
  }

  // ---- Queries ---- //

  /** Get all jobs (newest first). */
  getJobs(): ExportJob[] {
    return this.manager.getJobs()
  }

  /** Get a single job by ID. */
  getJob(jobId: string): ExportJob | undefined {
    return this.manager.getJob(jobId)
  }

  /** Whether another export can be started right now. */
  canExport(): boolean {
    return this.manager.canStartExport()
  }

  /** Number of jobs currently processing. */
  getActiveCount(): number {
    return this.manager.getActiveCount()
  }

  /** Get the most recent export for a given entity type (if any). */
  getLatestForEntity(entityType: string): ExportJob | undefined {
    return this.manager
      .getJobs()
      .find((j) => j.config.entityType === entityType)
  }

  // ---- Commands ---- //

  /**
   * Request a new export.
   *
   * In a real implementation this would POST to the backend:
   * ```
   * const res = await fetch('/api/exports', {
   *   method: 'POST',
   *   body: JSON.stringify(config),
   * })
   * const { jobId } = await res.json()
   * return jobId
   * ```
   *
   * @returns The job ID.
   * @throws Error with a user-facing message if validation fails.
   */
  requestExport(config: ExportJobConfig): string {
    return this.manager.requestExport(config)
  }

  /** Cancel an active or queued export. */
  cancelExport(jobId: string): void {
    this.manager.cancelExport(jobId)
  }

  /** Retry a failed export. */
  retryExport(jobId: string): void {
    this.manager.retryExport(jobId)
  }

  /** Trigger browser download for a completed export. */
  downloadExport(jobId: string): void {
    this.manager.downloadExport(jobId)
  }

  /** Remove completed / expired / failed jobs from the list. */
  clearCompleted(): void {
    this.manager.clearCompleted()
  }

  // ---- Events ---- //

  /** Subscribe to job lifecycle events. Returns unsubscribe function. */
  subscribe(listener: JobEventListener): () => void {
    return this.manager.subscribe(listener)
  }

  // ---- Lifecycle ---- //

  /** Clean up all resources. Call when the app unmounts. */
  destroy(): void {
    this.manager.destroy()
  }
}

// ---- Singleton management ---- //

let instance: ExportService | null = null

/**
 * Get or create the singleton ExportService.
 * The dataProvider supplies the current dataset for CSV generation.
 */
export function getExportService(dataProvider: DataProvider): ExportService {
  if (!instance) {
    instance = new ExportService(dataProvider)
  }
  return instance
}

/**
 * Reset the singleton (useful for testing or hot-reload).
 */
export function resetExportService(): void {
  if (instance) {
    instance.destroy()
    instance = null
  }
}
