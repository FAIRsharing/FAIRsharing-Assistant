/**
 *
 * @param {String} - registryName
 * @returns {String} - display name for registry
 */
const registryName = (registry) => {
  switch (registry) {
  case "Standard":
    return "Standards"
  case "Database":
    return "Databases"
  case "Policy":
    return "Policies"
  case "Collection":
    return "Collections"
  default:
    return registry
  }
}

export default registryName