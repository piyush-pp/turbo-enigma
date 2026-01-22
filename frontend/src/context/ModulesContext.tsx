import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import apiClient from '@/lib/api'

export interface Module {
    key: string
    name: string
    description: string
    enabled: boolean
}

interface ModulesContextValue {
    modules: Module[]
    loading: boolean
    error: string | null
    isModuleEnabled: (key: string) => boolean
    refreshModules: () => Promise<void>
}

const ModulesContext = createContext<ModulesContextValue | undefined>(undefined)

interface ModulesProviderProps {
    businessId: string
    children: ReactNode
}

export const ModulesProvider = ({ businessId, children }: ModulesProviderProps) => {
    const [modules, setModules] = useState<Module[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchModules = useCallback(async () => {
        if (!businessId) return

        setLoading(true)
        setError(null)

        try {
            const response = await apiClient.get(`/owner/modules?businessId=${businessId}`)
            setModules(response.data.modules)
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to fetch modules'
            setError(message)
        } finally {
            setLoading(false)
        }
    }, [businessId])

    useEffect(() => {
        fetchModules()
    }, [fetchModules])

    const isModuleEnabled = useCallback(
        (key: string): boolean => {
            const module = modules.find((m) => m.key === key)
            return module?.enabled ?? false
        },
        [modules]
    )

    return (
        <ModulesContext.Provider
            value={{
                modules,
                loading,
                error,
                isModuleEnabled,
                refreshModules: fetchModules,
            }}
        >
            {children}
        </ModulesContext.Provider>
    )
}

export const useModulesContext = (): ModulesContextValue => {
    const context = useContext(ModulesContext)
    if (context === undefined) {
        throw new Error('useModulesContext must be used within a ModulesProvider')
    }
    return context
}
