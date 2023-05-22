import {mapActions, mapState} from "vuex";

const allResourceData = {
  name: "Resource",
  records_count: 0,
  children: [],
}

const createResourceStructure = {
  computed: {
    ...mapState("recordTypeStore", ["allRecordTypes", "loadingData"]),
  },
  methods: {
    ...mapActions("recordTypeStore", ["fetchAllRecordTypes", "resetRecords"]),
    /**
     * Creates initial skeleton/structure for resource page as array of objects
     * Level -1 : 3 Registries (Database, Standards, Policy)
     * Level -2 : 14 Record types (e.g knowledgebase, repository, metric etc. )
     * @returns {Array} - Array of objects
     */
    async createResourceStructure(record) {
      await this.fetchAllRecordTypes()
      let topResources = [...new Set(this.allRecordTypes["records"].map(({fairsharingRegistry}) => fairsharingRegistry["name"]))]
      //Filtering "Database" topResource/registry
      topResources = topResources.filter(item => item === record)

      //Converting array of topResource/registry to object
      const topResourceTypeObj = topResources.map((name) => ({name}))

      //Creating Array of object for topResource/registry with chidlren (array of objects)
      topResourceTypeObj.forEach((ele) => {
        ele["children"] = []
        this.allRecordTypes["records"].filter(({name, fairsharingRegistry}) => {
          if(fairsharingRegistry["name"] === ele["name"]) {
            ele["children"].push({
              name: this.normalString(name),
              records_count: 0
            })
          }
        })

        if (ele["name"] === "Database") {
          ele["tree_id"] = 1
          ele["children"].forEach(child => child["tree_id"] = 1)
        }
        else if (ele["name"] === "Standard") {
          ele["name"] = "Standards"
          ele["tree_id"] = 2
          ele["children"].forEach(child => child["tree_id"] = 2)
        }
        else if (ele["name"] === "Policy") {
          ele["name"] = "Policies"
          ele["tree_id"] = 3
          ele["children"].forEach(child => child["tree_id"] = 3)
        }
        allResourceData["children"].push(ele)
      })
      return allResourceData
    },
  }
}

export default createResourceStructure;