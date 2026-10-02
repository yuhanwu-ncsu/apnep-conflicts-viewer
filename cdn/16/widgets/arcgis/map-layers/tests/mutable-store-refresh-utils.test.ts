import { getChangedMutableStatePropsVersionKeys, isOnlyPopupMutableStateChanged } from '../src/runtime/lib/mutable-store-refresh-utils'

describe('mutable-store-refresh-utils', () => {
  it('returns changed keys across previous and current mutable-state versions', () => {
    const changedKeys = getChangedMutableStatePropsVersionKeys(
      {
        'popup.layer-1': 1,
        other: 1
      },
      {
        'popup.layer-1': 2,
        extra: 1
      }
    )

    expect(changedKeys.sort()).toEqual(['extra', 'other', 'popup.layer-1'])
  })

  it('returns true when only dotted popup keys changed', () => {
    const changed = isOnlyPopupMutableStateChanged(
      {
        'popup.layer-1': 1
      },
      {
        'popup.layer-1': 2,
        'popup.layer-2': 1
      }
    )

    expect(changed).toBe(true)
  })

  it('returns true when the root popup key changed', () => {
    const changed = isOnlyPopupMutableStateChanged(
      {
        popup: 1
      },
      {
        popup: 2
      }
    )

    expect(changed).toBe(true)
  })

  it('returns false when popup and non-popup keys both changed', () => {
    const changed = isOnlyPopupMutableStateChanged(
      {
        popup: 1,
        other: 1
      },
      {
        popup: 2,
        other: 2
      }
    )

    expect(changed).toBe(false)
  })

  it('returns false when only non-popup keys changed', () => {
    const changed = isOnlyPopupMutableStateChanged(
      {
        other: 1
      },
      {
        other: 2
      }
    )

    expect(changed).toBe(false)
  })

  it('returns false when no mutable-state keys changed', () => {
    const changed = isOnlyPopupMutableStateChanged(
      {
        'popup.layer-1': 1
      },
      {
        'popup.layer-1': 1
      }
    )

    expect(changed).toBe(false)
  })
})
