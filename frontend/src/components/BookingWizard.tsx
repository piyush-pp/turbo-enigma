import { ChevronRight, ChevronLeft } from 'lucide-react'

interface Step {
  id: number
  title: string
  description: string
}

interface WizardProps {
  steps: Step[]
  currentStep: number
  onNext: () => void
  onPrev: () => void
  children: React.ReactNode
  isLoading?: boolean
  canContinue?: boolean
}

export const BookingWizard = ({
  steps,
  currentStep,
  onNext,
  onPrev,
  children,
  isLoading = false,
  canContinue = true,
}: WizardProps) => {
  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === steps.length - 1

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex-1">
                <div className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                      index <= currentStep
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-300 text-gray-600'
                    }`}
                  >
                    {index + 1}
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-2 transition-colors ${
                        index < currentStep ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    />
                  )}
                </div>
                <p
                  className={`text-sm font-medium mt-2 ${
                    index <= currentStep ? 'text-blue-600' : 'text-gray-600'
                  }`}
                >
                  {step.title}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{steps[currentStep].title}</h2>
            <p className="text-gray-600 mt-2">{steps[currentStep].description}</p>
          </div>

          {/* Step Body */}
          <div className="mb-8">{children}</div>

          {/* Navigation */}
          <div className="flex justify-between pt-6 border-t">
            <button
              onClick={onPrev}
              disabled={isFirstStep || isLoading}
              className="flex items-center space-x-2 px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={20} />
              <span>Previous</span>
            </button>

            {!isLastStep ? (
              <button
                onClick={onNext}
                disabled={!canContinue || isLoading}
                className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <span>{isLoading ? 'Loading...' : 'Next'}</span>
                <ChevronRight size={20} />
              </button>
            ) : (
              <button
                disabled={!canContinue || isLoading}
                type="button"
                onClick={onNext}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {isLoading ? 'Booking...' : 'Complete Booking'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookingWizard
