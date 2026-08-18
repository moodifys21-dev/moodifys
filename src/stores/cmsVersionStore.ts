import { create } from 'zustand'
import { CMSVersion, ScheduledPublication } from '@/types/cmsVersion'
import { HomepageCMSConfig } from '@/types/cms'
import { useCMSStore } from '@/stores/cmsStore'
import {
  fetchVersionHistoryFromSupabase,
  publishHomepageToSupabase,
} from '@/services/cmsService'

interface CMSVersionStoreState {
  versions: CMSVersion[]
  scheduled: ScheduledPublication[]
  isLoading: boolean

  // Actions
  loadVersionsFromSupabase: () => Promise<void>
  createVersionSnapshot: (
    summary: string,
    authorName?: string,
    customSnapshot?: HomepageCMSConfig
  ) => Promise<CMSVersion | null>
  rollbackToVersion: (versionId: string, authorName?: string) => Promise<boolean>
  scheduleRelease: (
    title: string,
    scheduledAt: string,
    snapshot: HomepageCMSConfig,
    authorName?: string
  ) => void
  cancelScheduledRelease: (id: string) => void
}

export const useCMSVersionStore = create<CMSVersionStoreState>((set, get) => ({
  versions: [],
  scheduled: [],
  isLoading: false,

  loadVersionsFromSupabase: async () => {
    set({ isLoading: true })
    try {
      const history = await fetchVersionHistoryFromSupabase()
      if (history && history.length > 0) {
        set({ versions: history, isLoading: false })
      } else {
        // Provide current version as initial snapshot
        const currentLive = useCMSStore.getState().config
        set({
          versions: [
            {
              id: 'ver-initial',
              versionNumber: 'v1.0.0 (INITIAL)',
              changeSummary: 'Baseline Lookbook & Editorial Release',
              authorName: 'Creative Director',
              publishedAt: currentLive.lastPublishedAt || new Date().toISOString(),
              isActive: true,
              snapshot: currentLive,
            },
          ],
          isLoading: false,
        })
      }
    } catch {
      set({ isLoading: false })
    }
  },

  createVersionSnapshot: async (summary, authorName = 'Admin Operator', customSnapshot) => {
    const snapshotData = customSnapshot || useCMSStore.getState().config
    const res = await publishHomepageToSupabase(snapshotData, authorName, summary)

    if (res.success && res.version) {
      set({
        versions: [
          res.version,
          ...get().versions.map((v) => ({ ...v, isActive: false })),
        ],
      })
      useCMSStore.setState({
        config: snapshotData,
        isDraft: false,
      })
      return res.version
    }
    return null
  },

  rollbackToVersion: async (versionId, authorName = 'Admin Operator') => {
    const target = get().versions.find((v) => v.id === versionId)
    if (!target) return false

    const rollbackSummary = `Rollback to ${target.versionNumber}: ${target.changeSummary}`
    const res = await publishHomepageToSupabase(target.snapshot, authorName, rollbackSummary)

    if (res.success && res.version) {
      useCMSStore.setState({
        config: target.snapshot,
        isDraft: false,
      })

      set({
        versions: [
          res.version,
          ...get().versions.map((v) => ({ ...v, isActive: false })),
        ],
      })
      return true
    }

    return false
  },

  scheduleRelease: (title, scheduledAt, snapshot, authorName = 'Content Manager') => {
    const newSchedule: ScheduledPublication = {
      id: `sch-${Date.now()}`,
      title,
      scheduledAt,
      authorName,
      snapshot,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    }

    set({ scheduled: [newSchedule, ...get().scheduled] })
  },

  cancelScheduledRelease: (id) => {
    set({
      scheduled: get().scheduled.map((s) =>
        s.id === id ? { ...s, status: 'CANCELLED' } : s
      ),
    })
  },
}))
