const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: './config.env' })

const supabaseUrl = process.env.SUPABASE_URL
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Create Supabase client with anon key for client-side operations
const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Create Supabase admin client with service role key for server-side operations
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

module.exports = {
  supabase,
  supabaseAdmin,
  auth: supabase.auth,
  db: supabase.from
}

// Helper functions for common operations
const getUser = async (token) => {
  const { data: { user }, error } = await supabase.auth.getUser(token)
  if (error) throw error
  return user
}

const signOut = async (token) => {
  const { error } = await supabase.auth.signOut(token)
  if (error) throw error
}

// Daily logs helpers
const createDailyLog = async (logData) => {
  const { data, error } = await supabase
    .from('daily_logs')
    .insert([logData])
    .select()
  
  if (error) throw error
  return data[0]
}

const getDailyLogs = async (userId, limit = 50) => {
  const { data, error } = await supabase
    .from('daily_logs')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)
  
  if (error) throw error
  return data
}

const getDailyLogById = async (id) => {
  const { data, error } = await supabase
    .from('daily_logs')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) throw error
  return data
}

const updateDailyLog = async (id, updates) => {
  const { data, error } = await supabase
    .from('daily_logs')
    .update(updates)
    .eq('id', id)
    .select()
  
  if (error) throw error
  return data[0]
}

const deleteDailyLog = async (id) => {
  const { error } = await supabase
    .from('daily_logs')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}

// Profile helpers
const getUserProfile = async (userId) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  
  if (error) throw error
  return data
}

const updateUserProfile = async (userId, updates) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
  
  if (error) throw error
  return data[0]
}

const createUserProfile = async (profileData) => {
  const { data, error } = await supabase
    .from('profiles')
    .insert([profileData])
    .select()
  
  if (error) throw error
  return data[0]
}

module.exports = {
  supabase,
  supabaseAdmin,
  auth: supabase.auth,
  db: supabase.from,
  getUser,
  signOut,
  createDailyLog,
  getDailyLogs,
  getDailyLogById,
  updateDailyLog,
  deleteDailyLog,
  getUserProfile,
  updateUserProfile,
  createUserProfile
} 