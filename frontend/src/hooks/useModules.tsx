import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { getModules, Module } from './useOwnerApi'

interface ModulesContextType {
  modules: Module[]
  isLoading: boolean
  error: string | null
  isModuleEnabled: (key: string) => boolean
  refreshModules: () => Promise<void>
}

const ModulesContext = createContext<ModulesContextType | undefined>(undefined)

interface ModulesProviderProps {
  children: ReactNode
  businessId: string
}

export const ModulesProvider = ({ children, businessId }: ModulesProviderProps) => {
  const [modules, setModules] = useState<Module[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadModules = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await getModules(businessId)
      setModules(data.modules)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load modules')
      setModules([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (businessId) {
      loadModules()
    }
  }, [businessId])

  const isModuleEnabled = (key: string): boolean => {
    const module = modules.find((m) => m.key === key)
    return module?.enabled ?? false
  }

  const refreshModules = async () => {
    await loadModules()
  }

  return (
    <ModulesContext.Provider
      value={{
        modules,
        isLoading,
        error,
        isModuleEnabled,
        refreshModules,
      }}
    >
      {children}
    </ModulesContext.Provider>
  )
}

export const useModules = (): ModulesContextType => {
  const context = useContext(ModulesContext)
  if (context === undefined) {
    throw new Error('useModules must be used within a ModulesProvider')
  }
  return context
}

/**
 * Standalone hook to check if a module is enabled
 * This can be used without the provider, but will fetch modules on demand
 */
export const useModuleEnabled = (businessId: string, moduleKey: string): boolean => {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const checkModule = async () => {
      try {
        const data = await getModules(businessId)
        const module = data.modules.find((m) => m.key === moduleKey)
        setEnabled(module?.enabled ?? false)
      } catch (err) {
        setEnabled(false)
      }
    }

    if (businessId && moduleKey) {
      checkModule()
    }
  }, [businessId, moduleKey])

  return enabled
}
