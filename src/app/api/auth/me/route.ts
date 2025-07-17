import { NextRequest, NextResponse } from 'next/server'
import sql from '@/lib/db'
import { verifyToken } from '@/lib/auth-utils'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value
    
    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    // Get user data
    const users = await sql`
      SELECT id, email, name, user_type
      FROM users
      WHERE id = ${payload.userId}
    `

    if (users.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(users[0])
  } catch (error: any) {
    console.error('Auth check error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to check auth' },
      { status: 500 }
    )
  }
}