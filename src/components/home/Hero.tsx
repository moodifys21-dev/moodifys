import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { ArrowRight, Sparkles } from 'lucide-react'
import { useCMSStore } from '@/stores/cmsStore'

export const Hero: React.FC = () => {
  const { config } = useCMSStore()
  const hero = config.hero

  if (!hero.isEnabled) return null

  return (
    <section className="relative w-full bg-[#F0EFED] overflow-hidden border-b border-[#E1E0DC] pt-4 md:pt-8 pb-12 md:pb-20">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12">
        {/* Top meta tags inspired by editorial layout */}
        <div className="flex items-center justify-between text-[11px] font-bold tracking-[0.22em] text-[#302F2E] uppercase mb-4 md:mb-8">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#090808] animate-pulse" />
            <span>{hero.tagline}</span>
          </div>
          <div className="hidden sm:block text-[#BEBDBB]">
            {hero.editionBadge}
          </div>
        </div>

        {/* Main Hero Visual Composition */}
        <div className="relative min-h-[520px] sm:min-h-[620px] lg:min-h-[720px] flex items-center justify-center">
          
          {/* Background Giant Brand Typography - Aggressive scale */}
          <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none z-0">
            <span className="font-display font-extrabold text-[#090808]/[0.08] lg:text-[#090808]/[0.09] text-[20vw] tracking-tighter leading-none text-center">
              {hero.backgroundWatermark}
            </span>
          </div>

          {/* Center Fashion Model / Garment Image */}
          <div className="relative z-10 w-full max-w-[340px] sm:max-w-[420px] lg:max-w-[520px] aspect-3/4 mx-auto overflow-hidden shadow-2xl border border-white/40">
            <img
              src={hero.centerImageUrl}
              alt="Moodifys Editorial Lookbook Model"
              className="w-full h-full object-cover object-center"
            />
            {/* Subtle overlay badge */}
            <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-xs text-white text-[10px] font-bold tracking-widest px-3 py-1 uppercase flex items-center gap-1.5">
              <Sparkles size={11} />
              {hero.badgeText}
            </div>
          </div>

          {/* Left Floating Editorial Headline */}
          <div className="absolute left-0 bottom-4 lg:bottom-12 z-20 max-w-sm space-y-4 text-left">
            <div className="space-y-1">
              <p className="text-[11px] font-bold tracking-[0.2em] text-[#BEBDBB] uppercase">
                WEAR YOUR MOOD
              </p>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold uppercase tracking-tight text-[#090808] leading-[0.92]">
                {hero.headlineLine1}<br />{hero.headlineLine2}
              </h1>
            </div>
            <p className="text-xs text-[#302F2E] font-normal leading-relaxed max-w-xs">
              {hero.subtitle}
            </p>
            <div className="flex items-center gap-3 pt-2">
              <Link to={hero.primaryCtaLink}>
                <Button size="md" className="gap-2 shadow-lg">
                  {hero.primaryCtaText}
                  <ArrowRight size={14} />
                </Button>
              </Link>
              <Link to={hero.secondaryCtaLink}>
                <Button variant="outline" size="md">
                  {hero.secondaryCtaText}
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Floating Meta Tag */}
          <div className="hidden lg:block absolute right-0 bottom-12 z-20 text-right space-y-2 max-w-xs">
            <p className="text-[11px] font-bold tracking-[0.25em] text-[#090808] uppercase">
              {hero.cornerBadgeTitle}
            </p>
            <p className="text-2xl font-display font-bold text-[#302F2E]">
              {hero.cornerBadgeYear}
            </p>
            <p className="text-xs text-[#BEBDBB] tracking-wider uppercase">
              {hero.cornerBadgeSubtitle}
            </p>
          </div>
        </div>

      </div>
    </section>
  )
}
