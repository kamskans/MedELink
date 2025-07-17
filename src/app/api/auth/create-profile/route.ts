import { NextRequest, NextResponse } from 'next/server'
import sql, { createUser, createCaseManagerProfile, createIndividualPractitionerProfile } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, name, userType, stackUserId } = body

    if (!email || !userType || !stackUserId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create user in our database
    const user = await createUser(email, name, userType, stackUserId)

    // Create profile based on user type
    if (userType === 'CASE_MANAGER') {
      await createCaseManagerProfile(user.id)
    } else if (userType === 'INDIVIDUAL_PRACTITIONER') {
      await createIndividualPractitionerProfile(user.id)
    }

    return NextResponse.json({ 
      success: true, 
      userId: user.id,
      userType: user.user_type 
    })
  } catch (error: any) {
    console.error('Create profile error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create profile' },
      { status: 500 }
    )
  }
}