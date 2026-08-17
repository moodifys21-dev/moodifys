import React from 'react'
import { useLocation } from 'react-router-dom'
import { useAdminAuth } from '@/hooks/useAdminAuth'
import { AdminAccessDenied } from '@/pages/admin/AdminAccessDenied'

interface AdminRouteGuardProps {
  children: React.ReactNode
}

export const AdminRouteGuard: React.FC<AdminRouteGuardProps> = ({ children }) => {
  const { isAdmin, canAccessRoute, isLoading } = useAdminAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-8 h-8 border-2 border-[#090808] border-t-transparent animate-spin" />
        <p className="font-mono text-xs font-bold tracking-widest uppercase text-[#302F2E]">
          VERIFYING CRYPTOGRAPHIC ADMIN SESSION...
        </p>
      </div>
    )
  }

  // 1. Must have an active admin session
  if (!isAdmin) {
    return <AdminAccessDenied />
  }

  // 2. Must possess specific granular permissions for this path
  if (!canAccessRoute(location.pathname)) {
    return <AdminAccessDenied />
  }

  // Permitted to render
  return <>{children}</>
}

export default AdminRouteGuard
