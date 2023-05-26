
const formatString = (name) => {
  return name.replace(/\s/g, '_').toLowerCase()
}

/**
 * @param {Array} - ResourceType
 * @returns {Array} - records of the resource
 */
const getResourceRecords = (resourceType) => {

  if (resourceType[0].children && resourceType[0].children.length) {
    return resourceType[0].children.map(({name}) => formatString(name))
  }
  else {
    return resourceType[0]._children.map(({name}) => formatString(name))
  }
}

export default getResourceRecords;