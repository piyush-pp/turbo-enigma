import { useParams } from 'react-router-dom'
import { useStaff } from '@/hooks/api'
import { AvailabilityManagement } from '@/components/AvailabilityManagement'

export const AvailabilityPage = () => {
  const { businessId } = useParams<{ businessId: string }>()!
  const { staff, loading } = useStaff(businessId)

  if (loading) {
    return (
      <main className="lg:ml-64 p-6">
        <h1 className="text-3xl font-bold mb-8">Availability Management</h1>
        <div className="card text-center py-12">Loading...</div>
      </main>
    )
  }

  const activeStaff = staff.filter((s) => s.isActive)

  return (
    <main className="lg:ml-64 p-6">
      <h1 className="text-3xl font-bold mb-8">Availability Management</h1>

      {activeStaff.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500">No active staff members</p>
        </div>
      ) : (
        <div className="space-y-8">
          {activeStaff.map((staffMember) => (
            <AvailabilityManagement
              key={staffMember.id}
              staffId={staffMember.id}
              businessId={businessId}
            />
          ))}
        </div>
      )}
    </main>
  )
}
