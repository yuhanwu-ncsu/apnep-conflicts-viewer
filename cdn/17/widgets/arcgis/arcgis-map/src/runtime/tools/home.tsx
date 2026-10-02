/** @jsx jsx */
import { React, jsx } from 'jimu-core'
import { BaseTool, type BaseToolProps, type IconType } from '../layout/base/base-tool'
import { loadArcGISJSAPIModules, type JimuMapView } from 'jimu-arcgis'
import { defaultMessages } from 'jimu-ui'
import type { InitialMapState } from 'jimu-ui/advanced/map'
import { MultiSourceMapContext } from '../components/multisourcemap-context'
import { overrideCalciteStyle } from './utils'
import type Viewpoint from '@arcgis/core/Viewpoint.js'
import type { ArcGISView, GoToParameters } from '@arcgis/map-components/dist/components/types.d.ts'

export default class Home extends BaseTool<BaseToolProps, unknown> {
  toolName = 'Home'

  getTitle () {
    return this.props.intl.formatMessage({ id: 'HomeLabel', defaultMessage: defaultMessages.HomeLabel })
  }

  getIcon (): IconType {
    return null
  }

  getHomeContent = (initialMapState: InitialMapState) => {
    return <HomeInner jimuMapView={this.props.jimuMapView} initialMapState={initialMapState} mapComponentsLoaded={this.props.mapComponentsLoaded} />
  }

  getExpandPanel (): React.JSX.Element {
    return (
      <MultiSourceMapContext.Consumer>
        {({ initialMapState }) => (
          this.getHomeContent(initialMapState)
        )}
      </MultiSourceMapContext.Consumer>
    )
  }
}

interface HomeInnerProps {
  jimuMapView: JimuMapView
  initialMapState: InitialMapState
  mapComponentsLoaded: boolean
}

interface HomeInnerState {
  apiLoaded: boolean
}

class HomeInner extends React.PureComponent<HomeInnerProps, HomeInnerState> {
  Extent: typeof __esri.Extent
  Viewpoint: typeof __esri.Viewpoint
  homeElement: HTMLArcgisHomeElement
  container: HTMLElement
  overrideStyleHandle: __esri.Handle

  constructor (props) {
    super(props)

    this.state = {
      apiLoaded: false
    }
  }

  componentDidMount () {
    if (!this.state.apiLoaded) {
      loadArcGISJSAPIModules(['esri/geometry/Extent', 'esri/Viewpoint']).then(modules => {
        [this.Extent, this.Viewpoint] = modules
        this.setState({
          apiLoaded: true
        })
      })
    }
  }

  componentDidUpdate (prevProps: HomeInnerProps) {
    const apiLoaded = this.props.mapComponentsLoaded && this.state.apiLoaded

    // ref is set to null when switch active view, then set to original dom, we need to avoid this special case
    if (!apiLoaded || !this.container) {
      return
    }

    const jimuMapView = this.props.jimuMapView
    const currMapComponent = jimuMapView?.mapComponent || null
    const currView = jimuMapView?.view || null
    // check initialMapState change or not
    // sometimes prevProps.initialMapState is undefined and props.initialMapState is null, so we need to convert undefined to null
    const preInitialMapState = prevProps?.initialMapState || null
    const currInitialMapState = this.props.initialMapState || null
    const isInitialMapStateChanged = preInitialMapState !== currInitialMapState

    // destroy current homeElement when map component, container or initialMapState changed
    if (this.homeElement) {
      if(this.homeElement.referenceElement !== currMapComponent || this.homeElement.parentNode !== this.container || isInitialMapStateChanged) {
        this.destroyHomeElement()
      }
    }

    // create new home btn if this.homeElement is empty and currMapComponent is not empty
    if (!this.homeElement && this.props.mapComponentsLoaded && apiLoaded && this.container && currMapComponent && currView) {
      let initViewpoint = this.props.initialMapState
        ? this.generateViewPointFromInitialMapState(this.props.initialMapState)
        : (currView.map as __esri.WebMap | __esri.WebScene)?.initialViewProperties?.viewpoint

      if (initViewpoint) {
        initViewpoint = initViewpoint.clone()
      }

      this.homeElement = document.createElement('arcgis-home')
      this.homeElement.referenceElement = currMapComponent
      this.homeElement.viewpoint = initViewpoint as unknown as Viewpoint
      this.homeElement.goToOverride = this.homeBtnGoToOverride
      this.overrideStyleHandle = overrideCalciteStyle(this.homeElement)
      this.container.appendChild(this.homeElement)

      jimuMapView.deleteJimuMapTool('Home')
      jimuMapView.addJimuMapTool({
        name: 'Home',
        element: this.homeElement
      })
    }
  }

  generateViewPointFromInitialMapState = (initialMapState: InitialMapState): __esri.Viewpoint => {
    if (initialMapState.viewType === '2d') {
      return new this.Viewpoint(
        {
          targetGeometry: this.Extent.fromJSON(initialMapState.extent),
          rotation: initialMapState.rotation
        }
      )
    } else {
      return this.Viewpoint.fromJSON(initialMapState.viewPoint)
    }
  }


  homeBtnGoToOverride = async (view: ArcGISView, goToParams: GoToParameters) => {
    const is2DView = view.type === '2d'

    // snapToZoom: true means integer zoom, false means float zoom
    // We need to make sure goTo the integer zoom when click home btn.
    let needToRestoreSnapToZoomToFalse = false
    if (is2DView && view.constraints && !view.constraints.snapToZoom) {
      view.constraints.snapToZoom = true
      needToRestoreSnapToZoomToFalse = true
    }

    try {
      await view.goTo(goToParams.target, goToParams.options)
    } catch (e) {
      console.error('home btn goto error', e)
    }

    // When goTo is done, we need to reset to float zoom to get the best synchronization between two map widgets.
    if (is2DView && view.constraints && needToRestoreSnapToZoomToFalse) {
      view.constraints.snapToZoom = false
    }
  }

  destroyHomeElement () {
    if (this.homeElement) {
      if (this.overrideStyleHandle) {
        this.overrideStyleHandle.remove()
        this.overrideStyleHandle = null
      }

      // this.homeBtn.destroy() will remove this.homeBtn.container from dom tree and let this.homeBtn.container.parentNode be null
      this.homeElement.destroy()
      this.homeElement = null
      const jimuMapView = this.props.jimuMapView

      if (jimuMapView) {
        jimuMapView.deleteJimuMapTool('Home')
      }
    }
  }

  componentWillUnmount () {
    this.destroyHomeElement()
  }

  render () {
    return <div className='home-map-tool' ref={ref => { this.container = ref }} />
  }
}
