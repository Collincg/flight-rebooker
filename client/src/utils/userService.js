import { supabase } from '../config/supabase'

export const getUserId = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return user?.id || null
}

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export const getSessionToken = async () => {
  const { data: { session } } = await supabase.auth.getSession()
  return session?.access_token || null
}

export const isAuthenticated = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return !!user
}

export const clearUserId = async () => {
  await supabase.auth.signOut()
}

export const getOrCreateUserId = async () => {
  return await getUserId()
}