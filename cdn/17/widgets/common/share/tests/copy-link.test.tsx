import { React, Immutable } from 'jimu-core'
import { createIntl } from 'react-intl'
import { defaultMessages } from 'jimu-ui'
import { fireEvent, waitFor } from '@testing-library/react'
import { withStoreThemeIntlRender, mockTheme } from 'jimu-for-test'
import { ShownMode } from '../src/runtime/components/items/base-item'
import { ShareLink } from '../src/runtime/components/items/sharelink'
import type { UiMode } from '../src/config'

describe('<ShareLink />', () => {
  const TAR_URL = 'test-url'

  let config
  let render = null; let intl = null
  beforeAll(() => {
    intl = createIntl({
      locale: 'en',
      defaultLocale: 'en',
      messages: defaultMessages
    })

    render = withStoreThemeIntlRender(false, mockTheme as any)
  })
  afterAll(() => {
    render = null
  })
  beforeEach(() => {
    config = Immutable({
      uiMode: 'POPUP',
      popup: {
        icon: '',
        items: ['embed', 'qrcode', 'email', 'facebook', 'twitter', 'pinterest', 'linkedin'],
        tooltip: ''
      },
      inline: {
        items: ['facebook', 'twitter', 'pinterest', 'linkedin', 'embed', 'qrcode', 'email', 'sharelink'],
        design: {
          direction: 'HORIZONTAL',
          hideLabel: false,
          btnRad: 0,
          btnColor: '',
          iconColor: '',
          size: 'default'
        }
      }
    })
  })

  it('click copy btn', async () => {
    const _onCopyFn = jest.fn().mockImplementation((text, result) => {
      expect(text).toBe(TAR_URL)
    })

    const props = {
      uiMode: config.uiMode as UiMode,
      sharedUrl: TAR_URL,
      isShowInModal: false,
      shownMode: ShownMode.Content,
      isShowing: true,

      getAppTitle: jest.fn(), // (() => string);
      onItemClick: jest.fn(), // ((name: string, ref: React.RefObject<any>, type: ExpandType, isUpdateUrl?: boolean) => void);
      onBackBtnClick: jest.fn(), // (() => void);

      theme: mockTheme as any,
      intl: intl,
      config: config,

      shortUrl: TAR_URL,
      onShortUrlChange: jest.fn(), // ((shortUrl: string) => void);
      updateUrls: jest.fn(), // (() => string) | (() => void);
      handleError: jest.fn(),

      errorInfo: null,
      isFetchingShortLink: false,
      enableShortLink: true,

      onCopy: _onCopyFn
    }

    const widgetRef = { current: null }

    const { queryByTestId } = render(<ShareLink {...props} ref={widgetRef} />)
    // widgetRef.current.onCopy = _onCopyFn;
    // let _onCopyFnSpy = jest.spyOn(widgetRef.current, 'onCopy');
    const btn = queryByTestId('copy-btn')
    fireEvent.click(btn)

    await waitFor(() => {
      expect(_onCopyFn).toHaveBeenCalledTimes(1)
    }, { timeout: 200 })
  })

  it('renders short link checkbox when enableShortLink is true', () => {
    const props = {
      uiMode: config.uiMode as UiMode,
      sharedUrl: TAR_URL,
      isShowInModal: false,
      shownMode: ShownMode.Content,
      isShowing: true,
      getAppTitle: jest.fn(),
      onItemClick: jest.fn(),
      onBackBtnClick: jest.fn(),
      theme: mockTheme as any,
      intl: intl,
      config: config,
      shortUrl: TAR_URL,
      onShortUrlChange: jest.fn(),
      updateUrls: jest.fn(),
      handleError: jest.fn(),
      errorInfo: null,
      isFetchingShortLink: false,
      enableShortLink: true
    }

    render(<ShareLink {...props} />)
    const checkboxes = document.querySelectorAll('input[type="checkbox"]')
    // short link checkbox should be present (first of the two checkboxes)
    expect(checkboxes.length).toBeGreaterThanOrEqual(1)
  })

  it('hides short link checkbox when enableShortLink is false', () => {
    const props = {
      uiMode: config.uiMode as UiMode,
      sharedUrl: TAR_URL,
      isShowInModal: false,
      shownMode: ShownMode.Content,
      isShowing: true,
      getAppTitle: jest.fn(),
      onItemClick: jest.fn(),
      onBackBtnClick: jest.fn(),
      theme: mockTheme as any,
      intl: intl,
      config: config,
      shortUrl: TAR_URL,
      onShortUrlChange: jest.fn(),
      updateUrls: jest.fn(),
      handleError: jest.fn(),
      errorInfo: null,
      isFetchingShortLink: false,
      enableShortLink: false
    }

    render(<ShareLink {...props} />)
    // There should only be the "Include URL parameters" checkbox, not the "Short link" one
    const checkboxes = document.querySelectorAll('input[type="checkbox"]')
    expect(checkboxes.length).toBe(1)
    checkboxes.forEach(cb => {
      expect((cb as HTMLInputElement).checked).toBe(true) // only the "include URL params" checkbox remains, checked by default
    })
  })

  it('does not render an empty short link spacer when enableShortLink is false', () => {
    const props = {
      uiMode: config.uiMode as UiMode,
      sharedUrl: TAR_URL,
      isShowInModal: false,
      shownMode: ShownMode.Content,
      isShowing: true,
      getAppTitle: jest.fn(),
      onItemClick: jest.fn(),
      onBackBtnClick: jest.fn(),
      theme: mockTheme as any,
      intl: intl,
      config: config,
      shortUrl: TAR_URL,
      onShortUrlChange: jest.fn(),
      updateUrls: jest.fn(),
      handleError: jest.fn(),
      errorInfo: null,
      isFetchingShortLink: false,
      enableShortLink: false
    }

    const { container } = render(<ShareLink {...props} />)

    expect(container.querySelectorAll('.short-link-wrapper')).toHaveLength(1)
  })

  it('does not request short URL when include URL parameters changes and short link is disabled', () => {
    const updateUrls = jest.fn()
    const props = {
      uiMode: config.uiMode as UiMode,
      sharedUrl: TAR_URL,
      isShowInModal: false,
      shownMode: ShownMode.Content,
      isShowing: true,
      getAppTitle: jest.fn(),
      onItemClick: jest.fn(),
      onBackBtnClick: jest.fn(),
      theme: mockTheme as any,
      intl: intl,
      config: config,
      shortUrl: TAR_URL,
      onShortUrlChange: jest.fn(),
      updateUrls,
      handleError: jest.fn(),
      errorInfo: null,
      isFetchingShortLink: false,
      enableShortLink: false,
      isShortLinkEnabled: true
    }

    const { container } = render(<ShareLink {...props} />)
    const includeUrlParamsCheckbox = container.querySelector('input[type="checkbox"]')

    expect(includeUrlParamsCheckbox).not.toBeNull()
    fireEvent.click(includeUrlParamsCheckbox as Element)

    expect(updateUrls).toHaveBeenCalledWith(expect.objectContaining({
      enableShortUrl: false
    }))
  })
})
