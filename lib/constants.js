'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var absoluteUrlTest = exports.absoluteUrlTest = /^(?:https?:)?(?:\/\/)?([^\/\?]+)/;

var AND = exports.AND = '_and_';
var ALL = exports.ALL = '_all_';
var ALSO = exports.ALSO = ' ';
var DELETE = exports.DELETE = '_delete_';
var DOT = exports.DOT = '.';
var EQUAL = exports.EQUAL = ':';
var IN = exports.IN = '_in_';
var IS_ALL_DEEP_JOINS = exports.IS_ALL_DEEP_JOINS = '_is_all_deep_joins_';
var IS_ALL_JOINS = exports.IS_ALL_JOINS = '_is_all_joins_';
var JOIN = exports.JOIN = '_join_';
var JOINS = exports.JOINS = '_joins_';
var LIMIT = exports.LIMIT = '_limit_';
var MAX_DEPTH = exports.MAX_DEPTH = '_max_depth_';
var NEW = exports.NEW = '_new_';
var OR = exports.OR = '_or_';
var PARSE = exports.PARSE = '_parse_';
var PASS = exports.PASS = '_pass_';
var SKIP = exports.SKIP = '_skip_';
var SORT = exports.SORT = '_sort_';
var WHERE = exports.WHERE = '_where_';

var inTest = exports.inTest = new RegExp(IN + '(.*)');
var joinTest = exports.joinTest = new RegExp(JOIN + '(.*)');