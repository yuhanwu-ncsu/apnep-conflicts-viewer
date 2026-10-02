export interface ActionElementsResult {
  actionElement: HTMLElement | null
  optionButtonElement: HTMLElement | null
}

export const getOptionButtonFromAction = (actionElement: HTMLElement): HTMLElement | null => {
  if (!actionElement) {
    return null
  }

  const actionShadowRoot = (actionElement as any).shadowRoot as ShadowRoot
  if (!actionShadowRoot) {
    return null
  }

  return actionShadowRoot.querySelector('button[aria-label="Options"], button[part="button"], button')
}

export const getActionElementsFromEvent = (event: MouseEvent): ActionElementsResult => {
  let actionElement: HTMLElement = null
  let optionButtonElement: HTMLElement = null

  if (typeof event?.composedPath === 'function') {
    const path = event.composedPath()
    for (const node of path) {
      if (!(node instanceof HTMLElement)) {
        continue
      }
      if (!optionButtonElement && node.tagName === 'BUTTON') {
        optionButtonElement = node
      }
      if (!actionElement && node.tagName === 'CALCITE-ACTION') {
        actionElement = node
      }
    }

    if (actionElement) {
      return { actionElement, optionButtonElement }
    }
  }

  const target = event?.target as HTMLElement
  if (!target) {
    return { actionElement: null, optionButtonElement: null }
  }
  actionElement = target.tagName === 'CALCITE-ACTION' ? target : target.closest('calcite-action')
  optionButtonElement = target.tagName === 'BUTTON' ? target : target.closest('button')
  return { actionElement, optionButtonElement }
}

export const isOptionActionEventFromClickOutside = (
  event: any,
  reason: string | undefined,
  isOptionActionElement: (actionElement: HTMLElement) => boolean,
  ownerContainers: Array<HTMLElement | null>
): boolean => {
  if (reason !== 'clickOutside') {
    return false
  }

  const nativeEvent = event?.nativeEvent || event
  const eventTarget = nativeEvent?.target as HTMLElement
  const eventPath = typeof nativeEvent?.composedPath === 'function' ? nativeEvent.composedPath() : []
  const pathNodes = eventPath.length ? eventPath : [eventTarget]

  let actionElement: HTMLElement = null
  for (const node of pathNodes) {
    if (!(node instanceof HTMLElement)) {
      continue
    }

    if (node.tagName === 'CALCITE-ACTION' && isOptionActionElement(node)) {
      actionElement = node
      break
    }
  }

  if (!actionElement) {
    return false
  }

  return ownerContainers.some((container) => {
    return !!container && (pathNodes.includes(container) || container.contains(actionElement))
  })
}

export class OptionAnchorManager {
  private sourceRef: HTMLElement | null
  private proxyRef: HTMLElement | null
  private ownerDocumentRef: Document | null
  private ownerWindowRef: Window | null
  private resizeObserverRef: ResizeObserver | null

  constructor () {
    this.sourceRef = null
    this.proxyRef = null
    this.ownerDocumentRef = null
    this.ownerWindowRef = null
    this.resizeObserverRef = null
  }

  get sourceAnchor (): HTMLElement | null {
    return this.sourceRef
  }

  cleanup (): void {
    this.resizeObserverRef?.disconnect()
    this.resizeObserverRef = null
    this.ownerWindowRef?.removeEventListener('resize', this.syncProxyRect)
    this.ownerDocumentRef?.removeEventListener('scroll', this.syncProxyRect, true)
    this.proxyRef?.remove()

    this.proxyRef = null
    this.sourceRef = null
    this.ownerDocumentRef = null
    this.ownerWindowRef = null
  }

  ensure (sourceAnchor: HTMLElement): HTMLElement | null {
    if (!sourceAnchor) {
      this.cleanup()
      return null
    }

    const sourceRoot = sourceAnchor.getRootNode?.()
    const isSourceInShadowRoot = !!sourceRoot && typeof ShadowRoot !== 'undefined' && sourceRoot instanceof ShadowRoot
    if (!isSourceInShadowRoot) {
      this.cleanup()
      this.sourceRef = sourceAnchor
      return sourceAnchor
    }

    const sourceDocument = sourceAnchor.ownerDocument || document
    const sourceWindow = sourceDocument.defaultView || window
    const canReuseProxy = !!this.proxyRef && this.ownerDocumentRef === sourceDocument
    if (!canReuseProxy) {
      this.cleanup()
      this.proxyRef = sourceDocument.createElement('div')
      this.proxyRef.className = 'map-layers-option-action-anchor'
      this.proxyRef.style.position = 'fixed'
      this.proxyRef.style.pointerEvents = 'none'
      this.proxyRef.style.opacity = '0'
      this.proxyRef.style.zIndex = '-1'
      sourceDocument.body.appendChild(this.proxyRef)
    } else {
      this.resizeObserverRef?.disconnect()
      this.ownerWindowRef?.removeEventListener('resize', this.syncProxyRect)
      this.ownerDocumentRef?.removeEventListener('scroll', this.syncProxyRect, true)
    }

    this.sourceRef = sourceAnchor
    this.ownerDocumentRef = sourceDocument
    this.ownerWindowRef = sourceWindow
    this.syncProxyRect()

    sourceWindow.addEventListener('resize', this.syncProxyRect)
    sourceDocument.addEventListener('scroll', this.syncProxyRect, true)
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserverRef = new ResizeObserver(() => {
        this.syncProxyRect()
      })
      this.resizeObserverRef.observe(sourceAnchor)
    }

    return this.proxyRef
  }

  isClickInsideCurrentOptionAnchor (event?: any): boolean {
    if (!event || !this.sourceRef) {
      return false
    }

    const nativeEvent = event?.nativeEvent || event
    const clientX = nativeEvent?.clientX
    const clientY = nativeEvent?.clientY
    if (typeof clientX !== 'number' || typeof clientY !== 'number') {
      return false
    }

    const rect = this.sourceRef.getBoundingClientRect()
    return clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom
  }

  private readonly syncProxyRect = (): void => {
    if (!this.sourceRef || !this.proxyRef) {
      return
    }

    const rect = this.sourceRef.getBoundingClientRect()
    this.proxyRef.style.left = `${rect.left}px`
    this.proxyRef.style.top = `${rect.top}px`
    this.proxyRef.style.width = `${rect.width}px`
    this.proxyRef.style.height = `${rect.height}px`
  }
}
