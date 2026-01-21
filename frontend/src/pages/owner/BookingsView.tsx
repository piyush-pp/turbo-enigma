import { useEffect, useState } from 'react'
import { Booking, getBookings, updateBookingStatus } from '@/hooks/useOwnerApi'
import { CheckCircle, Clock, AlertCircle } from 'lucide-react'

interface BookingsViewProps {
  businessId: string
}

export const BookingsView = ({ businessId }: BookingsViewProps) => {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    loadBookings()
  }, [businessId])

  const loadBookings = async () => {
    try {
      const data = await getBookings(businessId)
      setBookings(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load bookings')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (bookingId: string, status: 'confirmed' | 'completed' | 'cancelled') => {
    try {
      await updateBookingStatus(bookingId, status)
      await loadBookings()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update booking')
    }
  }

  const filteredBookings =
    statusFilter === 'all' ? bookings : bookings.filter((b) => b.status === statusFilter)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle size={18} className="text-green-600" />
      case 'pending':
        return <Clock size={18} className="text-yellow-600" />
      case 'completed':
        return <CheckCircle size={18} className="text-blue-600" />
      default:
        return <AlertCircle size={18} className="text-red-600" />
    }
  }

  if (loading) {
    return <div className="p-6">Loading...</div>
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Bookings</h1>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-800 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="flex gap-2 mb-6">
        {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              statusFilter === status
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {filteredBookings.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No bookings found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(booking.status)}
                  <div>
                    <h3 className="font-semibold text-gray-900">{booking.clientName}</h3>
                    <p className="text-sm text-gray-600">{booking.serviceName}</p>
                  </div>
                </div>
                <span
                  className={`text-sm px-3 py-1 rounded font-medium ${
                    booking.status === 'confirmed'
                      ? 'bg-green-100 text-green-800'
                      : booking.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : booking.status === 'completed'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-red-100 text-red-800'
                  }`}
                >
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div>
                  <p className="text-gray-600">Date & Time</p>
                  <p className="font-medium text-gray-900">{formatDate(booking.startTimeUtc)}</p>
                </div>
                <div>
                  <p className="text-gray-600">Staff</p>
                  <p className="font-medium text-gray-900">{booking.staffName}</p>
                </div>
                <div>
                  <p className="text-gray-600">Email</p>
                  <p className="font-medium text-gray-900 break-all">{booking.clientEmail}</p>
                </div>
                {booking.clientPhone && (
                  <div>
                    <p className="text-gray-600">Phone</p>
                    <p className="font-medium text-gray-900">{booking.clientPhone}</p>
                  </div>
                )}
              </div>

              {booking.notes && (
                <div className="mb-4 p-3 bg-gray-50 rounded text-sm">
                  <p className="text-gray-600 font-medium mb-1">Notes</p>
                  <p className="text-gray-900">{booking.notes}</p>
                </div>
              )}

              {booking.status === 'pending' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleStatusChange(booking.id, 'confirmed')}
                    className="flex-1 bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 text-sm font-medium transition-colors"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => handleStatusChange(booking.id, 'cancelled')}
                    className="flex-1 bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 text-sm font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
