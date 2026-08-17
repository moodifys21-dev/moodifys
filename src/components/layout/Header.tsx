import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Search, User, Heart, ShoppingBag, Menu, X, Sparkles } from 'lucide-react'
import { BRAND_NAME, NAV_LINKS } from '@/lib/constants'
import { useCartStore, getCartItemCount } from '@/stores/cartStore'
import { useAuthStore } from '@/stores/authStore'
import { AuthModal } from '@/components/auth/AuthModal'
import { SearchModal } from '@/components/layout/SearchModal'

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [searchModalOpen, setSearchModalOpen] = useState(false)
  const location = useLocation()

  const { items, openDrawer } = useCartStore()
  const { user } = useAuthStore()

  const cartItemCount = getCartItemCount(items)
  const wishlistCount = 0

  // Keyboard shortcut: Cmd+K or Ctrl+K opens SearchModal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchModalOpen((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleAccountClick = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault()
      setAuthModalOpen(true)
    }
  }

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#F0EFED]/95 backdrop-blur-md border-b border-[#E1E0DC] transition-all duration-200">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex items-center justify-between h-18 md:h-20">
            
            {/* Mobile Menu Toggle Button */}
            <div className="flex items-center lg:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 -ml-2 text-[#090808] hover:text-[#302F2E] focus:outline-none"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>

            {/* Desktop Left Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {NAV_LINKS.map((item) => {
                const isActive = location.pathname === item.href
                return (
                  <Link
                    key={item.label}
                    to={item.href}
                    className={`text-[12px] font-semibold tracking-widest uppercase transition-colors duration-150 ${
                      isActive
                        ? 'text-[#090808] border-b border-[#090808] pb-0.5'
                        : 'text-[#302F2E] hover:text-[#090808]'
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              })}
              <Link
                to="/customize"
                className="inline-flex items-center gap-1.5 text-[12px] font-bold tracking-widest uppercase text-[#090808] bg-[#E1E0DC] px-2.5 py-1 hover:bg-[#090808] hover:text-white transition-all duration-200"
              >
                <Sparkles size={13} />
                CUSTOMIZE
              </Link>
            </nav>

            {/* Brand Logo - Centered */}
            <div className="flex-1 lg:flex-none text-center">
              <Link
                to="/"
                className="inline-block font-display text-2xl md:text-3xl font-bold tracking-[0.22em] text-[#090808] uppercase hover:opacity-85 transition-opacity"
              >
                {BRAND_NAME}
              </Link>
            </div>

            {/* Right Action Icons & Labels */}
            <div className="flex items-center space-x-5 md:space-x-7">
              {/* Search Overlay Trigger */}
              <button
                type="button"
                onClick={() => setSearchModalOpen(true)}
                className="flex items-center gap-1.5 text-[12px] font-semibold tracking-wider text-[#302F2E] hover:text-[#090808] transition-colors cursor-pointer"
                aria-label="Search Catalog"
              >
                <Search size={18} strokeWidth={1.75} />
                <span className="hidden xl:inline uppercase">SEARCH</span>
                <span className="hidden lg:inline text-[9px] font-mono text-[#BEBDBB] border border-[#BEBDBB]/60 px-1 py-0.2 rounded">
                  ⌘K
                </span>
              </button>

              {/* Account */}
              <Link
                to="/account"
                onClick={handleAccountClick}
                className="flex items-center gap-1.5 text-[12px] font-semibold tracking-wider text-[#302F2E] hover:text-[#090808] transition-colors"
                aria-label="User Account"
              >
                <User size={18} strokeWidth={1.75} />
                <span className="hidden xl:inline uppercase">
                  {user?.fullName ? user.fullName.split(' ')[0] : 'ACCOUNT'}
                </span>
              </Link>

              {/* Wishlist */}
              <Link
                to="/account/wishlist"
                className="relative flex items-center gap-1.5 text-[12px] font-semibold tracking-wider text-[#302F2E] hover:text-[#090808] transition-colors"
                aria-label="Wishlist"
              >
                <Heart size={18} strokeWidth={1.75} />
                <span className="hidden xl:inline uppercase">WISHLIST</span>
                {wishlistCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-[#090808] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart Drawer Trigger */}
              <button
                type="button"
                onClick={openDrawer}
                className="flex items-center gap-1.5 text-[12px] font-bold tracking-wider text-[#090808] hover:text-[#302F2E] transition-colors cursor-pointer"
                aria-label="Shopping Bag"
              >
                <div className="relative">
                  <ShoppingBag size={19} strokeWidth={2} />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 bg-[#090808] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                      {cartItemCount}
                    </span>
                  )}
                </div>
                <span className="hidden md:inline uppercase tracking-widest text-[11px]">
                  CART ({cartItemCount})
                </span>
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-x-0 top-[110px] bottom-0 bg-[#F0EFED] z-50 border-t border-[#E1E0DC] overflow-y-auto p-6 flex flex-col justify-between">
            <div className="space-y-6">
              <Link
                to="/customize"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-4 bg-[#090808] text-white font-display text-lg tracking-widest font-bold uppercase"
              >
                <span>CUSTOMIZE NOW</span>
                <Sparkles size={18} />
              </Link>

              <div className="space-y-4 pt-2">
                <p className="text-[11px] font-bold tracking-[0.2em] text-[#BEBDBB] uppercase">
                  COLLECTIONS
                </p>
                {NAV_LINKS.map((item) => (
                  <Link
                    key={item.label}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-2xl font-display font-semibold tracking-wider text-[#090808] uppercase py-1 hover:text-[#302F2E]"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              <div className="border-t border-[#E1E0DC] pt-6 space-y-3">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false)
                    setSearchModalOpen(true)
                  }}
                  className="block text-left w-full text-sm font-semibold tracking-wider text-[#302F2E] uppercase py-1"
                >
                  SEARCH CATALOG
                </button>
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm font-semibold tracking-wider text-[#302F2E] uppercase py-1"
                >
                  ADMIN PORTAL
                </Link>
                <Link
                  to="/account/orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm font-semibold tracking-wider text-[#302F2E] uppercase py-1"
                >
                  TRACK ORDERS
                </Link>
                <Link
                  to="/account"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm font-semibold tracking-wider text-[#302F2E] uppercase py-1"
                >
                  MY ACCOUNT
                </Link>
              </div>
            </div>

            <div className="pt-8 border-t border-[#E1E0DC] text-xs text-[#BEBDBB] tracking-widest uppercase">
              © {new Date().getFullYear()} {BRAND_NAME}. ALL RIGHTS RESERVED.
            </div>
          </div>
        )}
      </header>

      {/* Global Search Overlay Modal */}
      <SearchModal isOpen={searchModalOpen} onClose={() => setSearchModalOpen(false)} />

      {/* Global Auth Modal */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </>
  )
}
