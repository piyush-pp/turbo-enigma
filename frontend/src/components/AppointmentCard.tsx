import { Booking } from '@/hooks/api'
import { format } from 'date-fns'
import { Clock, Mail, Phone } from 'lucide-react'

interface AppointmentCardProps {
  booking: Booking
  onStatusChange?: (bookingId: string, status: string) => void
}

export const AppointmentCard = ({ booking, onStatusChange }: AppointmentCardProps) => {
  const startDate = new Date(booking.startTimeUtc)
  const endDate = new Date(booking.endTimeUtc)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'badge-success'
      case 'PENDING':
        return 'badge-pending'
      case 'CANCELLED':
        return 'badge-cancelled'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="card border-l-4 border-blue-500">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-lg text-gray-900">{booking.clientName}</h3>
          <span className={`inline-block mt-2 ${getStatusColor(booking.status)}`}>
            {booking.status}
          </span>
        </div>
        <div className="text-sm text-gray-600">
          {format(startDate, 'MMM dd, yyyy')}
        </div>
      </div>

      <div className="space-y-2 text-sm text-gray-600 mb-4">
        <div className="flex items-center space-x-2">
          <Clock size={16} />
          <span>
            {format(startDate, 'HH:mm')} - {format(endDate, 'HH:mm')}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Mail size={16} />
          <span>{booking.clientEmail}</span>
        </div>
        {booking.clientPhone && (
          <div className="flex items-center space-x-2">
            <Phone size={16} />
            <span>{booking.clientPhone}</span>
          </div>
        )}
      </div>

      {booking.notes && (
        <div className="bg-gray-50 p-3 rounded mb-4 text-sm text-gray-700">
          <p className="font-medium mb-1">Notes:</p>
          <p>{booking.notes}</p>
        </div>
      )}

      {booking.status === 'PENDING' && onStatusChange && (
        <div className="flex space-x-2">
          <button
            onClick={() => onStatusChange(booking.id, 'CONFIRMED')}
            className="flex-1 btn-primary text-sm"
          >
            Confirm
          </button>
          <button
            onClick={() => onStatusChange(booking.id, 'CANCELLED')}
            className="flex-1 btn-secondary text-sm"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  )
}
