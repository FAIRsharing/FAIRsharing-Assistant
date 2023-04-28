import { databaseNodeSize, standardsNodeSize, policiesNodeSize} from "@/lib/D3GraphClient/ResourceGraphUtils"
import { subjectNodesSize } from "@/lib/D3GraphClient/SubjectGraphUtils";
import { domainNodeSize } from "@/lib/D3GraphClient/DomainGraphUtils";

const nodeSize = (routeName) => {
  switch(routeName) {
  case "DatabaseView":
    return databaseNodeSize
  case "StandardsView":
    return standardsNodeSize
  case "PoliciesView":
    return policiesNodeSize
  case "SubjectTypeView":
    return subjectNodesSize
  case "DomainTypeView":
    return domainNodeSize
  default:
    return subjectNodesSize
  }
}

export default nodeSize