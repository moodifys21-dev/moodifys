import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CMSVersion, ScheduledPublication } from '@/types/cmsVersion'
import { HomepageCMSConfig } from '@/types/cms'
import { useCMSStore } from '@/stores/cmsStore'

interface CMSVersionStoreState {
  versions: CMSVersion[]
  scheduled: ScheduledPublication[]

  // Actions
  createVersionSnapshot: (
    summary: string,
    authorName?: string,
    customSnapshot?: HomepageCMSConfig
  ) => CMSVersion
  rollbackToVersion: (versionId: string) => boolean
  scheduleRelease: (
    title: string,
    scheduledAt: string,
    snapshot: HomepageCMSConfig,
    authorName?: string
  ) => void
  cancelScheduledRelease: (id: string) => void
}

const INITIAL_VERSIONS: CMSVersion[] = [
  {
    id: 'ver-100',
    versionNumber: 'v1.0.0 (INITIAL LAUNCH)',
    changeSummary: 'Factory Brutalist Baseline Lookbook & Editorial Release',
    authorName: 'Creative Director',
    publishedAt: '2026-08-01T10:00:00Z',
    isActive: false,
    snapshot: {
      sectionsOrder: ['hero', 'categoryBands', 'editorial', 'trustStrip', 'featuredProducts', 'customizationCTA'],
      announcement: {
        isEnabled: true,
        text: 'BESPOKE 240GSM ORGANIC COTTON // COMPLIMENTARY SHIPPING ACROSS INDIA',
        linkText: 'DESIGN NOW',
        linkUrl: '/customize',
        backgroundColor: '#090808',
        textColor: '#FFFFFF',
      },
      hero: {
        isEnabled: true,
        tagline: 'FASHION THAT MOVES WITH YOU.',
        editionBadge: 'EDITION 01 // 2025',
        headlineLine1: 'ORIGINAL',
        headlineLine2: 'IDENTITY.',
        subtitle: 'Customizable wearable fashion for the contemporary minimalist. Make every piece personal.',
        backgroundWatermark: 'MOODIFYS',
        centerImageUrl: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=1200&auto=format&fit=crop&q=85',
        badgeText: 'CUSTOMIZABLE CANVAS',
        primaryCtaText: 'CUSTOMIZE NOW',
        primaryCtaLink: '/customize',
        secondaryCtaText: 'EXPLORE',
        secondaryCtaLink: '/shop',
        cornerBadgeYear: '2025',
        cornerBadgeTitle: 'NEW COLLECTION',
        cornerBadgeSubtitle: 'PREMIUM COTTON // LIMITED RUNS',
      },
      categoryBands: {
        isEnabled: true,
        title: 'COLLECTIONS',
        visibleCategorySlugs: ['t-shirts', 'hoodies', 'sweatshirts', 'caps'],
      },
      editorial: {
        isEnabled: true,
        pillText: 'THE CUSTOMIZATION SUITE',
        subHeading: 'NEW SEASON // PERSONALIZE',
        headlineLine1: 'MAKE',
        headlineLine2: 'IT',
        headlineLine3: 'YOURS.',
        description: 'Choose the piece. Add your mood, typography, or custom graphics in high resolution. Preview in real-time and wear a garment that is truly one of one.',
        primaryCtaText: 'START DESIGNING',
        primaryCtaLink: '/customize',
        secondaryCtaText: 'VIEW BLANKS',
        secondaryCtaLink: '/shop',
        imageUrl: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=1400&auto=format&fit=crop&q=85',
        imageBadgeText: 'FABRIC 240 GSM // ARCHIVAL PRINT',
      },
      trustStrip: {
        isEnabled: true,
        badge1Title: 'BESPOKE PRINT',
        badge1Desc: 'Ultra HD 300DPI direct to garment technology',
        badge2Title: '240GSM ORGANIC',
        badge2Desc: 'Heavyweight sustainably sourced combed cotton',
        badge3Title: 'EXPRESS DISPATCH',
        badge3Desc: 'Fabricated & shipped in 48-72 hours',
        badge4Title: 'PREMIUM PACKAGING',
        badge4Desc: 'Recyclable monochrome tactile presentation box',
      },
      featuredProducts: {
        isEnabled: true,
        subTitle: 'CURATED ESSENTIALS',
        title: 'BEST OF MOODIFYS',
        itemCount: 4,
        viewAllLinkText: 'VIEW ALL',
        viewAllLinkUrl: '/shop',
      },
      customizationCTA: {
        isEnabled: true,
        title: 'START DESIGNING YOUR BESPOKE PIECE TODAY.',
        subtitle: 'Upload artwork, choose fonts, and preview on high-grade blanks.',
        ctaText: 'LAUNCH 2D STUDIO',
        ctaLink: '/customize',
        secondaryText: 'BROWSE CATALOG',
        secondaryLink: '/shop',
        backgroundImageUrl: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1400&auto=format&fit=crop&q=85',
      },
      updatedAt: '2026-08-01T10:00:00Z',
    },
  },
  {
    id: 'ver-101',
    versionNumber: 'v1.1.0 (CURRENT LIVE)',
    changeSummary: 'Monochrome Drop 02 Campaign updates and Studio CTA link synchronization',
    authorName: 'Content Manager',
    publishedAt: '2026-08-15T16:00:00Z',
    isActive: true,
    snapshot: useCMSStore.getState().config,
  },
]

export const useCMSVersionStore = create<CMSVersionStoreState>()(
  persist(
    (set, get) => ({
      versions: INITIAL_VERSIONS,
      scheduled: [
        {
          id: 'sch-1',
          title: 'AUTUMN / WINTER 2026 MIDNIGHT DROP',
          scheduledAt: '2026-09-01T00:00:00Z',
          authorName: 'Creative Director',
          snapshot: useCMSStore.getState().config,
          status: 'PENDING',
          createdAt: '2026-08-16T12:00:00Z',
        },
      ],

      createVersionSnapshot: (summary, authorName = 'Content Manager', customSnapshot) => {
        const snapshotData = customSnapshot || useCMSStore.getState().config
        const nextVersionNum = `v1.${get().versions.length}.0`

        const newVersion: CMSVersion = {
          id: `ver-${Date.now()}`,
          versionNumber: nextVersionNum,
          changeSummary: summary,
          authorName,
          publishedAt: new Date().toISOString(),
          isActive: true,
          snapshot: snapshotData,
        }

        // Set all previous versions to inactive
        const updatedVersions = get().versions.map((v) => ({ ...v, isActive: false }))

        set({ versions: [newVersion, ...updatedVersions] })
        return newVersion
      },

      rollbackToVersion: (versionId) => {
        const target = get().versions.find((v) => v.id === versionId)
        if (!target) return false

        // Inject snapshot directly into CMS Store
        useCMSStore.setState({
          config: target.snapshot,
          isDraft: false,
        })

        // Mark active version
        set({
          versions: get().versions.map((v) => ({
            ...v,
            isActive: v.id === versionId,
          })),
        })

        return true
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
    }),
    {
      name: 'moodifys-cms-versions-storage',
    }
  )
)
