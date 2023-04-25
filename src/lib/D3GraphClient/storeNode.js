import bubbleSelectedStore from "@/store"

let itemClicked = ""
// Commit the node in store
const storeNode = (d, routeName) => {
  // When user is on Database, Standards, Policy Page
  if((routeName === "DatabaseView") || (routeName === "StandardsView") || (routeName === "PoliciesView")) {
    if(itemClicked !== d["name"]) {
      if (d["children"] && d["children"].length) {
        itemClicked = d["name"]
        bubbleSelectedStore.commit("bubbleSelectedStore/resourceSelected", {
          topResourceSelected: itemClicked,
          childResourceSelected: ''
        })
      }
      else {
        itemClicked = d["name"]
        bubbleSelectedStore.commit("bubbleSelectedStore/resourceSelected", {
          topResourceSelected: d["name"],
          childResourceSelected: itemClicked,
          recordsNumber: d["value"]
        })
      }
    }
  }

  // When user is on Subject Page
  else if (routeName === "SubjectTypeView") {
    if(itemClicked !== d["name"]) {
      itemClicked = d["name"]
      bubbleSelectedStore.commit("bubbleSelectedStore/subjectSelected", itemClicked)
    }
  }

  // When user is on Domain page
  else if (routeName === "DomainTypeView") {
    if(itemClicked !== d["name"]) {
      itemClicked = d["name"]
      bubbleSelectedStore.commit("bubbleSelectedStore/domainSelected", itemClicked)
    }
  }
}

export default storeNode