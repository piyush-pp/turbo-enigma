import { useState, useEffect } from 'react'
import apiClient from '@/lib/api'

export interface Booking {
  id: string
  serviceId: string
  staffId: string
  clientName: string
  clientEmail: string
  clientPhone?: string
  notes?: string
  startTimeUtc: string
  endTimeUtc: string
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'
  createdAt: string
}

export interface Service {
  id: string
  name: string
  description?: string
  duration: number
  price: number
  isActive: boolean
}

export interface Staff {
  id: string
  userId: string
  businessId: string
  isActive: boolean
}

export interface Customer {
  id: string
  email: string
  name: string
  bookingsCount: number
  totalSpent: number
}

export interface Business {
  id: string
  name: string
  slug: string
  timezone: string
  isSingleStaff: boolean
}

export const useBookings = (businessId: string, filters?: Record<string, string>) => {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true)
        const params = new URLSearchParams({ businessId, ...filters })
        const response = await apiClient.get(`/bookings?${params}`)
        setBookings(response.data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch bookings')
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [businessId, filters])

  const updateBooking = async (bookingId: string, status: string) => {
    try {
      await apiClient.patch(`/bookings/${bookingId}`, { status, businessId })
      setBookings(bookings.map((b) => (b.id === bookingId ? { ...b, status: status as any } : b)))
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update booking')
    }
  }

  return { bookings, loading, error, updateBooking }
}

export const useServices = (businessId: string) => {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true)
        const response = await apiClient.get(`/owner/services/${businessId}`)
        setServices(response.data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch services')
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [businessId])

  return { services, loading, error }
}

export const useStaff = (businessId: string) => {
  const [staff, setStaff] = useState<Staff[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        setLoading(true)
        const response = await apiClient.get(`/owner/staff/${businessId}`)
        setStaff(response.data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch staff')
      } finally {
        setLoading(false)
      }
    }

    fetchStaff()
  }, [businessId])

  return { staff, loading, error }
}

export const useBusiness = (businessId: string) => {
  const [business, setBusiness] = useState<Business | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        setLoading(true)
        const response = await apiClient.get(`/owner/business`)
        const b = response.data.find((b: Business) => b.id === businessId)
        setBusiness(b)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch business')
      } finally {
        setLoading(false)
      }
    }

    fetchBusiness()
  }, [businessId])

  return { business, loading, error }
}
