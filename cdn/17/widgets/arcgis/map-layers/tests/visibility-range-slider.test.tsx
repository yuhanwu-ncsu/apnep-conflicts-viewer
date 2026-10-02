import { act, render, waitFor } from '@testing-library/react'
import { React } from 'jimu-core'
import VisibilityRangeSlider, { getScaleRegion } from '../src/runtime/components/visibility-range-slider'

jest.mock('arcgis-map-components', () => ({}), { virtual: true })

jest.mock('jimu-core', () => {
  const jimuCore = (jest as any).requireActual('jimu-core')
  return {
    ...jimuCore,
    getAppStore: () => ({
      getState: () => ({
        appContext: {
          locale: 'en-au'
        }
      })
    })
  }
})

jest.mock('jimu-theme', () => ({
  useTheme: () => ({
    sys: {
      typography: {
        body: {
          fontFamily: 'Avenir Next'
        }
      }
    }
  })
}))

jest.mock('jimu-ui', () => ({
  FloatingPanel: ({ children }) => <div data-testid='floating-panel'>{children}</div>
}))

describe('VisibilityRangeSlider', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('derives a supported scale region from locale', () => {
    expect(getScaleRegion('zh-cn')).toBe('CN')
    expect(getScaleRegion('en-unknown')).toBe('US')
    expect(getScaleRegion()).toBe('US')
  })

  it('updates layer scale values from arcgisPropertyChange events', async () => {
    const view = { id: 'view-1' }
    const layer = {
      id: 'layer-1',
      title: 'Layer 1',
      minScale: 0,
      maxScale: 0
    }
    const widget = {
      jmvFromMap: { view },
      optionBtnRef: { current: document.createElement('button') },
      setState: jest.fn(),
      translate: jest.fn().mockReturnValue('Visibility range')
    }

    render(
      <VisibilityRangeSlider
        widget={widget as any}
        listItem={{ layer } as any}
      />
    )

    const slider = await waitFor(() => {
      const element = document.querySelector('arcgis-scale-range-slider') as any
      expect(element).toBeTruthy()
      return element
    })

    expect(slider.view).toBe(view)
    expect(slider.layer).toBe(layer)
    expect(slider.region).toBe('AU')

    act(() => {
      slider.minScale = 100000
      slider.maxScale = 5000
      slider.dispatchEvent(new CustomEvent('arcgisPropertyChange', {
        detail: {
          name: 'minScale'
        }
      }))
    })

    expect(layer.minScale).toBe(100000)
    expect(layer.maxScale).toBe(5000)
  })
})
