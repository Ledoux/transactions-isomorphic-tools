"use strict";

var createFilterReselector = function createFilterReselector(allReselector, query) {
  return createSelector(allReselector, function (elements) {
    return getQueriedElements(elements, query);
  });
};

var createSearchReselector = function createSearchReselector(parentReselector) {
  return createSelector(parentReselector, function (elements) {
    return getQueriedElements(elements, query);
  });
};