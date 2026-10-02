const DATUM_GROUP_SEPARATOR = /[,，]/
const DATUM_STEP_SEPARATOR = /[+＋]/

const isNumericToken = (value: string): boolean => /^\d+$/.test(value)

export type DatumTransformationGroups = number[][]

export const parseDatumTransformationWkids = (value: string | number): DatumTransformationGroups | null => {
  if (value === undefined || value === null) {
    return []
  }

  const rawValue = String(value).trim()
  if (!rawValue) {
    return []
  }

  const groups = rawValue.split(DATUM_GROUP_SEPARATOR).map(item => item.trim())
  if (groups.some(group => !group)) {
    return null
  }

  const parsedGroups: DatumTransformationGroups = []

  for (const group of groups) {
    const wkidTokens = group.split(DATUM_STEP_SEPARATOR).map(item => item.trim())
    if (wkidTokens.some(token => !token || !isNumericToken(token))) {
      return null
    }

    const wkids = wkidTokens.map(token => Number(token))
    if (wkids.some(wkid => !Number.isInteger(wkid) || wkid <= 0)) {
      return null
    }

    parsedGroups.push(wkids)
  }

  return parsedGroups
}

export const validateDatumTransformationWkids = async (
  value: string | number,
  validateWkid: (wkid: number) => Promise<boolean>
): Promise<boolean> => {
  const groups = parseDatumTransformationWkids(value)
  if (groups === null) {
    return false
  }

  for (const wkids of groups) {
    for (const wkid of wkids) {
      const isValid = await validateWkid(wkid)
      if (!isValid) {
        return false
      }
    }
  }

  return true
}

export const checkIsValidDatumTransformationWkids = (
  value: string | number,
  validateWkid: (wkid: number) => boolean
): boolean => {
  const groups = parseDatumTransformationWkids(value)
  if (groups === null) {
    return false
  }

  return groups.every(wkids => wkids.every(wkid => validateWkid(wkid)))
}

export const getDatumTransformationWkidLabel = async (
  value: string | number,
  getWkidLabel: (wkid: number) => Promise<string>
): Promise<string> => {
  const groups = parseDatumTransformationWkids(value)
  if (!groups || groups.length === 0) {
    return ''
  }

  const labelGroups: string[] = []

  for (const wkids of groups) {
    const labels = await Promise.all(wkids.map(getWkidLabel))
    labelGroups.push(labels.join('+'))
  }

  return labelGroups.join('，')
}

export const formatDatumTransformationLabelForDisplay = (label: string): string => {
  if (!label) {
    return ''
  }

  // Use normal spaces around "+" so long labels can wrap naturally when needed.
  const withCompositeSpacing = label.replace(/[+＋]/g, ' + ')

  // Show each comma-separated transformation on its own line.
  return withCompositeSpacing.replace(/\s*[,，]\s*/g, ',\n')
}
