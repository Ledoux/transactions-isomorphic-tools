'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.camelCasesByConstant = undefined;
exports.splitQuery = splitQuery;

var _lodash = require('lodash.camelcase');

var _lodash2 = _interopRequireDefault(_lodash);

var _after = require('./after');

var _join = require('./join');

var _constants = require('../constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var camelCasesByConstant = exports.camelCasesByConstant = {};
_after.afterConstants.concat(_join.joinConstants).forEach(function (constant) {
  camelCasesByConstant[constant] = (0, _lodash2.default)(constant);
});

function splitQuery(query) {
  var after = {};
  var joiner = {};
  var look = {};
  query && Object.keys(query).forEach(function (key) {
    var value = query[key];
    if (_after.afterConstants.includes(key)) {
      after[camelCasesByConstant[key]] = value;
    } else if (_join.joinConstants.includes(key)) {
      joiner[camelCasesByConstant[key]] = value;
    } else if (key !== _constants.MODE) {
      // don't set MODE
      look[key] = value;
    }
  });
  return { after: after, joiner: joiner, look: look };
}