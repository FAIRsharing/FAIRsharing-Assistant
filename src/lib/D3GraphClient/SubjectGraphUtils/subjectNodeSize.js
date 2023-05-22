import bubbleSelectedStore from "@/store"

//Size of nodes for AllSubjects
const allSubjectsNodeSize = (d) => {
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

//Size of nodes for filterdSubjects
const filteredSubjectsNodeSize = (d) => {
  const count = d.records_count
  switch(true) {
  case(count > 2000):
    return Math.sqrt(count) / 1
  case(1500 < count && count <= 2000):
    return Math.sqrt(count) * 3.5
  case(1000 <= count && count < 1500):
    return Math.sqrt(count) * 3.4
  case(800 <= count && count < 1000):
    return Math.sqrt(count) * 3.3
  case(600 <= count && count < 800):
    return Math.sqrt(count) * 3.2
  case(400 <= count && count < 600):
    return Math.sqrt(count) * 3.1
  case(200 <= count && count < 400):
    return Math.sqrt(count) * 3
  case(100 <= count && count < 200):
    return Math.sqrt(count) * 2.9
  case(80 <= count && count < 100):
    return Math.sqrt(count) * 2.8
  case(60 <= count && count < 80):
    return Math.sqrt(count) * 2.7
  case(50 <= count && count < 60):
    return Math.sqrt(count) * 2.9
  case(40 <= count && count < 50):
    return Math.sqrt(count) * 2.8
  case(30 <= count && count < 40):
    return Math.sqrt(count) * 2.8
  case(20 <= count && count < 30):
    return Math.sqrt(count) * 2.8
  case(10 <= count && count < 20):
    return Math.sqrt(count) * 2.7
  case(4 <= count && count < 10):
    return count * 3.7
  case(1 <= count && count < 4):
    return count * 8
  default:
    return  10
  }
}

//Size when all top four nodes have zero records count
// const noRecordsNodeSize = (d) => {
//   let noRecords = false
//   const { level, children } = d
//   if (level === 0) {
//     noRecords = children.every(childNode => childNode.records_count === 0)
//   }
//   if (noRecords) return 50
// }

const subjectNodesSize = (d) => {
  const allSubjects = bubbleSelectedStore.getters["bubbleSelectedStore/getAllSubjects"]
  if (allSubjects) return allSubjectsNodeSize(d)
  return filteredSubjectsNodeSize(d)
  // else return noRecordsNodeSize(d)

}

export default subjectNodesSize