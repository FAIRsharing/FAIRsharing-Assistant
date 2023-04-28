const resourceNodeDistance = (d) => {
  const { level } = d
  if (level === 1) return -30000
  else if (level === 2) {
    return -10000
  }
  return -30000
}

export default resourceNodeDistance