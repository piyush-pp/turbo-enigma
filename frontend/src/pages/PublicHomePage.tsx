import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, ArrowRight, AlertCircle } from 'lucide-react'

export const PublicHomePage = () => {
  const [businessSlug, setBusinessSlug] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!businessSlug.trim()) {
      setError('Please enter a business name')
      return
    }

    // Convert to slug format
    const slug = businessSlug.toLowerCase().trim().replace(/\s+/g, '-')
    setLoading(true)

    try {
      // Navigate to booking page (backend will validate slug exists)
      navigate(`/booking/${slug}`)
    } catch (err) {
      setError('Failed to navigate to booking page')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar size={32} className="text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Appoint</h1>
          </div>
          <p className="text-gray-600 hidden sm:block">Book your appointment online</p>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Content */}
          <div className="space-y-6">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight">
              Book Your Appointment Online
            </h2>
            <p className="text-xl text-gray-600">
              Find available times, select your preferred service and staff member, and book your appointment in
              minutes.
            </p>

            <ul className="space-y-3">
              {[
                'Browse available services and staff',
                'Select your preferred date and time',
                'Instant confirmation',
                'Email reminders before your appointment',
              ].map((feature, index) => (
                <li key={index} className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-6 w-6 rounded-full bg-blue-600">
                      <svg
                        className="h-4 w-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  </div>
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Side - Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-10">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Find Your Business</h3>

            <form onSubmit={handleBooking} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
                  <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Name or Booking Link
                </label>
                <input
                  type="text"
                  value={businessSlug}
                  onChange={(e) => setBusinessSlug(e.target.value)}
                  placeholder="e.g., my-salon or booking-slug"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors text-lg"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Ask your service provider for their booking link
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || !businessSlug.trim()}
                className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2 text-lg"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                    <span>Loading...</span>
                  </>
                ) : (
                  <>
                    <span>Continue</span>
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </form>

            {/* Example */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Example:</span> If your provider gave you{' '}
                <code className="bg-white px-2 py-1 rounded text-blue-600">my-salon</code>, enter that above.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Why Choose Appoint?</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '⏰',
                title: 'Real-Time Availability',
                description: 'See all available appointment slots instantly',
              },
              {
                icon: '✨',
                title: 'Easy Booking',
                description: 'Simple, intuitive booking process in just a few clicks',
              },
              {
                icon: '📧',
                title: 'Confirmations & Reminders',
                description: 'Get email confirmations and reminders before your appointment',
              },
            ].map((feature, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="font-semibold text-lg text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>
            &copy; 2024 Appoint. Appointment management made simple.
          </p>
        </div>
      </footer>
    </div>
  )
}
