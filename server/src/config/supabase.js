const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.SUPABASE_URL || 'https://jmkopacozxlscotgnmfz.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY


if (!supabaseUrl) {
  throw new Error('Missing SUPABASE_URL environment variable')
}

if (!supabaseServiceKey) {
  console.warn('Missing SUPABASE_SERVICE_ROLE_KEY - JWT verification will be limited')
}

const supabase = createClient(
  supabaseUrl,
  supabaseServiceKey || '',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    }
  }
)

module.exports = { supabase }