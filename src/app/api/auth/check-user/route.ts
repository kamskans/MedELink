import { NextRequest, NextResponse } from 'next/server'
import sql, { getCaseManagerProfile, getIndividualPractitionerProfile } from '@/lib/db'
import { verifyToken } from '@/lib/auth-utils'

export async function GET(request: NextRequest) {
  try {
    // Get current user from auth token
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

    // Get user from our database
    const users = await sql`
      SELECT id, email, name, user_type FROM users WHERE id = ${payload.userId}
    `
    const user = users[0]
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Get profile based on user type
    let profile = null
    let onboardingStatus = 'NOT_STARTED'
    
    if (user.user_type === 'CASE_MANAGER') {
      profile = await getCaseManagerProfile(user.id)
      if (profile) {
        onboardingStatus = profile.onboarding_status
      }
    } else if (user.user_type === 'INDIVIDUAL_PRACTITIONER') {
      profile = await getIndividualPractitionerProfile(user.id)
      if (profile) {
        onboardingStatus = profile.onboarding_status
      }
    }

    return NextResponse.json({
      userId: user.id,
      userType: user.user_type,
      onboardingStatus,
      profile
    })
  } catch (error: any) {
    console.error('Check user error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to check user' },
      { status: 500 }
    )
  }
}