import { useState, useEffect } from 'react'
import apiClient from '@/lib/api'
import { Clock, Save } from 'lucide-react'

interface AvailabilityRule {
  dayOfWeek: number
  startTime: string
  endTime: string
  isWorkingDay: boolean
}

interface AvailabilityManagementProps {
  staffId: string
  businessId: string
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export const AvailabilityManagement = ({
  staffId,
  businessId,
}: AvailabilityManagementProps) => {
  const [rules, setRules] = useState<AvailabilityRule[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    fetchAvailability()
  }, [staffId])

  const fetchAvailability = async () => {
    try {
      setLoading(true)
      const response = await apiClient.get(`/owner/availability/${staffId}`, {
        params: { businessId },
      })
      setRules(response.data || getDefaultRules())
    } catch (error) {
      console.error('Failed to fetch availability:', error)
      setRules(getDefaultRules())
    } finally {
      setLoading(false)
    }
  }

  const getDefaultRules = (): AvailabilityRule[] => {
    return Array.from({ length: 7 }, (_, i) => ({
      dayOfWeek: i,
      startTime: '09:00',
      endTime: '17:00',
      isWorkingDay: i < 5, // Mon-Fri
    }))
  }

  const updateRule = (dayOfWeek: number, field: string, value: any) => {
    setRules(
      rules.map((rule) =>
        rule.dayOfWeek === dayOfWeek ? { ...rule, [field]: value } : rule
      )
    )
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      await apiClient.put(`/owner/availability/${staffId}`, { rules }, {
        params: { businessId },
      })
      setMessage({ type: 'success', text: 'Availability updated successfully' })
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Failed to save availability',
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="card">Loading availability...</div>
  }

  return (
    <div className="card">
      <div className="flex items-center space-x-2 mb-6">
        <Clock size={24} className="text-blue-600" />
        <h2 className="text-2xl font-bold">Availability Management</h2>
      </div>

      {message && (
        <div
          className={`p-4 rounded mb-4 ${
            message.type === 'success'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="space-y-4">
        {rules.map((rule) => (
          <div key={rule.dayOfWeek} className="border rounded-lg p-4 bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {DAYS[rule.dayOfWeek]}
                </label>
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1">Start Time</label>
                <input
                  type="time"
                  value={rule.startTime}
                  onChange={(e) => updateRule(rule.dayOfWeek, 'startTime', e.target.value)}
                  disabled={!rule.isWorkingDay}
                  className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-100 disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1">End Time</label>
                <input
                  type="time"
                  value={rule.endTime}
                  onChange={(e) => updateRule(rule.dayOfWeek, 'endTime', e.target.value)}
                  disabled={!rule.isWorkingDay}
                  className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-100 disabled:opacity-50"
                />
              </div>

              <div className="flex items-end">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rule.isWorkingDay}
                    onChange={(e) => updateRule(rule.dayOfWeek, 'isWorkingDay', e.target.checked)}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">Working Day</span>
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end mt-6">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center space-x-2 btn-primary disabled:opacity-50"
        >
          <Save size={20} />
          <span>{saving ? 'Saving...' : 'Save Changes'}</span>
        </button>
      </div>
    </div>
  )
}
