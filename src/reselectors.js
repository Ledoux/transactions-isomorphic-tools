import { createSelector } from 'reselect'

import { getQueriedElements } from './query'

export const createQueryReselector = (allReselector, query) => createSelector(
  allReselector,
  elements => {
    // console.log('elements', elements)
    return getQueriedElements(elements, query)
  }
)
