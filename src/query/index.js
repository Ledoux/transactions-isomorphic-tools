import { getDemand, getQueryFromDemand } from './demand'
import { AND, ALSO } from '../constants'

export * from './demand'
export * from './parser'
export * from './request'
export * from './url'

export function getQuery (config = {}) {
  const { demand, demandTemplate, template, value } = config
  if (template) {
    const alsoChunks = value.split(ALSO)
    if (alsoChunks.length > 1) {
      const andQueriesString = String(alsoChunks.map((valueString) =>
        template.replace(/\{\{value\}\}/g, valueString)))
      return JSON.parse(`{ ${AND}: ${andQueriesString} }`)
    } else {
      const queryString = template.replace(/\{\{value\}\}/g, value)
      return JSON.parse(queryString)
    }
  } else if (demandTemplate) {
    // demand
    const demand = getDemand({ template: demandTemplate, value })
    // query
    return getQueryFromDemand(demand)
  }
  return value
}
