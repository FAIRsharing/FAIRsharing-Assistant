<template>
  <div>
    <p class="ma-0">Link to FAIRsharing:
      <!-- Resource Page Button -->
      <v-btn
          v-if="currentRouteName === 'ResourceTypeView'"
          v-bind="button['attributes']"
          :disabled="!fairSharingButton"
          :href="
          subjectSelected
          ?
           `https://fairsharing.org/search?fairsharingRegistry=${getTopResource}&recordType=${resourceSelected}&subjects=${subjectSelected}`
          :
          resourceSelected
          ?
           `https://fairsharing.org/search?fairsharingRegistry=${getTopResource}&recordType=${resourceSelected}`
          :
           `https://fairsharing.org/search?fairsharingRegistry=${getTopResource}`"
      >
        {{button["text"]}}
      </v-btn>

      <!-- Subject Page Button -->
      <v-btn
        v-else-if="currentRouteName === 'SubjectTypeView'"
        v-bind="button['attributes']"
        :disabled="!fairSharingButton"
        :href="
         resourceSelected
         ?
          `https://fairsharing.org/search??fairsharingRegistry=${getTopResource}&recordType=${resourceSelected}&subjects=${subjectSelected}`
         :
          `https://fairsharing.org/search?subjects=${subjectSelected}`"
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
    ...mapGetters("bubbleSelectedStore", ['getTopResource', 'getResource', 'getSubject']),
    currentRouteName() {
      return this.$route.name;
    },
    resourceSelected() {
      return this.getResource ? this.formatString(this.getResource) : null
    },
    subjectSelected() {
      return Object.values(this.getSubject).length ? this.getSubject["name"].toLowerCase() : null
    },

  },
};
</script>
