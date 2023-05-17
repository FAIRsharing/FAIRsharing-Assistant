const getRecords = (nodeArray) => {
  if(nodeArray === "resourceNodeList") return nodeArray.map(({records}) => this.formatString(records))
  return nodeArray.map(({records}) => records.toLowerCase())
}

export default getRecords