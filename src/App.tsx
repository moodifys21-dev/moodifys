import React, { useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AppRoutes } from '@/routes/AppRoutes'
import { useCMSStore } from '@/stores/cmsStore'

export const App: React.FC = () => {
  const { initializeStore } = useCMSStore()

  useEffect(() => {
    // Fetch latest authoritative published CMS content from Supabase and subscribe to Realtime updates
    initializeStore()
  }, [initializeStore])

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App

