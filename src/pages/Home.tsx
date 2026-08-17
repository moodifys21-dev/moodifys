import React from 'react'
import { Hero } from '@/components/home/Hero'
import { CategoryBands } from '@/components/home/CategoryBands'
import { EditorialCustomization } from '@/components/home/EditorialCustomization'
import { TrustStrip } from '@/components/home/TrustStrip'
import { FeaturedProducts } from '@/components/home/FeaturedProducts'
import { CustomizationCTA } from '@/components/home/CustomizationCTA'
import { useCMSStore } from '@/stores/cmsStore'

export const Home: React.FC = () => {
  const { config } = useCMSStore()

  const renderSection = (sectionKey: string) => {
    switch (sectionKey) {
      case 'hero':
        return <Hero key="hero" />
      case 'categoryBands':
        return <CategoryBands key="categoryBands" />
      case 'editorial':
        return <EditorialCustomization key="editorial" />
      case 'trustStrip':
        return <TrustStrip key="trustStrip" />
      case 'featuredProducts':
        return <FeaturedProducts key="featuredProducts" />
      case 'customizationCTA':
        return <CustomizationCTA key="customizationCTA" />
      default:
        return null
    }
  }

  return (
    <div className="w-full">
      {config.sectionsOrder.map((sectionKey) => renderSection(sectionKey))}
    </div>
  )
}

export default Home
