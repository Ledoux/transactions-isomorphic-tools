'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFromRequestQuery = getFromRequestQuery;

var _constants = require('../constants');

function getFromRequestQuery() {
  var query = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var fromRequestQuery = {};
  Object.keys(query).forEach(function (key) {
    // remove the request config keys
    if (_constants.requestConfigConstants.includes(key)) {
      return;
    }
    // parse
    var value = query[key];
    var fromRequestValue = value;
    if (value) {
      var parseMatch = value.match && value.match(/_PARSE_(.*)/);
      if (parseMatch && parseMatch[1]) {
        var notEqualMatch = parseMatch[1];
        var object = JSON.parse(notEqualMatch);
        var objectKeys = Object.keys(object);
        if (objectKeys[0] === '$ne') {
          var notEqualValue = object[objectKeys[0]];
          fromRequestValue = '_not_' + notEqualValue;
        }
      } else {
        var inValue = value['$in'];
        if (inValue) {
          fromRequestValue = '_has_' + inValue;
        } else {
          var ninValue = value['$nin'];
          if (ninValue) {
            fromRequestValue = '_hasnt_' + ninValue.join(',');
          }
        }
      }
    }
    fromRequestQuery[key] = fromRequestValue;
  });
  return fromRequestQuery;
}