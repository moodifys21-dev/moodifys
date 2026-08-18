import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Search, User, Heart, ShoppingBag, Menu, X, Sparkles, ArrowRight, ChevronRight } from 'lucide-react'
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

  // Keyboard shortcut: Cmd+K or Ctrl+K opens SearchModal, Esc closes mobile menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchModalOpen((prev) => !prev)
      } else if (e.key === 'Escape') {
        setMobileMenuOpen(false)
        setSearchModalOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

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
          <div className="flex items-center justify-between h-16 sm:h-18 md:h-20">
            
            {/* Mobile Menu Toggle Button (Visible below 1024px) */}
            <div className="flex items-center lg:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 -ml-2 text-[#090808] hover:text-[#302F2E] focus:outline-none cursor-pointer"
                aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              >
                {mobileMenuOpen ? <X size={24} strokeWidth={2} /> : <Menu size={24} strokeWidth={2} />}
              </button>
            </div>

            {/* Desktop Left Navigation (>= 1024px) */}
            <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
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
                className="inline-block font-display text-xl sm:text-2xl md:text-3xl font-bold tracking-[0.22em] text-[#090808] uppercase hover:opacity-85 transition-opacity"
              >
                {BRAND_NAME}
              </Link>
            </div>

            {/* Right Action Icons & Labels */}
            <div className="flex items-center space-x-3 sm:space-x-5 md:space-x-7">
              {/* Search Overlay Trigger */}
              <button
                type="button"
                onClick={() => setSearchModalOpen(true)}
                className="flex items-center gap-1.5 text-[12px] font-semibold tracking-wider text-[#302F2E] hover:text-[#090808] transition-colors cursor-pointer p-1"
                aria-label="Search Catalog"
              >
                <Search size={19} strokeWidth={1.8} />
                <span className="hidden xl:inline uppercase">SEARCH</span>
                <span className="hidden lg:inline text-[9px] font-mono text-[#BEBDBB] border border-[#BEBDBB]/60 px-1 py-0.2 rounded">
                  ⌘K
                </span>
              </button>

              {/* Account */}
              <Link
                to="/account"
                onClick={handleAccountClick}
                className="flex items-center gap-1.5 text-[12px] font-semibold tracking-wider text-[#302F2E] hover:text-[#090808] transition-colors p-1"
                aria-label="User Account"
              >
                <User size={19} strokeWidth={1.8} />
                <span className="hidden xl:inline uppercase">
                  {user?.fullName ? user.fullName.split(' ')[0] : 'ACCOUNT'}
                </span>
              </Link>

              {/* Wishlist */}
              <Link
                to="/account/wishlist"
                className="relative flex items-center gap-1.5 text-[12px] font-semibold tracking-wider text-[#302F2E] hover:text-[#090808] transition-colors p-1"
                aria-label="Wishlist"
              >
                <Heart size={19} strokeWidth={1.8} />
                <span className="hidden xl:inline uppercase">WISHLIST</span>
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#090808] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart Drawer Trigger */}
              <button
                type="button"
                onClick={openDrawer}
                className="flex items-center gap-1.5 text-[12px] font-bold tracking-wider text-[#090808] hover:text-[#302F2E] transition-colors cursor-pointer p-1"
                aria-label="Shopping Bag"
              >
                <div className="relative">
                  <ShoppingBag size={20} strokeWidth={2} />
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
      </header>

      {/* MOBILE NAVIGATION DRAWER & BACKDROP */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop Blur Overlay */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Slide-over Sheet Content */}
          <div className="relative w-full max-w-sm bg-[#F0EFED] text-[#090808] h-full flex flex-col justify-between shadow-2xl z-10 border-r border-[#E1E0DC] overflow-y-auto animate-in slide-in-from-left duration-200">
            
            {/* Drawer Top Bar */}
            <div className="p-4 sm:p-5 border-b border-[#E1E0DC] flex items-center justify-between bg-white/80 backdrop-blur-xs sticky top-0 z-10">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="font-display text-xl font-bold tracking-[0.2em] text-[#090808] uppercase"
              >
                {BRAND_NAME}
              </Link>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex items-center gap-1 text-[11px] font-bold tracking-widest text-[#302F2E] hover:text-[#090808] p-1.5 uppercase transition-colors"
                aria-label="Close navigation menu"
              >
                <span>CLOSE</span>
                <X size={18} />
              </button>
            </div>

            {/* Navigation Body */}
            <div className="p-5 sm:p-6 space-y-7 flex-1">
              
              {/* 1. CUSTOMIZE HIGHLIGHT BANNER */}
              <div>
                <Link
                  to="/customize"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between p-3.5 bg-[#090808] text-white hover:bg-[#302F2E] transition-colors shadow-sm"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles size={16} className="text-white" />
                    <span className="font-display text-sm font-bold tracking-widest uppercase">
                      CUSTOMIZE YOUR WEARABLE
                    </span>
                  </div>
                  <ArrowRight size={15} />
                </Link>
              </div>

              {/* 2. SHOP CATEGORIES */}
              <div className="space-y-2.5">
                <p className="text-[10px] font-mono font-bold tracking-[0.25em] text-[#BEBDBB] uppercase">
                  SHOP
                </p>
                <div className="space-y-1">
                  {NAV_LINKS.map((item) => (
                    <Link
                      key={item.label}
                      to={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between py-2 px-3 text-base font-display font-semibold tracking-wider text-[#090808] uppercase hover:bg-[#E1E0DC] transition-colors"
                    >
                      <span>{item.label}</span>
                      <ChevronRight size={15} className="text-[#BEBDBB]" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* 3. DISCOVER / COLLECTIONS */}
              <div className="space-y-2.5 pt-2 border-t border-[#E1E0DC]">
                <p className="text-[10px] font-mono font-bold tracking-[0.25em] text-[#BEBDBB] uppercase">
                  DISCOVER
                </p>
                <div className="space-y-1">
                  <Link
                    to="/shop"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between py-1.5 px-3 text-sm font-medium tracking-wide text-[#302F2E] hover:text-[#090808] hover:bg-[#E1E0DC] transition-colors"
                  >
                    <span>New Collection</span>
                    <ChevronRight size={13} className="text-[#BEBDBB]" />
                  </Link>
                  <Link
                    to="/shop"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between py-1.5 px-3 text-sm font-medium tracking-wide text-[#302F2E] hover:text-[#090808] hover:bg-[#E1E0DC] transition-colors"
                  >
                    <span>Best Sellers</span>
                    <ChevronRight size={13} className="text-[#BEBDBB]" />
                  </Link>
                  <Link
                    to="/shop"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between py-1.5 px-3 text-sm font-medium tracking-wide text-[#302F2E] hover:text-[#090808] hover:bg-[#E1E0DC] transition-colors"
                  >
                    <span>Featured Pieces</span>
                    <ChevronRight size={13} className="text-[#BEBDBB]" />
                  </Link>
                </div>
              </div>

              {/* 4. ACCOUNT & ORDERS */}
              <div className="space-y-2.5 pt-2 border-t border-[#E1E0DC]">
                <p className="text-[10px] font-mono font-bold tracking-[0.25em] text-[#BEBDBB] uppercase">
                  ACCOUNT
                </p>
                <div className="space-y-1">
                  <Link
                    to="/account"
                    onClick={(e) => {
                      setMobileMenuOpen(false)
                      handleAccountClick(e)
                    }}
                    className="flex items-center justify-between py-1.5 px-3 text-sm font-medium tracking-wide text-[#302F2E] hover:text-[#090808] hover:bg-[#E1E0DC] transition-colors"
                  >
                    <span>Account Profile</span>
                    <ChevronRight size={13} className="text-[#BEBDBB]" />
                  </Link>
                  <Link
                    to="/account/wishlist"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between py-1.5 px-3 text-sm font-medium tracking-wide text-[#302F2E] hover:text-[#090808] hover:bg-[#E1E0DC] transition-colors"
                  >
                    <span>Saved Wishlist</span>
                    <ChevronRight size={13} className="text-[#BEBDBB]" />
                  </Link>
                  <Link
                    to="/account/orders"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between py-1.5 px-3 text-sm font-medium tracking-wide text-[#302F2E] hover:text-[#090808] hover:bg-[#E1E0DC] transition-colors"
                  >
                    <span>Track Orders</span>
                    <ChevronRight size={13} className="text-[#BEBDBB]" />
                  </Link>
                </div>
              </div>

              {/* 5. SYSTEM & SEARCH */}
              <div className="space-y-2 pt-2 border-t border-[#E1E0DC]">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false)
                    setSearchModalOpen(true)
                  }}
                  className="flex items-center justify-between w-full py-2 px-3 text-xs font-mono font-bold uppercase tracking-wider text-[#302F2E] hover:bg-[#E1E0DC] transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Search size={14} />
                    SEARCH CATALOG
                  </span>
                  <span className="text-[10px] text-[#BEBDBB]">⌘K</span>
                </button>
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between w-full py-2 px-3 text-xs font-mono font-bold uppercase tracking-wider text-[#302F2E] hover:bg-[#E1E0DC] transition-colors"
                >
                  <span>ADMIN CONTROL CENTER</span>
                  <ChevronRight size={13} className="text-[#BEBDBB]" />
                </Link>
              </div>

            </div>

            {/* Drawer Bottom Bar with Cart Action */}
            <div className="p-4 sm:p-5 border-t border-[#E1E0DC] bg-white space-y-3">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false)
                  openDrawer()
                }}
                className="w-full py-3 bg-[#090808] text-white flex items-center justify-center gap-2 text-xs font-display font-bold uppercase tracking-widest hover:bg-[#302F2E] transition-colors shadow-md"
              >
                <ShoppingBag size={16} />
                <span>SHOPPING BAG ({cartItemCount})</span>
              </button>

              <div className="text-center text-[10px] text-[#BEBDBB] font-mono tracking-widest uppercase">
                © {new Date().getFullYear()} {BRAND_NAME}. WEAR YOUR MOOD.
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Global Search Overlay Modal */}
      <SearchModal isOpen={searchModalOpen} onClose={() => setSearchModalOpen(false)} />

      {/* Global Auth Modal */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </>
  )
}

