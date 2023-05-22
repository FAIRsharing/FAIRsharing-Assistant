<template>
  <div>
    <p class="ma-0">
      <!-- Resource Page Button -->
      <v-btn
        v-if="(currentRouteName === 'ResourceTypeView') ||
          (currentRouteName ==='DatabaseView') ||
          (currentRouteName === 'StandardsView') ||
          (currentRouteName === 'PoliciesView')"
        v-bind="button['attributes']"
        :disabled="!fairSharingButton"
        :href="resourceRedirectionLink"
        class="fairSharingBtn"
      >
        {{ button["text"] }}
      </v-btn>

      <!-- Subject Page Button -->
      <v-btn
        v-else-if="currentRouteName === 'SubjectTypeView'"
        v-bind="button['attributes']"
        :disabled="!fairSharingButton"
        :href="subjectRedirectionLink"
        class="fairSharingBtn"
      >
        {{ button["text"] }}
      </v-btn>

      <!-- Domain Page Button -->
      <v-btn
        v-else-if="currentRouteName === 'DomainTypeView'"
        v-bind="button['attributes']"
        :disabled="!fairSharingButton"
        :href="domainRedirectionLink"
        class="fairSharingBtn"
      >
        {{ button["text"] }}
      </v-btn>
    </p>
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
  },
  data:() => {
    return {
      fairSharingURL: process.env.VUE_APP_FAIRSHARING_URL,
      button: {
        text: "View in FAIRsharing",
        attributes: {
          elevation:"2",
          raised: true,
          color: "primary",
          target:"_blank",
          disabled: true
        }
      }
    }
  },
  computed:{
    ...mapGetters("bubbleSelectedStore", ['getTopResource', 'getResource', 'getSubject', 'getDomain']),
    ...mapGetters("nodeListStore", ['getNodeList']),
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
        const resources = resourceNodeList.map(({records}) => records).join(",")
        resourceSelected = this.formatString(resources)
      }
      else {
        resourceSelected = null
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
      else {
        subjectSelected = null
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
      else {
        domainSelected = null
      }
      return domainSelected
    },
    resourceRedirectionLink() {
      if (this.domainSelected && this.subjectSelected) {
        if (this.resourceSelected){
          return `${this.fairSharingURL}/search?fairsharingRegistry=${this.topResourceSelected}&recordType=${this.resourceSelected}&subjects=${this.subjectSelected}&domains=${this.domainSelected}`
        }
        else {
          return `${this.fairSharingURL}/search?fairsharingRegistry=${this.topResourceSelected}&subjects=${this.subjectSelected}&domains=${this.domainSelected}`
        }
      }
      else if (this.subjectSelected && this.resourceSelected) {
        return `${this.fairSharingURL}/search?fairsharingRegistry=${this.topResourceSelected}&recordType=${this.resourceSelected}&subjects=${this.subjectSelected}`
      }
      else if (this.domainSelected && this.resourceSelected) {
        return `${this.fairSharingURL}/search?fairsharingRegistry=${this.topResourceSelected}&recordType=${this.resourceSelected}&domains=${this.domainSelected}`
      }
      else if (this.subjectSelected) {
        return `${this.fairSharingURL}/search?fairsharingRegistry=${this.topResourceSelected}&subjects=${this.subjectSelected}`
      }
      else if (this.domainSelected) {
        return `${this.fairSharingURL}/search?fairsharingRegistry=${this.topResourceSelected}&domains=${this.domainSelected}`
      }
      else if (this.resourceSelected) {
        return `${this.fairSharingURL}/search?fairsharingRegistry=${this.topResourceSelected}&recordType=${this.resourceSelected}`
      }
      else {
        return`${this.fairSharingURL}/search?fairsharingRegistry=${this.topResourceSelected}`
      }
    },
    subjectRedirectionLink() {
      if (this.resourceSelected && this.domainSelected) {
        return `${this.fairSharingURL}/search?fairsharingRegistry=${this.topResourceSelected}&recordType=${this.resourceSelected}&subjects=${this.subjectSelected}&domains=${this.domainSelected}`
      }
      else if (this.topResourceSelected && this.domainSelected) {
        return `${this.fairSharingURL}/search?fairsharingRegistry=${this.topResourceSelected}&subjects=${this.subjectSelected}&domains=${this.domainSelected}`
      }
      else if (this.resourceSelected) {
        return `${this.fairSharingURL}/search?fairsharingRegistry=${this.topResourceSelected}&recordType=${this.resourceSelected}&subjects=${this.subjectSelected}`
      }
      else if (this.topResourceSelected !== "") {
        return `${this.fairSharingURL}/search?fairsharingRegistry=${this.topResourceSelected}&subjects=${this.subjectSelected}`
      }
      else if(this.domainSelected) {
        return `${this.fairSharingURL}/search?subjects=${this.subjectSelected}&domains=${this.domainSelected}`
      }
      else {
        return `${this.fairSharingURL}/search?subjects=${this.subjectSelected}`
      }
    },
    domainRedirectionLink() {
      if (this.resourceSelected && this.subjectSelected) {
        return `${this.fairSharingURL}/search?fairsharingRegistry=${this.topResourceSelected}&recordType=${this.resourceSelected}&subjects=${this.subjectSelected}&domains=${this.domainSelected}`
      }
      else if (this.topResourceSelected && this.subjectSelected) {
        return `${this.fairSharingURL}/search?fairsharingRegistry=${this.topResourceSelected}&subjects=${this.subjectSelected}&domains=${this.domainSelected}`
      }
      else if (this.resourceSelected) {
        return `${this.fairSharingURL}/search?fairsharingRegistry=${this.topResourceSelected}&recordType=${this.resourceSelected}&domains=${this.domainSelected}`
      }
      else if (this.topResourceSelected) {
        return `${this.fairSharingURL}/search?fairsharingRegistry=${this.topResourceSelected}&domains=${this.domainSelected}`
      }
      else if (this.subjectSelected) {
        return `${this.fairSharingURL}/search?subjects=${this.subjectSelected}&domains=${this.domainSelected}`
      }
      else {
        return `${this.fairSharingURL}/search?domains=${this.domainSelected}`
      }
    }
  },
};
</script>

<style lang="scss" scoped>
.fairSharingBtn {
  text-transform: initial;
}
</style>