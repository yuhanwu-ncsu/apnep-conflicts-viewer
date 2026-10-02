import { getAppStore, esri, urlUtils } from 'jimu-core'

export enum SearchSourceType {
  MyContent = 'my-content',
  MyOrganization = 'my-organization',
  MyGroups = 'my-groups',
  ArcGISOnline = 'arcGIS-online'
}

interface SearchOption {
  searchText?: string
  portalUrl: string
  num?: number
  start?: number
  sortField?: string
  sortOrder?: string
  searchItemType?: string
  excludeType?: string
  sourceType?: SearchSourceType
  ignoreCurrentPortalCheck?: boolean
  authentication?: any
  query?: string
}

export async function searchItemByPortalUrl (option: SearchOption) {
  const { searchText, portalUrl, num, start, sortField, sortOrder, searchItemType, excludeType, sourceType, ignoreCurrentPortalCheck, authentication, query } = option
  const requestPortalUrl = sourceType === SearchSourceType.ArcGISOnline ? urlUtils.getArcgisOnlineUrl() : portalUrl
  if (!requestPortalUrl) return Promise.reject(new Error('No portal url'))
  const requestOption = {
    start: start || 1,
    num: num || 30,
    q: query || getRequestOptionParamsQ(searchText, searchItemType, requestPortalUrl, excludeType, sourceType, ignoreCurrentPortalCheck),
    sortField: sortField || 'modified',
    sortOrder: sortOrder || 'desc'
  } as any

  authentication && (requestOption.authentication = authentication)
  const requestUrl = `${requestPortalUrl}/sharing/rest/search`
  const requestParams = {
    params: {
      q: requestOption.q,
      num: requestOption.num,
      start: requestOption.start,
      sortField: requestOption.sortField,
      sortOrder: requestOption.sortOrder,
      f: 'json'
    },
    httpMethod: 'GET'
  } as any

  if (requestOption.authentication) {
    requestParams.authentication = requestOption.authentication
  }

  return esri.restRequest.request(requestUrl, requestParams)
}

function getRequestOptionParamsQ (searchText: string, searchItemType: string, portalUrl: string, excludeType?: string, sourceType: SearchSourceType = SearchSourceType.MyOrganization, ignoreCurrentPortalCheck?: boolean): string {
  let query = new esri.restPortal.SearchQueryBuilder().match(searchItemType).in('type')
  if (excludeType) {
    query = query.and()
      .startGroup()
      .not()
      .match(excludeType)
      .in('type')
      .endGroup()
  }
  if (searchText) {
    query = query
      .and()
      .startGroup()
      .match(searchText)
      .endGroup()
  }

  const appState = getAppStore().getState()
  const orgId = appState?.portalSelf?.user?.orgId
  const user = appState?.user
  const userGroups = (user?.groups || []) as Array<{ id: string }>
  const isCurrentPortal = portalUrl === appState?.portalUrl

  if (!ignoreCurrentPortalCheck && !isCurrentPortal) {
    return query.toParam()
  }

  if (sourceType === SearchSourceType.MyContent && orgId && user?.username) {
    query = query
      .and()
      .match(orgId).in('orgid')
      .and()
      .match(user.username).in('owner')
  } else if (sourceType === SearchSourceType.MyOrganization && orgId) {
    query = query
      .and()
      .match(orgId).in('orgid')
  } else if (sourceType === SearchSourceType.MyGroups && userGroups.length > 0) {
    query = query
      .and()
      .startGroup()
      .match('shared').in('access')
      .or()
      .match('public').in('access')
      .or()
      .match('org').in('access')
      .endGroup()
      .and()
      .startGroup()

    userGroups.forEach((group, index) => {
      query = query.match(group.id).in('group')
      if (index < userGroups.length - 1) {
        query = query.or()
      }
    })
    query = query.endGroup()
  } else if (sourceType === SearchSourceType.ArcGISOnline) {
    query = query
      .and()
      .match('public').in('access')
  }
  return query.toParam()
}
