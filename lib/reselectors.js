'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createQueryReselector = undefined;

var _reselect = require('reselect');

var _query = require('./query');

var createQueryReselector = exports.createQueryReselector = function createQueryReselector(allReselector, query) {
  return (0, _reselect.createSelector)(allReselector, function (elements) {
    // console.log('elements', elements)
    return (0, _query.getQueriedElements)(elements, query);
  });
};