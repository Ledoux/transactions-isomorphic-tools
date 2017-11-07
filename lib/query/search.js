'use strict';

function getFromSearchQuery(queryString) {
  var query = {};
  queryString.split('&').forEach(function (item) {
    var chunks = item.split(':');
    if (chunks.length > 1) {
      query[chunks[0]] = chunks.slice(1).join(':');
    }
  });
  return query;
}