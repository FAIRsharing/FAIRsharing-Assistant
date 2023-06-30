<template>
  <div
    class="navSecond d-flex justify-space-around align-center full-width mb-4"
  >
    <v-btn
      v-bind="button['attributes']"
      class="white--text applyFilterBtn"
      @click="addFilters"
    >
      {{ button["text"] }}
    </v-btn>
  </div>
</template>

<script>
import { mapGetters} from "vuex";
import currentPath from "@/utils/Others/currentPath";
// import getRecords from "@/utils/Others/getRecords";

export default {
  name: "ApplyFilterButton",
  data () {
    return {
      button: {
        text: "Apply Filter",
        attributes: {
          elevation:"2",
          raised: true,
          color: "ready_color",
        }
      },
      noNullFilters: []
    }
  },
  computed:{
    ...mapGetters("addOnFilterSelectedStore", ["getFilters"]),
    // ...mapGetters("nodeListStore", ['getNodeList', 'getFilterLists']),
    // ...mapState("variableTagStore", ["variableResponse", "loadingStatus"]),
    currentRouteQuery() {
      return this.$route.query;
    }

  },
  methods:{
    // ...mapActions("variableTagStore", ["fetchVariableTags"]),
    async addFilters() {
      let filtersOpted = []
      this.getFilters.forEach((value, key) => {
        filtersOpted.push({key, value})
        this.noNullFilters = filtersOpted.filter(item => item.value !== "null")
      });
      this.$store.commit("nodeListStore/filterLists",  this.noNullFilters)
      this.applyFilters()
      // await this.fetchFilteredResult()
    },

    applyFilters() {
      let _module = this;
      let params = currentPath(this.currentRouteQuery);
      let newParams = {};
      // Set the list of parameters of interest
      if ('registry' in params) {
        newParams.registry = params.registry;
      }
      if ('record_type' in params) {
        newParams.record_type = params.record_type;
      }

      this.noNullFilters.forEach(filter => {
        newParams[filter.key] = filter["value"];
         
      })
      _module.$router.push({
        name: _module.$route.name,
        query: newParams
      }).catch(err => {
        // Ignore the vuex err regarding  navigating to the page they are already on.
        if (
          err.name !== 'NavigationDuplicated' &&
                  !err.message.includes('Avoided redundant navigation to current location')
        ) {
          // But print any other errors to the console
          //console.log(err);
        }
      });
    },

    // async fetchFilteredResult() {
    //   console.log("this.getNodeList::", this.getNodeList)
    //   console.log("this.getFilters::", this.getFilters)
    //   const {resourceNodeList, subjectNodeList, domainNodeList} = this.getNodeList
    //
    //   console.log("resourceNodeList::", resourceNodeList)
    //   const subjectSelected =  subjectNodeList.length ? getRecords(subjectNodeList) : null
    //
    //   const domainSelected = domainNodeList.length ? getRecords(domainNodeList) : null
    //
    //   await this.fetchVariableTags([resourceNodeList, subjectSelected, domainSelected, "resource", this.getFilters])
    // }
  }
}
</script>

<style scoped>
.applyFilterBtn {
  text-transform: initial;
}

</style>
