import camelCase from 'lodash.camelcase'

import { afterConstants } from './after'
import { joinConstants } from './join'
import { MODE } from '../constants'

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
      } else if (key !== MODE) {
        // don't set MODE
        look[key] = value
      }
    })
  return { after, joiner, look }
}
