import { useState, useCallback } from 'react'
import apiClient from '@/lib/api'

export interface AuthUser {
  id: string
  email: string
  businessId: string
  businessName: string
}

export const useOwnerAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const stored = localStorage.getItem('ownerUser')
    return stored ? JSON.parse(stored) : null
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const login = useCallback(
    async (email: string, password: string) => {
      setLoading(true)
      setError(null)
      try {
        const response = await apiClient.post('/auth/login', { email, password })
        const userData: AuthUser = {
          id: response.data.userId,
          email: response.data.email,
          businessId: response.data.businessId,
          businessName: response.data.name || 'My Business',
        }
        localStorage.setItem('accessToken', response.data.accessToken)
        localStorage.setItem('refreshToken', response.data.refreshToken)
        localStorage.setItem('ownerUser', JSON.stringify(userData))
        setUser(userData)
        return userData
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Login failed'
        setError(message)
        throw err
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const signup = useCallback(
    async (email: string, password: string, businessName: string, name: string = 'Owner') => {
      setLoading(true)
      setError(null)
      try {
        const response = await apiClient.post('/auth/signup', {
          email,
          password,
          name,
          businessName,
          role: 'OWNER',
        })
        const userData: AuthUser = {
          id: response.data.userId,
          email: response.data.email,
          businessId: response.data.businessId,
          businessName: response.data.businessName || businessName,
        }
        localStorage.setItem('accessToken', response.data.accessToken)
        localStorage.setItem('refreshToken', response.data.refreshToken)
        localStorage.setItem('ownerUser', JSON.stringify(userData))
        setUser(userData)
        return userData
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Signup failed'
        setError(message)
        throw err
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const logout = useCallback(() => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('ownerUser')
    setUser(null)
  }, [])

  const isAuthenticated = !!user

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    signup,
    logout,
  }
}
