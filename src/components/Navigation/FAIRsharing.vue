<template>
  <div>
    <p class="ma-0">Link to FAIRsharing:
      <v-btn
        :disabled="!fairSharingButton"
        elevation="2"
        raised
        color="primary"
        target="_blank"
        :href="
         resourceSelected
         ?
         `https://fairsharing.org/search?recordType=${resourceSelected}&subjects=${subjectSelected}`
         :
         `https://fairsharing.org/search?subjects=${subjectSelected}`"
      >See FAIRsharing
      </v-btn>

      {{ getResource ? getResource: null}}
      {{getSubject['name']}}
    </p>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import StringMixin from "@/utils/stringMixin.js"

export default {
  name: "FAIRsharing",
  props:[
    "pageName",
    "fairSharingButton"
  ],
  mixins: [StringMixin],
  computed:{
    ...mapGetters("bubbleSelectedStore", ['getSubject', 'getResource']),

    subjectSelected() {
      return Object.values(this.getSubject).length ? this.getSubject["name"].toLowerCase() : null
    },

    resourceSelected() {
      return this.getResource ? this.formatString(this.getResource) : null
    }
  },

  mounted(){
    console.log("this.getSubject::", this.getSubject)
    console.log("this.getResource::", this.getResource)
    console.log("this.pageName::", this.pageName)
    console.log("this.fairSharingButton::", this.fairSharingButton)
  },

};
</script>
