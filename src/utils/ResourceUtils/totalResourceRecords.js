/**
 * @param {Array} - otherResourceType
 * @returns {Number} - Total number of records for resource type
 */
const totalResourceRecords = (otherResourceType) => {
  return otherResourceType.reduce((accum,item) => accum + item.records_count, 0)
}

export default totalResourceRecords;