<template>
  <div class="ma-0">
    <!-- Resource Page Button -->
    <v-btn
      v-if="
        ((currentRouteName ==='DatabaseView') || (prevRoute ==='DatabaseView')) ||
          ((currentRouteName === 'StandardsView') || (prevRoute ==='StandardsView')) ||
          ((currentRouteName === 'PoliciesView') || (prevRoute ==='PoliciesView') ||(prevRoute === 'RefineResourceView'))"
      v-bind="button['attributes']"
      :disabled="!fairSharingButton"
      :href="resourceRedirectionLink"
      class="fairSharingBtn"
    >
      {{ button["text"] }}
    </v-btn>

    <!-- Subject Page Button -->
    <v-btn
      v-else-if="((currentRouteName === 'SubjectTypeView') || (prevRoute === 'SubjectTypeView'))"
      v-bind="button['attributes']"
      :disabled="!fairSharingButton"
      :href="subjectRedirectionLink"
      class="fairSharingBtn"
    >
      {{ button["text"] }}
    </v-btn>

    <!-- Domain Page Button -->
    <v-btn
      v-else-if="((currentRouteName === 'DomainTypeView') || (prevRoute === 'DomainTypeView'))"
      v-bind="button['attributes']"
      :disabled="!fairSharingButton"
      :href="domainRedirectionLink"
      class="fairSharingBtn"
    >
      {{ button["text"] }}
    </v-btn>

    <v-tooltip
      v-if="!fairSharingButton"
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
          v-on="on"
        >
          fa fa-question-circle
        </v-icon>
      </template>
      <span v-if="isObjEmpty">Click on the bubble and add record to the list to enable</span>
      <span v-else>Add record to the list to enable</span>
    </v-tooltip>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import StringMixin from "@/utils/Others/stringMixin.js"

export default {
  name: "FairSharingLink",
  mixins: [StringMixin],
  props:{
    fairSharingButton: {
      type: Boolean,
      default: false
    },
    prevRoute: {
      type: String,
      default: ''
    },
  },
  data:() => {
    return {
      fairSharingURL: '/results',
      button: {
        text: "View results",
        attributes: {
          elevation:"2",
          raised: true,
          color: "primary",
          target:"_blank",
        }
      }
    }
  },
  computed:{
    ...mapGetters("bubbleSelectedStore", ['getTopResource', 'getResource', 'getSubject', 'getDomain', 'getNodes']),
    ...mapGetters("nodeListStore", ['getNodeList']),
    isObjEmpty () {
      return Object.keys(this.getNodes).length === 0;
    },
    currentRouteName() {
      return this.$route.name;
    },

    topResourceSelected() {
      switch(this.getTopResource) {
      case "Databases":
        return "Database"
      case "Standards":
        return "Standard"
      case "Policies":
        return "Policy"
      default:
        return this.getTopResource;
      }
    },
    resourceSelected() {
      const { resourceNodeList } = this.getNodeList
      let resourceSelected = ""
      if (resourceNodeList && resourceNodeList.length) {
        // Filtering Record types only
        const recordType = resourceNodeList.filter(({type}) => type === "resource")
        const resources = recordType.map(({records}) => records).join(",")
        resourceSelected = this.formatString(resources)
      }
      return resourceSelected

    },
    subjectSelected() {
      const { subjectNodeList } = this.getNodeList
      let subjectSelected = ""
      if (subjectNodeList && subjectNodeList.length) {
        const subjects = subjectNodeList.map(({records}) => records).join(",")
        subjectSelected = subjects.toLowerCase()
      }
      return subjectSelected
    },
    domainSelected() {
      const { domainNodeList } = this.getNodeList
      let domainSelected = ""
      if (domainNodeList && domainNodeList.length) {
        const domains = domainNodeList.map(({records}) => records).join(",")
        domainSelected = domains.toLowerCase()
      }
      return domainSelected
    },
    resourceRedirectionLink() {
      if (this.domainSelected && this.subjectSelected) {
        if (this.resourceSelected){
          return `${this.fairSharingURL}?fairsharingRegistry=${this.topResourceSelected}&recordType=${this.resourceSelected}&subjects=${this.subjectSelected}&domains=${this.domainSelected}`
        }
        else {
          return `${this.fairSharingURL}?fairsharingRegistry=${this.topResourceSelected}&subjects=${this.subjectSelected}&domains=${this.domainSelected}`
        }
      }
      else if (this.subjectSelected && this.resourceSelected) {
        return `${this.fairSharingURL}?fairsharingRegistry=${this.topResourceSelected}&recordType=${this.resourceSelected}&subjects=${this.subjectSelected}`
      }
      else if (this.domainSelected && this.resourceSelected) {
        return `${this.fairSharingURL}?fairsharingRegistry=${this.topResourceSelected}&recordType=${this.resourceSelected}&domains=${this.domainSelected}`
      }
      else if (this.subjectSelected) {
        return `${this.fairSharingURL}?fairsharingRegistry=${this.topResourceSelected}&subjects=${this.subjectSelected}`
      }
      else if (this.domainSelected) {
        return `${this.fairSharingURL}?fairsharingRegistry=${this.topResourceSelected}&domains=${this.domainSelected}`
      }
      else if (this.resourceSelected) {
        return `${this.fairSharingURL}?fairsharingRegistry=${this.topResourceSelected}&recordType=${this.resourceSelected}`
      }
      else {
        return`${this.fairSharingURL}?fairsharingRegistry=${this.topResourceSelected}`
      }
    },
    subjectRedirectionLink() {
      if (this.resourceSelected && this.domainSelected) {
        return `${this.fairSharingURL}?fairsharingRegistry=${this.topResourceSelected}&recordType=${this.resourceSelected}&subjects=${this.subjectSelected}&domains=${this.domainSelected}`
      }
      else if (this.topResourceSelected && this.domainSelected) {
        return `${this.fairSharingURL}?fairsharingRegistry=${this.topResourceSelected}&subjects=${this.subjectSelected}&domains=${this.domainSelected}`
      }
      else if (this.resourceSelected) {
        return `${this.fairSharingURL}?fairsharingRegistry=${this.topResourceSelected}&recordType=${this.resourceSelected}&subjects=${this.subjectSelected}`
      }
      else if (this.topResourceSelected !== "") {
        return `${this.fairSharingURL}?fairsharingRegistry=${this.topResourceSelected}&subjects=${this.subjectSelected}`
      }
      else if(this.domainSelected) {
        return `${this.fairSharingURL}?subjects=${this.subjectSelected}&domains=${this.domainSelected}`
      }
      else {
        return `${this.fairSharingURL}?subjects=${this.subjectSelected}`
      }
    },
    domainRedirectionLink() {
      if (this.resourceSelected && this.subjectSelected) {
        return `${this.fairSharingURL}?fairsharingRegistry=${this.topResourceSelected}&recordType=${this.resourceSelected}&subjects=${this.subjectSelected}&domains=${this.domainSelected}`
      }
      else if (this.topResourceSelected && this.subjectSelected) {
        return `${this.fairSharingURL}?fairsharingRegistry=${this.topResourceSelected}&subjects=${this.subjectSelected}&domains=${this.domainSelected}`
      }
      else if (this.resourceSelected) {
        return `${this.fairSharingURL}?fairsharingRegistry=${this.topResourceSelected}&recordType=${this.resourceSelected}&domains=${this.domainSelected}`
      }
      else if (this.topResourceSelected) {
        return `${this.fairSharingURL}?fairsharingRegistry=${this.topResourceSelected}&domains=${this.domainSelected}`
      }
      else if (this.subjectSelected) {
        return `${this.fairSharingURL}?subjects=${this.subjectSelected}&domains=${this.domainSelected}`
      }
      else {
        return `${this.fairSharingURL}?domains=${this.domainSelected}`
      }
    }
  },
};
</script>

<style lang="scss" scoped>
.fairSharingBtn {
  text-transform: initial;
}
.v-tooltip__content[data-v-140955c7] {
  background-color: #3f51b5 !important;
}
</style>