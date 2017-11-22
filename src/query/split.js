import camelCase from 'lodash.camelcase'

import { afterConstants } from './after'
import { joinConstants } from './join'

export const camelCasesByConstant = {}
afterConstants.concat(joinConstants).forEach(constant => {
  camelCasesByConstant[constant] = camelCase(constant)
})

export function splitQuery (query) {
  const after = {}
  const joiner = {}
  const look = {}
  query && Object.keys(query)
    .forEach(key => {
      let value = query[key]
      if (afterConstants.includes(key)) {
        after[camelCasesByConstant[key]] = value
      } else if (joinConstants.includes(key)) {
        joiner[camelCasesByConstant[key]] = value
      } else {
        look[key] = value
      }
    })
  return { after, joiner, look }
}
