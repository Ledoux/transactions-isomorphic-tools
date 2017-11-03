import { getIsAcceptedElement } from './classify'
import { getFromRequestQuery } from './request'

export function filter (elements, query) {
  if (!query) {
    return []
  }
  if (!elements) {
    console.warn('There were no elements to filter here')
    return []
  }
  if (query.id) {
    // Put it into an array
    // because we want to return
    // always that type here
    const foundElement = elements.find(element => element.id === query.id)
    return (foundElement && [foundElement]) || []
  } else {
    // parse
    const fromRequestQuery = getFromRequestQuery(query)
    // unpack
    const filteringKeys = Object.keys(fromRequestQuery)
      .filter(key => key !== 'id')
    const filteringValues = filteringKeys.map(key => fromRequestQuery[key])
    // Here we do a generic filter :
    // each item in the filter checks
    // if their value matches the one in the entity (at the corresponding key)
    const filteredElements = elements.filter(element => {
      const isAcceptedElement = getIsAcceptedElement(element, filteringKeys, filteringValues)
      return isAcceptedElement
    })
    // return
    return filteredElements
  }
}
