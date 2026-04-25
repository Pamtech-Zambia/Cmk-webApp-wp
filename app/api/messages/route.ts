import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Get Chimwemwe's actual user ID from auth.users via email
async function getChimwemweUserId() {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', 'chimwemwe@happybakes.com')
      .single()

    if (error || !data) return null
    return data.id
  } catch (error) {
    console.error('Error getting Chimwemwe ID:', error)
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, message, email } = body

    if (!name || !message) {
      return NextResponse.json(
        { error: 'Name and message are required' },
        { status: 400 }
      )
    }

    const chimwemweId = await getChimwemweUserId()
    if (!chimwemweId) {
      return NextResponse.json(
        { error: 'Could not post message at this time' },
        { status: 500 }
      )
    }

    const { data, error } = await supabase
      .from('birthday_messages')
      .insert([
        {
          owner_id: chimwemweId,
          sender_name: name,
          sender_email: email,
          message,
        },
      ])
      .select()

    if (error) throw error
    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const chimwemweId = await getChimwemweUserId()
    if (!chimwemweId) {
      return NextResponse.json([])
    }

    const { data, error } = await supabase
      .from('birthday_messages')
      .select('*')
      .eq('owner_id', chimwemweId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return NextResponse.json(data || [])
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
