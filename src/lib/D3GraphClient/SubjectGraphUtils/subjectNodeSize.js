//Size of nodes
const nodeSize = (d) => {
  const count = d.records_count
  switch(true) {
  case(count > 7000):
    return Math.sqrt(count) / 0.7
  case(5000 < count && count <= 7000):
    return Math.sqrt(count) / 1.1
  case(2000 <= count && count <= 5000):
    return Math.sqrt(count) / 1.4
  case(1500 <= count && count < 2000):
    return Math.sqrt(count) / 1.1
  case(1000 <= count && count < 1500):
    return Math.sqrt(count) / 1.2
  case(500 <= count && count < 1000):
    return Math.sqrt(count) / 1.1
  case(200 <= count && count < 500):
    return 21
  case(100 <= count && count < 200):
    return 18
  case(20 <= count && count < 100):
    return 12
  case(8 <= count && count < 20):
    return 8
  default:
    return  4
  }
}

export default nodeSize