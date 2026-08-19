import { createClient } from '@supabase/supabase-js'

// Production defaults to guarantee multi-device connectivity even if Vercel env is omitted
const DEFAULT_SUPABASE_URL = 'https://wybrkuaimsecqeosksea.supabase.co'
const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_Pn_YFs4z_yzdUs-Kkn9gQg_l59T5Qv2'

const rawUrl = import.meta.env.VITE_SUPABASE_URL || ''
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Filter out placeholder strings like 'your_supabase_anon_key'
const isPlaceholder = (val: string) => !val || val.includes('your_supabase') || val.includes('placeholder')

const supabaseUrl = !isPlaceholder(rawUrl) ? rawUrl : DEFAULT_SUPABASE_URL
const supabaseAnonKey = !isPlaceholder(rawKey) ? rawKey : DEFAULT_SUPABASE_ANON_KEY

// Check if credentials are valid
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey && !isPlaceholder(supabaseAnonKey))

// Create Supabase client
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null

