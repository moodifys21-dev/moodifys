import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useProducts } from '@/hooks/useProducts'
import { formatPrice } from '@/lib/utils'
import { Search, X, Sparkles, ArrowRight } from 'lucide-react'

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

const TRENDING_SEARCHES = ['OVERSIZED', 'HEAVYWEIGHT', 'CLASSIC TEE', 'HOODIES', 'RAW HEM']

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [query, setQuery] = useState('')
  const { allProducts, categories } = useProducts()

  // Auto focus input on open & keyboard shortcut
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50)
    } else {
      setQuery('')
    }
  }, [isOpen])

  // Global keydown for Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const filteredResults = query.trim()
    ? allProducts.filter((p) => {
        const q = query.toLowerCase()
        return (
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.categoryName && p.categoryName.toLowerCase().includes(q))
        )
      })
    : []

  const handleSelectProduct = (slug: string) => {
    onClose()
    navigate(`/product/${slug}`)
  }

  const handleSelectCategory = (catSlug: string) => {
    onClose()
    navigate(`/shop/${catSlug}`)
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto select-none">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#090808]/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative min-h-screen flex items-start justify-center p-4 sm:p-6 md:p-20">
        <div className="relative w-full max-w-2xl bg-[#F0EFED] border border-[#E1E0DC] shadow-2xl rounded-sm overflow-hidden flex flex-col">
          
          {/* Top Search Input Bar */}
          <div className="p-4 sm:p-5 bg-white border-b border-[#E1E0DC] flex items-center gap-3">
            <Search size={20} className="text-[#090808]" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="SEARCH CATALOG OR BESPOKE BLANKS..."
              className="flex-1 bg-transparent text-sm sm:text-base font-bold uppercase tracking-wider text-[#090808] placeholder:text-[#BEBDBB] focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="p-1 text-[#BEBDBB] hover:text-[#090808]"
              >
                <X size={16} />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-2 py-1 bg-[#F0EFED] text-[10px] font-mono font-bold uppercase text-[#302F2E] border border-[#BEBDBB] rounded-sm hover:bg-[#E1E0DC]"
            >
              ESC
            </button>
          </div>

          {/* Body: Quick suggestions or Live Results */}
          <div className="p-5 max-h-[60vh] overflow-y-auto space-y-6">
            
            {/* Live Search Results */}
            {query.trim() !== '' ? (
              <div className="space-y-3">
                <p className="text-[10px] font-bold tracking-[0.2em] text-[#BEBDBB] uppercase">
                  RESULTS ({filteredResults.length})
                </p>

                {filteredResults.length === 0 ? (
                  <div className="py-12 text-center space-y-2">
                    <p className="font-display text-sm font-bold uppercase text-[#090808]">
                      NO PIECES MATCH "{query.toUpperCase()}"
                    </p>
                    <p className="text-xs text-[#302F2E]">
                      Try searching by category, material, or color.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-[#E1E0DC]">
                    {filteredResults.map((product) => (
                      <div
                        key={product.id}
                        onClick={() => handleSelectProduct(product.slug)}
                        className="py-3 flex items-center justify-between gap-4 cursor-pointer hover:bg-white p-2 rounded-sm transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-14 bg-white border border-[#E1E0DC] rounded-sm overflow-hidden flex-shrink-0">
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          </div>
                          <div>
                            <p className="font-display text-xs sm:text-sm font-bold uppercase text-[#090808] group-hover:underline">
                              {product.name}
                            </p>
                            <p className="text-[10px] text-[#302F2E] font-mono uppercase">
                              {product.categoryName || 'ESSENTIALS'}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          {product.isCustomizable && (
                            <span className="hidden sm:inline-flex items-center gap-1 bg-amber-50 text-amber-900 border border-amber-200 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">
                              <Sparkles size={9} />
                              CUSTOMIZABLE
                            </span>
                          )}
                          <span className="font-mono font-bold text-xs text-[#090808]">
                            {formatPrice(product.basePrice)}
                          </span>
                          <ArrowRight size={14} className="text-[#BEBDBB] group-hover:text-[#090808] transition-colors" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              /* Default Suggestions & Quick Categories */
              <div className="space-y-6">
                {/* Trending Queries */}
                <div>
                  <p className="text-[10px] font-bold tracking-[0.2em] text-[#BEBDBB] uppercase mb-2.5">
                    TRENDING SEARCHES
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {TRENDING_SEARCHES.map((term) => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => setQuery(term)}
                        className="px-3 py-1.5 bg-white border border-[#E1E0DC] hover:border-[#090808] text-xs font-bold uppercase tracking-wider text-[#090808] transition-colors rounded-sm"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Categories */}
                <div>
                  <p className="text-[10px] font-bold tracking-[0.2em] text-[#BEBDBB] uppercase mb-2.5">
                    EXPLORE BY CATEGORY
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => handleSelectCategory(cat.slug)}
                        className="p-3 bg-white border border-[#E1E0DC] hover:border-[#090808] text-left transition-colors rounded-sm group"
                      >
                        <p className="font-display text-xs font-bold uppercase text-[#090808] group-hover:underline">
                          {cat.name}
                        </p>
                        <p className="text-[9px] text-[#BEBDBB] uppercase font-mono mt-0.5">
                          VIEW COLLECTION →
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Customizer Fast Link */}
                <Link
                  to="/customize"
                  onClick={onClose}
                  className="flex items-center justify-between p-4 bg-[#090808] text-white rounded-sm hover:bg-[#302F2E] transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Sparkles size={18} />
                    <div>
                      <p className="font-display text-xs font-bold uppercase tracking-wider">
                        OPEN 2D CUSTOMIZER STUDIO
                      </p>
                      <p className="text-[10px] text-[#E1E0DC] font-light">
                        Create bespoke personal prints on premium blanks.
                      </p>
                    </div>
                  </div>
                  <ArrowRight size={16} />
                </Link>
              </div>
            )}

          </div>

          {/* Footer Shortcuts */}
          <div className="p-3 bg-[#E1E0DC]/50 border-t border-[#E1E0DC] flex items-center justify-between text-[10px] font-mono text-[#302F2E]">
            <div className="flex items-center gap-4">
              <span>PRESS <strong className="text-[#090808]">ESC</strong> TO CLOSE</span>
              <span className="hidden sm:inline">TYPE TO INSTANTLY FILTER</span>
            </div>
            <span className="uppercase text-[#BEBDBB]">MOODIFYS CATALOG ENGINE</span>
          </div>

        </div>
      </div>
    </div>
  )
}
