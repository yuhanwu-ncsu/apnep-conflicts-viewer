export { SearchSourceType, searchItemByPortalUrl } from '../../../utils/search-item-util'

export function intersectionObserver (
  ref: HTMLElement,
  rootElement: HTMLElement,
  onChange?: (isIn: boolean) => void,
  options?: IntersectionObserverInit
) {
  const option: any = options || { root: rootElement }
  const callback = function (
    entries: IntersectionObserverEntry[],
    observer: IntersectionObserver
  ) {
    const isIn = entries[0].intersectionRatio > 0
    onChange && onChange(isIn)
  }
  const observer = new IntersectionObserver(callback, option)
  observer.observe(ref)
  return observer
}
