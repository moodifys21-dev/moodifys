import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { BRAND_NAME, BRAND_TAGLINE, FOOTER_SECTIONS } from '@/lib/constants'

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#090808] text-[#BEBDBB] pt-16 pb-12 border-t border-[#302F2E]">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12">
        {/* Top section with Newsletter & Brand mission */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-[#302F2E]">
          <div className="lg:col-span-6 space-y-4">
            <Link
              to="/"
              className="inline-block font-display text-3xl md:text-4xl font-bold tracking-[0.25em] text-white uppercase"
            >
              {BRAND_NAME}
            </Link>
            <p className="text-sm md:text-base text-[#BEBDBB] max-w-md font-light leading-relaxed">
              {BRAND_TAGLINE} Customizable wearable fashion for the contemporary minimalist. Designed for personal expression.
            </p>
          </div>

          <div className="lg:col-span-6">
            <p className="text-xs font-bold tracking-[0.2em] text-white uppercase mb-3">
              JOIN THE INNER CIRCLE
            </p>
            <p className="text-xs text-[#BEBDBB] mb-4">
              Get exclusive early access to drops, customizer presets, and editorial lookbooks.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault()
              }}
              className="flex items-center border-b border-[#BEBDBB] focus-within:border-white transition-colors max-w-md"
            >
              <input
                type="email"
                placeholder="ENTER YOUR EMAIL"
                className="w-full bg-transparent py-3 text-xs tracking-widest text-white placeholder-[#BEBDBB]/60 focus:outline-none uppercase"
                required
              />
              <button
                type="submit"
                className="p-2 text-white hover:text-[#BEBDBB] transition-colors"
                aria-label="Subscribe to newsletter"
              >
                <ArrowRight size={18} />
              </button>
            </form>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12">
          {FOOTER_SECTIONS.map((section) => (
            <div key={section.title} className="space-y-4">
              <p className="text-[11px] font-bold tracking-[0.2em] text-white uppercase">
                {section.title}
              </p>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith('http') ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-[#BEBDBB] hover:text-white transition-colors"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        to={link.href}
                        className="text-xs text-[#BEBDBB] hover:text-white transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom copyright and legal */}
        <div className="pt-8 border-t border-[#302F2E] flex flex-col md:flex-row items-center justify-between text-[11px] text-[#BEBDBB]/80 space-y-4 md:space-y-0 tracking-wider">
          <p>© {new Date().getFullYear()} {BRAND_NAME}. ALL RIGHTS RESERVED.</p>
          <div className="flex items-center space-x-6">
            <Link to="/privacy" className="hover:text-white transition-colors uppercase">
              PRIVACY POLICY
            </Link>
            <Link to="/terms" className="hover:text-white transition-colors uppercase">
              TERMS OF SERVICE
            </Link>
            <Link to="/sitemap" className="hover:text-white transition-colors uppercase">
              SITEMAP
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
