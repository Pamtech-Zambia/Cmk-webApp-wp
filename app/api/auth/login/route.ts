import { NextRequest, NextResponse } from 'next/server'
import { loginUser } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const { error, user } = await loginUser(email, password)

    if (error || !user) {
      return NextResponse.json(
        { error: error || 'Invalid email or password' },
        { status: 401 }
      )
    }

    const response = NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          profile: user.profile,
        },
      },
      { status: 200 }
    )

    // Set secure cookie with token
    response.cookies.set({
      name: 'auth_token',
      value: user.accessToken || '',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
