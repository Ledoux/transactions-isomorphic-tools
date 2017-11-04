"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var mapGet = exports.mapGet = function mapGet(keys, objects) {
  var mapObject = {};
  keys.forEach(function (key) {
    var value = void 0;
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = objects[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var object = _step.value;

        value = object[key];
        if (value) {
          break;
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    mapObject[key] = value;
  });
  return mapObject;
};