
const formatString = (name) => {
  return name.replace(/\s/g, '_').toLowerCase()
}

/**
 * @param {Array} - ResourceType
 * @returns {Array} - records of the resource
 */
const getResourceRecords = (resourceType) => {
  if (resourceType.children && resourceType.children.length) {
    return resourceType.children.map(({name}) => formatString(name))
  }
  else {
    return resourceType._children.map(({name}) => formatString(name))
  }
}

export default getResourceRecords;