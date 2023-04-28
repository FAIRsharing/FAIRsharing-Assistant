import {subjectNodesSize} from '@/lib/D3GraphClient/SubjectGraphUtils'
import {databaseNodeSize, standardsNodeSize, policiesNodeSize} from "@/lib/D3GraphClient/ResourceGraphUtils";
// Size of text in nodes
const fontSize = (d, routeName) => {
  switch (routeName) {
  case "DatabaseView":
    return Math.sqrt(databaseNodeSize(d)) * 2.2 + "px"
  case "StandardsView":
    return Math.sqrt(standardsNodeSize(d)) * 2.2 + "px"
  case "PoliciesView":
    return Math.sqrt(policiesNodeSize(d)) * 2.2+ "px"
  default:
    return Math.sqrt(subjectNodesSize(d)) * 2.1 + "px"
  }
}

export default fontSize