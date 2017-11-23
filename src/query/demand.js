import { AND,
  ALSO,
  DOT,
  EQUAL,
  IN,
  JOIN,
  OR
} from '../constants'

export function getFromDemandQuery (queryString) {
  const query = {}
  queryString.split(AND)
    .forEach(item => {
      const chunks = item.split(':')
      if (chunks.length > 1) {
        query[chunks[0]] = chunks.slice(1).join(':')
      }
    })
  return query
}

export function getDemand (config = {}) {
  // unpack
  const { template, value } = config
  // return
  if (value) {
    return template
    ? value.split(ALSO)
      .map((valueString, index) =>
        template.replace(/\{\{value\}\}/g, valueString))
      .join(AND)
    : value
  }
}

export function getQueryFromDemand (demand) {
  // init
  const query = {}
  // check
  if (!demand) {
    return query
  }
  // AND
  const andChunks = demand.split(AND)
  if (andChunks.length > 1) {
    // init
    const and = []
    query[AND] = and
    // for each
    andChunks.forEach(andChunk => {
      and.push(getQueryFromDemand(andChunk))
    })
  } else {
    // EQUAL
    let [key, value] = demand.split(EQUAL)
    // OR
    const orChunks = key.split(OR)
    if (orChunks.length > 1) {
      const or = {}
      query[OR] = or
      orChunks.forEach(orChunk => {
        Object.assign(or, getQueryFromDemand(`${orChunk}${EQUAL}${value}`))
      })
    } else {
      // JOINS
      const dotChunks = key.split(DOT)
      if (dotChunks.length > 1) {
        query[`${JOIN}${dotChunks[0]}`] = getQueryFromDemand(
          `${dotChunks.slice(1).join(DOT)}${EQUAL}${value}`
        )
      } else {
        query[key] = value
      }
    }
  }
  // return
  return query
}
