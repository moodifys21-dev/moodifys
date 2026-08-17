import React from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { Container } from '@/components/ui/Container'
import { useAuthStore } from '@/stores/authStore'
import {
  User,
  Package,
  Sparkles,
  MapPin,
  LogOut,
  ChevronRight,
} from 'lucide-react'

export const AccountLayout: React.FC = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const navItems = [
    { label: 'OVERVIEW', href: '/account', icon: <User size={16} /> },
    { label: 'MY ORDERS', href: '/account/orders', icon: <Package size={16} /> },
    { label: 'SAVED DESIGNS', href: '/account/designs', icon: <Sparkles size={16} /> },
    { label: 'ADDRESSES', href: '/account/addresses', icon: <MapPin size={16} /> },
  ]

  return (
    <div className="w-full py-8 md:py-12 bg-[#F0EFED] min-h-[calc(100vh-14rem)]">
      <Container size="wide">
        
        {/* Page Header */}
        <div className="pb-6 mb-8 border-b border-[#BEBDBB]/40 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold tracking-[0.2em] text-[#BEBDBB] uppercase mb-1">
              MEMBER PORTAL
            </p>
            <h1 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#090808]">
              {user?.fullName ? `WELCOME, ${user.fullName.toUpperCase()}` : 'MY ACCOUNT'}
            </h1>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs font-bold tracking-widest text-[#302F2E] hover:text-red-600 uppercase transition-colors"
          >
            <LogOut size={14} />
            <span>SIGN OUT</span>
          </button>
        </div>

        {/* 2-Column Portal */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* Left Navigation Sidebar */}
          <div className="lg:col-span-3 bg-white border border-[#E1E0DC] p-4 rounded-sm space-y-1 select-none">
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                end={item.href === '/account'}
                className={({ isActive }) =>
                  `flex items-center justify-between p-3 text-xs font-bold tracking-wider uppercase rounded-sm transition-colors ${
                    isActive
                      ? 'bg-[#090808] text-white'
                      : 'text-[#302F2E] hover:bg-[#F0EFED] hover:text-[#090808]'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                <ChevronRight size={14} className="opacity-60" />
              </NavLink>
            ))}
          </div>

          {/* Right Tab Content Viewport */}
          <div className="lg:col-span-9">
            <Outlet />
          </div>

        </div>

      </Container>
    </div>
  )
}

export default AccountLayout
