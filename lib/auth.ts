import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

export async function loginUser(email: string, password: string) {
  try {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    })

    if (error || !data.user) {
      return { error: error?.message || 'Login failed', user: null }
    }

    // Get profile data
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single()

    if (profileError) {
      console.error('Profile fetch error:', profileError)
    }

    return {
      error: null,
      user: {
        id: data.user.id,
        email: data.user.email,
        accessToken: data.session?.access_token,
        refreshToken: data.session?.refresh_token,
        profile,
      },
    }
  } catch (error) {
    console.error('Login error:', error)
    return { error: 'An error occurred', user: null }
  }
}

export async function getCurrentUser(token: string) {
  try {
    const client = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          authorization: `Bearer ${token}`,
        },
      },
    })

    const { data, error } = await client.auth.getUser()

    if (error || !data.user) {
      return null
    }

    // Get profile
    const { data: profile } = await client
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single()

    return {
      id: data.user.id,
      email: data.user.email,
      profile,
    }
  } catch (error) {
    console.error('Get user error:', error)
    return null
  }
}

export async function getUser(userId: string) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      return null
    }

    return data
  } catch (error) {
    console.error('Error fetching user:', error)
    return null
  }
}

export async function getProducts(userId: string) {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}

export async function getOrders(userId: string) {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*, products(name, price)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error fetching orders:', error)
    return []
  }
}

export async function getBirthdayMessages(userId: string) {
  try {
    const { data, error } = await supabase
      .from('birthday_messages')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error fetching birthday messages:', error)
    return []
  }
}
