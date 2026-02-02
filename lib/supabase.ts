import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://veqnfkkbwevczlufipmp.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_j1inkl4kRKqXCcHkPZ4I0A_GcNq8D2i'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const adminEmail = 'emilyboutique@arubapec.it'
export const adminPassword = '123Emily!'
