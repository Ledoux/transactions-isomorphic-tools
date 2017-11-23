import camelCase from 'lodash.camelcase'

import * as constantsByName from './constants'

export const absoluteUrlTest = /^(?:https?:)?(?:\/\/)?([^\/\?]+)/

const constantTestNames = ['IN', 'JOIN', 'OR', 'PARSE']
export const constantTestsByName = {}
constantTestNames.forEach(name =>
  constantTestsByName[`${camelCase(name)}Test`] = new RegExp(`${constantsByName[name]}(.*)`))
