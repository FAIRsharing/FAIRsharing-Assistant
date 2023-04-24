import bubbleSelectedStore from "@/store"

const pathName = window.location.pathname
let itemClicked = ""
// Commit the node in store
const storeNode = (d) => {
  // When user is on Database, Standards, Policy Page
  if((pathName === "/database") || (pathName === "/policies") || (pathName === "/standards")) {
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
  else if (pathName === "/subject") {
    if(itemClicked !== d["name"]) {
      itemClicked = d["name"]
      bubbleSelectedStore.commit("bubbleSelectedStore/subjectSelected", itemClicked)
    }
  }
  // When user is on Domain page
  else if (pathName === "/domain") {
    if(itemClicked !== d["name"]) {
      itemClicked = d["name"]
      bubbleSelectedStore.commit("bubbleSelectedStore/domainSelected", itemClicked)
    }
  }
}

export default storeNode