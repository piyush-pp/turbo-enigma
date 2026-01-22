import { useParams } from 'react-router-dom'
import { OwnerSidebar } from '@/components/OwnerSidebar'
import { OwnerOverview } from './owner/OwnerOverview'
import { BusinessSetup } from './owner/BusinessSetup'
import { ServiceManagement } from './owner/ServiceManagement'
import { StaffManagement } from './owner/StaffManagement'
import { BookingsView } from './owner/BookingsView'
import { ModulesPage } from './owner/ModulesPage'

export const OwnerDashboardPage = () => {
  const { businessId, section } = useParams<{ businessId: string; section?: string }>()

  if (!businessId) {
    return <div>Invalid business</div>
  }

  const renderSection = () => {
    switch (section) {
      case 'business':
        return <BusinessSetup businessId={businessId} />
      case 'services':
        return <ServiceManagement businessId={businessId} />
      case 'staff':
        return <StaffManagement businessId={businessId} />
      case 'bookings':
        return <BookingsView businessId={businessId} />
      case 'extensions':
        return <ModulesPage businessId={businessId} />
      default:
        return <OwnerOverview businessId={businessId} />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <OwnerSidebar businessId={businessId} />
      <main className="flex-1 overflow-auto">
        {renderSection()}
      </main>
    </div>
  )
}
