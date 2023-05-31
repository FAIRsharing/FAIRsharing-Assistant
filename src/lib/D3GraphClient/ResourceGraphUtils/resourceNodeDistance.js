const resourceNodeDistance = (d) => {
  const { level } = d
  // console.log("children::", children)
  if (level === 1) return -70000
  else if (level === 2) {
    return -10000
  }
  return -30000
}

export default resourceNodeDistance