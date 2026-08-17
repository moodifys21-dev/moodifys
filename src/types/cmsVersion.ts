import { HomepageCMSConfig } from '@/types/cms'

export interface CMSVersion {
  id: string
  versionNumber: string
  changeSummary: string
  authorName: string
  publishedAt: string
  isActive: boolean
  snapshot: HomepageCMSConfig
}

export interface ScheduledPublication {
  id: string
  scheduledAt: string
  title: string
  authorName: string
  snapshot: HomepageCMSConfig
  status: 'PENDING' | 'EXECUTED' | 'CANCELLED'
  createdAt: string
}
