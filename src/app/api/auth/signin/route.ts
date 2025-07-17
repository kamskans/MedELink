import { NextRequest, NextResponse } from 'next/server'
import sql from '@/lib/db'
import { verifyPassword, generateToken } from '@/lib/auth-utils'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Missing email or password' },
        { status: 400 }
      )
    }

    // Find user
    const users = await sql`
      SELECT id, email, name, user_type, password_hash
      FROM users
      WHERE email = ${email}
    `

    if (users.length === 0) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    const user = users[0]

    // Verify password
    const isValid = await verifyPassword(password, user.password_hash)
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Check onboarding status for case managers
    let onboardingStatus = 'NOT_APPLICABLE'
    if (user.user_type === 'CASE_MANAGER') {
      const profile = await sql`
        SELECT onboarding_status
        FROM case_manager_profiles
        WHERE user_id = ${user.id}
      `
      if (profile.length > 0) {
        onboardingStatus = profile[0].onboarding_status
      }
    } else if (user.user_type === 'INDIVIDUAL_PRACTITIONER') {
      const profile = await sql`
        SELECT onboarding_status
        FROM individual_practitioner_profiles
        WHERE user_id = ${user.id}
      `
      if (profile.length > 0) {
        onboardingStatus = profile[0].onboarding_status
      }
    }

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      userType: user.user_type
    })

    // Create response
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        userType: user.user_type
      },
      onboardingStatus
    })

    // Set auth cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    })

    return response
  } catch (error: any) {
    console.error('Signin error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to sign in' },
      { status: 500 }
    )
  }
}