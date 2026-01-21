import { useState, useMemo } from 'react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Booking } from '@/hooks/api'

interface CalendarViewProps {
  bookings: Booking[]
  onDateSelect?: (date: Date) => void
}

export const CalendarView = ({ bookings, onDateSelect }: CalendarViewProps) => {
  const [currentDate, setCurrentDate] = useState(new Date())

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const bookingsByDate = useMemo(() => {
    const map = new Map<string, Booking[]>()
    bookings.forEach((booking) => {
      const dateKey = format(new Date(booking.startTimeUtc), 'yyyy-MM-dd')
      if (!map.has(dateKey)) {
        map.set(dateKey, [])
      }
      map.get(dateKey)?.push(booking)
    })
    return map
  }, [bookings])

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{format(currentDate, 'MMMM yyyy')}</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Today
          </button>
          <button
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Week day headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day) => (
          <div key={day} className="h-10 flex items-center justify-center font-semibold text-gray-600">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const dateKey = format(day, 'yyyy-MM-dd')
          const dayBookings = bookingsByDate.get(dateKey) || []
          const isCurrentMonth = isSameMonth(day, currentDate)

          return (
            <div
              key={dateKey}
              onClick={() => onDateSelect?.(day)}
              className={`min-h-24 p-2 rounded border cursor-pointer transition-colors ${
                isCurrentMonth ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-100'
              } ${isToday(day) ? 'bg-blue-50 border-blue-500' : ''} hover:bg-blue-50`}
            >
              <div className={`text-sm font-medium mb-1 ${isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}`}>
                {format(day, 'd')}
              </div>
              <div className="space-y-1">
                {dayBookings.slice(0, 2).map((booking) => (
                  <div
                    key={booking.id}
                    className="text-xs bg-blue-100 text-blue-800 p-1 rounded truncate"
                    title={booking.clientName}
                  >
                    {booking.clientName}
                  </div>
                ))}
                {dayBookings.length > 2 && (
                  <div className="text-xs text-gray-600 font-medium">
                    +{dayBookings.length - 2} more
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
