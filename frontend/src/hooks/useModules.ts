import { useState, useEffect, useCallback } from 'react'
import apiClient from '@/lib/api'

export interface Module {
    key: string
    name: string
    description: string
    enabled: boolean
}

interface ModulesResponse {
    modules: Module[]
}

interface ModuleUpdateResponse {
    module: Module
}

export const useModules = (businessId: string) => {
    const [modules, setModules] = useState<Module[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [updating, setUpdating] = useState<string | null>(null)

    const fetchModules = useCallback(async () => {
        if (!businessId) return

        setLoading(true)
        setError(null)

        try {
            const response = await apiClient.get<ModulesResponse>(
                `/owner/modules?businessId=${businessId}`
            )
            setModules(response.data.modules)
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to fetch modules'
            setError(message)
        } finally {
            setLoading(false)
        }
    }, [businessId])

    const updateModule = useCallback(
        async (moduleKey: string, enabled: boolean) => {
            setUpdating(moduleKey)
            setError(null)

            try {
                const response = await apiClient.patch<ModuleUpdateResponse>(
                    `/owner/modules/${moduleKey}?businessId=${businessId}`,
                    { enabled }
                )

                // Update local state with the response
                setModules((prev) =>
                    prev.map((m) =>
                        m.key === moduleKey ? response.data.module : m
                    )
                )

                return response.data.module
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Failed to update module'
                setError(message)
                throw err
            } finally {
                setUpdating(null)
            }
        },
        [businessId]
    )

    useEffect(() => {
        fetchModules()
    }, [fetchModules])

    return {
        modules,
        loading,
        error,
        updating,
        updateModule,
        refreshModules: fetchModules,
    }
}

/**
 * Helper function to check if a module is enabled
 * @param modules - Array of modules
 * @param key - Module key to check
 * @returns true if the module is enabled, false otherwise
 */
export const isModuleEnabled = (modules: Module[], key: string): boolean => {
    const module = modules.find((m) => m.key === key)
    return module?.enabled ?? false
}
