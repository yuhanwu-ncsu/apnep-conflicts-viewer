import { DataSourceManager, DataSourceTypes, i18n, jimuHistory, type FeatureLayerDataSource, type WebMapDataSource, type WebSceneDataSource } from 'jimu-core'
import { ApplyEditType, type MessageParams, MessageType, type EditResult, type IMConfig, AlertType } from '../../config'
import defaultMessages from '../translations/default'

/**
 * Loads the arcgis-version-management component and returns its versioning states
 * @return Collection of VersioningState objects
 */
export async function loadVersionManagementVersioningStates (): Promise<__esri.Collection<__esri.VersioningState>> {
  try {
    const arcgisVersionManagement = document.querySelector("arcgis-version-management")
    if (!arcgisVersionManagement) {
      throw new Error(getI18nMessage('loadComponentError'))
    }

    await arcgisVersionManagement.componentOnReady()

    // Wait for the component state to not be loading
    while (arcgisVersionManagement.state === 'loading') {
      await new Promise<void>((resolve) => { setTimeout(() => { resolve() }, 100) })
    }

    if (arcgisVersionManagement.state === 'failed') {
      throw new Error(getI18nMessage('loadComponentError'))
    }

    return arcgisVersionManagement.versioningStates
  } catch (error) {
    throw new Error(getI18nMessage('loadComponentError'))
  }
}

/**
 * Changes the version of a versioning state and updates relevant data sources
 * @param config Widget configuration (loads configured default versions)
 * @param urlProvidedVersion Version name provided in URL (overrides config)
 * @param vs Versioning state to change
 */
export async function changeDefaultVersion (config: IMConfig, urlProvidedVersion: string, vs: __esri.VersioningState): Promise<__esri.VersioningState> {
  if (!vs) {
    return
  }

  try {
    let targetVersionInfo: __esri.VersionInfo = null
    const versionInfos = vs.versionInfos

    const fullUrl = vs.featureServiceUrl || ''
    const serviceName = getServiceName(fullUrl)
    const configDefaultVersion = config.defaultVersions?.[serviceName] || ''

    if (urlProvidedVersion !== '') {
      // Url provided version takes precedence
      targetVersionInfo = versionInfos.find(vi => {
        const identifier = vi.versionIdentifier
        return identifier && identifier.name === urlProvidedVersion
      })

    } else if (configDefaultVersion !== '') {
      // Configured default version
      targetVersionInfo = versionInfos.find(vi => {
        const identifier = vi.versionIdentifier
        return identifier && identifier.name === configDefaultVersion.name
      })
    }
    else {
      // Fallback to default version of service
      targetVersionInfo = versionInfos.find(vi => {
        const identifier = vi.versionIdentifier
        return identifier && identifier.name === vs.defaultVersionIdentifier.name
      })
    }

    if (targetVersionInfo) {
      await vs.changeVersion(targetVersionInfo.versionIdentifier)
      changeDataSourceVersion(targetVersionInfo.versionIdentifier.name, vs.featureServiceUrl)
    }
    return vs
  } catch (error) {
    throw new Error(error.message)
  }
}

/**
 * Returns the name of the feature service from a given URL
 * @param url URL of the feature service
 * @returns Name of the feature service
 */
export function getServiceName (url: string): string {
  const SERVICE_NAME_REGEX = /\/rest\/services\/([^\/]+)\/FeatureServer/i
  return url.match(SERVICE_NAME_REGEX)?.[1] || url
}

/**
 * Gets the current enterprise version for each service from their layer definitions
 * @returns Map of service URLs to their current enterprise version numbers
 */
export function getServiceVersions (): Map<string, number> {
  const serviceVersions = new Map<string, number>()

  forEachFeatureLayer((featureLayerDs) => {
    const serviceUrl = featureLayerDs.layer.url

    // Only process if we haven't already captured this service
    if (!serviceVersions.has(serviceUrl)) {
      try {
        const layerDefinition = featureLayerDs.getLayerDefinition()
        if (layerDefinition && layerDefinition.currentVersion !== undefined) {
          serviceVersions.set(serviceUrl, layerDefinition.currentVersion)
        }
      } catch (error) {
        console.warn(`Failed to get layer definition for service: ${serviceUrl}`, error)
      }
    }
  })

  return serviceVersions
}

/**
 * Helper function to iterate through all feature layer data sources
 * @param action Callback function to execute on each feature layer data source
 */
function forEachFeatureLayer (
  action: (featureLayerDs: FeatureLayerDataSource) => void,
  utilityNetworkAction?: (utilityNetwork: __esri.UtilityNetwork) => void
): void {
  const dsManager = DataSourceManager.getInstance()
  const dsList = dsManager.getDataSources()

  for (const key in dsList) {
    const ds = dsList[key]
    if (ds.type === DataSourceTypes.Map || ds.type === DataSourceTypes.WebMap || ds.type === DataSourceTypes.WebScene) {
      const mapDs = ds as WebMapDataSource | WebSceneDataSource
      const childDS = mapDs.getAllChildDataSources()

      // Handle utility networks version or moment changes.
      if (utilityNetworkAction && mapDs.map) {
        const utilityNetworks = (mapDs.map as any).utilityNetworks as __esri.Collection<__esri.UtilityNetwork>
        if (utilityNetworks) {
          utilityNetworks.forEach((un) => {
            utilityNetworkAction(un)
          })
        }
      }

      childDS.forEach((child) => {
        switch (child.type) {
          case DataSourceTypes.FeatureLayer:
          case DataSourceTypes.SubtypeGroupLayer:
          case DataSourceTypes.SubtypeSublayer:
            const featureLayerDs = child as FeatureLayerDataSource
            action(featureLayerDs)
        }
      })
    }
  }
}

/**
 * Helper function to iterate through data sources and apply an action to matching feature layers
 * @param serviceUrl URL of the feature service to match data sources
 * @param action Callback function to execute on matching feature layer data sources
 * @returns Object containing the map data source ID and whether any children were updated
 */
function forEachMatchingFeatureLayer (
  serviceUrl: string,
  action: (featureLayerDs: FeatureLayerDataSource) => void,
  utilityNetworkAction?: (utilityNetwork: __esri.UtilityNetwork) => void
): { serviceName?: string, hasUpdatedChildren: boolean } {
  let serviceName: string | undefined
  let hasUpdatedChildren = false

  forEachFeatureLayer(
    (featureLayerDs) => {
      if (featureLayerDs.layer.url === serviceUrl) {
        action(featureLayerDs)
        if(!hasUpdatedChildren) {
          serviceName = getServiceName(featureLayerDs.layer.url)
          hasUpdatedChildren = true
        }
      }
    },
    utilityNetworkAction ? (un) => {
      if (un.featureServiceUrl === serviceUrl) {
        utilityNetworkAction(un)
        if (!hasUpdatedChildren) {
          serviceName = getServiceName(un.featureServiceUrl)
          hasUpdatedChildren = true
        }
      }
    } : undefined
  )

  return { serviceName, hasUpdatedChildren }
}

/**
 * Changes the geodatabase version for all relevant data sources in the web map
 * @param versionName Name of the version to switch to
 * @param serviceUrl URL of the feature service to match data sources
 */
export function changeDataSourceVersion (versionName: string, serviceUrl: string): void {
  const { serviceName, hasUpdatedChildren } = forEachMatchingFeatureLayer(
    serviceUrl,
    (featureLayerDs) => { featureLayerDs.changeGDBVersion(versionName) },
    (utilityNetwork) => { utilityNetwork.gdbVersion = versionName }
  )
  if (serviceName && hasUpdatedChildren) {
    // Save url parameters in history
    jimuHistory.changeQueryObjectByDataSourceGDBVersion(serviceName, versionName)
  }
}

/**
 * Changes the historic moment for all relevant data sources in the web map
 * @param moment Historic moment value to set
 * @param serviceUrl URL of the feature service to match data sources
 * @param layerIds Array of layer IDs to update (optional)
 * @param fullRefresh Whether to perform a full refresh after changing the historic moment (optional)
 */
export function changeDataSourceHistoricMoment (moment: number | string, serviceUrl: string, layerIds?: number[], fullRefresh: boolean = false): void {
  forEachMatchingFeatureLayer(
    serviceUrl,
    (featureLayerDs) => {
      const shouldUpdate = fullRefresh ||
        !layerIds ||
        layerIds.length === 0 ||
        layerIds.includes(featureLayerDs.getLayerDefinition().id)

        if (shouldUpdate) {
        featureLayerDs.changeHistoricMoment(moment)
      }
    },
    (utilityNetwork) => { utilityNetwork.historicMoment = moment === '' ? null : moment as number }
  )
}

/**
 * Updates historic moment for all relevant data sources based on the provided versioning states.
 * Used when reconciling a version or ending an edit session.
 * @param moment Historic moment value to set
 * @param versioningStates Map of versioning states keyed by service URL
 */
export function changeAllDataSourceHistoricMoment (moment: number | string, versioningStates: Map<string, __esri.VersioningState>): void {
  const serviceUrls = Array.from(versioningStates.values()).map(vs => vs.featureServiceUrl)
  serviceUrls.forEach(serviceUrl => {
    changeDataSourceHistoricMoment(moment, serviceUrl)
  })
}

/**
 * Normalize URL to match registered versioning states
 * LRS URLs: https://.../MapServer/exts/LRServer/applyEdits -> https://.../FeatureServer
 * Regular URLs: https://.../FeatureServer/0/applyEdits -> https://.../FeatureServer
 * VMS urls: "https://.../VersionManagementServer/versions -> https://.../FeatureServer
 * @param url URL to normalize
 * @returns Feature service URL
 */
export function normalizeServiceUrl (url: string): string {
  if (/\/LRServer\//i.test(url)) {
    return url.replace(/\/MapServer\/.*$/, '/FeatureServer')
  } else if (/\/VersionManagementServer\//i.test(url)) {
    return url.replace(/\/VersionManagementServer\/.*$/, '/FeatureServer')
  } else {
    const match = url.match(/(.*\/FeatureServer)/i)
    return match ? match[1] : url
  }
}

/**
 * Determine the type of applyEdits URL
 * Service URLs: https://<root>/<serviceName>/FeatureServer/applyEdits
 * Layer URLs: https://<root>/<serviceName>/FeatureServer/<layerId>/applyEdits
 * LRS URLS: https://<root>/<serviceName>/MapServer/exts/LRServer/applyEdits
 * @param url URL to check
 * @returns Type of applyEdits URL
 */
export function getApplyEditsType (url: string): ApplyEditType {
  if (/\/LRServer\/applyEdits$/i.test(url)) {
    return ApplyEditType.LRS
  } else if (/\/FeatureServer\/\d+\/applyEdits$/i.test(url)) {
    return ApplyEditType.LAYER
  } else {
    return ApplyEditType.SERVICE
  }
}

/**
 * Returns the EditResult from an LRS applyEdits response
 * @param response Response from an LRS applyEdits request
 * @returns EditResult object that contains the moment and affected layer IDs
 */
export function getLrsApplyEditsResults (response: any): EditResult {
  const layerIds: number[] = []
  let editMoment: number | undefined

  if (response.data.editMoment) {
    editMoment = response.data.editMoment
  }

  if (Array.isArray(response.data?.editResults)) {
    for (const layerResult of response.data.editResults) {
      if (layerResult.id !== undefined && layerResult.id !== null) {
        layerIds.push(Number(layerResult.id))
      }
    }
  }

  return { moment: editMoment, layerIds }
}

/**
 * Returns the EditResult from an feature service applyEdits response
 * @param response Response from an feature service applyEdits request
 * @returns EditResult object that contains the moment and affected layer IDs
 */
export function getFeatureServiceApplyEditsResults (response: any): EditResult {
  const layerIds: number[] = []
  let editMoment: number | undefined

  if (Array.isArray(response.data) && response.data.length > 0) {
    for (const layerResult of response.data) {
      if (layerResult.editMoment && !editMoment) {
        editMoment = layerResult.editMoment
      }

      if (layerResult.id !== undefined && layerResult.id !== null) {
        layerIds.push(Number(layerResult.id))
      }
    }
  }
  return { moment: editMoment, layerIds }
}

/**
 * Returns the EditResult from an feature layer applyEdits response
 * @param response Response from an feature layer applyEdits request
 * @returns EditResult object that contains the moment and affected layer IDs
 */
export function getFeatureServiceLayerApplyEditsResults (response: any): EditResult {
  const layerIds: number[] = []
  let editMoment: number | undefined

  if (response.data?.editMoment) {
    editMoment = response.data.editMoment
    const layerIdMatch = response.url?.match(/\/FeatureServer\/(\d+)\//)
    if (layerIdMatch) {
      layerIds.push(Number(layerIdMatch[1]))
    }
  }

  return { moment: editMoment, layerIds }
}

/**
 * Builds an empty message object
 * @returns MessageParams object with empty values
 */
export function buildEmptyMessage (): MessageParams {
  return {
    title: '',
    message: '',
    type: MessageType.NONE,
    kind: AlertType.BRAND
  }
}

/**
 * Builds a message object
 * @param title title to show in alert/dialog
 * @param message message body to show in alert/dialog
 * @param type type of message (ALERT, SAVE, DISCARD, etc)
 * @param kind kind of alert (BRAND, DANGER, INFO, etc)
 * @returns MessageParams object
 */
export function buildMessage (title: string, message: string, type: MessageType, kind?: AlertType): MessageParams {
  return {
    title,
    message,
    type,
    kind: kind ?? AlertType.BRAND
  }
}

/**
 * Get internationalized message
 * @param id Message ID
 * @param values Optional values for message interpolation
 */
export function getI18nMessage (id: string, values?: { [key: string]: any }): string {
  const messages = Object.assign({}, defaultMessages)
  const intl = i18n.getIntl()
  return intl.formatMessage(
    { id: id, defaultMessage: messages[id] },
    values
  )
}