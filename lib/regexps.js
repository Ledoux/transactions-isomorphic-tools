'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.newTest = exports.constantTestsByName = exports.absoluteUrlTest = undefined;

var _lodash = require('lodash.camelcase');

var _lodash2 = _interopRequireDefault(_lodash);

var _constants = require('./constants');

var constantsByName = _interopRequireWildcard(_constants);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var absoluteUrlTest = exports.absoluteUrlTest = /^(?:https?:)?(?:\/\/)?([^\/\?]+)/;

var constantTestNames = ['IN', 'JOIN', 'OR', 'PARSE'];
var constantTestsByName = exports.constantTestsByName = {};
constantTestNames.forEach(function (name) {
  return constantTestsByName[(0, _lodash2.default)(name) + 'Test'] = new RegExp(constantsByName[name] + '(.*)');
});

var newTest = exports.newTest = new RegExp(constantsByName.NEW + '(.*)');