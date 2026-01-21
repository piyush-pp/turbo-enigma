import { useParams } from 'react-router-dom'
import { useBookings, useServices, useStaff } from '@/hooks/api'
import { format, startOfDay, endOfDay } from 'date-fns'
import { Users, Calendar, DollarSign, Clock } from 'lucide-react'

export const DashboardPage = () => {
  const { businessId } = useParams<{ businessId: string }>()!
  const { bookings } = useBookings(businessId)
  const { services } = useServices(businessId)
  const { staff } = useStaff(businessId)

  const today = new Date()
  const todayStart = startOfDay(today)
  const todayEnd = endOfDay(today)

  const todayBookings = bookings.filter((b) => {
    const start = new Date(b.startTimeUtc)
    return start >= todayStart && start <= todayEnd
  })

  const confirmedBookings = bookings.filter((b) => b.status === 'CONFIRMED').length
  const totalRevenue = bookings
    .filter((b) => b.status === 'COMPLETED' || b.status === 'CONFIRMED')
    .reduce((sum, b) => {
      const service = services.find((s) => s.id === b.serviceId)
      return sum + (service?.price || 0)
    }, 0)

  const stats = [
    {
      icon: Calendar,
      label: "Today's Bookings",
      value: todayBookings.length,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      icon: Clock,
      label: 'Confirmed',
      value: confirmedBookings,
      color: 'bg-green-100 text-green-600',
    },
    {
      icon: DollarSign,
      label: 'Total Revenue',
      value: `$${totalRevenue.toFixed(2)}`,
      color: 'bg-purple-100 text-purple-600',
    },
    {
      icon: Users,
      label: 'Active Staff',
      value: staff.filter((s) => s.isActive).length,
      color: 'bg-orange-100 text-orange-600',
    },
  ]

  return (
    <main className="lg:ml-64 p-6">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="card">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-600 text-sm">{stat.label}</p>
                  <p className="text-3xl font-bold mt-2">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon size={24} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Today's Bookings */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4">Today's Bookings</h2>
        {todayBookings.length === 0 ? (
          <p className="text-gray-500">No bookings today</p>
        ) : (
          <div className="space-y-2">
            {todayBookings.map((booking) => (
              <div key={booking.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-medium">{booking.clientName}</p>
                  <p className="text-sm text-gray-600">
                    {format(new Date(booking.startTimeUtc), 'HH:mm')} -{' '}
                    {format(new Date(booking.endTimeUtc), 'HH:mm')}
                  </p>
                </div>
                <span className={`badge-${booking.status.toLowerCase()}`}>
                  {booking.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
