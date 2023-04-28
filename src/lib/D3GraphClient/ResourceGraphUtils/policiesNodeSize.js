//Size of nodes
const policiesNodesSize = (d) => {
  const count = d.records_count
  switch(true) {
  case(count > 200):
    return 100
  case(100 <= count && count < 200):
    return 90
  case(90 <= count && count < 100):
    return 80
  case(80 <= count && count < 90):
    return 78
  case(70 <= count && count < 80):
    return 76
  case(60 <= count && count < 70):
    return 74
  case(50 <= count && count < 60):
    return 72
  case(40 <= count && count < 50):
    return 70
  case(30 <= count && count < 40):
    return 60
  case(20 <= count && count < 30):
    return 40
  case(10 <= count && count < 20):
    return 20
  default:
    return  30
  }
}

export default policiesNodesSize