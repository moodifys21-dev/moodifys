import React from 'react'
import { Outlet } from 'react-router-dom'
import { AnnouncementBar } from '@/components/layout/AnnouncementBar'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { CartDrawer } from '@/components/cart/CartDrawer'

export interface MainLayoutProps {
  children?: React.ReactNode
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#F0EFED] text-[#090808]">
      <AnnouncementBar />
      <Header />
      <main className="flex-grow">
        {children || <Outlet />}
      </main>
      <Footer />
      {/* Global Slide-Over Shopping Bag */}
      <CartDrawer />
    </div>
  )
}

export default MainLayout
