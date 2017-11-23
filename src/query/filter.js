import get from 'lodash.get'
import values from 'lodash.values'

import { DOT,
  IN,
  JOIN,
  NOT_IN,
  OR
} from '../constants'
import { getFromDemandQuery } from './demand'
import { splitQuery } from './split'
import { constantTestsByName } from '../regexps'
const { inTest, joinTest } = constantTestsByName

export function getIsNotInAcceptedElement (element, key, value) {
  const elementArray = element[key]
  const subElementOrArray = value && value[NOT_IN]
  if (elementArray && subElementOrArray) {
    return elementArray && Array.isArray(subElementOrArray)
      ? subElementOrArray.every(subElement => !elementArray.includes(subElement))
      : !elementArray.includes(subElementOrArray)
  }
}

export function getIsInAcceptedElement (element, key, value) {
  const inMatch = key.match(inTest)
  const inKey = inMatch && inMatch[1]
  if (inKey) {
    return get(element, inKey).toLowerCase().includes(value)
  } else {
    const elementArray = element[key]
    const subElementOrArray = value && value[IN]
    if (elementArray && subElementOrArray) {
      return elementArray && Array.isArray(subElementOrArray)
        ? subElementOrArray.every(subElement => elementArray.includes(subElement))
        : elementArray.includes(subElementOrArray)
    }
  }
}

export function getIsJoinAcceptedElement (element, key, value, config) {
  // unpack
  const { getState, schema } = config
  // check
  const joinMatch = key.match(joinTest)
  const almostJoinKey = joinMatch && joinMatch[1]
  if (almostJoinKey) {
    const keys = Object.keys(value)
    const { itemsByKey, schemasByJoinKey } = schema
    const item = itemsByKey[almostJoinKey] || itemsByKey[`${almostJoinKey}ById`]
    const joinKey = item.key
    const joinVariable = element[joinKey]
    const joinCollectionName = schemasByJoinKey[joinKey].collectionName
    const collection = getState()[`${joinCollectionName}ById`]
    if (!Array.isArray(joinVariable)) {
      const joinElement = collection[joinVariable]
      return getIsSpecificAcceptedElement(joinElement, keys[0], value[keys[0]], config)
    } else {
      const joinElements = joinVariable.map(id => collection[id])
      return joinElements.some(joinElement =>
        getIsSpecificAcceptedElement(joinElement, keys[0], value[keys[0]], config))
    }
  }
}

export function getIsEqualAcceptedElement (element, key, value) {
  return get(element, key) === value
}

const getIsAcceptedElementSpecificMethods = [
  getIsNotInAcceptedElement,
  getIsInAcceptedElement,
  getIsEqualAcceptedElement,
  getIsJoinAcceptedElement
]

export function getIsSpecificAcceptedElement (...args) {
  return getIsAcceptedElementSpecificMethods.some(getIsAcceptedElementSpecificMethod =>
    getIsAcceptedElementSpecificMethod(...args))
}

export function getIsAcceptedElement (element, filteringKeys, filteringValues, config) {
  // unpack
  const { getState, schema } = config
  // AND CONDITION all must be fullfilled
  return filteringKeys.every((filteringKey, index) => {
    const filteringValue = filteringValues[index]
    if (filteringKey === OR) {
      // OR CONDITION one is enough
      return Object.keys(filteringValue).some(key => {
        // SPECIFICS
        return getIsSpecificAcceptedElement(element, key, filteringValue[key], config)
      })
    } else {
      // SPECIFICS
      return getIsSpecificAcceptedElement(element, filteringKey, filteringValue, config)
    }
  })
}

export function filterOrFind (elements, query, config = {}) {
  // unpack
  const { getState, schema } = config
  let isAfter = config.isAfter
  if (typeof config.isAfter === 'undefined') {
    isAfter = true
  }
  const methodName = config.methodName || 'filter'
  // check
  if (!query) {
    return []
  }
  if (!elements) {
    console.warn('There were no elements to filter here')
    return []
  }
  // id specific
  if (query.id) {
    // Put it into an array
    // because we want to return
    // always that type here
    const foundElement = elements.find(element => element.id === query.id)
    return methodName === 'filter'
      ? (foundElement && [foundElement]) || []
      : foundElement
  } else {
    // adapt
    const { after, join, look } = splitQuery(query)
    // unpack
    const filteringKeys = Object.keys(look)
      .filter(key => key !== 'id')
    const filteringValues = filteringKeys.map(key => look[key])
    // parser (can be array or element)
    let resultVariable = elements[methodName](element => {
      const isAcceptedElement = getIsAcceptedElement(element,
        filteringKeys, filteringValues, { getState, schema })
      return isAcceptedElement
    })
    // after
    if (methodName === 'filter' && isAfter) {
      const { sort, limit, skip } = after
      if (sort) {
        Object.keys(sort)
          .forEach(key => resultVariable.sort((element, nextElement) => {
              const isNextHigher = nextElement[key] > element[key]
              return sort[key] === 1
              // ascending
              ? (isNextHigher ? 1 : -1)
              // descending
              : (isNextHigher ? -1 : 1)
            }))
      }
      if (limit) {
        resultVariable = resultVariable.slice(0, limit)
      }
      if (skip) {
        resultVariable = resultVariable.slice(skip)
      }
    }
    // return
    return resultVariable
  }
}
