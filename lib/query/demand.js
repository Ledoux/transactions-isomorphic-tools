'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.getFromDemandQuery = getFromDemandQuery;
exports.getDemand = getDemand;
exports.getQueryFromDemand = getQueryFromDemand;

var _constants = require('../constants');

function getFromDemandQuery(queryString) {
  var query = {};
  queryString.split(_constants.AND).forEach(function (item) {
    var chunks = item.split(':');
    if (chunks.length > 1) {
      query[chunks[0]] = chunks.slice(1).join(':');
    }
  });
  return query;
}

function getDemand() {
  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  // unpack
  var template = config.template,
      value = config.value;
  // return

  if (value) {
    return template ? value.split(_constants.ALSO).map(function (valueString, index) {
      return template.replace(/\{\{value\}\}/g, valueString);
    }).join(_constants.AND) : value;
  }
}

function getQueryFromDemand(demand) {
  // init
  var query = {};
  // check
  if (!demand) {
    return query;
  }
  // AND
  var andChunks = demand.split(_constants.AND);
  if (andChunks.length > 1) {
    // init
    var and = [];
    query[_constants.AND] = and;
    // for each
    andChunks.forEach(function (andChunk) {
      and.push(getQueryFromDemand(andChunk));
    });
  } else {
    // EQUAL
    var _demand$split = demand.split(_constants.EQUAL),
        _demand$split2 = _slicedToArray(_demand$split, 2),
        key = _demand$split2[0],
        value = _demand$split2[1];
    // OR


    var orChunks = key.split(_constants.OR);
    if (orChunks.length > 1) {
      var or = {};
      query[_constants.OR] = or;
      orChunks.forEach(function (orChunk) {
        Object.assign(or, getQueryFromDemand('' + orChunk + _constants.EQUAL + value));
      });
    } else {
      // JOINS
      var dotChunks = key.split(_constants.DOT);
      if (dotChunks.length > 1) {
        query['' + _constants.JOIN + dotChunks[0]] = getQueryFromDemand('' + dotChunks.slice(1).join(_constants.DOT) + _constants.EQUAL + value);
      } else {
        query[key] = value;
      }
    }
  }
  // return
  return query;
}