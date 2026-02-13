// ============================================
// Export Store – localStorage persistence
// ============================================
//
// Persists export job metadata so the user can recover status
// after navigating away, refreshing, or closing the modal.
//
// Blob URLs are NOT persisted (they are session-scoped), so jobs
// that were 'completed' will have their downloadUrl stripped on load.
// Jobs that were 'processing' are reset to 'queued' on recovery.

import type { ExportJob } from '../../types/export'

const STORAGE_KEY = 'lumi_export_jobs'

/** Maximum number of historical jobs to keep in storage. */
const MAX_STORED_JOBS = 50

/**
 * Read all persisted jobs from localStorage.
 * Returns an empty array if nothing is stored or on parse error.
 */
export function loadJobs(): ExportJob[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const jobs: ExportJob[] = JSON.parse(raw)
    if (!Array.isArray(jobs)) return []
    return jobs
  } catch {
    return []
  }
}

/**
 * Persist the given jobs array to localStorage.
 * Trims to MAX_STORED_JOBS (most recent first) to avoid unbounded growth.
 */
export function saveJobs(jobs: ExportJob[]): void {
  try {
    const trimmed = jobs.slice(0, MAX_STORED_JOBS)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed))
  } catch {
    // Storage full or unavailable – silently ignore
  }
}

/**
 * Recover jobs after a page reload.
 *
 * - Jobs in 'processing' are reset to 'queued' (the generation was
 *   interrupted and must restart).
 * - Jobs in 'completed' lose their downloadUrl (blob URLs don't survive
 *   reloads) and are marked as 'expired'.
 * - Jobs in 'validating' are reset to 'failed' with a descriptive error.
 * - All other statuses are kept as-is.
 */
export function recoverJobs(jobs: ExportJob[]): ExportJob[] {
  const now = Date.now()
  return jobs.map((job) => {
    switch (job.status) {
      case 'processing':
        return {
          ...job,
          status: 'queued' as const,
          progress: 0,
          updatedAt: now,
          downloadUrl: undefined,
        }
      case 'validating':
        return {
          ...job,
          status: 'failed' as const,
          error: 'Exportação interrompida. Tente novamente.',
          updatedAt: now,
          downloadUrl: undefined,
        }
      case 'completed':
        // Blob URLs don't survive page reloads
        if (job.downloadUrl) {
          return {
            ...job,
            status: 'expired' as const,
            downloadUrl: undefined,
            updatedAt: now,
          }
        }
        return job
      default:
        return job
    }
  })
}

/**
 * Remove expired jobs whose TTL has passed and revoke their blob URLs.
 */
export function cleanExpiredJobs(
  jobs: ExportJob[],
  ttlSeconds: number,
): ExportJob[] {
  const now = Date.now()
  const ttlMs = ttlSeconds * 1000

  return jobs.filter((job) => {
    if (job.status === 'expired') {
      // Keep expired jobs for a while so the user can see the history
      const expiredAge = now - job.updatedAt
      return expiredAge < ttlMs // remove once truly old
    }

    if (job.status === 'completed' && job.completedAt) {
      const age = now - job.completedAt
      if (age > ttlMs) {
        // Revoke the blob URL to free memory
        if (job.downloadUrl) {
          try {
            URL.revokeObjectURL(job.downloadUrl)
          } catch {
            // ignore
          }
        }
        return false
      }
    }

    return true
  })
}

/**
 * Remove a single job by ID from the stored list.
 */
export function removeJob(jobId: string): void {
  const jobs = loadJobs().filter((j) => j.id !== jobId)
  saveJobs(jobs)
}

/**
 * Clear all stored jobs (e.g. on logout).
 */
export function clearAllJobs(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}
