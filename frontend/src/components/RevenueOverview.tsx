import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

interface RevenueOverviewProps {
  bookings: any[]
  services: any[]
}

export const RevenueOverview = ({ bookings, services }: RevenueOverviewProps) => {
  // Calculate revenue by day
  const revenueByDay = bookings.reduce((acc, booking) => {
    if (booking.status !== 'COMPLETED' && booking.status !== 'CONFIRMED') return acc
    
    const date = new Date(booking.startTimeUtc)
    const dateKey = date.toLocaleDateString()
    const service = services.find((s) => s.id === booking.serviceId)
    const price = service?.price || 0

    const existing = acc.find((item : any) => item.date === dateKey)
    if (existing) {
      existing.revenue += price
    } else {
      acc.push({ date: dateKey, revenue: price })
    }
    return acc
  }, [])

  // Calculate status distribution
  const statusDistribution = [
    { name: 'Confirmed', value: bookings.filter((b) => b.status === 'CONFIRMED').length },
    { name: 'Pending', value: bookings.filter((b) => b.status === 'PENDING').length },
    { name: 'Completed', value: bookings.filter((b) => b.status === 'COMPLETED').length },
    { name: 'Cancelled', value: bookings.filter((b) => b.status === 'CANCELLED').length },
  ]

  const totalRevenue = revenueByDay.reduce((sum : any, item : any) => sum + item.revenue, 0)
  const avgBookingValue = bookings.length > 0 ? totalRevenue / bookings.length : 0

  const COLORS = ['#10b981', '#f59e0b', '#3b82f6', '#ef4444']

  return (
    <div className="space-y-6">
      {/* Revenue Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card">
          <p className="text-gray-600 text-sm">Total Revenue</p>
          <p className="text-3xl font-bold text-green-600 mt-2">
            ${totalRevenue.toFixed(2)}
          </p>
        </div>
        <div className="card">
          <p className="text-gray-600 text-sm">Average Booking Value</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">
            ${avgBookingValue.toFixed(2)}
          </p>
        </div>
        <div className="card">
          <p className="text-gray-600 text-sm">Total Bookings</p>
          <p className="text-3xl font-bold text-purple-600 mt-2">
            {bookings.length}
          </p>
        </div>
      </div>

      {/* Revenue Trend Chart */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Revenue Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={revenueByDay.slice(-30)}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip formatter={(value) => `$${value}`} />
            <Legend />
            <Line type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Status Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Booking Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {statusDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Booking Breakdown</h3>
          <div className="space-y-3">
            {statusDistribution.map((item, index) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: COLORS[index] }}
                  />
                  <span className="text-gray-700">{item.name}</span>
                </div>
                <span className="font-semibold">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
