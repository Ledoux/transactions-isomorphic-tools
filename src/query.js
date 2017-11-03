import { PARSE,
  WHERE
} from './constants'

export function getQueryString (query) {
  return Object.keys(query)
    .map(key => {
      const value = query[key]
      // special parse
      const valueString = typeof value !== 'string'
      ? `${PARSE}${JSON.stringify(value)}`
      : value
      // return
      return `${key}=${valueString}`
    })
    .join('&')
}

export function getReplacedQueryString (queryString) {
  return queryString.replace(/&/g, '|')
    .replace(/=/g, '=>')
}

export function encodeSubQuery (option) {
  const { collectionName,
    query
  } = option
  let queryString = collectionName
  ? collectionName
  : ''
  if (query && Object.keys(query).length > 0) {
    const subQueryString = getQueryString(query)
    const replacedQueryString = getReplacedQueryString(subQueryString)
    queryString = collectionName
    ? `${queryString}${WHERE}${replacedQueryString}`
    : replacedQueryString
  }
  return queryString
}

export function encodeQuery (options) {
  return options.map((option, index) =>
    `${index}=${encodeSubQuery(option)}`
  ).join('&')
}
