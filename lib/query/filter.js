'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getIsNotInAcceptedElement = getIsNotInAcceptedElement;
exports.getIsInAcceptedElement = getIsInAcceptedElement;
exports.getIsJoinAcceptedElement = getIsJoinAcceptedElement;
exports.getIsEqualAcceptedElement = getIsEqualAcceptedElement;
exports.getIsSpecificAcceptedElement = getIsSpecificAcceptedElement;
exports.getIsAcceptedElement = getIsAcceptedElement;
exports.filterOrFind = filterOrFind;

var _lodash = require('lodash.get');

var _lodash2 = _interopRequireDefault(_lodash);

var _lodash3 = require('lodash.values');

var _lodash4 = _interopRequireDefault(_lodash3);

var _constants = require('../constants');

var _demand = require('./demand');

var _split = require('./split');

var _regexps = require('../regexps');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var inTest = _regexps.constantTestsByName.inTest,
    joinTest = _regexps.constantTestsByName.joinTest;
function getIsNotInAcceptedElement(element, key, value) {
  var elementArray = element[key];
  var subElementOrArray = value && value[_constants.NOT_IN];
  if (elementArray && subElementOrArray) {
    return elementArray && Array.isArray(subElementOrArray) ? subElementOrArray.every(function (subElement) {
      return !elementArray.includes(subElement);
    }) : !elementArray.includes(subElementOrArray);
  }
}

function getIsInAcceptedElement(element, key, value) {
  var inMatch = key.match(inTest);
  var inKey = inMatch && inMatch[1];
  if (inKey) {
    return (0, _lodash2.default)(element, inKey).toLowerCase().includes(value);
  } else {
    var elementArray = element[key];
    var subElementOrArray = value && value[_constants.IN];
    if (elementArray && subElementOrArray) {
      return elementArray && Array.isArray(subElementOrArray) ? subElementOrArray.every(function (subElement) {
        return elementArray.includes(subElement);
      }) : elementArray.includes(subElementOrArray);
    }
  }
}

function getIsJoinAcceptedElement(element, key, value, config) {
  // unpack
  var getState = config.getState,
      schema = config.schema;
  // check

  var joinMatch = key.match(joinTest);
  var almostJoinKey = joinMatch && joinMatch[1];
  if (almostJoinKey) {
    var keys = Object.keys(value);
    var itemsByKey = schema.itemsByKey,
        schemasByJoinKey = schema.schemasByJoinKey;

    var item = itemsByKey[almostJoinKey] || itemsByKey[almostJoinKey + 'ById'];
    var joinKey = item.key;
    var joinVariable = element[joinKey];
    var joinCollectionName = schemasByJoinKey[joinKey].collectionName;
    var collection = getState()[joinCollectionName + 'ById'];
    if (!Array.isArray(joinVariable)) {
      var joinElement = collection[joinVariable];
      return getIsSpecificAcceptedElement(joinElement, keys[0], value[keys[0]], config);
    } else {
      var joinElements = joinVariable.map(function (id) {
        return collection[id];
      });
      return joinElements.some(function (joinElement) {
        return getIsSpecificAcceptedElement(joinElement, keys[0], value[keys[0]], config);
      });
    }
  }
}

function getIsEqualAcceptedElement(element, key, value) {
  return (0, _lodash2.default)(element, key) === value;
}

var getIsAcceptedElementSpecificMethods = [getIsNotInAcceptedElement, getIsInAcceptedElement, getIsEqualAcceptedElement, getIsJoinAcceptedElement];

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

  var isAfter = config.isAfter;
  if (typeof config.isAfter === 'undefined') {
    isAfter = true;
  }
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
    var _splitQuery = (0, _split.splitQuery)(query),
        after = _splitQuery.after,
        join = _splitQuery.join,
        look = _splitQuery.look;
    // unpack


    var filteringKeys = Object.keys(look).filter(function (key) {
      return key !== 'id';
    });
    var filteringValues = filteringKeys.map(function (key) {
      return look[key];
    });
    // parser (can be array or element)
    var resultVariable = elements[methodName](function (element) {
      var isAcceptedElement = getIsAcceptedElement(element, filteringKeys, filteringValues, { getState: getState, schema: schema });
      return isAcceptedElement;
    });
    // after
    if (methodName === 'filter' && isAfter) {
      var sort = after.sort,
          limit = after.limit,
          skip = after.skip;

      if (sort) {
        Object.keys(sort).forEach(function (key) {
          return resultVariable.sort(function (element, nextElement) {
            var isNextHigher = nextElement[key] > element[key];
            return sort[key] === 1
            // ascending
            ? isNextHigher ? 1 : -1 :
            // descending
            isNextHigher ? -1 : 1;
          });
        });
      }
      if (limit) {
        resultVariable = resultVariable.slice(0, limit);
      }
      if (skip) {
        resultVariable = resultVariable.slice(skip);
      }
    }
    // return
    return resultVariable;
  }
}