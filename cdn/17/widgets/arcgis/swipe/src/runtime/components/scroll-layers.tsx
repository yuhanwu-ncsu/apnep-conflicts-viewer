import 'arcgis-map-components'
import type Collection from 'esri/core/Collection'
import type Layer from 'esri/layers/Layer'
import { React, type ImmutableArray } from 'jimu-core'
import type { JimuMapView, JimuLayerView, JimuMapViewGroup } from 'jimu-arcgis'
import { SwipeStyle } from '../../config'
import { isWebMap } from '../../utils/utils'
import * as reactiveUtils from 'esri/core/reactiveUtils'


const { useState, useEffect, useRef } = React

const scrollerStyleVertical = `
  position: absolute;
  overflow-y: scroll;
  z-index: 7;
  top: 0;
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
`
const scrollerStyleHorizontal = `
  position: absolute;
  overflow-x: scroll;
  z-index: 7;
  top: 0;
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
`

const contentStyleVertical = `
  padding: 0;
  margin: 0;
  display: flex;
  flexDirection: column;
  alignItems: stretch;
  alignContent: stretch;
  justifyContent: space-evenly;
`
const contentStyleHorizontal = `
  padding: 0;
  margin: 0;
  height: 100%;
  display: flex;
  flexDirection: row;
  alignItems: stretch;
  alignContent: stretch;
  justifyContent: space-evenly;
`

const dividerStyle = `
  position: absolute;
  border: 1px solid rgba(110,110,110,.5);
`

export interface ScrollLayersProps {
  widgetId: string
  activeMapView: JimuMapView
  inactiveMapView: JimuMapView
  jimuMapViewGroup: JimuMapViewGroup
  firstTrailingLayersId: ImmutableArray<string>
  secondTrailingLayersId: ImmutableArray<string>
  swipeStyle: SwipeStyle
  handleScrollingLayerOfFirstMapView: (layer: JimuLayerView) => void
  handleScrollingLayerOfSecondMapView: (layer: JimuLayerView) => void
  handleScrollFirstMapView: (isFirstMap: boolean) => void
  dividerColor: string
  isDesignMode: boolean
}

export function ScrollLayers (props: ScrollLayersProps) {
  /**
   * The scrolling process is made up of three steps:
   * 1. Scrolling layers of the first mapView (First scroll)
   * 2. Scrolling from mapView1 to mapView2 (Scroll maps)
   * 3. Scrolling layers of the second mapView (Second scroll)
   */
  const {
    jimuMapViewGroup, widgetId, activeMapView, inactiveMapView, firstTrailingLayersId, secondTrailingLayersId, swipeStyle,
    handleScrollingLayerOfFirstMapView, handleScrollingLayerOfSecondMapView, handleScrollFirstMapView, dividerColor, isDesignMode
  } = props
  const mapId = activeMapView.mapWidgetId
  const scrollerFirstRef = useRef<HTMLElement>(null)
  const contentFirstRef = useRef<HTMLElement>(null)
  const [currentLayerIndex, setCurrentLayerIndex] = useState(0)
  const [scrollFirstMap, setScrollFirstMap] = useState(firstTrailingLayersId?.length > 0)
  const scrollFirstMapRef = useRef(scrollFirstMap)
  const [viewHeight, setViewHeight] = useState(activeMapView?.view.height)
  const [viewWidth, setViewWidth] = useState(activeMapView?.view.width)
  const multiMapContainerRef = useRef<HTMLElement>(document.querySelector<HTMLElement>(`div[data-widgetid=${mapId}] .multi-map-container`))
  const getActiveMapDOM = (multiMapContainerRef) => {
    return multiMapContainerRef.current?.querySelector('.multisourcemap-item-appear-noanimate')
  }
  const activeMapDOMRef = useRef<HTMLDivElement>(getActiveMapDOM(multiMapContainerRef))
  const getInactiveMapDOM = (multiMapContainerRef) => {
    return multiMapContainerRef.current?.querySelector('.multisourcemap-item-disappear-noanimate')
  }
  const inactiveMapDOMRef = useRef<HTMLDivElement>(getInactiveMapDOM(multiMapContainerRef))

  const swipesFirstRef = useRef<HTMLArcgisSwipeElement[]>([])
  const view = activeMapView?.view
  const scrollFirstRef = useRef(0)
  /**
   * The "ticking" flag is used to optimize the execution frequency of the requestAnimationFrame function.
   * It ensures that only one calculation is performed per frame, thus improving the performance.
   */
  const ticking = useRef(false)
  const tickingSecond = useRef(false)

  const scrollMapsTopRef = useRef(0)
  const scrollMapsLeftRef = useRef(0)
  const scrollMapsRef = useRef<HTMLElement>(null)
  const firstPhaseLayerCountRef = useRef(firstTrailingLayersId?.length || 0)

  const scrollerSecondRef = useRef<HTMLElement>(null)
  const contentSecondRef = useRef<HTMLElement>(null)
  const [currentLayerIndexMap2, setCurrentLayerIndexMap2] = useState(0)

  const swipesSecondRef = useRef<HTMLArcgisSwipeElement[]>([])
  const scrollSecondRef = useRef(0)
  const sliderId = `jimu-widget-swipe-${widgetId}-handle-container`
  const scrollerId = `jimu-widget-swipe-${widgetId}-scroller`
  const contentId = `jimu-widget-swipe-${widgetId}-content`
  const dividerDomRef = useRef<HTMLElement>(null)
  const firstMapSizeWatchHandleRef = React.useRef<__esri.WatchHandle>(null)
  const secondMapSizeWatchHandleRef = React.useRef<__esri.WatchHandle>(null)


  //The flag is used to mark whether is the first layer of the second scroll mapView.
  const initSecondSwipeFlagRef = useRef(true)

  //This flag is used to mark whether scrollMaps begins.
  const scrollMapsFlagRef = useRef(true)

  const getJimuLayerViewById = async (jimuMapView: JimuMapView, jimuLayerViewId: string) => {
    const jimuLayerView = await jimuMapView.whenJimuLayerViewLoaded(jimuLayerViewId)
    return jimuLayerView
  }

  useEffect(() => {
    multiMapContainerRef.current.style.pointerEvents = isDesignMode ? 'none' : null
  }, [isDesignMode])

  useEffect(() => {
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      multiMapContainerRef.current.style.pointerEvents = null
    }
  }, [])

  useEffect(() => {
    setViewHeight(activeMapView?.view.height)
    setViewWidth(activeMapView?.view.width)
  }, [activeMapView])

  useEffect(() => {
    const restoreListener = () => {
      activeMapDOMRef.current = getActiveMapDOM(multiMapContainerRef)
      inactiveMapDOMRef.current = getInactiveMapDOM(multiMapContainerRef)
      if (!scrollFirstMapRef.current && secondTrailingLayersId !== undefined && secondTrailingLayersId.length !== 0) {
        if (swipeStyle === SwipeStyle.AdvancedVertical) {
          activeMapDOMRef.current.style.clipPath = `inset(0px 0px ${activeMapView.view.height}px 0px)`
        } else {
          activeMapDOMRef.current.style.clipPath = `inset(0px ${activeMapView.view.width}px 0px 0px)`
        }
      }
      if (secondTrailingLayersId?.length > 0) {
        inactiveMapDOMRef.current.style.opacity = '1'
      }
    }

    activeMapView.addRestoreListener(restoreListener)
    return () => {
      activeMapView.removeRestoreListener(restoreListener)
    }
  }, [activeMapView, mapId, secondTrailingLayersId, swipeStyle])

  useEffect(() => {
    let isUnmounted = false

    const hideTools = () => {
      jimuMapViewGroup.hideMapTools()
    }

    const resetHideTools = () => {
      jimuMapViewGroup.showMapTools()
    }

    /**
     * If jimu map view is created, will update swipe widget.
     */
    const hasVisibleTrailingLayer = async (jimuMapView: JimuMapView, trailingLayersId: ImmutableArray<string>) => {
      const mapLayerViewsPromiseArray = trailingLayersId?.asMutable()?.map(jimuLayerViewId => {
        return getJimuLayerViewById(jimuMapView, jimuLayerViewId)
      })

      if (!mapLayerViewsPromiseArray?.length) {
        return false
      }

      const jimuLayerViews = await Promise.all(mapLayerViewsPromiseArray)
      return jimuLayerViews.some(jimuLayerView => jimuLayerView?.layer && (jimuLayerView.layer?.visible !== false))
    }

    const initSwipeWidget = async () => {
      if (!(activeMapView?.view && multiMapContainerRef.current)) {
        return
      }

      const hasFirstMapLayers = firstTrailingLayersId?.length > 0
      const hasSecondMapLayers = secondTrailingLayersId?.length > 0
      const firstMapHasVisibleLayer = hasFirstMapLayers ? await hasVisibleTrailingLayer(activeMapView, firstTrailingLayersId) : false
      const useMapOnlyFirstPhase = hasSecondMapLayers && (!hasFirstMapLayers || !firstMapHasVisibleLayer)

      firstPhaseLayerCountRef.current = useMapOnlyFirstPhase ? 1 : (firstTrailingLayersId?.length || 0)

      if (isUnmounted) {
        return
      }

      initScrollerContent()

      if (hasFirstMapLayers && !useMapOnlyFirstPhase) {
        updateSwipeWidgetFirst()
        inactiveMapView && initSecondSwipe()
        hideTools()
        scrollMapsFlagRef.current = true
      } else if (hasSecondMapLayers) {
        if (inactiveMapDOMRef.current) inactiveMapDOMRef.current.style.opacity = '1'
        if (useMapOnlyFirstPhase) {
          if (activeMapDOMRef.current) activeMapDOMRef.current.style.clipPath = null
          setScrollFirstMap(true)
          scrollFirstMapRef.current = true
          inactiveMapView && initSecondSwipe()
          scrollMaps()
          scrollMapsFlagRef.current = false
        } else {
          if (activeMapDOMRef.current) {
            if (swipeStyle === SwipeStyle.AdvancedVertical) {
              activeMapDOMRef.current.style.clipPath = `inset(0px 0px ${activeMapView.view.height}px 0px)`
            } else {
              activeMapDOMRef.current.style.clipPath = `inset(0px ${activeMapView.view.width}px 0px 0px)`
            }
          }
          setScrollFirstMap(false)
          scrollFirstMapRef.current = false
          inactiveMapView && initSecondSwipe()
          secondScroll()
        }
        hideTools()
      }
    }

    initSwipeWidget()

    function initSecondSwipe () {
      const swipeDirection = swipeStyle === SwipeStyle.AdvancedVertical ? 'vertical' : 'horizontal'
      const inactiveMapLayerViewsPromiseArray = secondTrailingLayersId?.asMutable()?.map(jimuLayerViewId => {
        return getJimuLayerViewById(inactiveMapView, jimuLayerViewId)
      })
      if (inactiveMapLayerViewsPromiseArray) {
        Promise.all(inactiveMapLayerViewsPromiseArray).then(jimuLayerViews => {
          const trailingArray = jimuLayerViews.map(item => item.layer)
          swipesSecondRef.current = trailingArray?.map((layer) => {
            const swipe = document.createElement('arcgis-swipe')
            swipe.classList.add(`exb-swipe-scroll-${widgetId}`)
            swipe.startLayers = [] as unknown as Collection<Layer>
            swipe.endLayers = [layer] as unknown as Collection<Layer>
            swipe.disabled = true
            swipe.direction = swipeDirection
            swipe.position = 100
            swipe.hideHandle = true
            swipe.autoDestroyDisabled = true
            // --calcite-color-border-1 divider border color
            swipe.style.setProperty('--arcgis-internal-swipe-divider-color-background', dividerColor)
            swipe.style.setProperty('--arcgis-swipe-divider-color-background', dividerColor)
            return swipe
          })
          const swipe0 = swipesSecondRef?.current?.[0]
          // @ts-expect-error
          swipe0.view = inactiveMapView?.view
          inactiveMapView?.view?.ui.add(swipe0)
          swipe0?.startLayers?.addMany(swipe0.endLayers)
          swipe0?.endLayers.removeAll()
          initSecondSwipeFlagRef.current = true
        })
      }
    }

    //Scrolling from mapView1 to mapView2 (Scroll maps)
    function scrollMaps () {
      const createDivider = () => {
        if (swipeStyle === SwipeStyle.AdvancedVertical) {
          dividerDomRef.current = document.createElement('div')
          dividerDomRef.current.id = sliderId
          dividerDomRef.current.className = 'jimu-widget-swipe-handle-container'
          dividerDomRef.current.setAttribute('style', dividerStyle)
          dividerDomRef.current.style.transform = `translateY(${viewHeight}px`
          dividerDomRef.current.style.width = `${viewWidth}px`
          dividerDomRef.current.style.height = '2px'
          dividerDomRef.current.style.backgroundColor = dividerColor
          dividerDomRef.current.style.zIndex = activeMapDOMRef.current?.style?.zIndex
        } else {
          dividerDomRef.current = document.createElement('div')
          dividerDomRef.current.id = sliderId
          dividerDomRef.current.className = 'jimu-widget-swipe-handle-container'
          dividerDomRef.current.setAttribute('style', dividerStyle)
          dividerDomRef.current.style.transform = `translateX(${viewWidth})px`
          dividerDomRef.current.style.height = `${viewHeight}px`
          dividerDomRef.current.style.width = '2px'
          dividerDomRef.current.style.backgroundColor = dividerColor
          dividerDomRef.current.style.zIndex = activeMapDOMRef.current?.style?.zIndex
        }
        multiMapContainerRef.current.appendChild(dividerDomRef.current)
      }
      const handleScrollMapsVertical = () => {
        const scrollerMap = multiMapContainerRef.current.querySelector(`#${scrollerId}`)
        const deduction = firstPhaseLayerCountRef.current > 0 ? viewHeight * (firstPhaseLayerCountRef.current - 1) : 0
        scrollMapsTopRef.current = scrollerMap.scrollTop - deduction
        activeMapDOMRef.current.style.clipPath = `inset(0px 0px ${scrollMapsTopRef.current}px 0px)`
        //scrolling up
        if (scrollMapsTopRef.current < viewHeight) {
          setScrollFirstMap(true)
          scrollFirstMapRef.current = true
        }
        //scroll to the end, then scroll the second map layers.
        if (scrollMapsTopRef.current >= viewHeight) {
          secondScroll() //Scroll layers of the second mapView
          setScrollFirstMap(false)
          scrollFirstMapRef.current = false
        }
      }

      const handleScrollMapsHorizontal = (event?: Event) => {
        event?.preventDefault()
        const scrollerMap = multiMapContainerRef.current.querySelector(`#${scrollerId}`)
        const deduction = firstPhaseLayerCountRef.current > 0 ? viewWidth * (firstPhaseLayerCountRef.current - 1) : 0
        scrollMapsLeftRef.current = scrollerMap.scrollLeft - deduction

        activeMapDOMRef.current.style.clipPath = `inset(0px ${scrollMapsLeftRef.current}px 0px 0px)`

        //scrolling up
        if (scrollMapsLeftRef.current < viewWidth) {
          setScrollFirstMap(true)
          scrollFirstMapRef.current = true
        }
        //scroll to the end
        if (scrollMapsLeftRef.current >= viewWidth) {
          secondScroll()
          setScrollFirstMap(false)
          scrollFirstMapRef.current = false
        }
      }

      const initScrollerMapContent = () => {
        const scrollerMap = multiMapContainerRef.current.querySelector<HTMLElement>(`#${scrollerId}`)
        scrollMapsRef.current = scrollerMap
        if (swipeStyle === SwipeStyle.AdvancedVertical) {
          scrollerMap.addEventListener('scroll', handleScrollMapsVertical)
          handleScrollMapsVertical()
        } else {
          scrollerMap.addEventListener('scroll', handleScrollMapsHorizontal)
          scrollerFirstRef.current.addEventListener('wheel', handleMouseWheelFirst)
          handleScrollMapsHorizontal()
        }
      }

      initScrollerMapContent()
      inactiveMapDOMRef.current.style.opacity = '1'
      createDivider()
    }
    //Scrolling layers of the second mapView.
    function secondScroll () {
      const initScrollerContentSecond = () => {
        const scrollerSecond = multiMapContainerRef.current.querySelector<HTMLElement>(`#${scrollerId}`)
        const contentSecond = multiMapContainerRef.current.querySelector<HTMLElement>(`#${contentId}`)
        scrollerSecondRef.current = scrollerSecond
        contentSecondRef.current = contentSecond
      }

      const updateSwipeWidgetSecond = () => {
        const swipeDirection = swipeStyle === SwipeStyle.AdvancedVertical ? 'vertical' : 'horizontal'
        const inactiveMapLayerViewsPromiseArray = secondTrailingLayersId?.asMutable()?.map(jimuLayerViewId => {
          return getJimuLayerViewById(inactiveMapView, jimuLayerViewId)
        })
        if (inactiveMapLayerViewsPromiseArray) {
          Promise.all(inactiveMapLayerViewsPromiseArray).then(jimuLayerViews => {
            if (swipeDirection === 'vertical') {
              secondMapSizeWatchHandleRef.current = reactiveUtils.watch(() => inactiveMapView?.view?.height, () => { updateSizeSecond() })
            } else {
              secondMapSizeWatchHandleRef.current = reactiveUtils.watch(() => inactiveMapView?.view?.width, () => { updateSizeSecond() })
            }
            updateSizeSecond()
            scrollerSecondRef.current.addEventListener('scroll', handleScrollSecond)
            if (swipeDirection === 'horizontal') {
              scrollerSecondRef.current.addEventListener('wheel', handleMouseWheelSecond)
            }
          })
        }
      }

      function handleScrollSecond () {
        if (swipeStyle === SwipeStyle.AdvancedVertical) {
          setScrollSecond(scrollerSecondRef.current.scrollTop - viewHeight * firstPhaseLayerCountRef.current)
        } else {
          setScrollSecond(scrollerSecondRef.current.scrollLeft - viewWidth * firstPhaseLayerCountRef.current)
        }
      }

      function setScrollSecond (value: number) {
        scrollSecondRef.current = value
        if (!tickingSecond.current) {
          requestAnimationFrame(() => {
            tickingSecond.current = false

            const pageRatio = (swipeStyle === SwipeStyle.AdvancedVertical) ? (scrollSecondRef.current / view.height) : (scrollSecondRef.current / view.width)
            const maxIndex = swipesSecondRef?.current?.length - 1
            swipesSecondRef?.current?.forEach((swipe, index, swipes) => {
              // @ts-expect-error
              swipe.view = inactiveMapView?.view
              inactiveMapView?.view?.ui.add(swipe)

              let position = (index - pageRatio) * 100

              /**
               * To achieve this infinite scroll effect we need to swap the layers:
               * The layer starts at the bottom, the divider goes up,
               * Then the next layer starts to show up, so we put back the divider at the bottom and swap the layers.
               */

              if (index === 0 && swipe.startLayers.length && initSecondSwipeFlagRef.current) {
                swipe.endLayers.addMany(swipe.startLayers)
                swipe.startLayers.removeAll()
                initSecondSwipeFlagRef.current = false
              }
              if (position < 0 && swipe.endLayers.length) {
                swipe.startLayers.addMany(swipe.endLayers)
                swipe.endLayers.removeAll()
                setCurrentLayerIndexMap2(index)
              } else if (position >= 0 && swipe.startLayers.length) {
                swipe.endLayers.addMany(swipe.startLayers)
                swipe.startLayers.removeAll()
                setCurrentLayerIndexMap2(index)
              }
              if (position >= 0 && position < 0.1) {
                if (index === maxIndex) {
                  setCurrentLayerIndexMap2(index)
                }
              }

              if (position < 0) {
                position += 100
              }

              swipe.position = clamp(position, 0, 100)
            })
          })

          tickingSecond.current = true
        }
      }

      function updateSizeSecond () {
        if (swipeStyle === SwipeStyle.AdvancedVertical) {
          setScrollSecond(scrollerSecondRef.current.scrollTop - viewHeight * firstPhaseLayerCountRef.current)
        } else {
          setScrollSecond(scrollerSecondRef.current.scrollLeft - viewWidth * firstPhaseLayerCountRef.current)
        }
      }

      initScrollerContentSecond()
      updateSwipeWidgetSecond()
    }

    //Init the scroller and content DOM.
    function initScrollerContent () {
      const scroller = document.createElement('div')
      scroller.id = scrollerId
      const content = document.createElement('div')
      content.className = 'content'
      if (swipeStyle === SwipeStyle.AdvancedVertical) {
        scroller.setAttribute('style', scrollerStyleVertical)
        content.setAttribute('style', contentStyleVertical)
        content.style.height = viewHeight * (firstPhaseLayerCountRef.current + (secondTrailingLayersId?.length || 0)) + 'px'
      } else {
        scroller.setAttribute('style', scrollerStyleHorizontal)
        content.setAttribute('style', contentStyleHorizontal)
        content.style.width = viewWidth * (firstPhaseLayerCountRef.current + (secondTrailingLayersId?.length || 0)) + 'px'
      }
      multiMapContainerRef.current.appendChild(scroller)
      scroller.appendChild(content)
      scrollerFirstRef.current = scroller
      contentFirstRef.current = content
    }

    function updateSwipeWidgetFirst () {
      const swipeDirection = swipeStyle === SwipeStyle.AdvancedVertical ? 'vertical' : 'horizontal'
      const activeMapLayerViewsPromiseArray = firstTrailingLayersId?.asMutable()?.map(jimuLayerViewId => {
        return getJimuLayerViewById(activeMapView, jimuLayerViewId)
      })
      if (activeMapLayerViewsPromiseArray) {
        Promise.all(activeMapLayerViewsPromiseArray).then(jimuLayerViews => {
          const trailingArray = jimuLayerViews.map(item => item.layer)
          swipesFirstRef.current = trailingArray?.map((layer) => {
            const swipe = document.createElement('arcgis-swipe')
            swipe.classList.add(`exb-swipe-scroll-${widgetId}`)
            swipe.startLayers = [] as unknown as Collection<Layer>
            swipe.endLayers = [layer] as unknown as Collection<Layer>
            swipe.disabled = true
            swipe.direction = swipeDirection
            swipe.position = 100
            swipe.hideHandle = true
            swipe.autoDestroyDisabled = true
            // --calcite-color-border-1 divider border color
            swipe.style.setProperty('--arcgis-internal-swipe-divider-color-background', dividerColor)
            swipe.style.setProperty('--arcgis-swipe-divider-color-background', dividerColor)
            return swipe
          })
          if (swipeDirection === 'vertical') {
            firstMapSizeWatchHandleRef.current = reactiveUtils.watch(() => activeMapView?.view?.height, () => { updateSizeFirst() })
          } else {
            firstMapSizeWatchHandleRef.current = reactiveUtils.watch(() => activeMapView?.view?.width, () => { updateSizeFirst() })
          }
          updateSizeFirst()
          scrollerFirstRef.current.addEventListener('scroll', handleScrollFirst)
          if (swipeDirection === 'horizontal') {
            scrollerFirstRef.current.addEventListener('wheel', handleMouseWheelFirst)
          }
        })
      }
    }

    function handleScrollFirst () {
      if (swipeStyle === SwipeStyle.AdvancedVertical) {
        setScrollFirst(scrollerFirstRef.current.scrollTop)
      } else {
        setScrollFirst(scrollerFirstRef.current.scrollLeft)
      }
    }

    function setScrollFirst (value: number) {
      scrollFirstRef.current = value
      if (!ticking.current) {
        requestAnimationFrame(() => {
          ticking.current = false

          const pageRatio = (swipeStyle === SwipeStyle.AdvancedVertical) ? (scrollFirstRef.current / view.height) : (scrollFirstRef.current / view.width)
          const maxIndex = swipesFirstRef.current?.length - 1
          swipesFirstRef.current.forEach((swipe, index, swipes) => {
            // @ts-expect-error
            swipe.view = view
            // Add each swipe to the view UI
            view.ui.add(swipe)

            let position = (index - pageRatio) * 100

            /**
             * To achieve this infinite scroll effect we need to swap the layers:
             * The layer starts at the bottom, the divider goes up,
             * Then the next layer starts to show up, so we put back the divider at the bottom and swap the layers.
             */
            if (position < 0 && swipe.endLayers.length) {
              swipe.startLayers.addMany(swipe.endLayers)
              swipe.endLayers.removeAll()
              setCurrentLayerIndex(index)
            } else if (position >= 0 && swipe.startLayers.length) {
              swipe.endLayers.addMany(swipe.startLayers)
              swipe.startLayers.removeAll()
              setCurrentLayerIndex(index)
            }
            if (position === 0 || position < -100) {
              /**
               * Scrolling from mapView1 to mapView2 (Scroll maps).
               * Scroll to the last layer of the first map, then scroll to the first layer of the second map.
              */
              if (inactiveMapView && isWebMap(inactiveMapView.dataSourceId) && secondTrailingLayersId?.length > 0 && scrollMapsFlagRef.current) {
                scrollMaps()
                scrollMapsFlagRef.current = false
              }
              if (index === maxIndex) {
                setCurrentLayerIndex(index)
              }
            }

            if (position < 0) {
              position += 100
            }

            swipe.position = clamp(position, 0, 100)
          })
        })

        ticking.current = true
      }
    }

    function updateSizeFirst () {
      if (swipeStyle === SwipeStyle.AdvancedVertical) {
        setScrollFirst(scrollerFirstRef.current.scrollTop)
      } else {
        setScrollFirst(scrollerFirstRef.current.scrollLeft)
      }
    }

    function destroyFirstScroll () {
      const scroller = multiMapContainerRef.current.querySelector(`#${scrollerId}`)
      scroller && multiMapContainerRef.current.removeChild(scroller)
      swipesFirstRef?.current?.forEach((swipe, index, swipes) => {
        swipe.destroy()
        view.ui?.remove(swipe)
      })
      resetHideTools()
    }

    function destroySecondScroll () {
      swipesSecondRef?.current?.forEach((swipe, index, swipes) => {
        swipe.destroy()
        inactiveMapView?.view?.ui?.remove(swipe)
      })
      setScrollFirstMap(true)
    }

    function destroyScrollMaps () {
      // Clear the opacity of the invisible map and clipPath of the visible map.
      const clearMapViewStyle = () => {
        //Clear style if the action is switching Swipe off.
        inactiveMapDOMRef.current && (inactiveMapDOMRef.current.style.opacity = null)
        activeMapDOMRef.current && (activeMapDOMRef.current.style.clipPath = null)
      }
      const scrollerMap = multiMapContainerRef.current.querySelector('.scrollerMap')
      scrollerMap && multiMapContainerRef.current.removeChild(scrollerMap)
      clearMapViewStyle()
      if (dividerDomRef.current && multiMapContainerRef.current.querySelector(`#${sliderId}`) && multiMapContainerRef.current.contains(dividerDomRef.current)) {
        multiMapContainerRef.current.removeChild(dividerDomRef.current)
      }

      //clear the watch handlers
      firstMapSizeWatchHandleRef.current?.remove()
      firstMapSizeWatchHandleRef.current = null
      secondMapSizeWatchHandleRef.current?.remove()
      secondMapSizeWatchHandleRef.current = null
    }

    return () => {
      isUnmounted = true
      destroyFirstScroll()
      destroySecondScroll()
      destroyScrollMaps()
      // activeMapView.removeRestoreListener(restoreListener)
    }
  }, [
    widgetId, view, activeMapView, firstTrailingLayersId, secondTrailingLayersId, swipeStyle, dividerColor,
    sliderId, viewHeight, viewWidth, scrollerId, contentId, inactiveMapView, jimuMapViewGroup
  ])

  useEffect(() => {
    const activeMapLayerViewsPromiseArray = firstTrailingLayersId?.asMutable()?.map(jimuLayerViewId => {
      return getJimuLayerViewById(activeMapView, jimuLayerViewId)
    })
    if (activeMapLayerViewsPromiseArray) {
      Promise.all(activeMapLayerViewsPromiseArray).then(jimuLayerViews => {
        handleScrollingLayerOfFirstMapView(jimuLayerViews[currentLayerIndex])
      })
    }
  }, [activeMapView, firstTrailingLayersId, currentLayerIndex, handleScrollingLayerOfFirstMapView])

  useEffect(() => {
    const inactiveMapLayerViewsPromiseArray = secondTrailingLayersId?.asMutable()?.map(jimuLayerViewId => {
      return getJimuLayerViewById(inactiveMapView, jimuLayerViewId)
    })
    if (inactiveMapLayerViewsPromiseArray) {
      Promise.all(inactiveMapLayerViewsPromiseArray).then(jimuLayerViews => {
        handleScrollingLayerOfSecondMapView(jimuLayerViews[currentLayerIndexMap2])
      })
    }
  }, [secondTrailingLayersId, currentLayerIndexMap2, inactiveMapView, handleScrollingLayerOfSecondMapView])

  useEffect(() => {
    handleScrollFirstMapView(scrollFirstMap)
  }, [handleScrollFirstMapView, scrollFirstMap])

  const clamp = (value, min, max) => {
    return Math.min(max, Math.max(min, value))
  }

  const handleMouseWheelFirst = (event) => {
    event.preventDefault()
    const eventDelta = -event.wheelDelta || -event.deltaY * 30
    scrollerFirstRef.current.scrollLeft = scrollerFirstRef.current.scrollLeft + eventDelta / 2
  }

  const handleMouseWheelSecond = (event) => {
    event.preventDefault()
    const eventDelta = -event.wheelDelta || -event.deltaY * 30
    scrollerSecondRef.current.scrollLeft = scrollerSecondRef.current.scrollLeft + eventDelta / 2
  }

  return null
}
