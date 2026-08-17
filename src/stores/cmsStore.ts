import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { HomepageCMSConfig } from '@/types/cms'

interface CMSStoreState {
  config: HomepageCMSConfig
  isDraft: boolean

  // Actions
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
  publishLive: () => void
}

const DEFAULT_CMS_CONFIG: HomepageCMSConfig = {
  sectionsOrder: [
    'hero',
    'categoryBands',
    'editorial',
    'trustStrip',
    'featuredProducts',
    'customizationCTA',
  ],
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
    eyebrow: 'NEW SEASON // PERSONALIZE',
    headlineText: 'MAKE\nIT\nYOURS.',
    headlineLine1: 'MAKE',
    headlineLine2: 'IT',
    headlineLine3: 'YOURS.',
    description: 'Choose the piece. Add your mood, typography, or custom graphics in high resolution. Preview in real-time and wear a garment that is truly one of one.',
    primaryCtaText: 'START DESIGNING',
    primaryCtaLink: '/customize',
    primaryButtonEnabled: true,
    secondaryCtaText: 'VIEW BLANKS',
    secondaryCtaLink: '/shop',
    secondaryButtonEnabled: true,
    imageUrl: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=1400&auto=format&fit=crop&q=85',
    mobileImageUrl: '',
    imageAlt: 'Woman wearing customized Moodifys streetwear T-shirt',
    imageBadgeText: 'FABRIC 240 GSM // ARCHIVAL PRINT',
    imageBadgeEnabled: true,
    status: 'published',
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
  updatedAt: new Date().toISOString(),
}

export const useCMSStore = create<CMSStoreState>()(
  persist(
    (set, get) => ({
      config: DEFAULT_CMS_CONFIG,
      isDraft: false,

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

      publishLive: () => {
        set({
          isDraft: false,
          config: {
            ...get().config,
            lastPublishedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        })
      },
    }),
    {
      name: 'moodifys-homepage-cms-storage',
    }
  )
)
