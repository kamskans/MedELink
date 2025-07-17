'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  email: string
  name: string
  userType: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name: string, userType: string) => Promise<void>
  signOut: () => Promise<void>
  checkAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error('Auth check error:', error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    const response = await fetch('/api/auth/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Sign in failed')
    }

    const userData = await response.json()
    setUser(userData.user)
    
    // Redirect based on user type and onboarding status
    if (userData.user.userType === 'CASE_MANAGER') {
      if (userData.onboardingStatus !== 'COMPLETED') {
        router.push('/onboarding')
      } else {
        router.push('/dashboard')
      }
    } else if (userData.user.userType === 'INDIVIDUAL_PRACTITIONER') {
      if (userData.onboardingStatus !== 'COMPLETED') {
        router.push('/practitioner-onboarding')
      } else {
        router.push('/dashboard')
      }
    }
  }

  const signUp = async (email: string, password: string, name: string, userType: string) => {
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name, userType })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Sign up failed')
    }

    const userData = await response.json()
    setUser(userData.user)
    
    // Redirect to onboarding
    if (userType === 'CASE_MANAGER') {
      router.push('/onboarding')
    } else {
      router.push('/practitioner-onboarding')
    }
  }

  const signOut = async () => {
    try {
      await fetch('/api/auth/signout', { method: 'POST' })
      setUser(null)
      router.push('/sign-in')
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, checkAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}