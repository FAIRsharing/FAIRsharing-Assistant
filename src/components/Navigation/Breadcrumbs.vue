<template>
  <v-row>
    <v-col
      cols="12"
      class="ml-4"
    >
      <!-- This html is from a safe source -->
      <!-- eslint-disable vue/no-v-html -->
      <span
        class="ma-4"
        v-html="breadcrumbs"
      />
      <!-- eslint-enable vue/no-v-html -->
    </v-col>
  </v-row>
</template>

<script>

import questionSets from "@/data/questionPageData.json";
import {mapGetters} from "vuex";

export default {
  name: 'Breadcrumbs',
  data(){
    return {
      crumbRoot: {
        link: '/',
        text: 'Home'
      },
      currentBreadcrumb: null,
      breadcrumbs: null
    }
  },
  computed: {
    ...mapGetters('navigationStore', ["getCompliantWith", "getBreadcrumbs"]),
  },
  watch: {
    '$route'() {
      this.setBreadcrumbs();
    },
  },
  mounted() {
    this.setBreadcrumbs();
  },
  methods: {
    setBreadcrumbs() {
      this.currentBreadcrumb = questionSets.questionSets[parseInt(this.$route.params.id)].breadcrumb;
      let crumbList = this.getBreadcrumbs.map((x) => this.formatBreadcrumb(x)).join(' > ');
      if (crumbList.length) {
        this.breadcrumbs = this.formatBreadcrumb(this.crumbRoot) + ' > ' + crumbList;
      }
      else {
        this.breadcrumbs = this.formatBreadcrumb(this.crumbRoot);
      }
      this.breadcrumbs = this.breadcrumbs + ' > ' + this.currentBreadcrumb.text;
      // Remove the "FORMAT" and replace with the user's selected format.
      if (this.getCompliantWith) {
        this.breadcrumbs = this.breadcrumbs.replace("FORMAT", this.getCompliantWith);
      }
    },
    handleNavigation() {
      // TODO: replace crumbs with pills, and click them to jump to the right spot/slice crumb array.
    },
    formatBreadcrumb(crumb) {
      return `<a href="${crumb.link}" > ${crumb.text}</a>`
    },
  }
}

</script>

<style scoped>
</style>