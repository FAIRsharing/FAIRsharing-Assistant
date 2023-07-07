<template>
  <div
    class="navSecond d-flex justify-space-around align-center full-width mb-4"
  >
    <v-btn
      v-bind="button['attributes']"
      class="white--text applyFilterBtn"
      @click="addFilters()"
    >
      {{ button["text"] }}
    </v-btn>
  </div>
</template>

<script>
import { mapGetters} from "vuex";
import currentPath from "@/utils/Others/currentPath";

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
    currentRouteQuery() {
      return this.$route.query;
    }
  },
  methods:{
    addFilters() {
      this.noNullFilters = this.getFilters

      if(this.getFilters && this.getFilters.length) {
        this.getFilters.forEach(item => {
          this.$store.commit("nodeListStore/filterLists",  item)
        })
      }
      else {
        this.$store.commit("nodeListStore/filterLists",  {})
      }
      this.applyFilters()
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
        newParams[filter.key] = filter["value"].join(",");
         
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

  }
}
</script>

<style scoped>
.applyFilterBtn {
  text-transform: initial;
}

</style>
