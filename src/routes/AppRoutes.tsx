import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { MainLayout } from '@/layouts/MainLayout'
import { Home } from '@/pages/Home'
import { Shop } from '@/pages/Shop'
import { ProductDetail } from '@/pages/ProductDetail'
import { Customize } from '@/pages/Customize'
import { Cart } from '@/pages/Cart'
import { Checkout } from '@/pages/Checkout'
import { OrderSuccess } from '@/pages/OrderSuccess'
import { AccountLayout } from '@/layouts/AccountLayout'
import { AccountOverview } from '@/pages/account/AccountOverview'
import { AccountOrders } from '@/pages/account/AccountOrders'
import { AccountDesigns } from '@/pages/account/AccountDesigns'
import { AccountAddresses } from '@/pages/account/AccountAddresses'
import { AdminLayout } from '@/layouts/AdminLayout'
import { AdminDashboard } from '@/pages/admin/AdminDashboard'
import { AdminOrders } from '@/pages/admin/AdminOrders'
import { AdminProducts } from '@/pages/admin/AdminProducts'
import { DesignSystemPreview } from '@/pages/DesignSystemPreview'

import { AdminRouteGuard } from '@/components/admin/AdminRouteGuard'

import { AdminFulfillment } from '@/pages/admin/AdminFulfillment'
import { AdminProductionQueue } from '@/pages/admin/AdminProductionQueue'

import { AdminProductForm } from '@/pages/admin/AdminProductForm'
import { AdminInventory } from '@/pages/admin/AdminInventory'
import { AdminCategories } from '@/pages/admin/AdminCategories'
import { AdminMedia } from '@/pages/admin/AdminMedia'
import { AdminHomepageCMS } from '@/pages/admin/AdminHomepageCMS'
import { AdminCMSVersions } from '@/pages/admin/AdminCMSVersions'
import { AdminCustomers } from '@/pages/admin/AdminCustomers'
import { AdminDesigns } from '@/pages/admin/AdminDesigns'
import { AdminStaff } from '@/pages/admin/AdminStaff'
import { AdminAuditLogs } from '@/pages/admin/AdminAuditLogs'
import { AdminSettings } from '@/pages/admin/AdminSettings'

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* Public Commerce Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/shop/:category" element={<Shop />} />
        <Route path="/product/:slug" element={<ProductDetail />} />
        
        {/* Interactive Customizer Studio */}
        <Route path="/customize" element={<Customize />} />
        <Route path="/customize/:productId" element={<Customize />} />

        {/* Cart & Checkout Flow */}
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-success/:orderId" element={<OrderSuccess />} />

        {/* Member Portal */}
        <Route path="/account" element={<AccountLayout />}>
          <Route index element={<AccountOverview />} />
          <Route path="orders" element={<AccountOrders />} />
          <Route path="designs" element={<AccountDesigns />} />
          <Route path="addresses" element={<AccountAddresses />} />
          <Route path="wishlist" element={<AccountDesigns />} />
        </Route>

        {/* Admin Control Center (Secured via RBAC Guard) */}
        <Route
          path="/admin"
          element={
            <AdminRouteGuard>
              <AdminLayout />
            </AdminRouteGuard>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="fulfillment" element={<AdminFulfillment />} />
          <Route path="fulfillment/production" element={<AdminProductionQueue />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="products/new" element={<AdminProductForm />} />
          <Route path="products/:id/edit" element={<AdminProductForm />} />
          <Route path="inventory" element={<AdminInventory />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="media" element={<AdminMedia />} />
          <Route path="cms/homepage" element={<AdminHomepageCMS />} />
          <Route path="homepage" element={<AdminHomepageCMS />} />
          <Route path="cms/versions" element={<AdminCMSVersions />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="designs" element={<AdminDesigns />} />
          <Route path="staff" element={<AdminStaff />} />
          <Route path="users" element={<AdminStaff />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="audit-logs" element={<AdminAuditLogs />} />
        </Route>

        {/* Design System Reference */}
        <Route path="/design-system" element={<DesignSystemPreview />} />

        {/* 404 Not Found Fallback */}
        <Route
          path="*"
          element={
            <div className="py-32 text-center space-y-4">
              <p className="text-[11px] font-bold tracking-[0.3em] text-[#BEBDBB] uppercase">
                ERROR 404
              </p>
              <h1 className="font-display text-4xl font-bold uppercase tracking-tight text-[#090808]">
                PAGE ARCHIVE NOT FOUND
              </h1>
              <p className="text-xs text-[#302F2E] max-w-sm mx-auto">
                The requested URL does not exist or has been shifted in the collection.
              </p>
            </div>
          }
        />
      </Route>
    </Routes>
  )
}

export default AppRoutes
