
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://kunmckljzbnqjaswihou.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt1bm1ja2xqemJucWphc3dpaG91Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzAyMzE1ODIsImV4cCI6MjA0NTgwNzU4Mn0.TqmKi2HK9Ngzo0FHAwG9fsKpM1x1r26x2zWaI0rluoo"

// Create a single supabase client for the entire app
export const supabase = createClient(supabaseUrl, supabaseKey)
