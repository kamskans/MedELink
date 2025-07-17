import { NextRequest, NextResponse } from 'next/server'
import sql, { updateCaseManagerProfile } from '@/lib/db'
import { verifyToken } from '@/lib/auth-utils'

export async function POST(request: NextRequest) {
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

    const body = await request.json()
    const { step, data } = body

    // Get user from our database
    const userResult = await sql`
      SELECT id, user_type FROM users WHERE id = ${payload.userId}
    `
    
    if (!userResult || userResult.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const user = userResult[0]

    // Update case manager profile based on step
    if (user.user_type === 'CASE_MANAGER') {
      let updateQuery = ''
      let updateData: any = {}

      if (step === 1) {
        updateData = {
          name: data.name,
          email: data.email,
          address: data.address,
          date_of_birth: data.dateOfBirth,
          phone_number: data.phoneNumber,
          qualification: data.qualification,
          qualification_year: data.qualificationYear,
          profession: data.profession,
          job_title: data.jobTitle,
          onboarding_status: 'IN_PROGRESS',
          onboarding_step: 2
        }
      } else if (step === 2) {
        updateData = {
          company_name: data.companyName,
          company_email: data.companyEmail,
          company_phone: data.companyPhone,
          business_type: data.businessType,
          rehabilitation_clients: data.rehabilitationClients,
          regulatory_body: data.regulatoryBody,
          practice_restrictions: data.practiceRestrictions,
          cqc_regulated: data.cqcRegulated,
          additional_training: data.additionalTraining,
          company_address: data.companyAddress,
          onboarding_step: 3
        }
      } else if (step === 3) {
        updateData = {
          registration_number: data.registrationNumber,
          terms_accepted: data.termsAccepted,
          onboarding_status: 'COMPLETED',
          onboarding_step: 3
        }
      }

      // Use the updated function
      await updateCaseManagerProfile(user.id, updateData)

      return NextResponse.json({ 
        success: true,
        nextStep: step < 3 ? step + 1 : null,
        completed: step === 3
      })
    }

    return NextResponse.json(
      { error: 'Invalid user type' },
      { status: 400 }
    )
  } catch (error: any) {
    console.error('Save onboarding error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to save onboarding data' },
      { status: 500 }
    )
  }
}