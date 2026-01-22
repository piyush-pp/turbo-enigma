import { useEffect, useState } from 'react'
import { getModules, toggleModule, Module } from '@/hooks/useOwnerApi'
import { Loader2 } from 'lucide-react'

interface ModulesManagementProps {
  businessId: string
}

export const ModulesManagement = ({ businessId }: ModulesManagementProps) => {
  const [loading, setLoading] = useState(true)
  const [toggling, setToggling] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState('')
  const [modules, setModules] = useState<Module[]>([])

  useEffect(() => {
    const loadModules = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getModules(businessId)
        setModules(data.modules)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load modules')
      } finally {
        setLoading(false)
      }
    }
    loadModules()
  }, [businessId])

  const handleToggle = async (moduleKey: string, currentEnabled: boolean) => {
    try {
      setToggling(moduleKey)
      setError(null)
      setSuccess('')
      
      const newEnabled = !currentEnabled
      const updatedModule = await toggleModule(moduleKey, newEnabled, businessId)
      
      // Update local state
      setModules((prev) =>
        prev.map((m) => (m.key === moduleKey ? updatedModule : m))
      )
      
      setSuccess(`${updatedModule.name} ${newEnabled ? 'enabled' : 'disabled'} successfully`)
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle module')
    } finally {
      setToggling(null)
    }
  }

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Extensions</h1>
        <p className="text-gray-600">
          Enable or disable platform modules for your business
        </p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-800 rounded-lg text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-100 text-green-800 rounded-lg text-sm">
          {success}
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="divide-y divide-gray-200">
          {modules.map((module) => {
            const isToggling = toggling === module.key
            const isEnabled = module.enabled

            return (
              <div
                key={module.key}
                className={`p-6 transition-colors ${
                  !isEnabled ? 'bg-gray-50' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {module.name}
                      </h3>
                      {!isEnabled && (
                        <span className="px-2 py-1 text-xs font-medium bg-gray-200 text-gray-700 rounded">
                          Disabled
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      {module.description}
                    </p>
                    {module.defaultEnabled && (
                      <p className="text-xs text-gray-500">
                        Enabled by default
                      </p>
                    )}
                  </div>

                  <div className="ml-6">
                    <button
                      onClick={() => handleToggle(module.key, isEnabled)}
                      disabled={isToggling}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                        isEnabled
                          ? 'bg-blue-600'
                          : 'bg-gray-300'
                      } ${isToggling ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                      role="switch"
                      aria-checked={isEnabled}
                      aria-label={`Toggle ${module.name}`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          isEnabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                    {isToggling && (
                      <div className="absolute mt-2 ml-2">
                        <Loader2 className="animate-spin text-blue-600" size={16} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {modules.length === 0 && (
          <div className="p-12 text-center text-gray-500">
            <p>No modules available</p>
          </div>
        )}
      </div>
    </div>
  )
}
