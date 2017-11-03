import { createSelector } from 'reselect'

import { filter } from './filter'

export const createQueryReselector = (allReselector, query) => createSelector(
  allReselector,
  elements => {
    console.log('elements', elements)
    return filter(elements, query)
  }
)
