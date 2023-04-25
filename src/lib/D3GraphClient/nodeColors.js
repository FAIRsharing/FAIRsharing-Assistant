import { subjectFillColors, subjectLinkColors, subjectStrokeColors} from "@/lib/D3GraphClient/SubjectGraphUtils";
import { domainFillColors, domainLinkColors, domainStrokeColors } from "@/lib/D3GraphClient/DomainGraphUtils";

const nodeColors = (routeName) => {
  if (routeName === "SubjectTypeView") {
    return ({
      "fill": subjectFillColors,
      "stroke": subjectStrokeColors,
      "outline-color": subjectFillColors
    })
  }
  else if (routeName === "DomainTypeView") {
    return ({
      "fill": domainFillColors,
      "stroke": domainStrokeColors,
      "outline-color": domainFillColors
    })
  }
}

const linkColors = (routeName) => {
  if (routeName === "SubjectTypeView") {
    return subjectLinkColors
  }
  else if (routeName === "DomainTypeView") {
    return domainLinkColors
  }
}

const tooltipColors = (d, routeName) => {
  if (routeName === "SubjectTypeView") {
    return subjectFillColors(d)
  }
  else if (routeName === "DomainTypeView") {
    return domainFillColors(d)
  }
}

export { nodeColors, linkColors, tooltipColors }