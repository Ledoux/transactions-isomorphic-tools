'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.afterMethodNames = exports.afterConstants = undefined;

var _constants = require('../constants');

var afterConstants = exports.afterConstants = [_constants.SORT, _constants.LIMIT, _constants.SKIP];

var afterMethodNames = exports.afterMethodNames = afterConstants.map(function (constant) {
  return constant.match(/_(.*)_/)[1].toLowerCase();
});