'use client'

import { useAuth } from '@/contexts/AuthContext'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function DashboardPage() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const [userData, setUserData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await fetch('/api/auth/check-user')
        if (response.ok) {
          const data = await response.json()
          setUserData(data)
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchUserData()
    }
  }, [user])

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <ProtectedRoute requireOnboarding={true}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                  </svg>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">medElink</span>
              </div>
              
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  {user?.email || 'User'}
                </span>
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">
                Welcome to your Dashboard
              </h1>
              
              {userData && (
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      <strong>User Type:</strong> {userData.userType?.replace('_', ' ')}
                    </p>
                    <p className="text-sm text-blue-800 mt-1">
                      <strong>Onboarding Status:</strong> {userData.onboardingStatus}
                    </p>
                  </div>

                  {userData.userType === 'CASE_MANAGER' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-blue-900 mb-2">Active Cases</h3>
                        <p className="text-3xl font-bold text-blue-600">0</p>
                        <p className="text-sm text-blue-600 mt-2">View all cases →</p>
                      </div>
                      
                      <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-green-900 mb-2">Referrals</h3>
                        <p className="text-3xl font-bold text-green-600">0</p>
                        <p className="text-sm text-green-600 mt-2">Manage referrals →</p>
                      </div>
                      
                      <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-purple-900 mb-2">Appointments</h3>
                        <p className="text-3xl font-bold text-purple-600">0</p>
                        <p className="text-sm text-purple-600 mt-2">View calendar →</p>
                      </div>
                    </div>
                  )}

                  {userData.userType === 'INDIVIDUAL_PRACTITIONER' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                      <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-teal-900 mb-2">Active Patients</h3>
                        <p className="text-3xl font-bold text-teal-600">0</p>
                        <p className="text-sm text-teal-600 mt-2">View patients →</p>
                      </div>
                      
                      <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-orange-900 mb-2">Appointments Today</h3>
                        <p className="text-3xl font-bold text-orange-600">0</p>
                        <p className="text-sm text-orange-600 mt-2">View schedule →</p>
                      </div>
                      
                      <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-pink-900 mb-2">Pending Reviews</h3>
                        <p className="text-3xl font-bold text-pink-600">0</p>
                        <p className="text-sm text-pink-600 mt-2">Write reviews →</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  )
}