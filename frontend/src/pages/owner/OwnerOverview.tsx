import { useEffect, useState } from 'react'
import { Business, getBusiness } from '@/hooks/useOwnerApi'
import { AlertCircle } from 'lucide-react'

interface OwnerOverviewProps {
  businessId: string
}

export const OwnerOverview = ({ businessId }: OwnerOverviewProps) => {
  const [business, setBusiness] = useState<Business | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadBusiness = async () => {
      try {
        const data = await getBusiness(businessId)
        setBusiness(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load business')
      } finally {
        setLoading(false)
      }
    }
    loadBusiness()
  }, [businessId])

  if (loading) {
    return <div className="p-6">Loading...</div>
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="flex items-center space-x-2 text-red-600">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">{business?.name}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">Business Information</h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Business Name</p>
              <p className="font-medium text-gray-900">{business?.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Slug</p>
              <p className="font-medium text-gray-900 break-all">{business?.slug}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Timezone</p>
              <p className="font-medium text-gray-900">{business?.timezone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Type</p>
              <p className="font-medium text-gray-900">
                {business?.isSingleStaff ? 'Single Staff' : 'Multi Staff'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">Quick Stats</h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Booking URL</p>
              <p className="text-sm font-medium text-blue-600 break-all">
                {window.location.origin}/booking/{business?.slug}
              </p>
            </div>
            {business?.description && (
              <div>
                <p className="text-sm text-gray-600">Description</p>
                <p className="text-sm text-gray-900">{business.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
