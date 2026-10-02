interface MutableStatePropsVersionMap {
  [key: string]: unknown
}

type MutableStatePropsVersion = MutableStatePropsVersionMap | null | undefined

export const getChangedMutableStatePropsVersionKeys = (
  prevVersion: MutableStatePropsVersion,
  currentVersion: MutableStatePropsVersion
): string[] => {
  const normalizedPrevVersion = prevVersion || {}
  const normalizedCurrentVersion = currentVersion || {}
  const versionKeys = new Set([
    ...Object.keys(normalizedPrevVersion),
    ...Object.keys(normalizedCurrentVersion)
  ])

  return Array.from(versionKeys).filter(key => normalizedPrevVersion[key] !== normalizedCurrentVersion[key])
}

export const isOnlyPopupMutableStateChanged = (
  prevVersion: MutableStatePropsVersion,
  currentVersion: MutableStatePropsVersion
): boolean => {
  const changedKeys = getChangedMutableStatePropsVersionKeys(prevVersion, currentVersion)
  return changedKeys.length > 0 && changedKeys.every(key => key === 'popup' || key.startsWith('popup.'))
}
