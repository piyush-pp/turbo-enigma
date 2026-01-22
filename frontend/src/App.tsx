import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { OwnerProtectedRoute } from '@/components/OwnerProtectedRoute'
import { Sidebar } from '@/components/Sidebar'
import { DashboardPage } from '@/pages/DashboardPage'
import { CalendarPage } from '@/pages/CalendarPage'
import { AppointmentsPage } from '@/pages/AppointmentsPage'
import { CustomersPage } from '@/pages/CustomersPage'
import { RevenuePage } from '@/pages/RevenuePage'
import { AvailabilityPage } from '@/pages/AvailabilityPage'
import { LoginPage } from '@/pages/LoginPage'
import { SignupPage } from '@/pages/SignupPage'
import { PublicHomePage } from '@/pages/PublicHomePage'
import { PublicBookingPage } from '@/pages/PublicBookingPage'
import { OwnerLoginPage } from '@/pages/OwnerLoginPage'
import { OwnerDashboardPage } from '@/pages/OwnerDashboardPage'
import '@/index.css'

function DashboardLayout() {
  const { businessId } = useParams<{ businessId: string }>()
  
  if (!businessId) {
    return <div>Invalid business ID</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar businessId={businessId} />
      <div className="lg:pl-0">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/appointments" element={<AppointmentsPage />} />
          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/revenue" element={<RevenuePage />} />
          <Route path="/availability" element={<AvailabilityPage />} />
        </Routes>
      </div>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicHomePage />} />
        <Route path="/booking/:businessSlug" element={<PublicBookingPage />} />

        {/* Owner Auth Routes */}
        <Route path="/owner/login" element={<OwnerLoginPage />} />

        {/* Owner Dashboard Routes */}
        <Route
          path="/owner/:businessId/*"
          element={
            <OwnerProtectedRoute>
              <OwnerDashboardPage />
            </OwnerProtectedRoute>
          }
        />

        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Dashboard Routes */}
        <Route
          path="/dashboard/:businessId/*"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        />

        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
