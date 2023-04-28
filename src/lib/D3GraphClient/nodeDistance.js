import { resourceNodeDistance } from "@/lib/D3GraphClient/ResourceGraphUtils"
import { subjectNodeDistance } from "@/lib/D3GraphClient/SubjectGraphUtils"
import { domainNodeDistance } from "@/lib/D3GraphClient/DomainGraphUtils"

// Distance in-between the nodes
const nodeDistance = (routeName) => {
  if ((routeName === "DatabaseView") || (routeName === "StandardsView") || (routeName === "PoliciesView")) {
    return resourceNodeDistance
  }
  else if (routeName === "SubjectTypeView") {
    return subjectNodeDistance
  }
  else if (routeName === "DomainTypeView") {
    return domainNodeDistance
  }
}

export default nodeDistance