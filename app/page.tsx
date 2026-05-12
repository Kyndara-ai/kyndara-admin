'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('auth_token')

    if (token) {
      // Redirect to dashboard if authenticated
      router.push('/dashboard')
    } else {
      // Redirect to login if not authenticated
      router.push('/login')
    }
  }, [router])

  // Show loading state while redirecting
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-foreground">Redirecting...</div>
    </div>
  )
}
