/**
 * @param {Object} - route query parameters
 * @returns {Object} - route query parameters
 */
/* istanbul ignore next */
const currentPath = (routeQuery) => {
  let queryParams = {};
  Object.keys(routeQuery).forEach(prop => {
    let queryVal = routeQuery[prop];
    if (queryVal) {
      queryParams[prop] = decodeURI(queryVal);
    }
  });
  return queryParams;
}

export default currentPath