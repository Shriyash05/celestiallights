import { createClient } from '@supabase/supabase-js'

// Get Supabase credentials from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for authentication
export interface AuthUser {
  id: string
  email: string
  role?: string
}

// Helper function to get current user
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// Helper function to check if user is admin
export const isAdmin = async (user: any) => {
  if (!user) return false
  
  // For now, we'll check if the user's email matches our admin emails
  // In a production environment, you would check a role column in your database
  const adminEmails = [
    'admin@celestiallights.com',
    'info.celestiallight@gmail.com'
  ]
  
  return adminEmails.includes(user.email)
}