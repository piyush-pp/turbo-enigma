import { useParams } from 'react-router-dom'
import { useBookings } from '@/hooks/api'
import { AppointmentCard } from '@/components/AppointmentCard'
import { useState } from 'react'
import { Filter } from 'lucide-react'

type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'

export const AppointmentsPage = () => {
  const { businessId } = useParams<{ businessId: string }>()!
  const [filterStatus, setFilterStatus] = useState<BookingStatus | 'ALL'>('ALL')
  const { bookings, updateBooking, loading } = useBookings(businessId, {
    status: filterStatus === 'ALL' ? undefined : filterStatus,
  })

  const statuses: Array<{ value: BookingStatus | 'ALL'; label: string }> = [
    { value: 'ALL', label: 'All' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'CONFIRMED', label: 'Confirmed' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'CANCELLED', label: 'Cancelled' },
  ]

  const handleStatusChange = async (bookingId: string, status: string) => {
    try {
      await updateBooking(bookingId, status)
    } catch (error) {
      console.error('Failed to update booking:', error)
    }
  }

  const displayBookings =
    filterStatus === 'ALL'
      ? bookings
      : bookings.filter((b) => b.status === filterStatus)

  return (
    <main className="lg:ml-64 p-6">
      <h1 className="text-3xl font-bold mb-8">Appointments</h1>

      {/* Filter */}
      <div className="card mb-6">
        <div className="flex items-center space-x-2 mb-4">
          <Filter size={20} className="text-gray-600" />
          <h2 className="font-semibold">Filter by Status</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {statuses.map((status) => (
            <button
              key={status.value}
              onClick={() => setFilterStatus(status.value)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterStatus === status.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              {status.label}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {loading && <div className="card text-center py-8">Loading appointments...</div>}

      {/* Appointments List */}
      {!loading && displayBookings.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500 text-lg">No appointments found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {displayBookings.map((booking) => (
            <AppointmentCard
              key={booking.id}
              booking={booking}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}
    </main>
  )
}
