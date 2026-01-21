import { AlertCircle } from 'lucide-react'

interface CustomerInfoStepProps {
  formData: {
    clientName: string
    clientEmail: string
    clientPhone?: string
    notes?: string
  }
  onChange: (field: string, value: string) => void
  errors?: Record<string, string>
}

export const CustomerInfoStep = ({
  formData,
  onChange,
  errors = {},
}: CustomerInfoStepProps) => {
  return (
    <div className="space-y-4">
      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Full Name *
        </label>
        <input
          type="text"
          value={formData.clientName}
          onChange={(e) => onChange('clientName', e.target.value)}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 ${
            errors.clientName ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="John Doe"
        />
        {errors.clientName && (
          <div className="flex items-center space-x-1 text-red-600 text-sm mt-1">
            <AlertCircle size={16} />
            <span>{errors.clientName}</span>
          </div>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email Address *
        </label>
        <input
          type="email"
          value={formData.clientEmail}
          onChange={(e) => onChange('clientEmail', e.target.value)}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 ${
            errors.clientEmail ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="you@example.com"
        />
        {errors.clientEmail && (
          <div className="flex items-center space-x-1 text-red-600 text-sm mt-1">
            <AlertCircle size={16} />
            <span>{errors.clientEmail}</span>
          </div>
        )}
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Phone Number (Optional)
        </label>
        <input
          type="tel"
          value={formData.clientPhone || ''}
          onChange={(e) => onChange('clientPhone', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          placeholder="(555) 123-4567"
        />
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Additional Notes (Optional)
        </label>
        <textarea
          value={formData.notes || ''}
          onChange={(e) => onChange('notes', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          placeholder="Let us know if you have any special requests or questions..."
          rows={4}
        />
      </div>
    </div>
  )
}
