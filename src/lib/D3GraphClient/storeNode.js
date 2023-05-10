import bubbleSelectedStore from "@/store"

let itemClicked = ""
let parentResource = ""
// Commit the node in store
const storeNode = (d, routeName) => {
  // When user is on Database, Standards, Policy Page
  if((routeName === "DatabaseView") || (routeName === "StandardsView") || (routeName === "PoliciesView")) {
    if(parentResource !== d["name"]) {
      if (d["level"] === 1) {
        parentResource = d["name"]
        bubbleSelectedStore.commit("bubbleSelectedStore/resourceSelected", {
          topResourceSelected: parentResource,
          childResourceSelected: '',
        })
      }
      else if (d["level"] === 2) {
        itemClicked = d["name"]
        bubbleSelectedStore.commit("bubbleSelectedStore/resourceSelected", {
          topResourceSelected: parentResource,
          childResourceSelected: itemClicked,
          recordsNumber: d["records_count"]
        })
      }
    }
  }

  // When user is on Subject Page
  else if (routeName === "SubjectTypeView") {
    if(itemClicked !== d["name"]) {
      itemClicked = d["name"]
      bubbleSelectedStore.commit("bubbleSelectedStore/subjectSelected", {
        subjectSelected: itemClicked,
        recordsNumber: d["records_count"]
      })
    }
  }

  // When user is on Domain page
  else if (routeName === "DomainTypeView") {
    if(itemClicked !== d["name"]) {
      itemClicked = d["name"]
      bubbleSelectedStore.commit("bubbleSelectedStore/domainSelected", {
        domainSelected: itemClicked,
        recordsNumber: d["records_count"]
      })
    }
  }
}

export default storeNode