export interface AnnouncementBarConfig {
  isEnabled: boolean
  text: string
  linkText?: string
  linkUrl?: string
  backgroundColor: string
  textColor: string
}

export interface HeroSectionConfig {
  isEnabled: boolean
  tagline: string
  editionBadge: string
  headlineLine1: string
  headlineLine2: string
  subtitle: string
  backgroundWatermark: string
  centerImageUrl: string
  badgeText: string
  primaryCtaText: string
  primaryCtaLink: string
  secondaryCtaText: string
  secondaryCtaLink: string
  cornerBadgeYear: string
  cornerBadgeTitle: string
  cornerBadgeSubtitle: string
}

export interface EditorialSectionConfig {
  isEnabled: boolean
  pillText: string
  subHeading: string
  eyebrow?: string
  headlineText?: string
  headlineLine1: string
  headlineLine2: string
  headlineLine3: string
  description: string
  primaryCtaText: string
  primaryCtaLink: string
  primaryButtonEnabled?: boolean
  secondaryCtaText: string
  secondaryCtaLink: string
  secondaryButtonEnabled?: boolean
  imageUrl: string
  mobileImageUrl?: string
  imageAlt?: string
  imageBadgeText: string
  imageBadgeEnabled?: boolean
  status?: 'published' | 'draft' | 'hidden'
}

export interface FeaturedProductsSectionConfig {
  isEnabled: boolean
  subTitle: string
  title: string
  itemCount: number
  viewAllLinkText: string
  viewAllLinkUrl: string
}

export interface TrustStripConfig {
  isEnabled: boolean
  badge1Title: string
  badge1Desc: string
  badge2Title: string
  badge2Desc: string
  badge3Title: string
  badge3Desc: string
  badge4Title: string
  badge4Desc: string
}

export interface CustomizationCTASectionConfig {
  isEnabled: boolean
  title: string
  subtitle: string
  ctaText: string
  ctaLink: string
  secondaryText: string
  secondaryLink: string
  backgroundImageUrl: string
}

export interface CategoryBandsConfig {
  isEnabled: boolean
  title?: string
  visibleCategorySlugs: string[]
}

export interface HomepageCMSConfig {
  sectionsOrder: string[]
  announcement: AnnouncementBarConfig
  hero: HeroSectionConfig
  categoryBands: CategoryBandsConfig
  editorial: EditorialSectionConfig
  trustStrip: TrustStripConfig
  featuredProducts: FeaturedProductsSectionConfig
  customizationCTA: CustomizationCTASectionConfig
  lastPublishedAt?: string
  updatedAt: string
}
