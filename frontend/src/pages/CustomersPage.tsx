import { useParams } from 'react-router-dom'
import { useBookings } from '@/hooks/api'
import { useState, useMemo } from 'react'
import { Mail, Phone, User } from 'lucide-react'

interface Customer {
  id: string
  email: string
  name: string
  phone?: string
  bookingsCount: number
  totalSpent: number
  lastBooking?: string
}

export const CustomersPage = () => {
  const { businessId } = useParams<{ businessId: string }>()!
  const { bookings } = useBookings(businessId)
  const [searchTerm, setSearchTerm] = useState('')

  const customers = useMemo(() => {
    const customerMap = new Map<string, Customer>()

    bookings.forEach((booking) => {
      const key = booking.clientEmail
      if (!customerMap.has(key)) {
        customerMap.set(key, {
          id: booking.id,
          email: booking.clientEmail,
          name: booking.clientName,
          phone: booking.clientPhone,
          bookingsCount: 0,
          totalSpent: 0,
        })
      }
    })

    return Array.from(customerMap.values())
      .sort((a, b) => b.bookingsCount - a.bookingsCount)
  }, [bookings])

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <main className="lg:ml-64 p-6">
      <h1 className="text-3xl font-bold mb-8">Customers</h1>

      {/* Search */}
      <div className="card mb-6">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
      </div>

      {/* Customers List */}
      {filteredCustomers.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500 text-lg">No customers found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredCustomers.map((customer) => (
            <div key={customer.email} className="card">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <User size={24} className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{customer.name}</h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Mail size={16} />
                        <span>{customer.email}</span>
                      </div>
                    </div>
                  </div>

                  {customer.phone && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
                      <Phone size={16} />
                      <span>{customer.phone}</span>
                    </div>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-2xl font-bold text-blue-600">
                      {bookings.filter((b) => b.clientEmail === customer.email).length}
                    </p>
                    <p className="text-xs text-gray-600">Bookings</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-2xl font-bold text-green-600">
                      $
                      {bookings
                        .filter((b) => b.clientEmail === customer.email)
                        .reduce((sum) => sum + 50, 0) // Placeholder, use actual service prices
                        .toFixed(0)}
                    </p>
                    <p className="text-xs text-gray-600">Spent</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
