//Size of nodes
const standardsNodeSize = (d) => {
  const count = d.records_count
  switch(true) {
  case(count > 2000):
    return Math.sqrt(count) / 0.2
  case(1000 <= count && count < 2000):
    return Math.sqrt(count) / 0.4
  case(800 <= count && count < 1000):
    return 80
  case(600 <= count && count < 800):
    return 70
  case(400 <= count && count < 600):
    return 60
  case(200 <= count && count < 400):
    return 50
  case(100 <= count && count < 200):
    return 40
  case(50 <= count && count < 100):
    return 35
  case(25 <= count && count < 50):
    return 20
  case(15 <= count && count < 25):
    return 25
  default:
    return  8
  }
}

export default standardsNodeSize