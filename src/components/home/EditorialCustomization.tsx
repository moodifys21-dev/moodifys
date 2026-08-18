import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Sparkles, ArrowRight } from 'lucide-react'
import { useCMSStore } from '@/stores/cmsStore'

export const EditorialCustomization: React.FC = () => {
  const { config } = useCMSStore()
  const editorial = config.editorial

  if (!editorial || editorial.isEnabled === false || editorial.status === 'hidden') {
    return null
  }

  // Handle multiline headline rendering
  const renderHeadline = () => {
    if (editorial.headlineText) {
      return editorial.headlineText.split('\n').map((line, idx, arr) => (
        <React.Fragment key={idx}>
          {line}
          {idx < arr.length - 1 && <br />}
        </React.Fragment>
      ))
    }

    // Fallback to legacy headline lines
    const lines = [editorial.headlineLine1, editorial.headlineLine2, editorial.headlineLine3].filter(Boolean)
    if (lines.length > 0) {
      return lines.map((line, idx, arr) => (
        <React.Fragment key={idx}>
          {line}
          {idx < arr.length - 1 && <br />}
        </React.Fragment>
      ))
    }

    return 'MAKE\nIT\nYOURS.'.split('\n').map((line, idx) => (
      <React.Fragment key={idx}>
        {line}
        <br />
      </React.Fragment>
    ))
  }

  const eyebrowText = editorial.eyebrow || editorial.subHeading || 'NEW SEASON // PERSONALIZE'
  const pillBadge = editorial.pillText || 'THE CUSTOMIZATION SUITE'
  const desktopImg = editorial.imageUrl || 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=1400&auto=format&fit=crop&q=85'
  const altText = editorial.imageAlt || 'Moodifys bespoke customization showcase'
  const isLabelEnabled = editorial.imageBadgeEnabled !== false && Boolean(editorial.imageBadgeText)

  const showPrimaryBtn = editorial.primaryButtonEnabled !== false && Boolean(editorial.primaryCtaText)
  const showSecondaryBtn = editorial.secondaryButtonEnabled !== false && Boolean(editorial.secondaryCtaText)

  return (
    <section className="relative w-full bg-[#E1E0DC]/40 py-12 sm:py-16 md:py-24 border-b border-[#BEBDBB]/50 overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Editorial Copy (approx 40-45% width) */}
          <div className="lg:col-span-5 space-y-5 sm:space-y-6 text-left">
            {pillBadge && (
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#090808] text-white text-[10px] font-bold tracking-[0.22em] uppercase">
                <Sparkles size={11} />
                <span>{pillBadge}</span>
              </div>
            )}

            <div className="space-y-2">
              <p className="text-[10px] sm:text-[11px] font-bold tracking-[0.2em] text-[#302F2E] uppercase font-mono">
                {eyebrowText}
              </p>
              <h2 className="editorial-section-title text-[#090808] uppercase leading-[0.92] tracking-tighter text-3xl sm:text-5xl lg:text-6xl font-bold font-display">
                {renderHeadline()}
              </h2>
            </div>

            {editorial.description && (
              <p className="text-xs sm:text-sm md:text-base text-[#302F2E] font-light leading-relaxed max-w-md">
                {editorial.description}
              </p>
            )}

            {(showPrimaryBtn || showSecondaryBtn) && (
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                {showPrimaryBtn && (
                  <Link to={editorial.primaryCtaLink || '/customize'} className="w-full sm:w-auto">
                    <Button size="lg" className="w-full sm:w-auto gap-2 shadow-lg justify-center">
                      <span>{editorial.primaryCtaText}</span>
                      <ArrowRight size={16} />
                    </Button>
                  </Link>
                )}
                {showSecondaryBtn && (
                  <Link to={editorial.secondaryCtaLink || '/shop'} className="w-full sm:w-auto">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto justify-center">
                      <span>{editorial.secondaryCtaText}</span>
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Right Editorial Image Showcase (approx 55-60% width) */}
          <div className="lg:col-span-7 relative">
            <div className="relative aspect-[4/3] sm:aspect-[16/11] overflow-hidden bg-[#BEBDBB] border border-[#BEBDBB] shadow-xl group">
              <picture>
                {editorial.mobileImageUrl && (
                  <source media="(max-width: 640px)" srcSet={editorial.mobileImageUrl} />
                )}
                <img
                  src={desktopImg}
                  alt={altText}
                  className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-700"
                  loading="lazy"
                />
              </picture>
              
              {/* Floating archival label */}
              {isLabelEnabled && (
                <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 bg-white/95 backdrop-blur-md px-3 py-1.5 sm:px-4 sm:py-2 text-[10px] sm:text-[11px] font-mono font-bold tracking-widest text-[#090808] uppercase border border-black/10 shadow-md">
                  {editorial.imageBadgeText}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default EditorialCustomization

