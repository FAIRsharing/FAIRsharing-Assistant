import {mapActions, mapGetters, mapState} from 'vuex'

const recordTypes = {
  computed:{
    ...mapGetters("bubbleSelectedStore", ["getTopResource"]),
    ...mapState("recordTypeStore", ["allRecordTypes"]),
  },
  methods: {
    ...mapActions("recordTypeStore", ["fetchAllRecordTypes"]),

    /**
     * Rename the top resources
     * @returns {string}
     */
    topResource() {
      switch(this.getTopResource) {
      case "Standards":
        return "Standard"
      case "Policies":
        return "Policy"
      default:
        return this.getTopResource
      }
    },

    /**
     * Fetch the records according the registry selected
     * @param arr - the array to store the records
     * @returns {Promise} - records stored according to registry selected
     */
    async allOtherRecordTypes(arr) {
      await this.fetchAllRecordTypes()
      this.allRecordTypes["records"].filter(({name, fairsharingRegistry}) =>{
        if (this.topResource() === fairsharingRegistry["name"]) {
          arr.push(name)
        }
      })
      return arr
    },
  }
}

export default recordTypes;