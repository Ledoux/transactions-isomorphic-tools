import { SORT,
  LIMIT,
  SKIP
} from '../constants'

export const afterConstants = [ SORT,
  LIMIT,
  SKIP
]

export const afterMethodNames = afterConstants.map(constant =>
  constant.match(/_(.*)_/)[1].toLowerCase())
