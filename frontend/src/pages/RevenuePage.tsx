import { useParams } from 'react-router-dom'
import { useBookings, useServices } from '@/hooks/api'
import { RevenueOverview } from '@/components/RevenueOverview'

export const RevenuePage = () => {
  const { businessId } = useParams<{ businessId: string }>()!
  const { bookings, loading } = useBookings(businessId)
  const { services } = useServices(businessId)

  if (loading) {
    return (
      <main className="lg:ml-64 p-6">
        <h1 className="text-3xl font-bold mb-8">Revenue Overview</h1>
        <div className="card text-center py-12">Loading...</div>
      </main>
    )
  }

  return (
    <main className="lg:ml-64 p-6">
      <h1 className="text-3xl font-bold mb-8">Revenue Overview</h1>
      <RevenueOverview bookings={bookings} services={services} />
    </main>
  )
}
