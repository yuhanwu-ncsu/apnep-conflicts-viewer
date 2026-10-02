import { React, dateUtils } from 'jimu-core'

interface UseTimeRangeValidationOptions {
  errorMessage: string
}

export const useTimeRangeValidation = (options: UseTimeRangeValidationOptions) => {
  const { errorMessage } = options
  const [timeRangeErrorState, setTimeRangeErrorState] = React.useState<string>(null)

  const validateTimeRange = React.useCallback((startTime?: string, endTime?: string) => {
    const startMinutes = startTime ? dateUtils.convertISOTimeToMinutes(startTime) : null
    const endMinutes = endTime ? dateUtils.convertISOTimeToMinutes(endTime) : null

    if (startMinutes === null || endMinutes === null) {
      setTimeRangeErrorState(null)
      return true
    }

    if (startMinutes < endMinutes) {
      setTimeRangeErrorState(null)
      return true
    }

    setTimeRangeErrorState(errorMessage)
    return false
  }, [errorMessage])

  const clearTimeRangeError = React.useCallback(() => {
    setTimeRangeErrorState(null)
  }, [])

  return {
    timeRangeErrorState,
    validateTimeRange,
    clearTimeRangeError
  }
}