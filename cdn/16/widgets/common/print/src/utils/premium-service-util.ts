export const normalizeComparableUrl = (url?: string): string => {
  if (!url) return ''

  const trimmedUrl = url.trim()
  try {
    return decodeURIComponent(trimmedUrl)
  } catch (err) {
    return trimmedUrl
  }
}

const getDomainFromUrl = (url?: string): string => {
  const normalizedUrl = normalizeComparableUrl(url)
  if (!normalizedUrl) return ''

  try {
    return new URL(normalizedUrl).hostname.toLowerCase()
  } catch (err) {
    try {
      return new URL(`https://${normalizedUrl}`).hostname.toLowerCase()
    } catch (innerErr) {
      return ''
    }
  }
}

export const checkPremiumService = (printServiceUrl?: string): boolean => {
  const domain = getDomainFromUrl(printServiceUrl)
  return !!domain && /print(\w|-)*\.arcgis\.com/i.test(domain) && !window.jimuConfig.isInPortal
}