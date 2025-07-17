'use client'

import { useState, useRef, useEffect } from 'react'

interface VideoRecorderProps {
  onVideoRecorded: (videoBlob: Blob) => void
  maxDuration?: number // in seconds
}

export default function VideoRecorder({ onVideoRecorded, maxDuration = 120 }: VideoRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [recordedVideo, setRecordedVideo] = useState<string | null>(null)
  const [recordingTime, setRecordingTime] = useState(0)
  const [showCamera, setShowCamera] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  const startCamera = async () => {
    console.log('Starting camera...')
    setIsLoading(true)
    setCameraError(null)
    
    try {
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API is not supported in this browser')
      }

      console.log('Requesting camera permissions...')
      
      // Request camera and microphone permissions
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        }, 
        audio: true 
      })
      
      console.log('Camera stream obtained:', stream)
      streamRef.current = stream
      
      // Immediately show camera since we have the stream
      setShowCamera(true)
      setIsLoading(false)
      
      // Set the stream to video element after state update
      setTimeout(() => {
        if (videoRef.current && streamRef.current) {
          videoRef.current.srcObject = streamRef.current
          videoRef.current.play().catch(err => {
            console.error('Error auto-playing video:', err)
            // Video will still show, user might need to click play
          })
        }
      }, 100)
    } catch (error: any) {
      console.error('Error accessing camera:', error)
      setIsLoading(false)
      
      let errorMessage = 'Unable to access camera. '
      
      if (error.name === 'NotFoundError') {
        errorMessage += 'No camera found on this device.'
      } else if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        errorMessage += 'Camera permission was denied. Please allow camera access in your browser settings and try again.'
      } else if (error.name === 'NotReadableError') {
        errorMessage += 'Camera is already in use by another application.'
      } else if (error.name === 'OverconstrainedError') {
        errorMessage += 'Camera constraints could not be satisfied.'
      } else if (error.message.includes('not supported')) {
        errorMessage = 'Camera access is not supported in this browser. Please use Chrome, Firefox, or Safari.'
      } else {
        errorMessage += error.message || 'Please check your camera settings and try again.'
      }
      
      setCameraError(errorMessage)
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop()
      })
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    setShowCamera(false)
  }

  const startRecording = () => {
    if (!streamRef.current) return

    try {
      // Try different mime types for better browser compatibility
      const mimeTypes = [
        'video/webm;codecs=vp9,opus',
        'video/webm;codecs=vp8,opus',
        'video/webm',
        'video/mp4'
      ]
      
      let selectedMimeType = ''
      for (const mimeType of mimeTypes) {
        if (MediaRecorder.isTypeSupported(mimeType)) {
          selectedMimeType = mimeType
          break
        }
      }

      if (!selectedMimeType) {
        throw new Error('No supported video format found')
      }

      console.log('Using mime type:', selectedMimeType)
      
      const mediaRecorder = new MediaRecorder(streamRef.current, {
        mimeType: selectedMimeType
      })
      
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' })
        const videoUrl = URL.createObjectURL(blob)
        setRecordedVideo(videoUrl)
        onVideoRecorded(blob)
        
        // Stop camera stream
        stopCamera()
      }

      mediaRecorder.onerror = (event: any) => {
        console.error('MediaRecorder error:', event.error)
        setCameraError('Recording error: ' + event.error.message)
      }

      mediaRecorder.start(100)
      setIsRecording(true)
      setRecordingTime(0)

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          const newTime = prev + 1
          if (newTime >= maxDuration) {
            stopRecording()
            return prev
          }
          return newTime
        })
      }, 1000)
    } catch (error: any) {
      console.error('Error starting recording:', error)
      setCameraError('Unable to start recording: ' + error.message)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      setIsPaused(false)
      
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume()
        setIsPaused(false)
        
        // Resume timer
        timerRef.current = setInterval(() => {
          setRecordingTime(prev => {
            const newTime = prev + 1
            if (newTime >= maxDuration) {
              stopRecording()
              return prev
            }
            return newTime
          })
        }, 1000)
      } else {
        mediaRecorderRef.current.pause()
        setIsPaused(true)
        
        // Pause timer
        if (timerRef.current) {
          clearInterval(timerRef.current)
          timerRef.current = null
        }
      }
    }
  }

  const deleteRecording = () => {
    if (recordedVideo) {
      URL.revokeObjectURL(recordedVideo)
    }
    setRecordedVideo(null)
    setRecordingTime(0)
  }

  const retakeVideo = () => {
    deleteRecording()
    startCamera()
  }

  const cancelCamera = () => {
    stopCamera()
    setIsLoading(false)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="bg-gray-50 rounded-lg p-6">
      {!showCamera && !recordedVideo && (
        <div className="text-center py-8">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mb-4">
            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-gray-600 mb-4">Click to start recording your introduction video</p>
          
          {cameraError && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg max-w-md mx-auto">
              <p className="text-sm text-red-600">{cameraError}</p>
            </div>
          )}
          
          {!isLoading ? (
            <button 
              onClick={startCamera} 
              className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-medium hover:from-red-700 hover:to-red-800 transform hover:scale-105 transition-all duration-200 shadow-lg inline-flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span>Open Camera</span>
            </button>
          ) : (
            <div className="space-y-4">
              <div className="inline-flex items-center space-x-3">
                <svg className="animate-spin h-5 w-5 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-gray-600">Opening Camera...</span>
              </div>
              <div>
                <button 
                  onClick={cancelCamera}
                  className="text-sm text-gray-500 hover:text-gray-700 underline"
                >
                  Cancel
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                If the camera doesn't open, please check your browser permissions
              </p>
            </div>
          )}
        </div>
      )}

      {showCamera && !recordedVideo && (
        <div className="relative bg-black rounded-lg overflow-hidden">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline
            muted 
            className="w-full h-[400px] object-cover"
            style={{ transform: 'scaleX(-1)' }} // Mirror the video for better UX
          />
          
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-6">
            {!isRecording ? (
              <div className="flex justify-center">
                <button 
                  onClick={startRecording} 
                  className="group flex items-center space-x-3 px-8 py-4 bg-red-600 text-white rounded-full font-medium hover:bg-red-700 transition-all duration-200 shadow-lg"
                >
                  <span className="relative flex h-5 w-5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-5 w-5 bg-white"></span>
                  </span>
                  <span>Start Recording</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-white text-3xl font-mono font-bold">
                    {formatTime(recordingTime)}
                  </div>
                  <div className="text-white/70 text-sm mt-1">
                    Maximum duration: {formatTime(maxDuration)}
                  </div>
                  {recordingTime > maxDuration - 10 && (
                    <div className="text-yellow-400 text-sm mt-2 animate-pulse">
                      Recording will stop in {maxDuration - recordingTime} seconds
                    </div>
                  )}
                </div>
                
                <div className="flex justify-center space-x-4">
                  <button 
                    onClick={pauseRecording} 
                    className="px-6 py-3 bg-yellow-600 text-white rounded-lg font-medium hover:bg-yellow-700 transition-colors duration-200 shadow-lg"
                  >
                    {isPaused ? (
                      <span className="flex items-center space-x-2">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                        <span>Resume</span>
                      </span>
                    ) : (
                      <span className="flex items-center space-x-2">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <span>Pause</span>
                      </span>
                    )}
                  </button>
                  <button 
                    onClick={stopRecording} 
                    className="px-6 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors duration-200 shadow-lg"
                  >
                    <span className="flex items-center space-x-2">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
                      </svg>
                      <span>Stop Recording</span>
                    </span>
                  </button>
                </div>
                
                {isPaused && (
                  <div className="text-center text-yellow-400 text-sm animate-pulse">
                    Recording Paused
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Close button */}
          <button
            onClick={stopCamera}
            className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {recordedVideo && (
        <div className="space-y-4">
          <video 
            src={recordedVideo} 
            controls 
            className="w-full rounded-lg shadow-lg"
          />
          <div className="bg-gray-100 rounded-lg p-3">
            <p className="text-sm text-gray-600 text-center">
              Recording duration: {formatTime(recordingTime)}
            </p>
          </div>
          <div className="flex justify-center space-x-4">
            <button 
              onClick={retakeVideo} 
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2 shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Retake Video</span>
            </button>
            <button 
              onClick={deleteRecording} 
              className="px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors duration-200 flex items-center space-x-2 shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span>Delete</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}