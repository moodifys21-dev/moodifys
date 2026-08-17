import React from 'react'
import { Truck, RotateCcw, ShieldCheck, Lock } from 'lucide-react'

export const TrustStrip: React.FC = () => {
  const items = [
    {
      icon: <Truck size={22} strokeWidth={1.5} className="text-[#090808]" />,
      title: 'FAST DELIVERY',
      subtitle: 'Quick & safe delivery',
    },
    {
      icon: <RotateCcw size={22} strokeWidth={1.5} className="text-[#090808]" />,
      title: 'EASY RETURNS',
      subtitle: 'Within 15 days',
    },
    {
      icon: <ShieldCheck size={22} strokeWidth={1.5} className="text-[#090808]" />,
      title: 'QUALITY ASSURED',
      subtitle: 'Best fashion, best quality',
    },
    {
      icon: <Lock size={22} strokeWidth={1.5} className="text-[#090808]" />,
      title: 'SECURE PAYMENT',
      subtitle: '100% secure checkout',
    },
  ]

  return (
    <section className="w-full bg-[#F0EFED] py-8 md:py-10 border-b border-[#E1E0DC]">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {items.map((item) => (
            <div
              key={item.title}
              className="flex items-center space-x-3.5 sm:space-x-4 p-2"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#E1E0DC] flex items-center justify-center border border-[#BEBDBB]/30">
                {item.icon}
              </div>
              <div className="space-y-0.5">
                <p className="text-[11px] sm:text-xs font-bold tracking-wider text-[#090808] uppercase">
                  {item.title}
                </p>
                <p className="text-[10px] sm:text-[11px] text-[#302F2E] font-normal">
                  {item.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
