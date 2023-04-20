import * as am5hierarchy from "@amcharts/amcharts5/hierarchy";

export const breadCrumbBar = (container, root, series) => {
  container.children.unshift(
    am5hierarchy.BreadcrumbBar.new(root, {
      series: series
    }), 0
  )
}