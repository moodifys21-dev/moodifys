import React, { useState } from 'react'
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Package,
  Truck,
  Shirt,
  Boxes,
  Users,
  Sparkles,
  LayoutTemplate,
  Layers,
  Image,
  UserCheck,
  Shield,
  History,
  ShieldCheck,
  ArrowLeft,
  Bell,
  Search,
  LogOut,
  Menu,
  X,
  ChevronDown,
  CheckCircle2,
  Settings as SettingsIcon,
} from 'lucide-react'
import { useAdminAuth } from '@/hooks/useAdminAuth'
import { AdminRole, ROLE_LABELS, PermissionKey } from '@/types/admin'

interface NavGroup {
  title: string
  items: {
    label: string
    href: string
    icon: React.ReactNode
    permission: PermissionKey
    end?: boolean
  }[]
}

export const AdminLayout: React.FC = () => {
  const { adminUser, activeRole, hasPermission, setDemoRole, logoutAdmin } = useAdminAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  const allRoles: AdminRole[] = [
    'SUPER_ADMIN',
    'ADMIN',
    'MANAGER',
    'FULFILLMENT_MANAGER',
    'INVENTORY_MANAGER',
    'CONTENT_MANAGER',
    'CUSTOMER_SUPPORT',
  ]

  const navGroups: NavGroup[] = [
    {
      title: 'OVERVIEW',
      items: [
        {
          label: 'DASHBOARD',
          href: '/admin',
          icon: <LayoutDashboard size={15} />,
          permission: 'dashboard.view',
          end: true,
        },
      ],
    },
    {
      title: 'STORE',
      items: [
        {
          label: 'ORDERS',
          href: '/admin/orders',
          icon: <Package size={15} />,
          permission: 'orders.view',
        },
        {
          label: 'FULFILLMENT',
          href: '/admin/fulfillment',
          icon: <Truck size={15} />,
          permission: 'orders.fulfill',
        },
        {
          label: 'PRODUCTS',
          href: '/admin/products',
          icon: <Shirt size={15} />,
          permission: 'products.view',
        },
        {
          label: 'INVENTORY',
          href: '/admin/inventory',
          icon: <Boxes size={15} />,
          permission: 'inventory.view',
        },
        {
          label: 'CUSTOMERS',
          href: '/admin/customers',
          icon: <Users size={15} />,
          permission: 'customers.view',
        },
        {
          label: 'DESIGNS',
          href: '/admin/designs',
          icon: <Sparkles size={15} />,
          permission: 'orders.fulfill',
        },
      ],
    },
    {
      title: 'CONTENT & CMS',
      items: [
        {
          label: 'HOMEPAGE CMS',
          href: '/admin/cms/homepage',
          icon: <LayoutTemplate size={15} />,
          permission: 'homepage.view',
        },
        {
          label: 'CMS VERSIONS',
          href: '/admin/cms/versions',
          icon: <History size={15} />,
          permission: 'homepage.publish',
        },
        {
          label: 'CATEGORIES',
          href: '/admin/categories',
          icon: <Layers size={15} />,
          permission: 'categories.view',
        },
        {
          label: 'MEDIA LIBRARY',
          href: '/admin/media',
          icon: <Image size={15} />,
          permission: 'media.view',
        },
      ],
    },
    {
      title: 'SYSTEM & SECURITY',
      items: [
        {
          label: 'SETTINGS',
          href: '/admin/settings',
          icon: <SettingsIcon size={15} />,
          permission: 'settings.view',
        },
        {
          label: 'ADMIN STAFF & RBAC',
          href: '/admin/staff',
          icon: <UserCheck size={15} />,
          permission: 'admin.users.view',
        },
        {
          label: 'AUDIT LOGS',
          href: '/admin/audit-logs',
          icon: <Shield size={15} />,
          permission: 'audit_logs.view',
        },
      ],
    },
  ]

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    // Route search to orders or products based on query
    if (searchQuery.startsWith('ord_') || searchQuery.startsWith('#')) {
      navigate(`/admin/orders?q=${encodeURIComponent(searchQuery)}`)
    } else {
      navigate(`/admin/products?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  const handleLogout = () => {
    logoutAdmin()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-[#F0EFED] text-[#090808] flex flex-col font-sans">
      
      {/* 1. TOP ADMIN CONTROL HEADER */}
      <header className="sticky top-0 z-40 bg-[#090808] text-white border-b border-[#302F2E] px-4 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left branding & Mobile Trigger */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 text-[#BEBDBB] hover:text-white"
            aria-label="Toggle Sidebar"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <Link to="/admin" className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-white text-[#090808] flex items-center justify-center font-display font-black text-xs tracking-tighter">
              M
            </div>
            <div>
              <span className="font-display font-bold text-sm tracking-[0.2em] uppercase">
                MOODIFYS
              </span>
              <span className="ml-2 text-[9px] font-mono font-bold tracking-[0.25em] bg-[#302F2E] text-[#BEBDBB] px-1.5 py-0.5 uppercase">
                CONTROL CENTER
              </span>
            </div>
          </Link>
        </div>

        {/* Center Global Admin Search */}
        <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center max-w-md w-full mx-8">
          <div className="relative w-full">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#BEBDBB]"
            />
            <input
              type="text"
              placeholder="Quick search SKU, Order ID, Customer, Design..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1A1919] border border-[#302F2E] pl-9 pr-4 py-1.5 text-xs text-white placeholder-[#BEBDBB]/60 focus:outline-none focus:border-white transition-colors"
            />
          </div>
        </form>

        {/* Right Admin Profile & Role Selector */}
        <div className="flex items-center gap-3">
          
          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="p-2 text-[#BEBDBB] hover:text-white relative transition-colors"
              title="Notifications"
            >
              <Bell size={16} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-[#090808] shadow-2xl z-50 text-[#090808] p-4 text-xs space-y-3">
                <div className="flex items-center justify-between border-b border-[#E1E0DC] pb-2">
                  <span className="font-display font-bold uppercase text-[10px] tracking-widest">
                    SYSTEM NOTIFICATIONS (3)
                  </span>
                  <button
                    type="button"
                    onClick={() => setNotificationsOpen(false)}
                    className="text-[10px] font-mono text-[#9E2A2B]"
                  >
                    CLOSE
                  </button>
                </div>
                <div className="space-y-2">
                  <div className="p-2 bg-[#F0EFED] border border-[#E1E0DC] space-y-1">
                    <p className="font-bold text-[11px] text-[#090808]">NEW BESPOKE ORDER #ORD-8821</p>
                    <p className="text-[10px] text-[#302F2E]">Custom print waiting for QC clearance.</p>
                  </div>
                  <div className="p-2 bg-amber-50 border border-amber-200 space-y-1">
                    <p className="font-bold text-[11px] text-amber-900">LOW STOCK ALERT: ACID WASH TEE</p>
                    <p className="text-[10px] text-amber-800">Only 2 units remaining in Black / L.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Role Switching & Profile Badge */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="hidden sm:flex items-center gap-2 bg-[#1A1919] hover:bg-[#302F2E] border border-[#302F2E] px-2.5 py-1.5 transition-colors"
            >
              <ShieldCheck size={14} className="text-emerald-400" />
              <div className="text-left">
                <p className="text-[10px] font-bold text-white tracking-wider uppercase leading-none">
                  {activeRole ? ROLE_LABELS[activeRole] : 'AUTHENTICATING'}
                </p>
                {adminUser?.email && (
                  <p className="text-[9px] font-mono text-[#BEBDBB] truncate max-w-[140px] leading-tight mt-0.5">
                    {adminUser.email}
                  </p>
                )}
              </div>
              <ChevronDown size={12} className="text-[#BEBDBB]" />
            </button>

            {roleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-[#090808] shadow-2xl z-50 text-[#090808] p-3 text-xs space-y-2">
                <p className="text-[9px] font-mono font-bold tracking-widest text-[#BEBDBB] uppercase">
                  SWITCH SECURITY CONTEXT (DEMO)
                </p>
                <div className="space-y-1">
                  {allRoles.map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => {
                        setDemoRole(role)
                        setRoleDropdownOpen(false)
                      }}
                      className={`w-full text-left p-1.5 flex items-center justify-between text-[11px] font-bold uppercase transition-colors ${
                        activeRole === role
                          ? 'bg-[#090808] text-white'
                          : 'hover:bg-[#F0EFED] text-[#302F2E]'
                      }`}
                    >
                      <span>{ROLE_LABELS[role]}</span>
                      {activeRole === role && <CheckCircle2 size={12} />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick Exit to Store */}
          <Link
            to="/shop"
            className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold uppercase text-[#BEBDBB] hover:text-white transition-colors"
          >
            <ArrowLeft size={13} />
            <span>STORE</span>
          </Link>

          {/* Logout */}
          <button
            type="button"
            onClick={handleLogout}
            className="p-1.5 text-[#BEBDBB] hover:text-rose-400 transition-colors"
            title="Sign out of Admin Control Center"
          >
            <LogOut size={16} />
          </button>

        </div>
      </header>

      {/* 2. BODY CONTAINER (SIDEBAR + CONTENT) */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* DESKTOP SIDEBAR */}
        <aside className="hidden lg:block w-64 bg-white border-r border-[#E1E0DC] overflow-y-auto select-none p-4 space-y-6 flex-shrink-0">
          {navGroups.map((group) => {
            // Filter items that current admin has permission to view
            const visibleItems = group.items.filter((item) => hasPermission(item.permission))
            if (visibleItems.length === 0) return null

            return (
              <div key={group.title} className="space-y-1">
                <p className="text-[9px] font-mono font-bold tracking-[0.25em] text-[#BEBDBB] uppercase px-3 py-1">
                  {group.title}
                </p>
                <div className="space-y-0.5">
                  {visibleItems.map((item) => (
                    <NavLink
                      key={item.href}
                      to={item.href}
                      end={item.end}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2 text-xs font-bold tracking-wider uppercase transition-colors ${
                          isActive
                            ? 'bg-[#090808] text-white shadow-xs'
                            : 'text-[#302F2E] hover:bg-[#F0EFED] hover:text-[#090808]'
                        }`
                      }
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </NavLink>
                  ))}
                </div>
              </div>
            )
          })}
        </aside>

        {/* MOBILE SLIDING SIDEBAR */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative w-72 max-w-full bg-white h-full p-4 overflow-y-auto space-y-6 z-10 shadow-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-[#E1E0DC]">
                <span className="font-display font-bold uppercase text-xs tracking-widest text-[#090808]">
                  ADMIN NAVIGATION
                </span>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 text-[#090808]"
                >
                  <X size={18} />
                </button>
              </div>

              {navGroups.map((group) => {
                const visibleItems = group.items.filter((item) => hasPermission(item.permission))
                if (visibleItems.length === 0) return null

                return (
                  <div key={group.title} className="space-y-1">
                    <p className="text-[9px] font-mono font-bold tracking-[0.25em] text-[#BEBDBB] uppercase px-3 py-1">
                      {group.title}
                    </p>
                    <div className="space-y-0.5">
                      {visibleItems.map((item) => (
                        <NavLink
                          key={item.href}
                          to={item.href}
                          end={item.end}
                          onClick={() => setMobileMenuOpen(false)}
                          className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2 text-xs font-bold tracking-wider uppercase transition-colors ${
                              isActive
                                ? 'bg-[#090808] text-white'
                                : 'text-[#302F2E] hover:bg-[#F0EFED]'
                            }`
                          }
                        >
                          {item.icon}
                          <span>{item.label}</span>
                        </NavLink>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* MAIN VIEWPORT */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>

      </div>
    </div>
  )
}

export default AdminLayout
