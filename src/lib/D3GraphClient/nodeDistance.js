import { subjectNodeDistance } from "@/lib/D3GraphClient/SubjectGraphUtils"
import { domainNodeDistance } from "@/lib/D3GraphClient/DomainGraphUtils"

// Distance in-between the nodes
const nodeDistance = (routeName) => {
  if (routeName === "SubjectTypeView") {
    return subjectNodeDistance
  }
  else if (routeName === "DomainTypeView") {
    return domainNodeDistance
  }
}

export default nodeDistance