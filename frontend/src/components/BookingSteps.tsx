import { PublicService, PublicStaff } from '@/hooks/publicApi'
import { Check } from 'lucide-react'

interface ServiceSelectionStepProps {
  services: PublicService[]
  selectedServiceId: string | null
  onSelectService: (serviceId: string) => void
  isLoading?: boolean
}

export const ServiceSelectionStep = ({
  services,
  selectedServiceId,
  onSelectService,
  isLoading = false,
}: ServiceSelectionStepProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    )
  }

  if (services.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No services available</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {services
        .filter((s) => s.isActive)
        .map((service) => (
          <div
            key={service.id}
            onClick={() => onSelectService(service.id)}
            className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
              selectedServiceId === service.id
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 bg-white hover:border-blue-300'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{service.name}</h3>
                {service.description && (
                  <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                )}
                <div className="flex items-center space-x-4 mt-2">
                  <span className="text-sm text-gray-600">
                    ⏱️ {service.duration} minutes
                  </span>
                  <span className="font-semibold text-blue-600">
                    ${service.price.toFixed(2)}
                  </span>
                </div>
              </div>
              {selectedServiceId === service.id && (
                <div className="flex-shrink-0 ml-4">
                  <div className="flex items-center justify-center h-6 w-6 rounded-full bg-blue-600">
                    <Check size={16} className="text-white" />
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
    </div>
  )
}

interface StaffSelectionStepProps {
  staff: PublicStaff[]
  selectedStaffId: string | null
  onSelectStaff: (staffId: string) => void
  isSingleStaff: boolean
  isLoading?: boolean
}

export const StaffSelectionStep = ({
  staff,
  selectedStaffId,
  onSelectStaff,
  isSingleStaff,
  isLoading = false,
}: StaffSelectionStepProps) => {
  // Auto-select if single staff mode
  if (isSingleStaff && staff.length > 0 && !selectedStaffId) {
    // This should be handled by parent
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Staff member will be automatically assigned</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    )
  }

  if (staff.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No staff available</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {staff.map((member) => (
        <div
          key={member.id}
          onClick={() => onSelectStaff(member.id)}
          className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
            selectedStaffId === member.id
              ? 'border-blue-600 bg-blue-50'
              : 'border-gray-200 bg-white hover:border-blue-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">Staff Member</h3>
              <p className="text-sm text-gray-600 mt-1">Available for booking</p>
            </div>
            {selectedStaffId === member.id && (
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-6 w-6 rounded-full bg-blue-600">
                  <Check size={16} className="text-white" />
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
