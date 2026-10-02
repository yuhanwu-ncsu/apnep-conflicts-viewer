import { React, css, hooks, type DataRecord, type FeatureDataRecord } from 'jimu-core'
import { isSameRecord } from './utils'

interface SymbolWidgetProps {
  record: DataRecord
  toolTip: string
  altText: string
  symbolScale: number
}

const getStyle = (symbolScale: number) => {
  return css`
    .image-symbol {
      display: grid;
      place-items: center;
      svg, img {
        transform: scale(${symbolScale});
      }
    }
  `
}

const SymbolWidget = React.memo((props: SymbolWidgetProps) => {
  const { record, toolTip, altText, symbolScale = 1 } = props
  const [symbolElement, setSymbolElement] = React.useState<HTMLElement>(null)

  const prevRecord = hooks.usePrevious<DataRecord>(null)
  const requestIdRef = React.useRef(0)
  React.useEffect(() => {
    const sameRecord = isSameRecord(record, prevRecord)
    if (sameRecord) return

    const dataRecord = record as FeatureDataRecord
    if (!dataRecord?.fetchSymbolPreviewHTML) return
    requestIdRef.current += 1
    const currentRequestId = requestIdRef.current
    setSymbolElement(null)
    dataRecord.fetchSymbolPreviewHTML().then((result) => {
      if (requestIdRef.current === currentRequestId) {
        setSymbolElement(result)
      }
    }).catch((err) => {
      setSymbolElement(null)
      console.error('Error fetching symbol element:', err)
    })
  }, [prevRecord, record])

  const symbolElementRef = React.useRef<HTMLDivElement>(null)
  React.useEffect(() => {
    const svgOrImg = ['IMG', 'SVG'].includes(symbolElement?.tagName) ? symbolElement : symbolElement?.querySelector?.('svg,img')
    if (svgOrImg) {
      svgOrImg.setAttribute('alt', altText)
    }
    if (symbolElementRef.current) {
      symbolElementRef.current.innerHTML = ''
      symbolElement && symbolElementRef.current.appendChild(symbolElement.cloneNode(true))
    }
  }, [altText, symbolElement])

  return (
    <div className='w-100 h-100' css={getStyle(symbolScale)}>
      <div ref={symbolElementRef} className='w-100 h-100 image-symbol' title={toolTip} />
    </div>
  )
})

export default SymbolWidget
