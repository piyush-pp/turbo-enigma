import axios from 'axios'

const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:3000/api'

const publicApiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export interface PublicBusiness {
  id: string
  name: string
  slug: string
  description?: string
  timezone: string
  isSingleStaff: boolean
}

export interface PublicService {
  id: string
  name: string
  description?: string
  duration: number
  price: number
  isActive: boolean
}

export interface PublicStaff {
  id: string
  userId: string
  businessId: string
  isActive: boolean
}

export interface TimeSlot {
  startTimeUtc: string
  endTimeUtc: string
}

export interface BookingRequest {
  businessSlug: string
  serviceId: string
  staffId?: string
  startTimeUtc: string
  clientName: string
  clientEmail: string
  clientPhone?: string
  notes?: string
}

export interface BookingResponse {
  id: string
  status: string
  startTimeUtc: string
  endTimeUtc: string
  clientName: string
  clientEmail: string
}

// Public APIs (no auth required)
export const getBusinessBySlug = async (slug: string): Promise<PublicBusiness> => {
  const response = await publicApiClient.get(`/owner/business/public/${slug}`)
  return response.data
}

export const getServices = async (businessId: string): Promise<PublicService[]> => {
  const response = await publicApiClient.get(`/owner/services/${businessId}`)
  return response.data
}

export const getStaff = async (businessId: string): Promise<PublicStaff[]> => {
  const response = await publicApiClient.get(`/owner/staff/${businessId}`)
  return response.data.filter((s: PublicStaff) => s.isActive)
}

export const getAvailableSlots = async (
  businessSlug: string,
  serviceId: string,
  date: string,
  staffId?: string,
  timezone?: string
): Promise<TimeSlot[]> => {
  const params: Record<string, string> = {
    businessSlug,
    serviceId,
    date,
  }
  if (staffId) params.staffId = staffId
  if (timezone) params.timezone = timezone

  const response = await publicApiClient.get('/public/slots', { params })
  return response.data
}

export const createBooking = async (booking: BookingRequest): Promise<BookingResponse> => {
  const response = await publicApiClient.post('/bookings', booking)
  return response.data
}

export default publicApiClient
