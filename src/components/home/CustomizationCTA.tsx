import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Sparkles, ArrowRight } from 'lucide-react'

export const CustomizationCTA: React.FC = () => {
  return (
    <section className="w-full bg-[#090808] text-white py-20 md:py-28 relative overflow-hidden border-b border-[#302F2E]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-[#E1E0DC] text-[10px] font-bold tracking-[0.25em] uppercase backdrop-blur-xs">
          <Sparkles size={12} />
          ZERO MINIMUMS // INSTANT PREVIEW
        </div>

        <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold uppercase tracking-tight text-white leading-none">
          READY TO WEAR<br />YOUR MOOD?
        </h2>

        <p className="text-xs sm:text-sm text-[#BEBDBB] font-light max-w-lg mx-auto leading-relaxed">
          From heavy-weight 240GSM cotton tees to boxy hoodies, our browser customizer lets you place high-definition graphics and custom typography with millimeter accuracy.
        </p>

        <div className="pt-4">
          <Link to="/customize">
            <Button
              size="lg"
              className="bg-white text-[#090808] hover:bg-[#E1E0DC] border-white font-bold gap-2 px-10 shadow-2xl"
            >
              LAUNCH CUSTOMIZER
              <ArrowRight size={16} />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
