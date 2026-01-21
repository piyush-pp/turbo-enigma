import { PublicService, TimeSlot } from '@/hooks/publicApi'
import { format } from 'date-fns'
import { Check, AlertCircle } from 'lucide-react'

interface BookingReviewStepProps {
  business: {
    name: string
    timezone: string
  }
  service: PublicService | null
  selectedSlot: TimeSlot | null
  staff?: { id: string }
  formData: {
    clientName: string
    clientEmail: string
    clientPhone?: string
    notes?: string
  }
  isProcessing?: boolean
}

export const BookingReviewStep = ({
  business,
  service,
  selectedSlot,
  staff,
  formData,
  isProcessing = false,
}: BookingReviewStepProps) => {
  if (!service || !selectedSlot) {
    return (
      <div className="flex items-center space-x-2 text-yellow-600 bg-yellow-50 p-4 rounded-lg">
        <AlertCircle size={20} />
        <span>Missing booking details</span>
      </div>
    )
  }

  const startTime = new Date(selectedSlot.startTimeUtc)
  const endTime = new Date(selectedSlot.endTimeUtc)

  return (
    <div className="space-y-6">
      {/* Booking Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Service Card */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-600 font-medium mb-1">SERVICE</p>
          <h3 className="font-semibold text-gray-900">{service.name}</h3>
          <p className="text-sm text-gray-600 mt-2">
            ⏱️ {service.duration} minutes
          </p>
          <p className="text-lg font-bold text-blue-600 mt-2">
            ${service.price.toFixed(2)}
          </p>
        </div>

        {/* Date & Time Card */}
        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-600 font-medium mb-1">DATE & TIME</p>
          <h3 className="font-semibold text-gray-900">
            {format(startTime, 'MMM d, yyyy')}
          </h3>
          <p className="text-sm text-gray-600 mt-2">
            {format(startTime, 'HH:mm')} - {format(endTime, 'HH:mm')}
          </p>
          <p className="text-xs text-gray-500 mt-2">Timezone: {business.timezone}</p>
        </div>
      </div>

      {/* Client Information */}
      <div className="border border-gray-200 rounded-lg p-4">
        <p className="text-sm font-medium text-gray-700 mb-4">CLIENT INFORMATION</p>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Name:</span>
            <span className="font-medium text-gray-900">{formData.clientName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Email:</span>
            <span className="font-medium text-gray-900">{formData.clientEmail}</span>
          </div>
          {formData.clientPhone && (
            <div className="flex justify-between">
              <span className="text-gray-600">Phone:</span>
              <span className="font-medium text-gray-900">{formData.clientPhone}</span>
            </div>
          )}
        </div>
      </div>

      {/* Notes */}
      {formData.notes && (
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <p className="text-sm font-medium text-gray-700 mb-2">NOTES</p>
          <p className="text-sm text-gray-600 whitespace-pre-wrap">{formData.notes}</p>
        </div>
      )}

      {/* Confirmation Message */}
      {!isProcessing && (
        <div className="flex items-start space-x-3 bg-green-50 border-l-4 border-green-600 p-4">
          <Check size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-green-900">Ready to book</p>
            <p className="text-sm text-green-700 mt-1">
              Click "Complete Booking" to confirm your appointment. You'll receive a confirmation email shortly.
            </p>
          </div>
        </div>
      )}

      {/* Processing Message */}
      {isProcessing && (
        <div className="flex items-center space-x-3 bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600" />
          <p className="text-blue-900">Processing your booking...</p>
        </div>
      )}
    </div>
  )
}
