import values from 'lodash.values'

import { getFromDemandQuery } from './demand'
import { getFromRequestQuery } from './request'

export function getIsAcceptedElement (element, filteringKeys, filteringValues) {
  // look for any that is a false condition
  return !filteringKeys.some((filteringKey, index) => {
    const filteringValue = filteringValues[index]
    // if it is not a string return just the equal
    if (!filteringValue.split) {
      return element[filteringKey] !== filteringValue
    }
    // we can do some smart parsing in the value string
    return filteringValue
      .split('&&')
      .some(andExpression => {
        const orMatch = filteringKey.match(/[0-100]?_or_(.*)/)
        if (orMatch) {
          if (orMatch[1].length === 0) {
            return !andExpression.split(orSeparator)
              .some(orExpression => {
                const query = getFromDemandQuery(orExpression)
                return filter(element, Object.keys(query), values(query))
              })
          } else if (orMatch[1]){
            const orKeys = orMatch[1].split(orSeparator)
            const queryValues = [andExpression]
            if (orKeys.length > 0) {
              const orValues = orKeys.map(orKey => {
                const joinMatch = orKey.match(/[0-100]?_join_(.*)/)
                if (joinMatch && joinMatch[1]) {
                  const chunks = joinMatch[1].split('.')
                  if (chunks.length > 1) {
                    const [joinKey, queryString] = chunks
                    const joinElement = element[joinKey]
                    if (joinElement) {
                      return getIsAcceptedElement(joinElement, [queryString], queryValues)
                    }
                  }
                } else {
                  return getIsAcceptedElement(element, [orKey], queryValues)
                }
              })
              return !orValues.some(orValue => orValue)
            }
          }
        } else if (/[0-100]?_join_/.test(filteringKey)) {
          const chunks = andExpression.split('.')
          if (chunks.length > 1) {
            const [joinKey, filterOrQueryString, filterQueryString] = chunks
            const joinElement = element[joinKey]
            // if there is no joinElement, it means that the
            // filter should return already that it will not passed
            if (!joinElement) {
              return true
            }
            let queryString
            let subElements
            let conditionInt
            if (filterOrQueryString === '_filter_') {
              queryString = filterQueryString
              subElements = joinElement
            } else {
              queryString = filterOrQueryString
              subElements = [joinElement]
            }
            const query = getFromDemandQuery(queryString)
            const directFilteredElements = filter(subElements,
                  { query })
            return directFilteredElements.length === 0
          }
        } else {
          // lets parse conditions on the value first
          const notEqualMatch = filteringValue.match(/_not_(.*)/)
          if (notEqualMatch && notEqualMatch[1]) {
            let notEqualValue = notEqualMatch[1]
            // if the value not begins with a quote, it means
            // it is a value to be first parsed
            if (notEqualValue[0] !== "\"") {
              notEqualValue = JSON.parse(notEqualValue)
            }
            return element[filteringKey] === notEqualValue
          } else {
            const hasMatch = filteringValue.match(/_has_(.*)/)
            if (hasMatch && hasMatch[1]) {
              return !element[filteringKey] || !element[filteringKey].includes(hasMatch[1])
            } else {
              const hasntMatch = filteringValue.match(/_hasnt_(.*)/)
              if (hasntMatch && hasntMatch[1]) {
                return element[filteringKey] && element[filteringKey].includes(hasntMatch[1])
              } else {
                // then parse conditions on the key
                const inMatch = filteringKey.match(/_in_(.*)/)
                if (inMatch && inMatch[1]) {
                  const withoutPrefixKey = inMatch[1]
                  const value = element[withoutPrefixKey]
                  return !value || !value
                    .toLowerCase()
                    .includes(andExpression.toLowerCase())
                }
              }
            }
          }
        }
        // special implicit array including rule
        const elementValue = element[filteringKey]
        if (Array.isArray(elementValue)) {
          return !elementValue.includes(andExpression)
        }
        // else equal
        return elementValue !== andExpression
      })
  })
}

export function filterOrFind (elements, query, methodName = 'filter') {
  // check
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
    return methodName === 'filter'
      ? (foundElement && [foundElement]) || []
      : foundElement
  } else {
    // adapt
    const fromRequestQuery = getFromRequestQuery(query)
    // unpack
    const filteringKeys = Object.keys(fromRequestQuery)
      .filter(key => key !== 'id')
    const filteringValues = filteringKeys.map(key => fromRequestQuery[key])
    // parser (can be array or element)
    const resultVariable = elements[methodName](element => {
      const isAcceptedElement = getIsAcceptedElement(element, filteringKeys, filteringValues)
      return isAcceptedElement
    })
    // return
    return resultVariable
  }
}
