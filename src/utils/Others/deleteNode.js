/**
 *
 * @param recordArray - array of records
 * @param nodeItem - Object of a record
 * @returns {Array}
 */
const deleteNode = (recordArray, nodeItem) => {
  return recordArray.splice(recordArray.indexOf(nodeItem), 1)
}

export default deleteNode