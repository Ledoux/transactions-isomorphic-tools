'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.requestConfigKeysByConstant = exports.postGetMethodNames = exports.requestConfigConstants = exports.WHERE = exports.SORT = exports.SKIP = exports.PASS = exports.PARSE = exports.OR = exports.NEW = exports.LIMIT = exports.JOINS = exports.JOIN = exports.IS_ALL_JOINS = exports.IS_ALL_DEEP_JOINS = exports.DELETE = exports.ALL = undefined;

var _lodash = require('lodash.camelcase');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ALL = exports.ALL = '_all_';
var DELETE = exports.DELETE = '_delete_';
var IS_ALL_DEEP_JOINS = exports.IS_ALL_DEEP_JOINS = '_is_all_deep_joins_';
var IS_ALL_JOINS = exports.IS_ALL_JOINS = '_is_all_joins_';
var JOIN = exports.JOIN = '_join_';
var JOINS = exports.JOINS = '_joins_';
var LIMIT = exports.LIMIT = '_limit_';
var NEW = exports.NEW = '_new_';
var OR = exports.OR = '_or_';
var PARSE = exports.PARSE = '_parse_';
var PASS = exports.PASS = '_pass_';
var SKIP = exports.SKIP = '_skip_';
var SORT = exports.SORT = '_sort_';
var WHERE = exports.WHERE = '_where_';

var requestConfigConstants = exports.requestConfigConstants = [IS_ALL_DEEP_JOINS, IS_ALL_JOINS, JOINS, LIMIT, SORT, SKIP];

var postGetMethodNames = exports.postGetMethodNames = [SORT, LIMIT, SKIP].map(function (constant) {
  return constant.match(/_(.*)_/)[1].toLowerCase();
});

var requestConfigKeysByConstant = exports.requestConfigKeysByConstant = {};
requestConfigConstants.forEach(function (requestConfigConstant) {
  requestConfigKeysByConstant[requestConfigConstant] = (0, _lodash2.default)(requestConfigConstant);
});