'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function ProtectedRoute({ 
  children,
  requireOnboarding = false 
}: { 
  children: React.ReactNode
  requireOnboarding?: boolean 
}) {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    async function checkAuth() {
      if (authLoading) {
        return
      }
      
      if (!user) {
        // Not authenticated
        router.push('/sign-in')
        return
      }

      if (requireOnboarding) {
        // Check onboarding status
        try {
          const response = await fetch('/api/auth/check-user')
          if (response.ok) {
            const data = await response.json()
            if (data.onboardingStatus !== 'COMPLETED') {
              // Redirect to appropriate onboarding page
              if (data.userType === 'CASE_MANAGER') {
                router.push('/onboarding')
              } else if (data.userType === 'INDIVIDUAL_PRACTITIONER') {
                router.push('/practitioner-onboarding')
              }
              return
            }
          }
        } catch (error) {
          console.error('Error checking onboarding status:', error)
        }
      }

      setIsAuthorized(true)
      setIsLoading(false)
    }

    checkAuth()
  }, [user, router, requireOnboarding, authLoading])

  if (isLoading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isAuthorized) {
    return null
  }

  return <>{children}</>
}