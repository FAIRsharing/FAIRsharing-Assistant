import {mapActions, mapState} from "vuex";
import otherResourcesSelectedStore from "@/store"

const calculateResourceRecords = {
  computed: {
    ...mapState("multiTagsStore", ["fairSharingRecords", "loadingStatus"]),
  },
  destroyed() {
    this.resetMultiTags()
  },
  methods: {
    ...mapActions("multiTagsStore", ["fetchMultiTagsTerms", "resetMultiTags"]),
    /**
     * Calculate the number of fairSharing records for each record type and assign the total
     * @param {String} resourceSelected - The resource selected
     * @param {String} subjectSelected - The subject selected
     * @param {String} domainSelected - The domain selected
     * @param {Array} otherResourceType - All the recordTypes
     * @returns {Number} - Number of  each recordsTpe
     */
    async calculateRecords(resourceSelected, subjectSelected, domainSelected, otherResourceType) {
      //Using multiTagFilter Query
      await this.fetchMultiTagsTerms([resourceSelected, subjectSelected, domainSelected])


      for (let childResource of otherResourceType) {
        childResource["records_count"] = 0
        this.fairSharingRecords.filter(ele => {
          if (ele["type"] === this.formatString(childResource["name"])) {
            childResource["records_count"]++
          }
        })
      }
      otherResourcesSelectedStore.commit("otherResourcesSelectedStore/otherResourceSelected", otherResourceType)
    },
  }
}

export default calculateResourceRecords;