import { requestConfigConstants } from '../constants'

export function getFromRequestQuery (query = {}) {
  const fromRequestQuery = {}
  Object.keys(query)
    .forEach(key => {
      // remove the request config keys
      if (requestConfigConstants.includes(key)) {
        return
      }
      // parse
      const value = query[key]
      const parseMatch = value.match && value.match(/_PARSE_(.*)/)
      let fromRequestValue = value
      if (parseMatch && parseMatch[1]) {
        const notEqualMatch = parseMatch[1]
        const object = JSON.parse(notEqualMatch)
        const objectKeys = Object.keys(object)
        if (objectKeys[0] === '$ne') {
          const notEqualValue = object[objectKeys[0]]
          fromRequestValue = `_not_${notEqualValue}`
        }
      } else {
        const inValue = value['$in']
        if (inValue) {
          fromRequestValue = `_has_${inValue}`
        } else {
          const ninValue = value['$nin']
          if (ninValue) {
            fromRequestValue = `_hasnt_${ninValue.join(',')}`
          }
        }
      }
      fromRequestQuery[key] = fromRequestValue
    })
  return fromRequestQuery
}
