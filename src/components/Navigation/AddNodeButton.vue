<template>
  <div
    class="navSecond align-center ml-4"
  >
    <v-tooltip
      v-model="showAlertTooltip"
      top
      color="red accent-4"
    >
      <template #activator="{ }">
        <v-btn
          :bind="button['attributes']"
          color="deep-orange"
          small
          class="white--text backBtn"
          @click="addNodeToList"
        >
          {{ button["text"] }} {{ getNodeName() }}
        </v-btn>
      </template>
      <span>Already Added!</span>
    </v-tooltip>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from "vuex";


export default {
  name: "AddNodeButton",
  props:{
    previousPage: {
      type: String,
      default: null
    },
  },
  data () {
    return {
      button: {
        text: "Add",
        attributes: {
          elevation:"2",
          rounded: true,
          raised: true,
          color: "deep-orange",
        }
      },
      showAlertTooltip: false,
    }
  },
  computed:{
    currentRouteName() {
      return this.$route.name;
    },
    ...mapGetters("bubbleSelectedStore", ['getTopResource','getResource','getSubject', 'getDomain', 'getNodes']),
    ...mapMutations("nodeListStore", ['nodeListStore']),
    ...mapGetters("nodeListStore", ['getNodeFound'])
  },
  beforeDestroy() {
    clearTimeout(this._timerId)
  },
  methods:{
    addNodeToList() {
      this.$store.commit("nodeListStore/nodeLists", this.getNodes)
      if (this.getNodeFound) {
        this.showAlertTooltip = true
        this._timerId = setTimeout(() => this.showAlertTooltip = false, 3000)
      }
      else {
        this.showAlertTooltip = false
      }

    },
    getNodeName() {
      if ((this.currentRouteName === "DatabaseView") || (this.currentRouteName === "StandardsView") || (this.currentRouteName === "PoliciesView")) {
        return this.getResource
      }
      else if (this.currentRouteName === "SubjectTypeView") {
        return this.getSubject
      }
      else if (this.currentRouteName === "DomainTypeView") {
        return this.getDomain
      }
    },
  },
}
</script>


<style scoped>
.backBtn {
  text-transform: initial;
}

</style>
