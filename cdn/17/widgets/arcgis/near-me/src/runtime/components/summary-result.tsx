/** @jsx jsx */
import { React, type Expression, Immutable, jsx, utils as coreUtils, type IMThemeVariables, type UseDataSource, ExpressionResolverComponent, type QueriableDataSource, DataSourceManager, type FeatureLayerQueryParams } from 'jimu-core'
import { richTextUtils } from 'jimu-ui'
import type { SummaryAttributes, SummaryFieldsInfo, SumOfAreaLengthParam } from '../../config'
import SummaryFieldCard from './summary-field-card'
import { colorUtils } from 'jimu-theme'
import { CommonSummaryFieldValue } from '../../setting/constants'
import type Geometry from 'esri/geometry/Geometry'

interface Props {
  widgetId: string
  theme: IMThemeVariables
  useDataSource: UseDataSource
  summaryFieldInfos: SummaryFieldsInfo[]
  sumOfAreaOrLengthValue: string
  onSummaryFieldsResolved: (resolvedValues: SummaryAttributes) => void
  singleFieldColor?: string | null
  analysisId: string
  bufferGeom?: Geometry
}

interface State {
  formattedExpression: string[] | null
  summaryFieldCards: React.JSX.Element[]
}

export default class SummaryResult extends React.PureComponent<Props, State> {
  private resolvedSummaryValues: string[]
  private localDs: QueriableDataSource
  private resultObj: any
  constructor (props) {
    super(props)
    this.resolvedSummaryValues = []
    this.localDs = null
    this.resultObj = {}
    this.state = {
      formattedExpression: [],
      summaryFieldCards: []
    }
  }

  /**
   * On component mount update the summary value and summary text value
   */
  componentDidMount = () => {
    if (this.props.useDataSource?.dataSourceId) {
      const dsManager = DataSourceManager.getInstance()
      const ds = dsManager.getDataSource(this.props.useDataSource.dataSourceId)
      const localDsId = dsManager.getLocalDataSourceId(ds.id, this.props.analysisId)
      this.localDs = dsManager.getDataSource(localDsId) as QueriableDataSource
      if (!this.localDs) {
        this.localDs = dsManager.createLocalDataSource(ds, this.props.analysisId) as QueriableDataSource
      }
      const query: FeatureLayerQueryParams = {}
      query.where = '1=1'
      query.outFields = this.props.useDataSource.fields ?? ['*']
      if (this.props.bufferGeom) {
        query.geometry = this.props.bufferGeom.toJSON()
      }
      this.localDs.updateQueryParams(query, this.props.widgetId)
      this.updateSummaryValue()
    }
  }

  /**
   * Check the current config property or runtime property changed in live view
   * @param prevProps previous property
   */
  componentDidUpdate = (prevProps) => {
    //check if summaryDisplayValue is changed
    if (prevProps.sumOfAreaOrLengthValue !== this.props.sumOfAreaOrLengthValue) {
      this.updateSummaryValue()
    }
  }

  /**
   * Update summary value and get the formatted expression value depending on the config values
   */
  updateSummaryValue = () => {
    if (this.props.useDataSource && this.props.summaryFieldInfos) {
      this.resolvedSummaryValues = []
      const formattedExp: string[] = []
      this.props.summaryFieldInfos.forEach((eachFieldInfo) => {
        let formattedExpression: string
        let expression: SumOfAreaLengthParam & Expression = eachFieldInfo.summaryFieldInfo
        // Avoid mutating the original expression.parts (which may be immutable)
        if (expression.parts) {
          // Create a new array with updated dataSourceId
          const newParts = expression.parts.map((exp) => {
            if (exp.dataSourceId) {
              return { ...exp, dataSourceId: this.localDs.id }
            }
            return exp
          })
          // Create a new expression object with updated parts
          expression = { ...expression, parts: newParts }
        }
        if (Object.prototype.hasOwnProperty.call(eachFieldInfo.summaryFieldInfo, 'summaryBy')) {
          formattedExpression = this.props.sumOfAreaOrLengthValue?.toString()
          formattedExp.push(formattedExpression)
          this.resolvedSummaryValues.push(formattedExpression)
          if (this.props.summaryFieldInfos.length === 1) {
            this.onTextExpResolveChange({})
          }
        } else {
          formattedExpression = this.getExpressionString(expression)
          formattedExp.push(formattedExpression)
        }
      })
      this.setState({
        formattedExpression: formattedExp
      })
    }
  }

  /**
   * get the formatted expression string value
   * @param expression configured expression
   * @returns formatted expression
   */
  getExpressionString = (expression: Expression): string => {
    try {
      let string = JSON.stringify(expression)
      string = encodeURIComponent(string)

      const { parts } = expression
      let functionDsid = ''
      let multiExpDom = ''

      parts?.forEach(part => {
        const { dataSourceId: dsid } = part
        if (dsid) functionDsid = dsid
        if (functionDsid !== '') return false
      })

      const uniqueid = coreUtils.getUUID()
      this.resolvedSummaryValues.push(uniqueid)
      const expDom = document && document.createElement('exp')
      expDom.setAttribute('data-uniqueid', uniqueid)
      expDom.setAttribute('data-dsid', functionDsid)
      expDom.setAttribute('data-expression', string)
      expDom.innerHTML = expression.name
      multiExpDom += expDom.outerHTML
      return multiExpDom
    } catch (error) {
      console.error(error)
      return ''
    }
  }

  /**
   * On expression resolve create the summary field cards to be displayed in widget panel
   * @param resultObj expression result obj
   */
  onTextExpResolveChange = (result) => {
    // get all the result of all configured summaries and then create a summary field card
    this.resolvedSummaryValues.forEach((key) => {
      if (!this.resultObj[key] && result[key]) {
        this.resultObj[key] = result[key]
      }
    })
    let resultsCount = this.resolvedSummaryValues.length
    const sumOfAreaOrLengthConfigured = this.props.summaryFieldInfos.find((summaryField) => {
      if (summaryField.summaryFieldInfo?.summaryBy === CommonSummaryFieldValue.SumOfIntersectedArea || summaryField.summaryFieldInfo?.summaryBy === CommonSummaryFieldValue.SumOfIntersectedLength) {
        return true
      } else {
        return false
      }
    })
    // In case of sum of area/length configured the result count will be less since sum of area/length will be calculated seperately
    if (sumOfAreaOrLengthConfigured) {
      resultsCount = resultsCount - 1
    }
    if (Object.keys(this.resultObj).length === resultsCount) {
      const resolvedSummaryValues = {}
      const fieldCards: React.JSX.Element[] = []
      this.resolvedSummaryValues.forEach((key, index) => {
        // The 'key' can be a pre-calculated value (e.g., for SumOfArea/Length) or a unique ID for an expression.
        let result = key
      //when resultObj is for expression we will get the object
      if (this.resultObj[key]) {
        //if the expression is resolved successfully then use its value else show the configured fieldLabel
        if (this.resultObj[key].isSuccessful) {
          result = this.resultObj[key].value
        } else {
          result = this.props.summaryFieldInfos[index].fieldLabel
        }
      }
      if (result !== undefined) {
        const summaryField = this.props.summaryFieldInfos[index]
        //create attributes for output ds
        resolvedSummaryValues[summaryField.fieldLabel.replace(/ /g, '')] = result
        //create summary card to be displayed in widget panel
        fieldCards.push(<SummaryFieldCard
          widgetId={this.props.widgetId}
          theme={this.props.theme}
          fieldLabel={summaryField.fieldLabel}
          fieldColor={colorUtils.parseThemeVariable(this.props.singleFieldColor ? this.props.singleFieldColor : summaryField.fieldColor, this.props.theme)}
          summaryDisplayValue={result}
          key={index}
        ></SummaryFieldCard>)
      }
    })
    this.setState({ summaryFieldCards: fieldCards })
    this.props.onSummaryFieldsResolved(resolvedSummaryValues)
    }
  }

  render () {
    if (!this.localDs) {
      return
    }
    const useDs = {
      dataSourceId: this.localDs.id,
      mainDataSourceId: this.localDs.getMainDataSource().id,
      rootDataSourceId: this.localDs.getRootDataSource().id
    }
    return (
      <React.Fragment>
        {useDs && (
          <React.Fragment>
            {this.state.summaryFieldCards.length === 0 &&
              this.state.formattedExpression?.map((formattedExpression, index) => (
                <ExpressionResolverComponent
                  key={index}
                  useDataSources={Immutable([useDs])}
                  expression={richTextUtils.getAllExpressions(formattedExpression)}
                  onChange={this.onTextExpResolveChange}
                  widgetId={this.props.widgetId}
                />
              ))}
            {this.state.summaryFieldCards.length > 0 && this.state.summaryFieldCards}
          </React.Fragment>
        )}
      </React.Fragment>
    )
  }
}
