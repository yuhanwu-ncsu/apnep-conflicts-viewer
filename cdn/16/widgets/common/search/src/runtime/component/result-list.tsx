/** @jsx jsx */
import { React, jsx, type QueriableDataSource, classNames, type DataRecord, Immutable, type ImmutableObject, i18n, MessageManager, DataRecordsSelectionChangeMessage, hooks, ReactRedux, type IMState, type ImmutableArray, type ArcGISQueriableDataSource, type FeatureDataRecord } from 'jimu-core'
import { Icon, DropdownItem } from 'jimu-ui'
import { type IMConfig, type IMServiceList, type RecordResultType, type IMDatasourceCreatedStatus, type IMSearchResult, SearchResultStyle, DEFAULT_POPPER_OFFSET, type IMSelectionList, type NewDatasourceConfigItem, SearchResultView } from '../../config'
import defaultMessage from '../translations/default'
import { getDatasourceConfigItemByConfigId, getJsonLength, getDatasource, loadAllDsRecord, checkIsAllRecordLoadedWithDsStatus, loadEsriModulesForZoomTo, getGraphicForMessageAction } from '../utils/utils'
import { DownOutlined } from 'jimu-icons/outlined/directional/down'
import { UpOutlined } from 'jimu-icons/outlined/directional/up'
import ResultPopper from './resultPopper'
import UtilityErrorRemind from './utility-remind'
const { useEffect, useRef } = React
interface DisplayRecord {
  value: string[]
  configId: string
  zoomScale?: number
  outputDsId: string
  dsId: string
  recordId: string | number
  isGeocodeRecords: boolean
  layerDsIdActuallyUsed: string
  localDsId?: string
}

interface DisplayRecordData {
  [configId: string]: DisplayRecord[]
}

interface DisplayRecords {
  [configId: string]: DataRecord[]
}

interface SelectRecordsOption {
  isActive: boolean
  key: string
  recordId: string | number
  dsId: string
  configId: string
  zoomScale?: number
}

type IMDisplayRecordData = ImmutableObject<DisplayRecordData>

interface ResultListProps {
  serviceList: IMServiceList
  originalServiceList: IMServiceList
  searchConfigIdsWithClearedDsFilter?: Set<string>
  searchText: string
  reference: any
  id: string
  isOpenResultListDefault: boolean
  config: IMConfig
  searchResult: IMSearchResult
  className?: string
  searchInputRef?: any
  selectionList: IMSelectionList
  openUtilityErrRemindInResult: boolean
  dsStatus?: IMDatasourceCreatedStatus
  /**
   * If `true`, means confirm search and show search result panel
  */
  isOpenResultPopper: boolean
  /**
   * If `true`, means confirm search and go to other widget
  */
  isToOtherWidget: boolean
  datasourceConfig: ImmutableArray<NewDatasourceConfigItem>
  Graphic?: typeof __esri.Graphic
  scaleExtent: (extent: __esri.Extent, view?: any, scale?: number) => __esri.Extent
  setResultFirstItem: (ref) => void
  handleDsIdOfSelectedResultItemChange: (dsId: string) => void
  toggleResultUtilityError: (open?: boolean) => void
  toggleLoading: (showLoading?: boolean) => void
  clearSearch: () => void
}

const ResultList = (props: ResultListProps) => {
  const nls = hooks.useTranslation(defaultMessage)
  const { reference, searchText, id, config, originalServiceList, dsStatus, serviceList, searchConfigIdsWithClearedDsFilter, isOpenResultListDefault, searchInputRef, searchResult, selectionList, openUtilityErrRemindInResult, isOpenResultPopper, isToOtherWidget, datasourceConfig, scaleExtent, Graphic } = props
  const { toggleResultUtilityError, setResultFirstItem, handleDsIdOfSelectedResultItemChange, toggleLoading, clearSearch } = props
  const { resultMaxNumber, enableFiltering } = config
  const selectedRecordKey = useRef([] as string[])
  const isDataLoaded = useRef(false)
  const dropdownMenuRef = useRef<HTMLDivElement>(null)
  const searchResultsButtonRef = useRef<HTMLButtonElement>(null)
  const isHasSetFirstItem = useRef<boolean>(false)
  const displayRecordRef = useRef<IMDisplayRecordData>(Immutable({}) as IMDisplayRecordData)
  const displayRecordsRef = useRef<DisplayRecords>({} as DisplayRecords)
  const selectRecordsTimeoutRef = useRef(null)
  const isHasAutoSelectFirstRecordRef = useRef(false)
  const isShowResultListRef = useRef(false)
  const searchTextRef = useRef(null as string)
  const firstRecord = useRef({} as DisplayRecord)
  const resultListContentRef = useRef<HTMLDivElement>(null)
  const clearSearchRef = useRef(clearSearch)

  const isRTL = ReactRedux.useSelector((state: IMState) => {
    return state.appContext.isRTL
  })

  const [displayRecord, setDisplayRecord] = React.useState(Immutable({}) as IMDisplayRecordData)
  const [isShowResultList, setIsShowResultList] = React.useState(isOpenResultListDefault)
  const [searchResultStyle, setSearchResultStyle] = React.useState(SearchResultStyle.Classic)
  const [isNoResult, setIsNoResult] = React.useState(false)
  const [offset, setOffset] = React.useState(DEFAULT_POPPER_OFFSET)
  const [popperVersion, setPopperVersion] = React.useState(null)

  useEffect(() => {
    selectedRecordKey.current = []
    searchTextRef.current = searchText
  }, [searchText])

  useEffect(() => {
    isDataLoaded.current = false
    const isAllRecordLoaded = checkIsAllRecordLoadedWithDsStatus(serviceList?.asMutable({ deep: true }), dsStatus)
    if (isAllRecordLoaded && (isToOtherWidget || isOpenResultPopper)) {
      //Load records when show result
      loadRecords()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchResult, isToOtherWidget, isOpenResultPopper, enableFiltering, dsStatus])

  useEffect(() => {
    if (isOpenResultPopper) {
      const isAllRecordLoaded = checkIsAllRecordLoadedWithDsStatus(serviceList?.asMutable({ deep: true }), dsStatus)
      toggleLoading(!isAllRecordLoaded)
    }
  }, [dsStatus, serviceList, isOpenResultPopper, toggleLoading])

  // When ds filters are cleared by message action, remove corresponding source items from result list;
  // if results transition from non-empty to empty, clear the current search state.
  useEffect(() => {
    clearSearchRef.current = clearSearch
  }, [clearSearch])

  useEffect(() => {
    if (!searchConfigIdsWithClearedDsFilter || searchConfigIdsWithClearedDsFilter.size === 0) {
      return
    }

    const currentDisplayRecord = displayRecordRef.current || (Immutable({}) as IMDisplayRecordData)
    const mutableDisplayRecord = currentDisplayRecord.asMutable({ deep: true }) || {}
    let hasRemovedItem = false

    searchConfigIdsWithClearedDsFilter.forEach(configId => {
      if (Object.prototype.hasOwnProperty.call(mutableDisplayRecord, configId)) {
        delete mutableDisplayRecord[configId]
        hasRemovedItem = true
      }
    })

    if (!hasRemovedItem) {
      return
    }

    const previousHasRecords = Object.keys(currentDisplayRecord || {}).length > 0
    const nextDisplayRecord = Immutable(mutableDisplayRecord) as IMDisplayRecordData
    const nextHasRecords = Object.keys(nextDisplayRecord || {}).length > 0
    const isTransitionFromHasRecordsToNoRecords = previousHasRecords && !nextHasRecords

    displayRecordRef.current = nextDisplayRecord
    setDisplayRecord(nextDisplayRecord)

    if (isTransitionFromHasRecordsToNoRecords) {
      clearSearchRef.current?.()
    }
  }, [searchConfigIdsWithClearedDsFilter])

  useEffect(() => {
    if (isOpenResultPopper || isToOtherWidget) {
      //When show result, should rest recordAutoSelect status and showResult status
      setIsShowResultList(true)
      isShowResultListRef.current = true
      isHasAutoSelectFirstRecordRef.current = false
      setDisplayRecord(Immutable({}) as IMDisplayRecordData)
      displayRecordsRef.current = {} as DisplayRecords
    }
  }, [isOpenResultPopper, isToOtherWidget])

  useEffect(() => {
    if (config?.searchResultStyle && config?.searchResultStyle !== searchResultStyle) {
      setSearchResultStyle(config?.searchResultStyle)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config])

  useEffect(() => {
    getOffset(searchResultStyle, isShowResultList, isNoResult)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchResultStyle, isShowResultList, isNoResult])

  /**
   * Load records by ds
  */
  const loadRecords = () => {
    const serviceRecords = loadAllDsRecord({
      resultServiceList: serviceList?.asMutable({ deep: true }),
      originalServiceList: originalServiceList?.asMutable({ deep: true }),
      resultMaxNumber: resultMaxNumber,
      id: id,
      enableFiltering: config?.enableFiltering
    })
    firstRecord.current = {} as any
    toggleLoading(true)
    Promise.all([serviceRecords]).then(async (res) => {
      isDataLoaded.current = true
      let newDisplayRecord = Immutable({}) as IMDisplayRecordData
      let allResponse = []
      res?.forEach(resItem => {
        allResponse = allResponse.concat(resItem)
      })
      const newDisplayRecords: any = {}

      const promises = allResponse.map(async (dsResult) => {
        const disPlayData = await getDisplayRecords(dsResult)
        return disPlayData
      })

      const disPlayDataArray = await Promise.all(promises)

      allResponse.forEach((dsResult, index) => {
        const { records, configId } = dsResult as RecordResultType
        newDisplayRecords[configId] = records
        let disPlayData = disPlayDataArray[index]
        disPlayData = sortDisplayRecords(disPlayData)
        initFirstRecord(disPlayData)
        newDisplayRecord = newDisplayRecord.setIn([configId], disPlayData)
      })

      displayRecordRef.current = newDisplayRecord
      config?.searchResultView !== SearchResultView.OtherWidgets && setDisplayRecord(newDisplayRecord)
      displayRecordsRef.current = newDisplayRecords
      autoSelectFirstRecord()
      toggleLoading(false)
    }, err => {
      toggleLoading(false)
      isDataLoaded.current = true
    })
  }

  const sortDisplayRecords = (disPlayData: DisplayRecord[]) => {
    return disPlayData.sort((data1, data2) => {
      const value1 = data1?.value?.join(',')?.toLocaleLowerCase()
      const value2 = data2?.value?.join(',')?.toLocaleLowerCase()
      const startsWithA = value1.startsWith(searchTextRef.current?.toLocaleLowerCase()) ? 0 : 1
      const startsWithB = value2.startsWith(searchTextRef.current?.toLocaleLowerCase()) ? 0 : 1
      return startsWithA - startsWithB
    })
  }

  /**
   * Render result list
  */
  const renderResultList = () => {
    const recordElementData = []
    isHasSetFirstItem.current = null
    for (const configId in displayRecord) {
      const displayItem = displayRecord?.asMutable({ deep: true })?.[configId]
      const datasourceConfigItem = getDatasourceConfigItemByConfigId(datasourceConfig, configId)
      const label = datasourceConfigItem?.label
      const icon = datasourceConfigItem?.icon
      const currentOutputNumber = getJsonLength(serviceList)
      const list = (
        <div key={`${configId}_${label}_con`} role='group' title='label' aria-label={label}>
          {displayItem.length > 0 && <div>
            {currentOutputNumber > 1 &&
              <div onMouseDown={(e) => { e.preventDefault() }}>
                <button role='button' aria-label={label} className='source-label-con d-flex align-items-center jimu-outline-inside' disabled={true} key={`${configId}_${label}`} title={label}>
                  {icon && <Icon className='mr-2' size={16} icon={icon?.svg}/> }
                  <div className='flex-grow-1'>{label}</div>
                </button>
              </div>
            }
            {renderResultItem(displayItem, selectionList, checkIsShowPadding())}
          </div>}
        </div>
      )
      recordElementData.push(list)
    }
    return recordElementData
  }

  const checkIsShowPadding = () => {
    const currentOutputNumber = getJsonLength(serviceList)
    if (currentOutputNumber < 2) {
      return false
    }

    // The total number of icons
    let iconNumber = 0
    //when only one source has records, and the ds item has an icon, padding should also be added
    let numberOfSourceWithRecordsAndIcon = 0
    for (const configId in displayRecord) {
      const datasourceConfigItem = getDatasourceConfigItemByConfigId(datasourceConfig, configId)
      const icon = datasourceConfigItem?.icon
      if (icon) {
        iconNumber += 1
      }
      if (displayRecord[configId]?.length > 0 && icon) {
        numberOfSourceWithRecordsAndIcon += 1
      }
    }
    return numberOfSourceWithRecordsAndIcon > 0 && iconNumber > 0
  }

  /**
   * Render result item
  */
  const renderResultItem = hooks.useEventCallback((displayData: DisplayRecord[], selectionList: IMSelectionList, isShowPadding = false) => {
    return displayData?.map((displayDataItem, index) => {
      const { configId, value, recordId, outputDsId, zoomScale } = displayDataItem
      const key = getItemKey(configId, recordId)
      const isSelected = selectionList?.asMutable({ deep: true })?.[configId]?.includes(recordId)
      const datasourceConfigItem = getDatasourceConfigItemByConfigId(datasourceConfig, configId)
      const icon = datasourceConfigItem?.icon
      const currentOutputNumber = getJsonLength(serviceList)

      return (
        <button
          className={classNames('d-flex align-items-center jimu-outline-inside', { 'item-p-l': isShowPadding, 'active': isSelected })}
          key={key}
          role='option'
          aria-selected={isSelected}
          title={value.join(', ')}
          aria-label={value.join(', ')}
          ref={ref => { setFirstItemRef(index, ref) }}
          onClick={() => {
            onSelectRecord({
              isActive: isSelected,
              key: key,
              recordId: recordId,
              dsId: outputDsId,
              configId: configId,
              zoomScale: zoomScale
            })
          }}
        >
          {(icon && currentOutputNumber === 1) && <Icon className='mr-2' size={16} icon={icon?.svg}/> }
          <div className='flex-grow-1'>{value.join(', ')}</div>
        </button>
      )
    })
  })

  const setFirstItemRef = (index: number, ref) => {
    if (index === 0 && !isHasSetFirstItem.current && isShowResultListRef.current && ref) {
      setResultFirstItem(ref)
      isHasSetFirstItem.current = true
    }
  }

  const publishRecordsSelectionChangeMessage = React.useCallback(async (dsId: string, localDsId: string, records: DataRecord[], zoomScale: number) => {
    if(localDsId) {
      const ds = getDatasource(dsId) as QueriableDataSource
      records = records.map(record => {
        return ds.buildRecord((record as any).feature)
      })
    }
    const dataRecordsSelectionChangeMessage = new DataRecordsSelectionChangeMessage(id, records, [dsId])
    let extent = (records[0] as any)?.__extent
    if (extent) {
      if (zoomScale) {
        let scaleExtentFn = scaleExtent
        let GraphicClass = Graphic
        if (!scaleExtentFn || !Graphic) {
          const esriModules = await loadEsriModulesForZoomTo()
          const esriScaleUtils = esriModules[0]
          GraphicClass = esriModules[1]
          scaleExtentFn = esriScaleUtils?.scaleExtent
        }
        if (scaleExtentFn) {
          extent = async (jimuMapView) => {
            const pointExtent = (records[0] as any)?.__extent
            const graphic = await getGraphicForMessageAction({
              pointExtent: pointExtent,
              jimuMapView: jimuMapView,
              GraphicClass: GraphicClass,
              scaleExtentFn: scaleExtentFn,
              zoomScale: zoomScale
            })
            return Promise.resolve(graphic)
          }
        }
      }
      dataRecordsSelectionChangeMessage.extent = extent
    }
    MessageManager.getInstance().publishMessage(dataRecordsSelectionChangeMessage)
  }, [Graphic, id, scaleExtent])

  const onSelectRecord = React.useCallback((option: SelectRecordsOption) => {
    const { isActive, recordId, dsId, configId, zoomScale } = option
    const localDsId = displayRecordRef.current?.[configId]?.[0]?.localDsId
    const layerDsIdActuallyUsed = displayRecordRef.current?.[configId]?.[0]?.layerDsIdActuallyUsed
    const isGeocodeRecords = displayRecordRef.current?.[configId]?.[0]?.isGeocodeRecords
    const datasourceId = isGeocodeRecords ? dsId : layerDsIdActuallyUsed
    const ds = getDatasource(datasourceId) as QueriableDataSource

    //Publish message action
    const records = !isActive ? getRecordsByRecordsId(configId, recordId) : []
    publishRecordsSelectionChangeMessage(dsId, localDsId, records, zoomScale)

    handleDsIdOfSelectedResultItemChange(recordId ? dsId : null)
    if (checkIsValidRecordId(recordId)) {
      !isActive && clearOtherDsSelectedRecords(configId)
      //This timeout is special processing to deal with issue https://devtopia.esri.com/Beijing-R-D-Center/ExperienceBuilder-Web-Extensions/issues/22482
      clearTimeout(selectRecordsTimeoutRef.current)
      selectRecordsTimeoutRef.current = setTimeout(() => {
        !isActive ? ds?.selectRecordsByIds([recordId]) : ds?.selectRecordsByIds([])
      }, 100)
    }

    if (config?.autoCollapseOnSelection && !isActive) {
      setIsShowResultList(false)
    }
  }, [config?.autoCollapseOnSelection, handleDsIdOfSelectedResultItemChange, publishRecordsSelectionChangeMessage])

  const clearOtherDsSelectedRecords = (currentSelectConfigId: string) => {
    const displayRecord = displayRecordRef.current
    for (const configId in displayRecord) {
      if (currentSelectConfigId === configId) {
        continue
      } else {
        const dsId = displayRecord[configId]?.[0]?.outputDsId
        const layerDsId = displayRecord?.[configId]?.[0]?.layerDsIdActuallyUsed
        const isGeocodeRecords = displayRecord?.[configId]?.[0]?.isGeocodeRecords
        const datasourceId = isGeocodeRecords ? dsId : layerDsId
        const ds = getDatasource(datasourceId) as QueriableDataSource
        ds && ds.selectRecordsByIds([])
      }
    }
  }

  const getRecordsByRecordsId = (configId: string, recordId: string | number): DataRecord[] => {
    const records = displayRecordsRef.current?.[configId] || []
    const fieldRecord = records?.filter(record => record?.getId() === recordId)
    return fieldRecord || []
  }

  /**
   * Get display record list by field name
  */
  const getDisplayRecords = async (dsResult: RecordResultType): Promise<DisplayRecord[]> => {
    const { records, configId, dsId, isGeocodeRecords, layerDsIdActuallyUsed, localDsId, zoomScale } = dsResult
    const displayFields = serviceList?.[configId]?.displayFields || []
    let displayRecordList: DisplayRecord[] = []
    const intl = i18n.getIntl()

    async function getDisplayRecord (record: DataRecord): Promise<DisplayRecord> {
      const promises = displayFields.map(async (field) => {
        let fieldValue

        try {
          const isArcadeField = (record?.dataSource as ArcGISQueriableDataSource)?.isArcadeField?.(field.jimuName)

          if (isArcadeField) {
            fieldValue = await (record as FeatureDataRecord).resolveArcadeFieldValue?.(field.jimuName)
          } else {
            fieldValue = record.getFormattedFieldValue(field.jimuName, intl) as any
          }
        } catch (err) {
          fieldValue = null
          console.error('Error getting display value for field:', field, err)
        }

        return fieldValue
      })

      let valueData = await Promise.all(promises)
      valueData = valueData.filter(fieldValue => (fieldValue || fieldValue === 0))

      const displayRecord: DisplayRecord = {
        value: valueData,
        configId: configId,
        outputDsId: dsId,
        dsId: dsId,
        recordId: record?.getId(),
        isGeocodeRecords: isGeocodeRecords,
        layerDsIdActuallyUsed: layerDsIdActuallyUsed,
        localDsId: localDsId,
        zoomScale: zoomScale
      }

      return displayRecord
    }

    if (records?.length > 0) {
      const promises = records.map(async (record) => {
        const displayRecord = await getDisplayRecord(record)
        return displayRecord
      })

      displayRecordList = await Promise.all(promises)
    }

    if (!displayRecordList) {
      displayRecordList = []
    }

    return displayRecordList
  }

  const initFirstRecord = (displayRecords: DisplayRecord[]) => {
    displayRecords.forEach(displayItem => {
      if (!checkIsValidRecordId(firstRecord.current?.recordId) && checkIsValidRecordId(displayItem.recordId)) {
        firstRecord.current = displayItem
      }
    })
  }

  const checkIsValidRecordId = (recordId: string | number) => {
    return recordId === 0 || !!recordId
  }

  /**
   * Get key of record item element
  */
  const getItemKey = (configId: string, recordId: string | number) => {
    return `${configId}_${recordId}`
  }

  /**
   * Auto select first result
  */
  const autoSelectFirstRecord = React.useCallback(() => {
    const isAllDsLoaded = checkIsAllRecordLoadedWithDsStatus(serviceList?.asMutable({ deep: true }), dsStatus)
    if (!config?.isAutoSelectFirstResult || !checkIsValidRecordId(firstRecord.current?.recordId) || isHasAutoSelectFirstRecordRef.current || !isAllDsLoaded) return
    const { configId, recordId, outputDsId, zoomScale } = firstRecord.current
    const firstRecordKey = getItemKey(configId, recordId)
    onSelectRecord({
      isActive: false,
      key: firstRecordKey,
      recordId: recordId,
      dsId: outputDsId,
      configId: configId,
      zoomScale: zoomScale
    })
    isHasAutoSelectFirstRecordRef.current = true
  }, [config, onSelectRecord, serviceList, dsStatus])

  const onShowResultButtonClick = () => {
    getOffset(searchResultStyle, !isShowResultList, isNoResult)
    if (isShowResultList) {
      setResultFirstItem(searchResultsButtonRef.current)
    }
    setIsShowResultList(!isShowResultList)
    isShowResultListRef.current = !isShowResultList
  }

  const checkIsNoResult = React.useCallback((displayRecord: IMDisplayRecordData) => {
    let recordLength = 0
    for (const configId in displayRecord) {
      const length = displayRecord?.[configId]?.length || 0
      recordLength += length
    }
    const serviceLength = getJsonLength(serviceList)
    if (serviceLength === 0) {
      setIsNoResult(true)
    } else {
      setIsNoResult(recordLength === 0 && isDataLoaded.current)
    }
  }, [serviceList])

  const toggleResultListPopper = React.useCallback((e) => {
    if (isShowResultListRef.current) {
      setIsShowResultList(false)
      isShowResultListRef.current = false
      setResultFirstItem(searchResultsButtonRef.current)
    }
  }, [setResultFirstItem])

  const getPopperConClass = (): string => {
    if (searchResultStyle !== SearchResultStyle.Compact || isNoResult) {
      return ''
    }
    if (isShowResultList) {
      return 'result-list-con-compact-open'
    } else {
      return 'result-list-con-compact-close'
    }
  }

  const getOffset = (searchResultStyle: SearchResultStyle, isShowResultList: boolean, isNoResult: boolean) => {
    let newOffset
    if (searchResultStyle === SearchResultStyle.Compact) {
      if (!isShowResultList && !isNoResult) {
        const left = (reference?.current?.clientWidth / 2 - 15) || 0
        newOffset = isRTL ? [-left, 0] : [left, 0]
      } else {
        newOffset = DEFAULT_POPPER_OFFSET
      }
    } else {
      newOffset = DEFAULT_POPPER_OFFSET
    }
    setOffset(newOffset)
  }

  const differentWithReferenceWidth = (isShowResultList, searchResultStyle, searchText) => {
    return searchResultStyle === SearchResultStyle.Compact && !isShowResultList && !!searchText
  }

  const handleFocusChange = React.useCallback((e) => {
    const isInPopper = resultListContentRef?.current?.contains(e.target)
    const isInput = e.target.tagName.toLowerCase() === 'input'
    const isClearButton = e.target.classList.contains('text-input-clear') && e.target.parentElement === searchInputRef?.current?.parentElement
    const isHideResultList = !(isInPopper || isInput || isClearButton)
    if (isHideResultList) {
      toggleResultListPopper(e)
    }
  }, [searchInputRef, toggleResultListPopper])

  useEffect(() => {
    document.addEventListener('focusin', handleFocusChange)
    return () => {
      document.removeEventListener('focusin', handleFocusChange)
    }
  }, [handleFocusChange])

  useEffect(() => {
    checkIsNoResult(displayRecord)
  }, [displayRecord, checkIsNoResult])

  useEffect(() => {
    if (displayRecord && isShowResultList) {
      setPopperVersion(Math.random())
    }
  }, [displayRecord, isShowResultList])

  return (
    <div role='group' aria-label={nls('searchResults')}>
      <ResultPopper
        isOpen={isOpenResultPopper && isDataLoaded.current}
        isFocusWithSearchInput
        autoFocus={false}
        reference={reference}
        searchInputRef={searchInputRef}
        toggle={toggleResultListPopper}
        id={id}
        offset={offset}
        version={popperVersion}
        differentWithReferenceWidth={differentWithReferenceWidth(isShowResultList, searchResultStyle, searchText)}
        className={classNames('result-list-con', getPopperConClass())}
        ariaLabel={nls('searchResults')}
      >
        <div className='result-list-content' ref={resultListContentRef} role='listbox'>
          {!openUtilityErrRemindInResult && <div ref={dropdownMenuRef}>
            {isNoResult && <button role='button' className='text-center' disabled={true} aria-label={nls('noResult', { searchText: searchText })} title={nls('noResult', { searchText: searchText })}>
              <span aria-label={nls('noResult', { searchText: searchText })} role='warning'>{nls('noResult', { searchText: searchText })}</span>
            </button>}
            {isNoResult && <button
              aria-live='assertive'
              className='sr-only'
            >
              {nls('noResult', { searchText: searchText })}
            </button>}

            {!isNoResult && <div>
              {searchResultStyle === SearchResultStyle.Classic && <div>
                <button role='button' ref={searchResultsButtonRef} className='d-flex align-items-center show-result-button jimu-outline-inside' onClick={onShowResultButtonClick} aria-label={nls('searchResults')} title={nls('searchResults')}>
                  <div className='flex-grow-1 font-weight-bold'>{nls('searchResults')}</div>
                  {(!isShowResultList && !!searchText) ? <DownOutlined/> : <UpOutlined/>}
                </button>
                {isShowResultList && <DropdownItem divider={true} />}
              </div>}

              {isShowResultList && <div>
                {renderResultList()}
              </div>}

              {searchResultStyle === SearchResultStyle.Compact && <div className='show-result-button-style2-con'>
                {isShowResultList && <DropdownItem divider={true} />}
                <button
                  role='button'
                  className='d-flex align-items-center show-result-button show-result-button-style2 jimu-outline-inside'
                  onClick={onShowResultButtonClick}
                  title={nls('searchResults')}
                  aria-label={nls('searchResults')}
                >
                  {(!isShowResultList && !!searchText) ? <DownOutlined size={10}/> : <UpOutlined size={10}/>}
                </button>
            </div>}
            </div>}
          </div>}
          {openUtilityErrRemindInResult && <UtilityErrorRemind open={openUtilityErrRemindInResult} serviceList={serviceList} toggleUtilityErrorRemind={toggleResultUtilityError}/>}
        </div>
      </ResultPopper>
    </div>
  )
}
export default ResultList
