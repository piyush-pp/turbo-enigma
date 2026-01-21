import apiClient from '@/lib/api'

export interface Owner {
  id: string
  email: string
  businessId: string
}

export interface Business {
  id: string
  name: string
  description: string
  slug: string
  timezone: string
  isSingleStaff: boolean
  email?: string
  phone?: string
}

export interface Staff {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  isActive: boolean
}

export interface Service {
  id: string
  name: string
  description: string
  duration: number
  price: number
  isActive: boolean
}

export interface Booking {
  id: string
  clientName: string
  clientEmail: string
  clientPhone?: string
  serviceName: string
  staffName: string
  startTimeUtc: string
  endTimeUtc: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  notes?: string
}

// Business Management
export const getBusiness = async (businessId: string) => {
  const response = await apiClient.get(`/owner/business/${businessId}`)
  return response.data as Business
}

export const updateBusiness = async (businessId: string, data: Partial<Business>) => {
  const response = await apiClient.put(`/owner/business/${businessId}`, data)
  return response.data as Business
}

// Staff Management
export const getStaffList = async (businessId: string) => {
  const response = await apiClient.get(`/owner/staff/${businessId}`)
  return response.data as Staff[]
}

export const createStaff = async (businessId: string, data: Omit<Staff, 'id' | 'isActive'>) => {
  const response = await apiClient.post(`/owner/staff`, {
    businessId,
    ...data,
  })
  return response.data as Staff
}

export const updateStaff = async (staffId: string, data: Partial<Staff>) => {
  const response = await apiClient.put(`/owner/staff/${staffId}`, data)
  return response.data as Staff
}

export const deleteStaff = async (staffId: string) => {
  await apiClient.delete(`/owner/staff/${staffId}`)
}

// Service Management
export const getServices = async (businessId: string) => {
  const response = await apiClient.get(`/owner/services/${businessId}`)
  return response.data as Service[]
}

export const createService = async (businessId: string, data: Omit<Service, 'id' | 'isActive'>) => {
  const response = await apiClient.post(`/owner/services`, {
    businessId,
    ...data,
  })
  return response.data as Service
}

export const updateService = async (serviceId: string, data: Partial<Service>) => {
  const response = await apiClient.put(`/owner/services/${serviceId}`, data)
  return response.data as Service
}

export const deleteService = async (serviceId: string) => {
  await apiClient.delete(`/owner/services/${serviceId}`)
}

// Bookings
export const getBookings = async (businessId: string) => {
  const response = await apiClient.get(`/owner/bookings/${businessId}`)
  return response.data as Booking[]
}

export const updateBookingStatus = async (
  bookingId: string,
  status: 'confirmed' | 'completed' | 'cancelled'
) => {
  const response = await apiClient.patch(`/owner/bookings/${bookingId}`, { status })
  return response.data as Booking
}

// Availability Management
export const getAvailabilityRules = async (staffId: string) => {
  const response = await apiClient.get(`/owner/availability/${staffId}`)
  return response.data
}

export const updateAvailabilityRules = async (staffId: string, rules: any) => {
  const response = await apiClient.put(`/owner/availability/${staffId}`, rules)
  return response.data
}
