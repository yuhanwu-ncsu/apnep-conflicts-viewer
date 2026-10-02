import { isCorruptedShapefileAnalyzeResponse, shouldStopUploadForCorruptedShapefile } from '../src/runtime/components/add-data-popper/shapefile-analyze-utils'

describe('add-data shapefile analyze utils', () => {
  it('flags analyze response as corrupted when extent contains sentinel-like value', () => {
    const analyzeData = {
      publishParameters: {
        layers: [{
          extent: {
            xmin: 428099.39379273757,
            ymin: 1116287.0656990809,
            xmax: 1.7976931348623154E+302,
            ymax: 1.7976931348623154E+302
          }
        }]
      }
    }

    expect(isCorruptedShapefileAnalyzeResponse(analyzeData)).toBe(true)
  })

  it('does not flag analyze response when extents are valid', () => {
    const analyzeData = {
      publishParameters: {
        layers: [{
          extent: {
            xmin: 428388.39390359941,
            ymin: 1116384.0563448656,
            xmax: 428537.00469538331,
            ymax: 1116430.1686807207
          }
        }]
      }
    }

    expect(isCorruptedShapefileAnalyzeResponse(analyzeData)).toBe(false)
  })

  it('applies corruption check only for shapefile uploads', () => {
    const corruptedAnalyzeData = {
      publishParameters: {
        layers: [{
          extent: {
            xmin: 0,
            ymin: 0,
            xmax: 1.7976931348623154E+302,
            ymax: 10
          }
        }]
      }
    }

    expect(shouldStopUploadForCorruptedShapefile(true, corruptedAnalyzeData)).toBe(true)
    expect(shouldStopUploadForCorruptedShapefile(false, corruptedAnalyzeData)).toBe(false)
  })
})
