
const formatString = (name) => {
  return name.replace(/\s/g, '_').toLowerCase()
}
const getRecords = (nodeArray) => {
  if(nodeArray === "resourceNodeList") return nodeArray.map(({records}) => formatString(records))
  return nodeArray.map(({records}) => records.toLowerCase())
}

export default getRecords