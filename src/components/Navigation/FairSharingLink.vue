<template>
  <div>
    <p class="ma-0">
      <!-- Resource Page Button -->
      <v-btn
        v-if="currentRouteName === 'ResourceTypeView' || 'DatabaseView' ||'StandardsView'|| 'PoliciesView'"
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
    currentRouteName() {
      return this.$route.name;
    },
    topResourceSelected() {
      let topResource;
      switch(this.getTopResource) {
      case "Databases":
        topResource = "Database"
        break;
      case "Standards":
        topResource = "Standard"
        break;
      case "Policies":
        topResource = "Policy"
        break;
      default:
        topResource = this.getTopResource;
        break;
      }
      return topResource
    },
    resourceSelected() {
      return this.getResource ? this.formatString(this.getResource) : null
    },
    subjectSelected() {
      return this.getSubject ? this.getSubject.toLowerCase() : null
    },
    domainSelected() {
      return this.getDomain ? this.getDomain.toLowerCase() : null
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
      else if (this.topResourceSelected) {
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