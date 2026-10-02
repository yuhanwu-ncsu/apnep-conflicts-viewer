import { screen } from '@testing-library/react'
import { withStoreThemeIntlRender } from 'jimu-for-test'
import EditorGeneral from '../src/setting/components/editor-general'

const render = withStoreThemeIntlRender(false)

describe('EditorGeneral', () => {
  const baseConfig: any = {
    tooltip: false,
    templateFilter: true,
    relatedRecords: true,
    liveDataEditing: true,
    initialReshapeMode: true,
    segmentLabel: true,
    batchEditing: true,
    advancedEditingTools: true,
    splitButton: true,
    mergeButton: true,
    copyPaste: true
  }

  const onPropertyChange = jest.fn()
  const onMultiplePropertyChange = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should show advanced editing options for 2d geometry editor', () => {
    render(
      <EditorGeneral
        config={baseConfig}
        isActiveScene={false}
        onPropertyChange={onPropertyChange}
        onMultiplePropertyChange={onMultiplePropertyChange}
      />
    )

    expect(screen.getByText('Advanced editing tools')).not.toBeNull()
    expect(screen.getByText('Segment label')).not.toBeNull()
    expect(screen.getByText('Split')).not.toBeNull()
    expect(screen.getByText('Merge')).not.toBeNull()
  })

  it('should support segment label setting in 2d map', () => {
    render(
      <EditorGeneral
        config={baseConfig}
        isActiveScene={false}
        onPropertyChange={onPropertyChange}
        onMultiplePropertyChange={onMultiplePropertyChange}
      />
    )

    expect(screen.getByText('Segment label')).not.toBeNull()
    expect(screen.getAllByText('Enable by default').length).toBeGreaterThan(0)
  })

  it('should hide merge toggle when batch editing is disabled', () => {
    render(
      <EditorGeneral
        config={{ ...baseConfig, batchEditing: false }}
        isActiveScene={false}
        onPropertyChange={onPropertyChange}
        onMultiplePropertyChange={onMultiplePropertyChange}
      />
    )

    expect(screen.getByText('Split')).not.toBeNull()
    expect(screen.queryByText('Merge')).toBeNull()
  })

  it('should hide split and merge toggles when advanced editing tools are disabled', () => {
    render(
      <EditorGeneral
        config={{ ...baseConfig, advancedEditingTools: false }}
        isActiveScene={false}
        onPropertyChange={onPropertyChange}
        onMultiplePropertyChange={onMultiplePropertyChange}
      />
    )

    expect(screen.getByText('Advanced editing tools')).not.toBeNull()
    expect(screen.queryByText('Split')).toBeNull()
    expect(screen.queryByText('Merge')).toBeNull()
  })

  it('should use scene-specific controls instead of advanced editing tools in 3d', () => {
    render(
      <EditorGeneral
        config={baseConfig}
        isActiveScene={true}
        onPropertyChange={onPropertyChange}
        onMultiplePropertyChange={onMultiplePropertyChange}
      />
    )

    expect(screen.getByText('Segment label')).not.toBeNull()
    expect(screen.queryByText('Advanced editing tools')).toBeNull()
  })
})