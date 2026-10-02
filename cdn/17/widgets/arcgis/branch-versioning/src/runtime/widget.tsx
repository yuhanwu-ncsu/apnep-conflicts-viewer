/** @jsx jsx */
import { type AllWidgetProps, jsx } from 'jimu-core'
import type { IMConfig } from '../config'
import { BranchVersioningProvider } from './context/state/branch-versioning-context'
import { BranchVersioning } from './components/branch-versioning'

export type LrsControllerWidgetProps = AllWidgetProps<IMConfig>

const LrsControllerWidget = (props: AllWidgetProps<IMConfig>) => {
  return (
    <BranchVersioningProvider>
      <BranchVersioning {...props} />
    </BranchVersioningProvider>
  )
}

export default LrsControllerWidget
