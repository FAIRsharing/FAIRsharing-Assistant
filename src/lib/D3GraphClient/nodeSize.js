import {resourceNodesSize} from "@/lib/D3GraphClient/ResourceGraphUtils"
import { subjectNodesSize } from "@/lib/D3GraphClient/SubjectGraphUtils";
import { domainNodeSize } from "@/lib/D3GraphClient/DomainGraphUtils";

const nodeSize = (routeName) => {
  if ((routeName === "DatabaseView") || (routeName === "StandardsView") || (routeName === "PoliciesView")) {
    return resourceNodesSize
  }
  else if (routeName === "SubjectTypeView") {
    return subjectNodesSize
  }
  else if (routeName === "DomainTypeView") {
    return domainNodeSize
  }
}

export default nodeSize