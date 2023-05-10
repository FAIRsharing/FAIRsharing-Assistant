//Size of nodes
const domainNodeSize = (d) => {
  const count = d.records_count
  switch(true) {
  case(count > 500):
    return 70
  case(450 <= count && count < 500):
    return 65
  case(400 <= count && count < 450):
    return 60
  case(350 <= count && count < 400):
    return 55
  case(300 <= count && count < 350):
    return 50
  case(250 <= count && count < 300):
    return 45
  case(200 <= count && count < 250):
    return 40
  case(150 <= count && count < 200):
    return 35
  case(100 <= count && count < 150):
    return 30
  case(70 <= count && count < 100):
    return 25
  case(40 <= count && count < 70):
    return 20
  case(20 <= count && count < 40):
    return 15
  case(10 <= count && count < 20):
    return 12
  default:
    return  10
  }
}

export default domainNodeSize