import { useParams } from 'react-router-dom'
import { useBookings } from '@/hooks/api'
import { CalendarView } from '@/components/CalendarView'
import { AppointmentCard } from '@/components/AppointmentCard'
import { useState } from 'react'
import { format, startOfDay, endOfDay } from 'date-fns'

export const CalendarPage = () => {
  const { businessId } = useParams<{ businessId: string }>()!
  const { bookings } = useBookings(businessId)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const filteredBookings = selectedDate
    ? bookings.filter((b) => {
        const start = new Date(b.startTimeUtc)
        const dayStart = startOfDay(selectedDate)
        const dayEnd = endOfDay(selectedDate)
        return start >= dayStart && start <= dayEnd
      })
    : []

  return (
    <main className="lg:ml-64 p-6">
      <h1 className="text-3xl font-bold mb-8">Calendar</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <CalendarView bookings={bookings} onDateSelect={setSelectedDate} />
        </div>

        {/* Selected Date Appointments */}
        <div className="space-y-4">
          {selectedDate && (
            <div className="card bg-blue-50 border-l-4 border-blue-600">
              <h3 className="font-semibold text-lg">
                {format(selectedDate, 'MMMM dd, yyyy')}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {filteredBookings.length} appointment(s)
              </p>
            </div>
          )}

          <div className="space-y-3">
            {filteredBookings.map((booking) => (
              <AppointmentCard key={booking.id} booking={booking} />
            ))}
          </div>

          {selectedDate && filteredBookings.length === 0 && (
            <div className="card text-center py-8">
              <p className="text-gray-500">No appointments on this date</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
