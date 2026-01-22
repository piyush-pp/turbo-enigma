import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useOwnerAuth } from '@/hooks/useOwnerAuth'
import {
  LayoutDashboard,
  Settings,
  Users,
  Briefcase,
  Calendar,
  LogOut,
  Menu,
  X,
  Puzzle,
} from 'lucide-react'

interface OwnerSidebarProps {
  businessId: string
}

export const OwnerSidebar = ({ businessId }: OwnerSidebarProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useOwnerAuth()

  const menuItems = [
    { path: '', label: 'Overview', icon: LayoutDashboard },
    { path: 'business', label: 'Business Setup', icon: Settings },
    { path: 'services', label: 'Services', icon: Briefcase },
    { path: 'staff', label: 'Staff', icon: Users },

    { path: 'bookings', label: 'Bookings', icon: Calendar },
    { path: 'extensions', label: 'Extensions', icon: Puzzle },
  ]

  const isActive = (path: string) => {
    const currentPath = location.pathname.split('/').pop() || ''
    return path === currentPath
  }

  const handleLogout = () => {
    logout()
    navigate('/owner/login')
  }

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/20 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 w-64 bg-gray-900 text-white z-40 transform lg:transform-none transition-transform ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-gray-800">
            <h1 className="text-2xl font-bold">{user?.businessName}</h1>
            <p className="text-sm text-gray-400 mt-1">{user?.email}</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6">
            <div className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.path}
                    onClick={() => {
                      navigate(`/owner/${businessId}/${item.path}`)
                      setIsOpen(false)
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-colors ${isActive(item.path)
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800'
                      }`}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </button>
                )
              })}
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-800">
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-gray-800 rounded-lg font-medium transition-colors"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content area adjustment */}
      <div className="lg:ml-0" />
    </>
  )
}
