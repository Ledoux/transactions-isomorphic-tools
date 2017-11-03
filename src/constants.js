import camelCase from 'lodash.camelcase'

export const ALL = '_all_'
export const IS_ALL_DEEP_JOINS = '_is_all_deep_joins_'
export const IS_ALL_JOINS = '_is_all_joins_'
export const JOIN = '_join_'
export const JOINS = '_joins_'
export const LIMIT = '_limit_'
export const OR = '_or_'
export const PARSE = '_parse_'
export const SKIP = '_skip_'
export const SORT = '_sort_'
export const WHERE = '_where_'

export const requestConfigConstants = [ IS_ALL_DEEP_JOINS,
  IS_ALL_JOINS,
  JOINS,
  LIMIT,
  SORT,
  SKIP
]

export const postGetMethodNames = [ SORT,
  LIMIT,
  SKIP
].map(constant => constant.match(/_(.*)_/)[1].toLowerCase())

export const requestConfigKeysByConstant = {}
requestConfigConstants.forEach(requestConfigConstant => {
  requestConfigKeysByConstant[requestConfigConstant] = camelCase(requestConfigConstant)
})
