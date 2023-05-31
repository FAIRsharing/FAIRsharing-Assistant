/**
 * @param {Array} - otherResourceType
 * @returns {Number} - Total number of records for resource type
 */
const totalResourceRecords = (otherResourceType) => {
  const noNullotherResource = otherResourceType.filter(n => n)
  return noNullotherResource.reduce((accum,item) => accum + item.records_count, 0)
}

export default totalResourceRecords;