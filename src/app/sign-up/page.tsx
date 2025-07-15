'use client'

import { SignUp } from "@stackframe/stack"

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your MedELink account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Join our healthcare management platform
          </p>
        </div>
        <SignUp />
      </div>
    </div>
  )
}