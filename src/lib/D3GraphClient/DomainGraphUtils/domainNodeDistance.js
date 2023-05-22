const domainNodeDistance = (d) => {
  const { level, records_count } = d
  if (level === 1) return -9000
  else if (300 <= records_count) {
    if (level === 2) return -4000
    else if (level === 3) return -7000
  }
  return -2000
}

export default domainNodeDistance