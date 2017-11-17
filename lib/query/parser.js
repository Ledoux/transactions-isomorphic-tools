'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getIsInAcceptedElement = getIsInAcceptedElement;
exports.getIsJoinAcceptedElement = getIsJoinAcceptedElement;
exports.getIsEqualAcceptedElement = getIsEqualAcceptedElement;
exports.getIsSpecificAcceptedElement = getIsSpecificAcceptedElement;
exports.getIsAcceptedElement = getIsAcceptedElement;
exports.filterOrFind = filterOrFind;

var _lodash = require('lodash.values');

var _lodash2 = _interopRequireDefault(_lodash);

var _constants = require('../constants');

var _demand = require('./demand');

var _request = require('./request');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getIsInAcceptedElement(element, key, value) {
  var inMatch = key.match(_constants.inTest);
  var inKey = inMatch && inMatch[1];
  if (inKey) {
    return element[inKey].toLowerCase().includes(value);
  }
}

function getIsJoinAcceptedElement(element, key, value, config) {
  // unpack
  var getState = config.getState,
      schema = config.schema;
  // check

  var joinMatch = key.match(_constants.joinTest);
  var almostJoinKey = joinMatch && joinMatch[1];
  if (almostJoinKey) {
    var itemsByKey = schema.itemsByKey,
        schemasByJoinKey = schema.schemasByJoinKey;

    var joinKey = itemsByKey[almostJoinKey].key;
    var joinId = element[joinKey];
    var joinCollectionName = schemasByJoinKey[joinKey].collectionName;
    var joinElement = getState()[joinCollectionName + 'ById'][joinId];
    var keys = Object.keys(value);
    return getIsSpecificAcceptedElement(joinElement, keys[0], value[keys[0]], config);
  }
}

function getIsEqualAcceptedElement(element, key, value) {
  return element[key] === value;
}

var getIsAcceptedElementSpecificMethods = [getIsInAcceptedElement, getIsJoinAcceptedElement, getIsEqualAcceptedElement];

function getIsSpecificAcceptedElement() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return getIsAcceptedElementSpecificMethods.some(function (getIsAcceptedElementSpecificMethod) {
    return getIsAcceptedElementSpecificMethod.apply(undefined, args);
  });
}

function getIsAcceptedElement(element, filteringKeys, filteringValues, config) {
  // unpack
  var getState = config.getState,
      schema = config.schema;
  // AND CONDITION all must be fullfilled

  return filteringKeys.every(function (filteringKey, index) {
    var filteringValue = filteringValues[index];
    if (filteringKey === _constants.OR) {
      // OR CONDITION one is enough
      return Object.keys(filteringValue).some(function (key) {
        // SPECIFICS
        return getIsSpecificAcceptedElement(element, key, filteringValue[key], config);
      });
    } else {
      // SPECIFICS
      return getIsSpecificAcceptedElement(element, filteringKey, filteringValue, config);
    }
  });
}

function filterOrFind(elements, query) {
  var config = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  // unpack
  var getState = config.getState,
      schema = config.schema;

  var methodName = config.methodName || 'filter';
  // check
  if (!query) {
    return [];
  }
  if (!elements) {
    console.warn('There were no elements to filter here');
    return [];
  }
  // id specific
  if (query.id) {
    // Put it into an array
    // because we want to return
    // always that type here
    var foundElement = elements.find(function (element) {
      return element.id === query.id;
    });
    return methodName === 'filter' ? foundElement && [foundElement] || [] : foundElement;
  } else {
    // adapt
    var fromRequestQuery = (0, _request.getFromRequestQuery)(query);
    // unpack
    var filteringKeys = Object.keys(fromRequestQuery).filter(function (key) {
      return key !== 'id';
    });
    var filteringValues = filteringKeys.map(function (key) {
      return fromRequestQuery[key];
    });
    // parser (can be array or element)
    var resultVariable = elements[methodName](function (element) {
      var isAcceptedElement = getIsAcceptedElement(element, filteringKeys, filteringValues, { getState: getState, schema: schema });
      return isAcceptedElement;
    });
    // return
    return resultVariable;
  }
}