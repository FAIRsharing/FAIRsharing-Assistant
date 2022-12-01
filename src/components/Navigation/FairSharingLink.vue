<template>
  <div>
    <p class="ma-0">Link to FAIRsharing:
      <!-- Resource Page Button -->
      <v-btn
          v-if="currentRouteName === 'ResourceTypeView'"
          v-bind="button['attributes']"
          :disabled="!fairSharingButton"
          :href="resourceRedirectionLink"
      >
        {{button["text"]}}
      </v-btn>

      <!-- Subject Page Button -->
      <v-btn
        v-else-if="currentRouteName === 'SubjectTypeView'"
        v-bind="button['attributes']"
        :disabled="!fairSharingButton"
        :href="subjectRedirectionLink"
      >
        {{button["text"]}}
      </v-btn>

      <!-- Domain Page Button -->
      <v-btn
          v-else-if="currentRouteName === 'DomainTypeView'"
          v-bind="button['attributes']"
          :disabled="!fairSharingButton"
          :href="domainRedirectionLink"
      >
        {{button["text"]}}
      </v-btn>
    </p>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import StringMixin from "@/utils/stringMixin.js"

export default {
  name: "FairSharingLink",
  props:[
    "fairSharingButton"
  ],
  mixins: [StringMixin],
  data:() => {
    return {
      fairSharingURL: process.env.VUE_APP_FAIRSHARING_URL,
      button: {
        text: "See FAIRsharing",
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
    resourceSelected() {
      return this.getResource ? this.formatString(this.getResource) : null
    },
    subjectSelected() {
      return Object.values(this.getSubject).length ? this.getSubject["name"].toLowerCase() : null
    },
    domainSelected() {
      return this.getDomain ? this.getDomain.toLowerCase() : null
    },
    resourceRedirectionLink() {
      if (this.subjectSelected && this.resourceSelected) {
        return `${this.fairSharingURL}/search?fairsharingRegistry=${this.getTopResource}&recordType=${this.resourceSelected}&subjects=${this.subjectSelected}`
      }
      else if (this.subjectSelected) {
        return `${this.fairSharingURL}/search?fairsharingRegistry=${this.getTopResource}&subjects=${this.subjectSelected}`
      }
      else if (this.domainSelected && this.resourceSelected) {
        return `${this.fairSharingURL}/search?fairsharingRegistry=${this.getTopResource}&recordType=${this.resourceSelected}&domains=${this.domainSelected}`
      }
      else if (this.domainSelected) {
        return `${this.fairSharingURL}/search?fairsharingRegistry=${this.getTopResource}&domains=${this.domainSelected}`
      }
      else if (this.resourceSelected) {
        return `${this.fairSharingURL}/search?fairsharingRegistry=${this.getTopResource}&recordType=${this.resourceSelected}`
      }
      else {
        return`${this.fairSharingURL}/search?fairsharingRegistry=${this.getTopResource}`
      }
    },
    subjectRedirectionLink() {
      if (this.resourceSelected) {
        return `${this.fairSharingURL}/search?fairsharingRegistry=${this.getTopResource}&recordType=${this.resourceSelected}&subjects=${this.subjectSelected}`
      }
      else if(this.domainSelected) {
        return `${this.fairSharingURL}/search?subjects=${this.subjectSelected}&domains=${this.domainSelected}`
      }
      else {
        return `${this.fairSharingURL}/search?subjects=${this.subjectSelected}`
      }
    },
    domainRedirectionLink() {
      // if (this.domainSelected) {
      //   return `${this.fairSharingURL}/search?fairsharingRegistry=${this.getTopResource}&recordType=${this.resourceSelected}&subjects=${this.subjectSelected}`
      // }
      // else {
        return `${this.fairSharingURL}/search?domains=${this.domainSelected}`
      // }
    }
  },
};
</script>
