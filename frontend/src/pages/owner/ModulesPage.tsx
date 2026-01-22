import { useState } from 'react'
import { useModules } from '@/hooks/useModules'
import { Puzzle, Loader2, AlertCircle, CheckCircle } from 'lucide-react'

interface ModulesPageProps {
    businessId: string
}

export const ModulesPage = ({ businessId }: ModulesPageProps) => {
    const { modules, loading, error, updating, updateModule } = useModules(businessId)
    const [successMessage, setSuccessMessage] = useState<string | null>(null)

    const handleToggle = async (moduleKey: string, currentEnabled: boolean) => {
        try {
            setSuccessMessage(null)
            await updateModule(moduleKey, !currentEnabled)
            setSuccessMessage(`Module ${!currentEnabled ? 'enabled' : 'disabled'} successfully`)
            setTimeout(() => setSuccessMessage(null), 3000)
        } catch {
            // Error is handled in the hook
        }
    }

    if (loading) {
        return (
            <div className="p-8">
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    <span className="ml-3 text-gray-600">Loading modules...</span>
                </div>
            </div>
        )
    }

    return (
        <div className="p-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <Puzzle className="w-8 h-8 text-blue-600" />
                    <h1 className="text-3xl font-bold text-gray-900">Extensions</h1>
                </div>
                <p className="text-gray-600">
                    Manage platform modules for your business. Enable or disable features based on your needs.
                </p>
            </div>

            {/* Success Message */}
            {successMessage && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-green-800">{successMessage}</span>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <span className="text-red-800">{error}</span>
                </div>
            )}

            {/* Modules List */}
            <div className="space-y-4">
                {modules.map((module) => {
                    const isUpdating = updating === module.key

                    return (
                        <div
                            key={module.key}
                            className={`bg-white rounded-xl border p-6 transition-all duration-200 ${module.enabled
                                    ? 'border-blue-200 shadow-sm'
                                    : 'border-gray-200 opacity-75'
                                }`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            {module.name}
                                        </h3>
                                        <span
                                            className={`px-2 py-0.5 text-xs font-medium rounded-full ${module.enabled
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-gray-100 text-gray-600'
                                                }`}
                                        >
                                            {module.enabled ? 'Enabled' : 'Disabled'}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 mt-1">{module.description}</p>
                                </div>

                                {/* Toggle Switch */}
                                <button
                                    onClick={() => handleToggle(module.key, module.enabled)}
                                    disabled={isUpdating}
                                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isUpdating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                                        } ${module.enabled ? 'bg-blue-600' : 'bg-gray-300'}`}
                                    role="switch"
                                    aria-checked={module.enabled}
                                    aria-label={`Toggle ${module.name}`}
                                >
                                    {isUpdating ? (
                                        <span className="absolute inset-0 flex items-center justify-center">
                                            <Loader2 className="w-4 h-4 animate-spin text-white" />
                                        </span>
                                    ) : (
                                        <span
                                            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform ${module.enabled ? 'translate-x-6' : 'translate-x-1'
                                                }`}
                                        />
                                    )}
                                </button>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Empty State */}
            {modules.length === 0 && !loading && (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <Puzzle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No modules available</h3>
                    <p className="text-gray-600">Check back later for new extensions.</p>
                </div>
            )}
        </div>
    )
}
