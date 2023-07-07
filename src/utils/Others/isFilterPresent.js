/**
 *
 * @param filterArray - array of filtersSelected
 * @param filterItem - Object of a filter
 * @returns {Object}
 */
const isFilterPresent = (filterArray, filterItem) => {
  return filterArray.find(({key}) => key === filterItem["key"])
}

export default isFilterPresent