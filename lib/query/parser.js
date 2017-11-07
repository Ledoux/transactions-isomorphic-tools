'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.getIsAcceptedElement = getIsAcceptedElement;
exports.getQueriedElements = getQueriedElements;

var _lodash = require('lodash.values');

var _lodash2 = _interopRequireDefault(_lodash);

var _demand = require('./demand');

var _request = require('./request');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getIsAcceptedElement(element, filteringKeys, filteringValues) {
  // look for any that is a false condition
  return !filteringKeys.some(function (filteringKey, index) {
    var filteringValue = filteringValues[index];
    // if it is not a string return just the equal
    if (!filteringValue.split) {
      return element[filteringKey] !== filteringValue;
    }
    // we can do some smart parsing in the value string
    return filteringValue.split('&&').some(function (andExpression) {
      var orMatch = filteringKey.match(/[0-100]?_or_(.*)/);
      if (orMatch) {
        if (orMatch[1].length === 0) {
          return !andExpression.split(orSeparator).some(function (orExpression) {
            var query = (0, _demand.getFromDemandQuery)(orExpression);
            return filter(element, Object.keys(query), (0, _lodash2.default)(query));
          });
        } else if (orMatch[1]) {
          var orKeys = orMatch[1].split(orSeparator);
          var queryValues = [andExpression];
          if (orKeys.length > 0) {
            var orValues = orKeys.map(function (orKey) {
              var joinMatch = orKey.match(/[0-100]?_join_(.*)/);
              if (joinMatch && joinMatch[1]) {
                var chunks = joinMatch[1].split('.');
                if (chunks.length > 1) {
                  var _chunks = _slicedToArray(chunks, 2),
                      joinKey = _chunks[0],
                      queryString = _chunks[1];

                  var joinElement = element[joinKey];
                  if (joinElement) {
                    return getIsAcceptedElement(joinElement, [queryString], queryValues);
                  }
                }
              } else {
                return getIsAcceptedElement(element, [orKey], queryValues);
              }
            });
            return !orValues.some(function (orValue) {
              return orValue;
            });
          }
        }
      } else if (/[0-100]?_join_/.test(filteringKey)) {
        var chunks = andExpression.split('.');
        if (chunks.length > 1) {
          var _chunks2 = _slicedToArray(chunks, 3),
              joinKey = _chunks2[0],
              filterOrQueryString = _chunks2[1],
              filterQueryString = _chunks2[2];

          var joinElement = element[joinKey];
          // if there is no joinElement, it means that the
          // filter should return already that it will not passed
          if (!joinElement) {
            return true;
          }
          var queryString = void 0;
          var subElements = void 0;
          var conditionInt = void 0;
          if (filterOrQueryString === '_filter_') {
            queryString = filterQueryString;
            subElements = joinElement;
          } else {
            queryString = filterOrQueryString;
            subElements = [joinElement];
          }
          var query = (0, _demand.getFromDemandQuery)(queryString);
          var directFilteredElements = filter(subElements, { query: query });
          return directFilteredElements.length === 0;
        }
      } else {
        // lets parse conditions on the value first
        var notEqualMatch = filteringValue.match(/_not_(.*)/);
        if (notEqualMatch && notEqualMatch[1]) {
          var notEqualValue = notEqualMatch[1];
          // if the value not begins with a quote, it means
          // it is a value to be first parsed
          if (notEqualValue[0] !== "\"") {
            notEqualValue = JSON.parse(notEqualValue);
          }
          return element[filteringKey] === notEqualValue;
        } else {
          var hasMatch = filteringValue.match(/_has_(.*)/);
          if (hasMatch && hasMatch[1]) {
            return !element[filteringKey] || !element[filteringKey].includes(hasMatch[1]);
          } else {
            var hasntMatch = filteringValue.match(/_hasnt_(.*)/);
            if (hasntMatch && hasntMatch[1]) {
              return element[filteringKey] && element[filteringKey].includes(hasntMatch[1]);
            } else {
              // then parse conditions on the key
              var inMatch = filteringKey.match(/_in_(.*)/);
              if (inMatch && inMatch[1]) {
                var withoutPrefixKey = inMatch[1];
                var value = element[withoutPrefixKey];
                return !value || !value.toLowerCase().includes(andExpression.toLowerCase());
              }
            }
          }
        }
      }
      // special implicit array including rule
      var elementValue = element[filteringKey];
      if (Array.isArray(elementValue)) {
        return !elementValue.includes(andExpression);
      }
      // else equal
      return elementValue !== andExpression;
    });
  });
}

function getQueriedElements(elements, query) {
  if (!query) {
    return [];
  }
  if (!elements) {
    console.warn('There were no elements to filter here');
    return [];
  }
  if (query.id) {
    // Put it into an array
    // because we want to return
    // always that type here
    var foundElement = elements.find(function (element) {
      return element.id === query.id;
    });
    return foundElement && [foundElement] || [];
  } else {
    // parse
    var fromRequestQuery = (0, _request.getFromRequestQuery)(query);
    // unpack
    var filteringKeys = Object.keys(fromRequestQuery).filter(function (key) {
      return key !== 'id';
    });
    var filteringValues = filteringKeys.map(function (key) {
      return fromRequestQuery[key];
    });
    // Here we do a generic filter :
    // each item in the filter checks
    // if their value matches the one in the entity (at the corresponding key)
    var filteredElements = elements.filter(function (element) {
      var isAcceptedElement = getIsAcceptedElement(element, filteringKeys, filteringValues);
      return isAcceptedElement;
    });
    // return
    return filteredElements;
  }
}