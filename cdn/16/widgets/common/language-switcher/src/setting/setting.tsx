import { React, css, classNames, type IconResult, getAppStore, jimuHistory } from 'jimu-core'
import InlineSVG from 'react-inlinesvg'
import { type AllWidgetSettingProps, getAppConfigAction } from 'jimu-for-builder'
import { SettingSection, SettingRow } from 'jimu-ui/advanced/setting-components'
import { Button, defaultMessages as jimuUIDefaultMessages } from 'jimu-ui'
import type { IMConfig } from '../config'
import defaultMessages from './translations/default'
import { IconPicker } from 'jimu-ui/advanced/resource-selector'
import dropdownIcon from './dropdown.svg'
import icon from './icon.svg'
import widgetIcon from '../../icon.svg'

const customIcons = [
  {
    svg: widgetIcon,
    properties: {
      filename: 'language-switcher',
      originalName: 'language-switcher'
    }
  }
]

const messages = Object.assign(
  {},
  defaultMessages,
  jimuUIDefaultMessages
)

const titleStyle = css`label {font-weight: 600 !important; font-size: 0.875rem !important;}`

const style = css`
  width: 180px;
  .style-group {
    display: flex;
    flex-direction: column;
    align-items: center;
    .style-label {
      margin-top: 0.5rem;
    }
  }
  .style-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    background: var(--ref-palette-neutral-300);
    border: none;
    width: 108px;
    height: 48px;
    border-radius: 0;

    &.selected {
      outline: 2px solid var(--sys-color-primary-light);
    }
    &:hover {
      background: var(--ref-palette-neutral-300);
    }
  }
`

export default class Setting extends React.PureComponent<AllWidgetSettingProps<IMConfig>> {
  handleConfigChange = (prop: string, value: any): void => {
    const appConfigAction = getAppConfigAction()
    if (prop === 'icon') {
      if (value?.svg) {
        appConfigAction.editWidgetProperty(this.props.id, 'config.useIcon', true)
          .editWidgetProperty(this.props.id, 'config.icon', value).exec()
      } else {
        appConfigAction.editWidgetProperty(this.props.id, 'config.useIcon', false)
          .editWidgetProperty(this.props.id, 'config.icon', null).exec()
      }
    } else {
      appConfigAction.editWidgetProperty(this.props.id, `config.${prop}`, value).exec()
    }
  }

  formatMessage = (id: string): string => {
    return this.props.intl.formatMessage({ id, defaultMessage: messages[id] })
  }

  formatActionMessage = () => {
    return this.props.intl.formatMessage({
      id: 'configTip',
      defaultMessage: messages.configTip
    }, {
      bold: (str) => {
        return <button
          aria-describedby={`${this.props.id}_actionTip`}
          css={css`text-decoration: underline; background: transparent; border: none; cursor: pointer; color: var(--sys-color-action-link)`}
          onClick={() => {
            jimuHistory.changeQueryObject({ views: 'app-setting' })
          }}
          >{str}</button>
      }
    })
  }

  render (): React.JSX.Element {
    const { config } = this.props
    const isRTL = getAppStore().getState().appStateInBuilder.appContext?.isRTL ?? false
    return (
      <div className='locale-switcher-setting'>
        <SettingSection>
          <div id={`${this.props.id}_actionTip`}>
            {this.formatActionMessage()}
          </div>
        </SettingSection>
        <SettingSection role='radiogroup' aria-label={this.formatMessage('style')}>
          <SettingRow css={titleStyle} flow='wrap' label={this.formatMessage('style')}>
            <div className='d-flex justify-content-between w-100' css={style}>
              <div className='style-group'>
                <Button
                  className={classNames('style-btn', { selected: config.type === 'dropdown' })}
                  onClick={() => { this.handleConfigChange('type', 'dropdown') }}
                  aria-label={this.formatMessage('dropdown')}
                  aria-checked={config.type === 'dropdown'}
                  role='radio'
                  icon
                  type='tertiary'
                  disableHoverEffect={true}
                  disableRipple={true}
                >
                  <InlineSVG width={108} height={48} src={dropdownIcon} css={css`transform: rotateY(${isRTL ? '180deg' : 0})`}/>
                </Button>
                <label className='style-label label2'>{this.formatMessage('dropdown')}</label>
              </div>
              <div className='style-group'>
                <Button
                  className={classNames('style-btn', { selected: config.type === 'button' })}
                  onClick={() => { this.handleConfigChange('type', 'button') }}
                  aria-label={this.formatMessage('iconMode')}
                  aria-checked={config.type === 'button'}
                  role='radio'
                  icon
                  type='tertiary'
                  disableHoverEffect={true}
                  disableRipple={true}
                >
                  <InlineSVG width={108} height={48} src={icon}/>
                </Button>
                <label className='style-label label2'>{this.formatMessage('iconMode')}</label>
              </div>
            </div>
          </SettingRow>
        </SettingSection>
        <SettingSection role='group' aria-label={this.formatMessage('icon')}>
          <SettingRow
            css={titleStyle}
            label={this.formatMessage('icon')}
          >
            <IconPicker
              icon={config.useIcon ? (config.icon as IconResult || customIcons[0]) : undefined}
              onChange={(icon) => { this.handleConfigChange('icon', icon) }}
              configurableOption='all'
              customIcons={customIcons}
              setButtonUseColor={false}
            />
          </SettingRow>
        </SettingSection>
      </div>
    )
  }
}

