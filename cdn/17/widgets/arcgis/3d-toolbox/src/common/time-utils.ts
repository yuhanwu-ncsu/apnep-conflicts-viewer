
export const getUtcOffsetFromMinutes = (defaultTimeZoneVal?: number | string): number | undefined => {
  if (defaultTimeZoneVal === undefined || defaultTimeZoneVal === null || defaultTimeZoneVal === '') {
    return undefined
  }

  const parsedValue = Number(defaultTimeZoneVal)
  return Number.isNaN(parsedValue) ? undefined : parsedValue / 60
}