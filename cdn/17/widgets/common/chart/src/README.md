## How to add a new chart type

** Some terms **
- serial chart: Bar(column) and line chart
- xy chart: Chart with XY axis
- Setting Sections: Several parts of the chart that can be configured
  - Data: Data-related configuration (how to query data)
  - Series - Change the stacking type, symbols, and labels of the data series.
  - Slices(series for pie) - Customize the properties of the pie slices
  - Axes - Customize the properties of the axis for xy chart
  - General — Specify general properties of the chart
    - Title
    - Subtitle
    - Orientation(serial chart only)
    - Legend
    - Start angle (pie only)
    - Inner radius (pie only)
  - Appearance — Customize the chart appearance
    - Background
    - Text elements
    - Symbol elements
  - Tools — Add runtime tools so end users can experiment and observe chart patterns
    - Selection & zoom

### Setting

- config.ts(src/config.ts)
  - Add a new type to `ChartType`
  - Add a new type to `TemplateType`
- template
   - Add a new template json to `src/setting/template/`
   - Add the template info to `src/setting/settings/chart-type-selector/templates/buildin-templates.tsx`
     - Add related icon and thumbnail to `assets` and use them in `templates/buildin-templates.tsx` and `templates/utils.ts`
     - Enhance the method `getTemplateTranslation` and `getTemplateThumbnail` in `templates/utils.ts`
   - Enhance the method in `src/setting/settings/chart-type-selector/utils/` to complete the template information
 - utils
   - Add default config related methods(e.g `getDefaultBarChartSeries`) in `src/utils/default/index.ts`
   - Check `isValidQuery` in  `src/utils/common/series.ts`, which used to check whether the query in chart data source is valid.

- setting
  - some common methods
    -  Enhance the method `createDefaultSerie` in `src/utils/common/series.ts`
  - Implement the setting component of the new added type in file `src/setting/settings/chart/web-chart/xxx/index.tsx`
  - Add the required sections for it, you can select a section that can be used directly from the `common-sections`.
    If there is no section that can be used directly, you can add a new section in the directory of this new type
  - Add the new setting component to `src/setting/settings/chart/web-chart/index.tsx`

- tools
  - Implement the tools of the corresponding chart type under the `src/setting/settings/chart/universal/tools` directory

### Runtime
  - placeholder
    - Extend the function `getTemplateType` in the `src/utils/common/series.ts` file so that it can handle the newly added chart type.
    - Add a new placeholder svg to `src/runtime/assets/icons/` which will be used in the `src/runtime/chart/components/placeholder.tsx` file

  - runtime
    - Check `useSelection` in `src/runtime/chart/web-chart/utils/use-selection.ts`
    - Implement `createRecordsFromChartData` method a to convert chart data into records from `src/runtime/chart/web-chart/utils/index.ts`
    - Check `normalizeAxes` in `src/runtime/chart/web-chart/utils/normalize-axes.ts`
    - Check `normalizeSeries` in `src/runtime/chart/web-chart/utils/normalize-series.ts`

  - tools
    - Implement the tools of the corresponding chart type under the `src/runtime/chart/tools` directory

### Output data source
- Under directory `src/utils/common/schema`, there is a method called `getDataSourceSchema`(or `getDataSourceSchemaForSplitBy`), which will be called in file `src/runtime/chart/data-source/index.tsx` when related config changes. Ensure that this method can correctly handle the newly added chart type

## How is the style of a series generated:

- If there is a corresponding series in the template, use the styles in the template（get by index）
- If it is not in the template, use the first series of the template to get the necessary series information(e.g, type), and randomly generate styles for it

## The explanation of split by field(This process is handled internally by charts-components):

If you have such a chart, the category field is `city`, the number field is `pop`, now the chart is statistic population by city, the series is like this:

```js
[{
  x: 'city',
  y: 'pop',
   query: {
      groupByFieldsForStatistics: ['city']
      outStatistics: [{
        statisticType: 'sum',
        onStatisticField: 'pop',
        outStatisticFieldName: 'pop'
      }]
}]
```

On the basis of the existing chart, if you want to analyze the population by `gender`, you can choose a split by field: `gender`, now the chart is statistic population by city, each city will be displayed as two bars, men and women, the series is like this:

```
[{
  x: 'city',
  y: 'pop-man',
  query: {
    groupByFieldsForStatistics: ['city']
    outStatistics: [{
      statisticType: 'sum',
      onStatisticField: 'pop',
      outStatisticFieldName: 'pop-man'
    }],
    where: 'gender=\'man\''
  }
},{
  x: 'city',
  y: 'pop-woman',
  query: {
    groupByFieldsForStatistics: ['city']
    outStatistics: [{
      statisticType: 'sum',
      onStatisticField: 'pop',
      outStatisticFieldName: 'pop-woman'
    }],
    where: 'gender=\'woman\''
  }
}]
```

However, in the actual request data, we will merge multiple series of queries into one query to send, query after merging:

```
query: {
    groupByFieldsForStatistics: ['city', 'gender']
    outStatistics: [{
      statisticType: 'sum',
      onStatisticField: 'pop',
      outStatisticFieldName: 'pop_0'
    }]
  }
```

So the data returned might look like this:

```
[{
  city: 'city_a',
  gender: 'man',
  pop_0: 1000
},{
  city: 'city_b',
  gender: 'man',
  pop_0: 800
},{
  city: 'city_a',
  gender: 'woman',
  pop_0: 800
},{
  city: 'city_b',
  gender: 'woman',
  pop_0: 1000
}]
```

This data is not recognized by the current `series`, So we need to convert it into data that series can recognize. We need to match `series[i].y` with the `gender` of the current `data`. If we can match it, change the pop_0 in this data to `series[i].y`(pop_man).

The converted data is like this:

```
[{
  city: 'city_a',
  pop_man: 1000
  pop_woman: 800
},{
  city: 'city_b',
  pop_man: 800
  pop_woman: 1000
}]
```