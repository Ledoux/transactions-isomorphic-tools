'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.encodeQuery = encodeQuery;
exports.encodeSubQuery = encodeSubQuery;
exports.getQueryString = getQueryString;
exports.getReplacedQueryString = getReplacedQueryString;

var _constants = require('../constants');

function encodeQuery(options) {
  return options.map(function (option, index) {
    return index + '=' + encodeSubQuery(option);
  }).join('&');
}

function encodeSubQuery(option) {
  var collectionName = option.collectionName,
      query = option.query;

  var queryString = collectionName ? collectionName : '';
  if (query && Object.keys(query).length > 0) {
    var subQueryString = getQueryString(query);
    var replacedQueryString = getReplacedQueryString(subQueryString);
    queryString = collectionName ? '' + queryString + _constants.WHERE + replacedQueryString : replacedQueryString;
  }
  return queryString;
}

function getQueryString(query) {
  return Object.keys(query).map(function (key) {
    var value = query[key];
    // special parse
    var valueString = typeof value !== 'string' ? '' + _constants.PARSE + JSON.stringify(value) : value;
    // return
    return key + '=' + valueString;
  }).join('&');
}

function getReplacedQueryString(queryString) {
  return queryString.replace(/&/g, '|').replace(/=/g, '=>');
}