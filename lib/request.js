'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.requestConfigKeysByConstant = exports.requestConfigConstants = undefined;

var _lodash = require('lodash.camelcase');

var _lodash2 = _interopRequireDefault(_lodash);

var _constants = require('./constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var requestConfigConstants = exports.requestConfigConstants = [_constants.IS_ALL_DEEP_JOINS, _constants.IS_ALL_JOINS, _constants.JOINS, _constants.LIMIT, _constants.SORT, _constants.SKIP];

var requestConfigKeysByConstant = exports.requestConfigKeysByConstant = {};
requestConfigConstants.forEach(function (requestConfigConstant) {
  requestConfigKeysByConstant[requestConfigConstant] = (0, _lodash2.default)(requestConfigConstant);
});