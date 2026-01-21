import { useState, useMemo } from 'react'
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isToday,
} from 'date-fns'
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react'
import { TimeSlot } from '@/hooks/publicApi'

interface DateTimeSelectionStepProps {
  availableSlots: TimeSlot[]
  selectedSlot: TimeSlot | null
  onSelectSlot: (slot: TimeSlot) => void
  isLoading?: boolean
  timezone?: string
}

export const DateTimeSelectionStep = ({
  availableSlots,
  selectedSlot,
  onSelectSlot,
  isLoading = false,
  timezone = 'UTC',
}: DateTimeSelectionStepProps) => {
  const [currentDate, setCurrentDate] = useState(new Date())

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Group slots by date
  const slotsByDate = useMemo(() => {
    const map = new Map<string, TimeSlot[]>()
    availableSlots.forEach((slot) => {
      const dateKey = format(new Date(slot.startTimeUtc), 'yyyy-MM-dd')
      if (!map.has(dateKey)) {
        map.set(dateKey, [])
      }
      map.get(dateKey)?.push(slot)
    })
    return map
  }, [availableSlots])

  // Get selected date from selectedSlot or null
  const selectedDate = selectedSlot ? format(new Date(selectedSlot.startTimeUtc), 'yyyy-MM-dd') : null
  const slotsForSelectedDate = selectedDate ? slotsByDate.get(selectedDate) || [] : []

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Calendar */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-gray-900">{format(currentDate, 'MMMM yyyy')}</h3>
          <div className="flex space-x-2">
            <button
              onClick={() =>
                setCurrentDate(
                  new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
                )
              }
              className="p-2 hover:bg-white rounded transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Today
            </button>
            <button
              onClick={() =>
                setCurrentDate(
                  new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
                )
              }
              className="p-2 hover:bg-white rounded transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Week days header */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map((day) => (
            <div key={day} className="h-8 flex items-center justify-center font-semibold text-gray-600 text-sm">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day) => {
            const dateKey = format(day, 'yyyy-MM-dd')
            const daySlots = slotsByDate.get(dateKey) || []
            const isCurrentMonth = isSameMonth(day, currentDate)
            const hasSlots = daySlots.length > 0
            const isSelected = selectedDate === dateKey

            return (
              <button
                key={dateKey}
                onClick={() => hasSlots && onSelectSlot(daySlots[0])}
                disabled={!hasSlots}
                className={`p-2 rounded text-sm font-medium h-12 transition-colors ${
                  !isCurrentMonth
                    ? 'text-gray-300 bg-gray-50'
                    : isSelected
                      ? 'bg-blue-600 text-white'
                      : hasSlots
                        ? 'bg-blue-50 text-blue-900 hover:bg-blue-100 cursor-pointer'
                        : 'text-gray-400 bg-gray-50 cursor-not-allowed'
                } ${isToday(day) ? 'ring-2 ring-orange-400' : ''}`}
              >
                {format(day, 'd')}
              </button>
            )
          })}
        </div>
      </div>

      {/* Time Slots for Selected Date */}
      {selectedDate && (
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">
            Available times for {format(new Date(selectedDate), 'MMMM d, yyyy')}
          </h3>
          {slotsForSelectedDate.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No available slots for this date</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {slotsForSelectedDate.map((slot, index) => {
                const startTime = new Date(slot.startTimeUtc)
                const endTime = new Date(slot.endTimeUtc)
                const isSelected =
                  selectedSlot?.startTimeUtc === slot.startTimeUtc &&
                  selectedSlot?.endTimeUtc === slot.endTimeUtc

                return (
                  <button
                    key={index}
                    onClick={() => onSelectSlot(slot)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 bg-white hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Clock size={16} />
                      <span className="font-medium">
                        {format(startTime, 'HH:mm')} - {format(endTime, 'HH:mm')}
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
