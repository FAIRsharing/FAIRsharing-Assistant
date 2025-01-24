/**
 *
 * @param {String} - registryName
 * @returns {String} - icon name for registry
 */
const registryIcons = (registry) => {
  switch (registry) {
    case "Standard":
      return "home_standard";
    case "Database":
      return "home_db";
    case "Policy":
      return "home_policies";
    case "Collection":
      return "home_collections";
    default:
      return "home_standard";
  }
};

export default registryIcons;
