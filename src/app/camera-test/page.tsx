'use client'

import { useState } from 'react'

export default function CameraTest() {
  const [error, setError] = useState<string>('')
  const [log, setLog] = useState<string[]>([])
  
  const addLog = (message: string) => {
    setLog(prev => [...prev, `${new Date().toISOString()}: ${message}`])
    console.log(message)
  }

  const testCamera = async () => {
    setError('')
    setLog([])
    
    try {
      addLog('Checking browser support...')
      
      if (!navigator.mediaDevices) {
        throw new Error('navigator.mediaDevices is not available')
      }
      
      if (!navigator.mediaDevices.getUserMedia) {
        throw new Error('getUserMedia is not available')
      }
      
      addLog('Browser supports getUserMedia')
      addLog('Requesting camera permissions...')
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true,
        audio: false
      })
      
      addLog('Camera access granted!')
      addLog(`Stream active: ${stream.active}`)
      addLog(`Video tracks: ${stream.getVideoTracks().length}`)
      
      // Stop the stream after testing
      stream.getTracks().forEach(track => track.stop())
      addLog('Camera test successful - stream stopped')
      
    } catch (err: any) {
      addLog(`Error: ${err.name} - ${err.message}`)
      setError(`${err.name}: ${err.message}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Camera Test Page</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-4">
          <h2 className="text-lg font-semibold mb-3">Browser Information</h2>
          <div className="space-y-2 text-sm">
            <p><strong>User Agent:</strong> {typeof window !== 'undefined' ? navigator.userAgent : 'N/A'}</p>
            <p><strong>Protocol:</strong> {typeof window !== 'undefined' ? window.location.protocol : 'N/A'}</p>
            <p><strong>Hostname:</strong> {typeof window !== 'undefined' ? window.location.hostname : 'N/A'}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-4">
          <button
            onClick={testCamera}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Test Camera Access
          </button>
          
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded">
              <p className="text-red-600 font-semibold">Error:</p>
              <p className="text-red-800">{error}</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-3">Debug Log</h2>
          <div className="bg-gray-50 rounded p-4 h-64 overflow-y-auto font-mono text-sm">
            {log.length === 0 ? (
              <p className="text-gray-500">Click "Test Camera Access" to start</p>
            ) : (
              log.map((entry, index) => (
                <div key={index} className="mb-1">{entry}</div>
              ))
            )}
          </div>
        </div>

        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-800 mb-2">Common Issues:</h3>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Camera access requires HTTPS (except for localhost)</li>
            <li>• Check browser permissions in address bar</li>
            <li>• Ensure no other app is using the camera</li>
            <li>• Try refreshing the page after granting permissions</li>
          </ul>
        </div>
      </div>
    </div>
  )
}