<template>
  <div
    class="navSecond align-center ml-2"
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

    <v-tooltip
      color="indigo"
      right
    >
      <template #activator="{ on, attrs }">
        <v-icon
          color="primary"
          dark
          small
          v-bind="attrs"
          class="ml-2"
          v-on="on
          "
        >
          fa fa-question-circle
        </v-icon>
      </template>
      <span>Click Add {{ getNodeName() }} to add to the list</span>
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
    ...mapMutations("nodeListStore", ['nodeLists']),
    ...mapGetters("nodeListStore", ['getNodeFound'])
  },
  beforeDestroy() {
    clearTimeout(this._timerId)
  },
  methods:{
    addNodeToList() {
      this.$store.commit("nodeListStore/nodeLists", [this.getNodes, this.currentRouteName])

      //When user is on database/standards/policies page
      if ((this.currentRouteName === "DatabaseView") || (this.currentRouteName === "StandardsView") || (this.currentRouteName === "PoliciesView")) {
        if (this.getNodeFound["isResourceNode"]) {
          this.alertTooltip()
        }
      }

      //When user is on subject page
      else if (this.currentRouteName === "SubjectTypeView") {
        if (this.getNodeFound["isSubjectNode"]) {
          this.alertTooltip()
        }
      }

      //When user is on domain page
      else if (this.currentRouteName === "DomainTypeView") {
        if (this.getNodeFound["isDomainNode"]) {
          this.alertTooltip()
        }
      }
    },
    getNodeName() {
      if ((this.currentRouteName === "DatabaseView") || (this.currentRouteName === "StandardsView") || (this.currentRouteName === "PoliciesView")) {
        return !this.getResource ? this.getTopResource : this.getResource
      }
      else if (this.currentRouteName === "SubjectTypeView") {
        return this.getSubject
      }
      else if (this.currentRouteName === "DomainTypeView") {
        return this.getDomain
      }
    },
    alertTooltip() {
      this.showAlertTooltip = true
      this._timerId = setTimeout(() => this.showAlertTooltip = false, 3000)
    },
  },
}
</script>


<style scoped>
.backBtn {
  text-transform: initial;
}

</style>
