import { React, type DataSource, type Timezone, dataSourceUtils } from 'jimu-core'
import type { StyleConfig } from '../../config'
import { getViewByDataSourceId } from '../../utils'
import 'arcgis-map-components'

export enum LoadStatus {
  Pending = 'Pending',
  Fulfilled = 'Fulfilled',
  Rejected = 'Rejected'
}

interface VisibleElements {
  title: boolean
  content: {
    fields: boolean
    text: boolean
    media: boolean
    attachments: boolean
  }
  lastEditedInfo: boolean
}

interface Props {
  dataSource: DataSource
  graphic: __esri.Graphic
  defaultPopupTemplate: any
  visibleElements: VisibleElements
  timezone: Timezone
  useMapWidget: boolean
  featureInfoConRef: React.RefObject<HTMLDivElement>
  styleConfig: StyleConfig
}

interface State {
  loadStatus: LoadStatus
}

export default class FeatureInfos extends React.PureComponent<Props, State> {
  private features: any
  private readonly featureContainerRef = React.createRef<HTMLInputElement>()

  constructor (props) {
    super(props)
    this.state = {
      loadStatus: LoadStatus.Pending
    }
  }

  componentDidMount () {
    this.createFeature()
  }

  componentDidUpdate (prevProps: Props) {
    if (this.features) {
      this.updateDataSource(prevProps)

      const graphic = { popupTemplate: { content: '' } }
      const graphics = this.props.graphic ? [this.props.graphic] : [graphic]
      this.updateGraphic(prevProps, graphics)

      this.features.timeZone = this.getTimezone()

      this.updateVisibleElementsContent(graphics)
    }
  }

  updateGraphic (prevProps: Props, graphics) {
    // @ts-expect-error
    let popupTemplate = this.props.graphic?.popupTemplate || this.props.graphic?.layer?.popupTemplate
    if (!popupTemplate) {
      popupTemplate = this.props.defaultPopupTemplate
      this.props.graphic && (this.props.graphic.popupTemplate = popupTemplate)
      //this.props.graphic?.layer?.popupTemplate = this.props.defaultPopupTemplate
    }

    const isOutputDSFromChart = this.isOutputDSFromChart()
    popupTemplate?.fieldInfos?.forEach(fieldInfo => {
      // temporarily hide three data/time fields
      // @ts-expect-error
      const fieldType = this.props.graphic?.layer?.fields?.find(field => field.name === fieldInfo.fieldName)?.toJSON()?.type
      if (fieldType && fieldType === 'esriFieldTypeTimestampOffset') {
        fieldInfo.visible = false
      } else if (isOutputDSFromChart) {
        // display all fields by default if the data source is output from chart widget.
        fieldInfo.visible = true
      }
    })

    // @ts-expect-error
    if (this.props.graphic?.uid === undefined || this.props.graphic?.uid !== prevProps.graphic?.uid) {
      // there is a timing problem between sets 'map/view' and 'graphics', setting 'graphics' immediately after setting 'map/view' sometimes causes a blank
      // use 'set timeout' to make sure setting 'graphics' to wait setting map/view
      setTimeout(() => { this.features.features = graphics }, 1)
    }
  }

  updateDataSource (prevProps: Props) {
    const rootDataSource = this.props.dataSource.getRootDataSource()
    const view = getViewByDataSourceId(this.props.dataSource?.id)
    // @ts-expect-error
    this.features.spatialReference = view?.spatialReference || this.props.graphic?.layer?.spatialReference || null
    // @ts-expect-error
    this.features.map = rootDataSource?.map || null
    if (this.props.useMapWidget && view && this.features.view !== view) {
      // for Arcade expressions, view can be alternatively set the 'map' property.
      this.features.view = view
    }
  }

  updateVisibleElementsContent (graphics) {
    this.features.hideHeading = !this.props.visibleElements.title
    this.features.hideFieldsContent = !this.props.visibleElements.content.fields
    this.features.hideMediaContent = !this.props.visibleElements.content.media
    this.features.hideTextContent = !this.props.visibleElements.content.text
    this.features.hideAttachmentContent = !this.props.visibleElements.content.attachments
    this.features.hideLastEditedInfo = !this.props.visibleElements.lastEditedInfo

    //if (this.features.hideHeading !== !this.props.visibleElements.title) {
    //  this.features.hideHeading = !this.props.visibleElements.title
    //}
    //const visibleElementsContent = this.props.visibleElements.content
    //const prevContent = this.features.featureViewModelAbilities
    //const featureViewModelAbilitiesChanged = prevContent?.attachmentsContent !== visibleElementsContent.attachments ||
    //                                         prevContent?.customContent !== visibleElementsContent.text ||
    //                                         prevContent?.fieldsContent !== visibleElementsContent.fields ||
    //                                         prevContent?.mediaContent !== visibleElementsContent.media ||
    //                                         prevContent?.textContent !== visibleElementsContent.text
    //if (featureViewModelAbilitiesChanged) {
    //  const featureViewModelAbilities = {
    //    attachmentsContent: visibleElementsContent.attachments,
    //    customContent: visibleElementsContent.text,
    //    fieldsContent: visibleElementsContent.fields,
    //    mediaContent: visibleElementsContent.media,
    //    textContent: visibleElementsContent.text
    //  }
    //  this.features.featureViewModelAbilities = featureViewModelAbilities
    //}
  }

  getTimezone () {
    // @ts-expect-error
    return dataSourceUtils.getTimezoneAPIFromRuntime(this.props.dataSource?.getTimezone())
  }

  isOutputDSFromChart () {
    const dataSourceJson = this.props.dataSource?.getDataSourceJson()
    return dataSourceJson.isOutputFromWidget && dataSourceJson.schema
  }

  destroyFeature () {
    this.features && !this.features.destroyed && this.features.destroy()
  }

  createFeature () {
    this.destroyFeature()
    this.features = document.createElement('arcgis-features')
    this.featureContainerRef.current.appendChild(this.features)
    //await this.features.componentOnReady()
    this.features.visible = true
    this.features.features = [this.props.graphic]
    this.features.defaultPopupTemplateEnabled = true
    this.features.timeZone = this.props.timezone
    this.features.hideActionBar = true
    this.features.hideCloseButton = true
    this.features.hideHeading = false
    // since js-api v5-0.0-next.141, the open method has been replaced by open property, and the default value is false
    this.features.open = true
    this.setState({ loadStatus: LoadStatus.Fulfilled })
  }

  /*
   * For the feature info with long content, the content will be loaded gradually when scrolling
   */
  //addEventListenerForCustomHtmlStylesWhenScroll () {
  //  let timer
  //  this.props.featureInfoConRef.current.addEventListener('scroll', () => {
  //    clearTimeout(timer)
  //    timer = setTimeout(() => {
  //      this.customHtmlStyles()
  //    }, 50)
  //  })
  //}

  /*
   * There is no API to directly set the styles of the arcgis features and its inner content,
   * so we have to use this way to customize the html styles.
   * The styles will be added when the component is mounted and updated, and also when the feature
   * info container is scrolled for the feature info with long content which will be loaded gradually when scrolling.
   * We will add a style element with a specific class name to the shadow root of the arcgis features,
   * and also to the shadow root of each content element. When the styles need to be updated, we will replace the style element with a new one.
   */
  //customHtmlStyles () {
  //  this.features.componentOnReady().then(() => {
  //    // arcgis features root
  //    const arcgisFeaturesRoot = this.features.shadowRoot?.querySelector('.root')
  //    const style = document.createElement('style')
  //    const styleConfig = this.props.styleConfig
  //    style.classList.add('exb-custom-style')
  //    style.innerHTML = `
  //      *{
  //        color: ${styleConfig?.textColor ? styleConfig.textColor : null} !important;
  //      }
  //    `
  //    const arcgisFeaturesStyle = arcgisFeaturesRoot?.querySelector('.exb-custom-style')
  //    //if (arcgisFeaturesStyle && !styleConfig) {
  //    //  arcgisFeaturesStyle?.parentNode?.removeChild(arcgisFeaturesStyle)
  //    //} else
  //    if (!arcgisFeaturesStyle) {
  //      arcgisFeaturesRoot?.appendChild(style)
  //    } else if (arcgisFeaturesStyle.innerHTML !== style.innerHTML) {
  //      arcgisFeaturesRoot?.replaceChild(style, arcgisFeaturesStyle)
  //    }
  //    const arcgisFeature = arcgisFeaturesRoot?.querySelector('arcgis-feature')
  //    arcgisFeature?.componentOnReady().then(() => {
  //      // @ts-expect-error
  //      if (arcgisFeature?.graphic?.uid !== this.props.graphic?.uid) {
  //        return
  //      }
  //      // arcgis feature root
  //      const arcgisFeatureRoot = arcgisFeature?.shadowRoot?.querySelector('.root')
  //      let intervalCount = 0
  //      const intervalId = setInterval(() => {
  //        arcgisFeatureRoot?.querySelectorAll('.content-element').forEach(contentElement => {
  //          intervalCount++
  //          // content element root
  //          const contentElementRoot = contentElement.shadowRoot?.querySelector('.root')
  //          const contentStyle = contentElementRoot?.querySelector('.exb-custom-style')
  //          if (!contentStyle) {
  //            contentElementRoot?.appendChild(style.cloneNode(true))
  //          } else if (contentStyle.innerHTML !== style.innerHTML) {
  //            contentElementRoot?.replaceChild(style.cloneNode(true), contentStyle)
  //          }
  //          // arcgis feature content root
  //          const arcgisFeatureContent = contentElementRoot?.querySelector('arcgis-feature-content')
  //          const arcgisFeatureContentRoot = arcgisFeatureContent?.shadowRoot?.querySelector('.root')
  //          const arcgisFeatureContentStyle = arcgisFeatureContentRoot?.querySelector('.exb-custom-style')
  //          if (!arcgisFeatureContentStyle) {
  //            arcgisFeatureContentRoot?.appendChild(style.cloneNode(true))
  //          } else if (arcgisFeatureContentStyle.innerHTML !== style.innerHTML) {
  //            arcgisFeatureContentRoot?.replaceChild(style.cloneNode(true), arcgisFeatureContentStyle)
  //          }
  //        })
  //        if (intervalCount > 200) {
  //          clearInterval(intervalId)
  //        }
  //      }, 20)
  //    })
  //  })
  //}

  render () {
    return (
      <div className='feature-info-component'>
        {<div id='features-container' role='document' tabIndex={0} ref={this.featureContainerRef} />}
      </div>
    )
  }
}
