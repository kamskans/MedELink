'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import styles from '@/styles/SignUp.module.css'
import { useAuth } from '@/contexts/AuthContext'

export default function SignUpPage() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [userType, setUserType] = useState('case-manager')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const router = useRouter()
  const { signUp } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long')
      return
    }

    setLoading(true)

    try {
      const name = `${firstName} ${lastName}`
      const userTypeValue = userType === 'case-manager' ? 'CASE_MANAGER' : 'INDIVIDUAL_PRACTITIONER'
      
      await signUp(email, password, name, userTypeValue)
      // The signUp function handles the redirect
    } catch (err: any) {
      console.error('Sign up error:', err)
      setError(err.message || 'An error occurred during sign up')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>
            <svg width="20" height="20" fill="white" viewBox="0 0 20 20">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
            </svg>
          </div>
          <span className={styles.logoText}>medElink</span>
        </div>
        <div className={styles.nav}>
          <button className={styles.signUpButton}>
            Sign up
          </button>
          <Link href="/sign-in" className={styles.loginLink}>
            Login
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.main}>
        <div className={styles.form}>
          <form className={styles.formContent} onSubmit={handleSubmit}>
            {/* Name Fields */}
            <div className={styles.nameRow}>
              <div className={styles.inputGroup}>
                <label htmlFor="firstName" className={styles.label}>
                  First name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  placeholder="First name"
                  className={styles.input}
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="lastName" className={styles.label}>
                  Last name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  placeholder="Last name"
                  className={styles.input}
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.label}>
                Email address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Email"
                className={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password */}
            <div className={styles.inputGroup}>
              <label htmlFor="password" className={`${styles.label} ${styles.labelPassword}`}>
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Password"
                className={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />
            </div>

            {/* Confirm Password */}
            <div className={styles.inputGroup}>
              <label htmlFor="confirmPassword" className={styles.label}>
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Password"
                className={styles.input}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
              />
            </div>

            {/* User Type Selection */}
            <div className={styles.radioGroup}>
              <div className={styles.radioOption}>
                <input
                  id="case-manager"
                  name="userType"
                  type="radio"
                  value="case-manager"
                  checked={userType === 'case-manager'}
                  onChange={(e) => setUserType(e.target.value)}
                  className={styles.radio}
                />
                <label htmlFor="case-manager" className={styles.radioLabel}>
                  Case Manager
                </label>
              </div>
              <div className={styles.radioOption}>
                <input
                  id="individual-practitioner"
                  name="userType"
                  type="radio"
                  value="individual-practitioner"
                  checked={userType === 'individual-practitioner'}
                  onChange={(e) => setUserType(e.target.value)}
                  className={styles.radio}
                />
                <label htmlFor="individual-practitioner" className={styles.radioLabel}>
                  Individual Practitioners
                </label>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className={styles.error}>
                {error}
              </div>
            )}

            {/* Sign Up Button */}
            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>

            {/* Login Link */}
            <div className={styles.loginSection}>
              <span className={styles.loginText}>
                Already have an account ?{' '}
                <Link href="/sign-in" className={styles.loginHereLink}>
                  Login here
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}