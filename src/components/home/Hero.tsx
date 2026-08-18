import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { ArrowRight, Sparkles } from 'lucide-react'
import { useCMSStore } from '@/stores/cmsStore'

export const Hero: React.FC = () => {
  const { config } = useCMSStore()
  const hero = config.hero

  if (!hero || hero.isEnabled === false) return null

  return (
    <section className="relative w-full bg-[#F0EFED] overflow-hidden border-b border-[#E1E0DC] pt-4 sm:pt-6 md:pt-8 pb-10 sm:pb-14 md:pb-20">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12">
        
        {/* Top meta bar inspired by editorial layout */}
        <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-bold tracking-[0.22em] text-[#302F2E] uppercase mb-4 sm:mb-6 md:mb-8">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#090808] animate-pulse" />
            <span className="truncate">{hero.tagline}</span>
          </div>
          <div className="text-[#BEBDBB] font-mono text-[10px] hidden sm:block">
            {hero.editionBadge}
          </div>
        </div>

        {/* DESKTOP HERO COMPOSITION (>= 1024px) */}
        <div className="hidden lg:flex relative min-h-[580px] xl:min-h-[700px] items-center justify-center">
          
          {/* Background Giant Brand Watermark */}
          <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none z-0 overflow-hidden">
            <span className="font-display font-extrabold text-[#090808]/[0.07] text-[18vw] tracking-tighter leading-none text-center">
              {hero.backgroundWatermark}
            </span>
          </div>

          {/* Center Lookbook Image */}
          <div className="relative z-10 w-full max-w-[440px] xl:max-w-[500px] aspect-[3/4] mx-auto overflow-hidden shadow-2xl border border-white/60">
            <img
              src={hero.centerImageUrl}
              alt="Moodifys Lookbook Editorial Model"
              className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-[1.02]"
            />
            {/* Subtle overlay badge */}
            <div className="absolute top-4 left-4 bg-[#090808]/85 backdrop-blur-xs text-white text-[10px] font-bold tracking-widest px-3 py-1.5 uppercase flex items-center gap-1.5 shadow-sm">
              <Sparkles size={11} />
              <span>{hero.badgeText}</span>
            </div>
          </div>

          {/* Left Floating Headline */}
          <div className="absolute left-0 bottom-8 xl:bottom-12 z-20 max-w-sm space-y-4 text-left">
            <div className="space-y-1">
              <p className="text-[11px] font-bold tracking-[0.25em] text-[#BEBDBB] uppercase font-mono">
                WEAR YOUR MOOD
              </p>
              <h1 className="font-display text-5xl xl:text-6xl font-bold uppercase tracking-tight text-[#090808] leading-[0.92]">
                {hero.headlineLine1}<br />{hero.headlineLine2}
              </h1>
            </div>
            <p className="text-xs text-[#302F2E] font-normal leading-relaxed max-w-xs">
              {hero.subtitle}
            </p>
            <div className="flex items-center gap-3 pt-2">
              <Link to={hero.primaryCtaLink || '/customize'}>
                <Button size="md" className="gap-2 shadow-lg">
                  <span>{hero.primaryCtaText}</span>
                  <ArrowRight size={14} />
                </Button>
              </Link>
              <Link to={hero.secondaryCtaLink || '/shop'}>
                <Button variant="outline" size="md">
                  <span>{hero.secondaryCtaText}</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Floating Meta Tag */}
          <div className="absolute right-0 bottom-8 xl:bottom-12 z-20 text-right space-y-1.5 max-w-xs">
            <p className="text-[11px] font-bold tracking-[0.25em] text-[#090808] uppercase">
              {hero.cornerBadgeTitle}
            </p>
            <p className="text-3xl font-display font-bold text-[#302F2E]">
              {hero.cornerBadgeYear}
            </p>
            <p className="text-xs text-[#BEBDBB] font-mono tracking-wider uppercase">
              {hero.cornerBadgeSubtitle}
            </p>
          </div>
        </div>

        {/* MOBILE & TABLET HERO COMPOSITION (< 1024px) */}
        <div className="lg:hidden flex flex-col items-center space-y-6">
          
          {/* Main Lookbook Visual */}
          <div className="relative w-full max-w-[340px] sm:max-w-[400px] aspect-[3/4] mx-auto overflow-hidden shadow-xl border border-white/60">
            <img
              src={hero.centerImageUrl}
              alt="Moodifys Lookbook Editorial Model"
              className="w-full h-full object-cover object-center"
            />
            {/* Overlay badge */}
            <div className="absolute top-3 left-3 bg-[#090808]/85 backdrop-blur-xs text-white text-[9px] sm:text-[10px] font-bold tracking-widest px-2.5 py-1 uppercase flex items-center gap-1.5">
              <Sparkles size={10} />
              <span>{hero.badgeText}</span>
            </div>
          </div>

          {/* Clean Editorial Content Flow (Never overlaps or covers the model) */}
          <div className="w-full max-w-md text-center space-y-3.5 px-2">
            <p className="text-[10px] font-mono font-bold tracking-[0.25em] text-[#BEBDBB] uppercase">
              WEAR YOUR MOOD
            </p>
            <h1 className="font-display text-3xl sm:text-4xl font-bold uppercase tracking-tight text-[#090808] leading-[0.95]">
              {hero.headlineLine1} {hero.headlineLine2}
            </h1>
            <p className="text-xs sm:text-sm text-[#302F2E] font-normal leading-relaxed max-w-sm mx-auto">
              {hero.subtitle}
            </p>

            {/* Touch-Friendly Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5 pt-2">
              <Link to={hero.primaryCtaLink || '/customize'} className="w-full sm:w-auto">
                <Button size="md" className="w-full sm:w-auto gap-2 shadow-md justify-center">
                  <span>{hero.primaryCtaText}</span>
                  <ArrowRight size={14} />
                </Button>
              </Link>
              <Link to={hero.secondaryCtaLink || '/shop'} className="w-full sm:w-auto">
                <Button variant="outline" size="md" className="w-full sm:w-auto justify-center">
                  <span>{hero.secondaryCtaText}</span>
                </Button>
              </Link>
            </div>
          </div>

        </div>

      </div>
    </section>
  )
}

