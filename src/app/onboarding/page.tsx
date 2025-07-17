'use client'

import { useState } from 'react'
import Image from 'next/image'
import VideoRecorder from '@/components/VideoRecorder'

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // Step 1 - Personal Information
    name: '',
    email: '',
    address: '',
    dateOfBirth: '',
    emailAddress: '',
    phoneNumber: '',
    qualification: '',
    qualificationYear: '',
    profession: '',
    jobTitle: '',
    
    // Step 2 - About Your Business
    companyName: '',
    companyEmail: '',
    companyPhone: '',
    businessType: '',
    rehabilitationClients: '',
    regulatoryBody: '',
    practiceRestrictions: '',
    cqcRegulated: '',
    additionalTraining: '',
    companyAddress: '',
    
    // Step 3 - Governance
    videoUrl: ''
  })
  
  const [uploadedFiles, setUploadedFiles] = useState({
    profilePicture: null as File | null,
    qualification: null as File | null,
    documents: [] as File[],
    insurance: null as File | null,
    companyLogo: null as File | null,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleFileUpload = (fileType: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    if (fileType === 'documents') {
      setUploadedFiles(prev => ({
        ...prev,
        documents: [...prev.documents, ...Array.from(files)]
      }))
    } else {
      setUploadedFiles(prev => ({
        ...prev,
        [fileType]: files[0]
      }))
    }
  }

  const handleNext = async () => {
    try {
      // Save current step data
      const response = await fetch('/api/onboarding/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          step: currentStep,
          data: formData
        })
      })

      if (!response.ok) {
        throw new Error('Failed to save data')
      }

      const result = await response.json()
      
      if (result.nextStep && currentStep < 3) {
        setCurrentStep(result.nextStep)
      }
    } catch (error) {
      console.error('Error saving onboarding data:', error)
      alert('Failed to save data. Please try again.')
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    try {
      // Save final step data
      const response = await fetch('/api/onboarding/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          step: 3,
          data: {
            ...formData,
            termsAccepted: true
          }
        })
      })

      if (!response.ok) {
        throw new Error('Failed to complete onboarding')
      }

      // Redirect to dashboard
      window.location.href = '/dashboard'
    } catch (error) {
      console.error('Error completing onboarding:', error)
      alert('Failed to complete onboarding. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
              </svg>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">medElink</span>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className="relative">
                  <div className={`
                    w-12 h-12 rounded-full flex items-center justify-center font-semibold text-lg
                    transition-all duration-300 transform
                    ${currentStep >= step 
                      ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg scale-110' 
                      : 'bg-gray-200 text-gray-500'
                    }
                  `}>
                    {step}
                  </div>
                  {currentStep > step && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="ml-4">
                  <p className={`text-sm font-medium ${currentStep >= step ? 'text-gray-900' : 'text-gray-500'}`}>
                    {step === 1 && 'Personal Information'}
                    {step === 2 && 'About Your Business'}
                    {step === 3 && 'Governance'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {step === 1 && 'Basic details'}
                    {step === 2 && 'Professional info'}
                    {step === 3 && 'Final steps'}
                  </p>
                </div>
                {step < 3 && (
                  <div className={`
                    hidden sm:block w-24 h-0.5 ml-8
                    ${currentStep > step ? 'bg-blue-500' : 'bg-gray-300'}
                  `} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8">
            {currentStep === 1 && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Let's get to know you</h2>
                  <p className="text-gray-600 leading-relaxed">
                    Help us provide you with the most helpful and personalized experience.
                    We respect your privacy and professional autonomy while serving our 
                    case managers and healthcare professionals.
                  </p>
                </div>

                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                    />
                  </div>
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                    />
                  </div>
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors">
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      placeholder="123 Main Street"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      max={new Date().toISOString().split('T')[0]} // Prevent future dates
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700"
                    />
                  </div>
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      placeholder="+44 20 1234 5678"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                    />
                  </div>
                </div>

                {/* Profile Picture Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Profile Picture
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload('profilePicture')}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-500 transition-colors duration-200 cursor-pointer bg-gray-50 hover:bg-blue-50">
                      {uploadedFiles.profilePicture ? (
                        <div>
                          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <p className="text-gray-600 mb-2">{uploadedFiles.profilePicture.name}</p>
                          <p className="text-sm text-blue-600 font-medium">Click to change</p>
                        </div>
                      ) : (
                        <>
                          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                          </div>
                          <p className="text-gray-600 mb-2">
                            Drop a file here, or click to <span className="text-blue-600 font-medium">import</span>
                          </p>
                          <p className="text-sm text-gray-500">Max size: 500 MB</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Professional Information */}
                <div className="space-y-6 pt-6 border-t border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-900">Professional Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="group">
                      <label className="block text-sm font-medium text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors">
                        What is your qualification?
                        <span className="text-xs text-gray-500 ml-2">(e.g., BSc Hons Physiotherapy)</span>
                      </label>
                      <input
                        type="text"
                        name="qualification"
                        placeholder="Enter your qualification"
                        value={formData.qualification}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                      />
                    </div>
                    <div className="group">
                      <label className="block text-sm font-medium text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors">
                        What year did you qualify?
                      </label>
                      <input
                        type="text"
                        name="qualificationYear"
                        placeholder="YYYY"
                        value={formData.qualificationYear}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                      />
                    </div>
                  </div>

                  {/* Qualification Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Please upload a copy of your professional qualification
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        onChange={handleFileUpload('qualification')}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-500 transition-colors duration-200 cursor-pointer bg-gray-50 hover:bg-blue-50">
                        {uploadedFiles.qualification ? (
                          <div>
                            <div className="mx-auto w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mb-3">
                              <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <p className="text-sm text-gray-600">{uploadedFiles.qualification.name}</p>
                            <p className="text-xs text-blue-600 font-medium mt-1">Click to change</p>
                          </div>
                        ) : (
                          <>
                            <div className="mx-auto w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mb-3">
                              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                            <p className="text-sm text-gray-600">
                              Drop a file here, or click to <span className="text-blue-600 font-medium">import</span>
                            </p>
                            <p className="text-xs text-gray-500 mt-1">Max size: 500 MB</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="group">
                      <label className="block text-sm font-medium text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors">
                        What is your profession?
                      </label>
                      <select
                        name="profession"
                        value={formData.profession}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700 bg-white"
                      >
                        <option value="">Select profession</option>
                        <option value="adults-nurse">Adults Nurse</option>
                        <option value="art-therapist">Art Therapist</option>
                        <option value="dietician">Dietician</option>
                        <option value="drama-therapist">Drama Therapist</option>
                        <option value="music-therapist">Music Therapist</option>
                        <option value="occupational-therapist">Occupational Therapist</option>
                        <option value="orthotist">Orthotist</option>
                        <option value="other">Other</option>
                        <option value="paediatric-nurse">Paediatric Nurse</option>
                        <option value="paramedic">Paramedic</option>
                      </select>
                    </div>
                    <div className="group">
                      <label className="block text-sm font-medium text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors">
                        Job Title
                      </label>
                      <input
                        type="text"
                        name="jobTitle"
                        placeholder="Senior Healthcare Professional"
                        value={formData.jobTitle}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                      />
                    </div>
                  </div>

                  {/* Video Recording Section */}
                  <div className="pt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload a short video to introduce yourself and your service
                      <span className="text-xs text-gray-500 ml-2">(2 mins max)</span>
                    </label>
                    <p className="text-sm text-gray-600 mb-4">If requested by case manager, please complete below.</p>
                    <VideoRecorder 
                      onVideoRecorded={(blob) => {
                        console.log('Video recorded:', blob)
                      }}
                      maxDuration={120}
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Tell us about your business...</h2>
                </div>

                {/* Company Information Section */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      What's your company called? <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="companyName"
                      placeholder="What's your company called?"
                      value={formData.companyName || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Logo
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload('companyLogo')}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition-colors duration-200 cursor-pointer bg-gray-50 hover:bg-blue-50">
                        {uploadedFiles.companyLogo ? (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">{uploadedFiles.companyLogo.name}</span>
                            <span className="text-sm text-blue-600 font-medium">Change</span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center space-x-2">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-sm text-gray-500">Drop a file here, or click to import</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 text-right">Max size: 500 MB</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company Email
                      </label>
                      <input
                        type="email"
                        name="companyEmail"
                        placeholder="Company Email"
                        value={formData.companyEmail || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company Telephone
                      </label>
                      <input
                        type="tel"
                        name="companyPhone"
                        placeholder="07459451740"
                        value={formData.companyPhone || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Are you a?
                    </label>
                    <select
                      name="businessType"
                      value={formData.businessType || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700 bg-white"
                    >
                      <option value="">Select</option>
                      <option value="ltd-company">Ltd Company</option>
                      <option value="partnership">Partnership</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      What type of rehabilitation clients do you work with?
                    </label>
                    <textarea
                      name="rehabilitationClients"
                      placeholder="Explain here"
                      value={formData.rehabilitationClients || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 resize-none"
                      rows={4}
                    />
                  </div>
                </div>

                {/* Professional Bodies Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    What Professional Bodies are you registered with?
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        What Regulatory Bodies are you registered with?
                      </label>
                      <select
                        name="regulatoryBody"
                        value={formData.regulatoryBody || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700 bg-white"
                      >
                        <option value="">Select</option>
                        <option value="hcpc">HCPC</option>
                        <option value="nmc">NMC</option>
                        <option value="gmc">GMC</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Are you subject to any restrictions to practice?
                      </label>
                      <select
                        name="practiceRestrictions"
                        value={formData.practiceRestrictions || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700 bg-white"
                      >
                        <option value="">Select</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Is your Business CQC Regulated?
                    </label>
                    <select
                      name="cqcRegulated"
                      value={formData.cqcRegulated || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700 bg-white"
                    >
                      <option value="">Select</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Training
                    </label>
                    <input
                      type="text"
                      name="additionalTraining"
                      placeholder="Eg. Mental Health First Aid"
                      value={formData.additionalTraining || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Registered Company Address
                    </label>
                    <input
                      type="text"
                      name="companyAddress"
                      placeholder="Enter manual address"
                      value={formData.companyAddress || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Governance</h2>
                  <p className="text-gray-600">Final step - provide your professional details and verification.</p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex">
                    <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <div className="ml-3">
                      <p className="text-sm text-blue-800">
                        Please ensure all information is accurate as it will be used for verification purposes.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="group">
                      <label className="block text-sm font-medium text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors">
                        Professional Registration Number
                      </label>
                      <input
                        type="text"
                        placeholder="Enter registration number"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                      />
                    </div>
                    <div className="group">
                      <label className="block text-sm font-medium text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors">
                        Regulatory Body
                      </label>
                      <select className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700 bg-white">
                        <option value="">Select regulatory body</option>
                        <option value="nmc">Nursing and Midwifery Council</option>
                        <option value="hcpc">Health and Care Professions Council</option>
                        <option value="gmc">General Medical Council</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Insurance Documentation
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleFileUpload('insurance')}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-500 transition-colors duration-200 cursor-pointer bg-gray-50 hover:bg-blue-50">
                        {uploadedFiles.insurance ? (
                          <div>
                            <div className="mx-auto w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mb-3">
                              <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <p className="text-sm text-gray-600">{uploadedFiles.insurance.name}</p>
                            <p className="text-xs text-blue-600 font-medium mt-1">Click to change</p>
                          </div>
                        ) : (
                          <>
                            <div className="mx-auto w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mb-3">
                              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                              </svg>
                            </div>
                            <p className="text-sm text-gray-600">
                              Upload insurance certificate
                            </p>
                            <p className="text-xs text-gray-500 mt-1">PDF format preferred</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                    <input
                      type="checkbox"
                      className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <label className="text-sm text-gray-700">
                        I confirm that all the information provided is accurate and up to date. I understand that false information may result in termination of my account.
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between items-center pt-8 mt-8 border-t border-gray-200">
              <button
                onClick={handleBack}
                className={`
                  px-6 py-3 rounded-lg font-medium transition-all duration-200
                  ${currentStep > 1 
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                    : 'invisible'
                  }
                `}
              >
                Back
              </button>
              
              <div className="flex items-center space-x-2">
                {[1, 2, 3].map((dot) => (
                  <div
                    key={dot}
                    className={`
                      h-2 w-2 rounded-full transition-all duration-300
                      ${currentStep === dot ? 'w-8 bg-blue-600' : 'bg-gray-300'}
                    `}
                  />
                ))}
              </div>

              {currentStep < 3 ? (
                <button
                  onClick={handleNext}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-200 shadow-lg"
                >
                  Save and Continue
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-medium hover:from-green-700 hover:to-green-800 transform hover:scale-105 transition-all duration-200 shadow-lg"
                >
                  Complete Onboarding
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Need help? Contact us at{' '}
            <a href="mailto:support@medelink.co.uk" className="text-blue-600 hover:text-blue-700 font-medium">
              support@medelink.co.uk
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}