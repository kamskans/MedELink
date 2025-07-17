import { NextRequest, NextResponse } from 'next/server'
import sql from '@/lib/db'
import { hashPassword, generateToken, setAuthCookie } from '@/lib/auth-utils'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name, userType } = body

    if (!email || !password || !userType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await sql`
      SELECT id FROM users WHERE email = ${email}
    `
    
    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const passwordHash = await hashPassword(password)

    // Create user
    const newUser = await sql`
      INSERT INTO users (email, name, user_type, password_hash)
      VALUES (${email}, ${name}, ${userType}::user_type, ${passwordHash})
      RETURNING id, email, name, user_type
    `
    const user = newUser[0]

    // Create profile based on user type
    if (userType === 'CASE_MANAGER') {
      await sql`
        INSERT INTO case_manager_profiles (user_id)
        VALUES (${user.id})
      `
    } else if (userType === 'INDIVIDUAL_PRACTITIONER') {
      await sql`
        INSERT INTO individual_practitioner_profiles (user_id)
        VALUES (${user.id})
      `
    }

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      userType: user.user_type
    })

    // Create response and set cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        userType: user.user_type
      }
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
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create account' },
      { status: 500 }
    )
  }
}