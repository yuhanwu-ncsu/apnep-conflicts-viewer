import {
  React, type AttachmentInfo, type IMState, useIntl, ReactRedux, type ImmutableObject,
  type DataRecord, type FeatureDataRecord, hooks
} from 'jimu-core'
import { ImageGallery } from './image-gallery'
import type { FunctionConfig } from '../../config'
import { isSameRecord } from './utils'


interface AttachmentWidgetProps {
  record: DataRecord
  toolTip: string
  altText: string
  autoWidth: boolean
  autoHeight: boolean
  functionConfig: ImmutableObject<FunctionConfig>
  onChange?: (attachmentInfos: AttachmentInfo[]) => void
}

const attachmentTypes = ['image/png', 'image/jpeg', 'image/gif', 'image/bmp', 'image/svg+xml', 'image/webp']

const AttachmentWidget = React.memo((props: AttachmentWidgetProps) => {
  const { record, toolTip, altText, autoWidth, autoHeight, functionConfig = {} as ImmutableObject<FunctionConfig>, onChange } = props
  const { imageFillMode, imageParam, altTextWithAttachmentName, toolTipWithAttachmentName } = functionConfig

  const [attachmentInfos, setAttachmentInfos] = React.useState<AttachmentInfo[]>([])

  const intl = useIntl()

  const browserSizeMode = ReactRedux.useSelector((state: IMState) => state.browserSizeMode)

  const prevRecord = hooks.usePrevious(record)

  const requestIdRef = React.useRef(0)

  React.useEffect(() => {
    const sameRecord = isSameRecord(record, prevRecord)
    if (sameRecord) return

    setAttachmentInfos([])
    onChange && onChange([])
    const currentRequestId = ++requestIdRef.current
    const resolveExpressions = async () => {
      const dataRecord = record as FeatureDataRecord
      let attachmentInfos: AttachmentInfo[]
      if (dataRecord && dataRecord.attachmentInfos) {
        attachmentInfos = dataRecord.attachmentInfos.filter(info => attachmentTypes.includes(info.contentType))
      } else if (dataRecord && dataRecord.queryAttachments) {
        try {
          attachmentInfos = await dataRecord.queryAttachments(attachmentTypes)
        } catch (err) {
          console.error('Error querying attachments:', err)
        }
      } else {
        attachmentInfos = []
      }
      if (requestIdRef.current === currentRequestId) {
        setAttachmentInfos(attachmentInfos)
        onChange && onChange(attachmentInfos)
      }
    }
    resolveExpressions()
  }, [onChange, prevRecord, record])

  return <React.Fragment>
    <div className='w-100 h-100'>
      <ImageGallery
        sources={attachmentInfos}
        cropParam={imageParam?.cropParam}
        imageFillMode={imageFillMode}
        isAutoHeight={autoHeight}
        isAutoWidth={autoWidth}
        title={toolTip} alt={altText}
        altTextWithAttachmentName={altTextWithAttachmentName}
        toolTipWithAttachmentName={toolTipWithAttachmentName}
        intl={intl}
        browserSizeMode={browserSizeMode}
      />
    </div>
  </React.Fragment>
})

export default AttachmentWidget
