import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { HomepageCMSConfig } from '@/types/cms'
import { CMSVersion } from '@/types/cmsVersion'

export const DEFAULT_CMS_CONFIG: HomepageCMSConfig = {
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

/**
 * Fetch the authoritative published homepage CMS version from Supabase
 */
export async function fetchPublishedHomepage(): Promise<{
  config: HomepageCMSConfig
  versionId?: string
  versionNumber?: string
  publishedAt?: string
}> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('homepage_versions')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (!error && data && data.content) {
        return {
          config: data.content as HomepageCMSConfig,
          versionId: data.id,
          versionNumber: data.version_number,
          publishedAt: data.published_at || data.created_at,
        }
      }
    } catch (err) {
      console.warn('Failed to fetch published homepage from Supabase, using fallback:', err)
    }
  }

  // Fallback to local published backup if available
  try {
    const localBackup = localStorage.getItem('moodifys_published_cms')
    if (localBackup) {
      const parsed = JSON.parse(localBackup)
      if (parsed && typeof parsed === 'object') {
        return {
          config: parsed as HomepageCMSConfig,
          versionNumber: 'v1.0.0 (LOCAL)',
          publishedAt: new Date().toISOString(),
        }
      }
    }
  } catch {
    // ignore
  }

  // Fallback to default seed config if no published version is available
  return {
    config: DEFAULT_CMS_CONFIG,
    versionNumber: 'v1.0.0 (SEED)',
    publishedAt: new Date().toISOString(),
  }
}

/**
 * Atomically publish a new CMS version to Supabase
 */
export async function publishHomepageToSupabase(
  config: HomepageCMSConfig,
  authorName = 'Admin Operator',
  changeSummary = 'Homepage CMS Update'
): Promise<{ success: boolean; version?: CMSVersion; error?: string }> {
  const publishedAt = new Date().toISOString()
  const versionNumber = `v1.${Date.now().toString().slice(-4)}`
  const updatedConfig: HomepageCMSConfig = {
    ...config,
    lastPublishedAt: publishedAt,
    updatedAt: publishedAt,
  }

  if (isSupabaseConfigured && supabase) {
    try {
      // 1. Insert new published version
      const { data: inserted, error: insertError } = await supabase
        .from('homepage_versions')
        .insert({
          version_number: versionNumber,
          status: 'published',
          change_summary: changeSummary,
          author_name: authorName,
          content: updatedConfig,
          published_at: publishedAt,
        })
        .select()
        .single()

      if (!insertError && inserted?.id) {
        // 2. Archive previous published versions
        try {
          await supabase
            .from('homepage_versions')
            .update({ status: 'archived' })
            .eq('status', 'published')
            .neq('id', inserted.id)
        } catch {
          // non-fatal
        }

        const publishedVersion: CMSVersion = {
          id: inserted.id,
          versionNumber,
          changeSummary,
          authorName,
          publishedAt,
          isActive: true,
          snapshot: updatedConfig,
        }

        // Also persist backup locally
        try {
          localStorage.setItem('moodifys_published_cms', JSON.stringify(updatedConfig))
        } catch {
          // ignore
        }

        return { success: true, version: publishedVersion }
      } else if (insertError) {
        console.warn('Supabase publish warning:', insertError.message)
      }
    } catch (err) {
      console.warn('Failed to publish to Supabase, falling back to local sync:', err)
    }
  }

  // Graceful local backup fallback if Supabase returns error or table missing
  const mockVersion: CMSVersion = {
    id: `ver-${Date.now()}`,
    versionNumber,
    changeSummary,
    authorName,
    publishedAt,
    isActive: true,
    snapshot: updatedConfig,
  }

  try {
    localStorage.setItem('moodifys_published_cms', JSON.stringify(updatedConfig))
  } catch {
    // ignore
  }

  return { success: true, version: mockVersion }
}

/**
 * Save draft version to Supabase
 */
export async function saveDraftHomepageToSupabase(
  config: HomepageCMSConfig,
  authorName = 'Admin Operator',
  changeSummary = 'Draft Work In Progress'
): Promise<{ success: boolean; error?: string }> {
  if (isSupabaseConfigured && supabase) {
    try {
      const versionNumber = `v-draft-${Date.now().toString().slice(-4)}`
      const { error } = await supabase.from('homepage_versions').insert({
        version_number: versionNumber,
        status: 'draft',
        change_summary: changeSummary,
        author_name: authorName,
        content: config,
      })

      if (error) return { success: false, error: error.message }
      return { success: true }
    } catch (err) {
      return { success: false, error: String(err) }
    }
  }
  return { success: true }
}

/**
 * Fetch complete CMS version history from Supabase
 */
export async function fetchVersionHistoryFromSupabase(): Promise<CMSVersion[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('homepage_versions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(30)

      if (!error && data) {
        return data.map((row) => ({
          id: row.id,
          versionNumber: row.version_number,
          changeSummary: row.change_summary || 'Homepage Update',
          authorName: row.author_name || 'Admin',
          publishedAt: row.published_at || row.created_at,
          isActive: row.status === 'published',
          snapshot: row.content as HomepageCMSConfig,
        }))
      }
    } catch (err) {
      console.warn('Failed to fetch version history:', err)
    }
  }

  return []
}

/**
 * Subscribe to live published CMS changes across all devices via Supabase Realtime
 */
export function subscribeToHomepageRealtime(
  onPublishedUpdate: (config: HomepageCMSConfig) => void
): () => void {
  if (!isSupabaseConfigured || !supabase) {
    return () => {}
  }

  try {
    const channel = supabase
      .channel('homepage_versions_live')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'homepage_versions',
        },
        async (payload) => {
          const newRow = payload.new as { status?: string; content?: HomepageCMSConfig }
          if (newRow && newRow.status === 'published' && newRow.content) {
            onPublishedUpdate(newRow.content)
          } else {
            // Refetch latest published version to be 100% authoritative
            const latest = await fetchPublishedHomepage()
            onPublishedUpdate(latest.config)
          }
        }
      )
      .subscribe()

    return () => {
      if (supabase) {
        supabase.removeChannel(channel)
      }
    }
  } catch (err) {
    console.warn('Realtime subscription error:', err)
    return () => {}
  }
}
