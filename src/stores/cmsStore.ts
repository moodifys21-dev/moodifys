import { create } from 'zustand'
import { HomepageCMSConfig } from '@/types/cms'
import {
  DEFAULT_CMS_CONFIG,
  fetchPublishedHomepage,
  publishHomepageToSupabase,
  saveDraftHomepageToSupabase,
  subscribeToHomepageRealtime,
} from '@/services/cmsService'

interface CMSStoreState {
  config: HomepageCMSConfig
  isDraft: boolean
  isLoading: boolean
  isPublishing: boolean
  lastPublishedVersion?: string

  // Actions
  initializeStore: () => Promise<void>
  updateHero: (updates: Partial<HomepageCMSConfig['hero']>) => void
  updateAnnouncement: (updates: Partial<HomepageCMSConfig['announcement']>) => void
  updateEditorial: (updates: Partial<HomepageCMSConfig['editorial']>) => void
  updateFeaturedProducts: (updates: Partial<HomepageCMSConfig['featuredProducts']>) => void
  updateTrustStrip: (updates: Partial<HomepageCMSConfig['trustStrip']>) => void
  updateCustomizationCTA: (updates: Partial<HomepageCMSConfig['customizationCTA']>) => void
  updateCategoryBands: (updates: Partial<HomepageCMSConfig['categoryBands']>) => void
  reorderSections: (newOrder: string[]) => void
  toggleSectionVisibility: (sectionKey: string) => void
  resetToDefault: () => void
  saveDraft: (authorName?: string) => Promise<{ success: boolean; error?: string }>
  publishLive: (authorName?: string, summary?: string) => Promise<{ success: boolean; error?: string }>
}

let realtimeUnsubscribe: (() => void) | null = null

export const useCMSStore = create<CMSStoreState>((set, get) => ({
  config: DEFAULT_CMS_CONFIG,
  isDraft: false,
  isLoading: false,
  isPublishing: false,

  initializeStore: async () => {
    // Avoid double initialization
    set({ isLoading: true })
    try {
      const { config, versionNumber } = await fetchPublishedHomepage()
      set({
        config,
        isDraft: false,
        isLoading: false,
        lastPublishedVersion: versionNumber,
      })

      // Subscribe to Realtime updates across devices
      if (!realtimeUnsubscribe) {
        realtimeUnsubscribe = subscribeToHomepageRealtime((newConfig) => {
          set({
            config: newConfig,
            isDraft: false,
          })
        })
      }
    } catch (err) {
      console.warn('CMS initialization error:', err)
      set({ isLoading: false })
    }
  },

  updateHero: (updates) => {
    set({
      isDraft: true,
      config: {
        ...get().config,
        hero: { ...get().config.hero, ...updates },
        updatedAt: new Date().toISOString(),
      },
    })
  },

  updateAnnouncement: (updates) => {
    set({
      isDraft: true,
      config: {
        ...get().config,
        announcement: { ...get().config.announcement, ...updates },
        updatedAt: new Date().toISOString(),
      },
    })
  },

  updateEditorial: (updates) => {
    set({
      isDraft: true,
      config: {
        ...get().config,
        editorial: { ...get().config.editorial, ...updates },
        updatedAt: new Date().toISOString(),
      },
    })
  },

  updateFeaturedProducts: (updates) => {
    set({
      isDraft: true,
      config: {
        ...get().config,
        featuredProducts: { ...get().config.featuredProducts, ...updates },
        updatedAt: new Date().toISOString(),
      },
    })
  },

  updateTrustStrip: (updates) => {
    set({
      isDraft: true,
      config: {
        ...get().config,
        trustStrip: { ...get().config.trustStrip, ...updates },
        updatedAt: new Date().toISOString(),
      },
    })
  },

  updateCustomizationCTA: (updates) => {
    set({
      isDraft: true,
      config: {
        ...get().config,
        customizationCTA: { ...get().config.customizationCTA, ...updates },
        updatedAt: new Date().toISOString(),
      },
    })
  },

  updateCategoryBands: (updates) => {
    set({
      isDraft: true,
      config: {
        ...get().config,
        categoryBands: { ...get().config.categoryBands, ...updates },
        updatedAt: new Date().toISOString(),
      },
    })
  },

  reorderSections: (newOrder) => {
    set({
      isDraft: true,
      config: {
        ...get().config,
        sectionsOrder: newOrder,
        updatedAt: new Date().toISOString(),
      },
    })
  },

  toggleSectionVisibility: (sectionKey) => {
    const currentConfig = get().config
    let updatedSection = {}

    if (sectionKey === 'hero') updatedSection = { hero: { ...currentConfig.hero, isEnabled: !currentConfig.hero.isEnabled } }
    else if (sectionKey === 'categoryBands') updatedSection = { categoryBands: { ...currentConfig.categoryBands, isEnabled: !currentConfig.categoryBands.isEnabled } }
    else if (sectionKey === 'editorial') updatedSection = { editorial: { ...currentConfig.editorial, isEnabled: !currentConfig.editorial.isEnabled } }
    else if (sectionKey === 'trustStrip') updatedSection = { trustStrip: { ...currentConfig.trustStrip, isEnabled: !currentConfig.trustStrip.isEnabled } }
    else if (sectionKey === 'featuredProducts') updatedSection = { featuredProducts: { ...currentConfig.featuredProducts, isEnabled: !currentConfig.featuredProducts.isEnabled } }
    else if (sectionKey === 'customizationCTA') updatedSection = { customizationCTA: { ...currentConfig.customizationCTA, isEnabled: !currentConfig.customizationCTA.isEnabled } }

    set({
      isDraft: true,
      config: {
        ...currentConfig,
        ...updatedSection,
        updatedAt: new Date().toISOString(),
      },
    })
  },

  resetToDefault: () => {
    set({
      config: {
        ...DEFAULT_CMS_CONFIG,
        updatedAt: new Date().toISOString(),
      },
      isDraft: false,
    })
  },

  saveDraft: async (authorName = 'Admin Operator') => {
    const current = get().config
    return saveDraftHomepageToSupabase(current, authorName)
  },

  publishLive: async (authorName = 'Admin Operator', summary = 'Homepage CMS Update') => {
    set({ isPublishing: true })
    const currentConfig = get().config
    const result = await publishHomepageToSupabase(currentConfig, authorName, summary)

    if (result.success && result.version) {
      set({
        isDraft: false,
        isPublishing: false,
        config: result.version.snapshot,
        lastPublishedVersion: result.version.versionNumber,
      })
      return { success: true }
    } else {
      set({ isPublishing: false })
      return { success: false, error: result.error || 'Failed to publish version to Supabase.' }
    }
  },
}))
