<template>
  <v-row>
    <v-col
      cols="12"
      class="ml-4"
    >
      <v-chip
        :key="crumbRoot.id"
        class="ma-2"
        color="pink"
        text-color="white"
        label
        @click="handleNavigation(crumbRoot.link)"
      >
        {{ formatBreadcrumb(crumbRoot) }}
      </v-chip>
      <v-chip
        v-for="crumb in (getBreadcrumbs)"
        :key="crumb.id"
        class="ma-2"
        color="pink"
        text-color="white"
        label
        @click="handleNavigation(crumb.link)"
      >
        <!-- This html is from a safe source -->
        <!-- eslint-disable vue/no-v-html -->
        <span v-html="formatBreadcrumb(crumb)" />
        <!-- eslint-enable vue/no-v-html -->
      </v-chip>
      <v-chip
        :key="currentBreadcrumb.id"
        class="ma-2"
        color="pink"
        text-color="pink"
        label
        outlined
      >
        <!-- This html is from a safe source -->
        <!-- eslint-disable vue/no-v-html -->
        <span v-html="formatBreadcrumb(currentBreadcrumb)" />
        <!-- eslint-enable vue/no-v-html -->
      </v-chip>
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
        id: "crumbroot",
        link: '/',
        text: 'Home'
      },
      currentBreadcrumb: {
        link: '/',
        text: '',
        id: 'nullcrumb'
      },
      breadcrumbs: null
    }
  },
  computed: {
    ...mapGetters('navigationStore', ["getCompliantWith", "getBreadcrumbs"]),
    ...mapGetters('multiTagsStore', ["getCurrentRegistry", "getQueryParams"]),
  },
  watch: {
    '$route'() {
      this.setBreadcrumb();
    },
  },
  mounted() {
    this.setBreadcrumb();
  },
  methods: {
    setBreadcrumb() {
      let questionData = questionSets.questionSets.find(q => parseInt(q['path']) === parseInt(this.$route.params.id));
      // Breadcrumbs may be visible on a non-question page, specifically results if users have got there via the
      // questions. So, there won't be a currentBreadcrumb defined.
      try {
        this.currentBreadcrumb = JSON.parse(JSON.stringify(questionData.breadcrumb));
      }
      // TODO: Perhaps currentBreadcrumb definitions could be put in a JSON file...
      catch {
        if (this.$route.path === '/results') {
          this.currentBreadcrumb = {
            text: 'Results',
            link: '/results'
          }
        }
        else if (this.$route.path === '/educational/claim') {
          this.currentBreadcrumb = {
            text: "Claim your record(s) in FAIRsharing",
            link: '/educational/claim'
          }
        }
        else if (this.$route.path === '/educational/register') {
          this.currentBreadcrumb = {
            text: "Register your resources(s) with FAIRsharing",
            link: '/educational/register'
          }
        }
      }
    },
    handleNavigation(link) {
      this.$store.commit('navigationStore/sliceBreadcrumb', link);
      // We should be going backwards at this point
      // TODO: Find queries in the routeQuery store further advanced than the current click target, and clear them.
      // TODO: This could probably go in the store.
      this.$store.commit('navigationStore/clearPreviousNavigation', link);
      this.$router.push({path: link});
    },
    formatBreadcrumb(crumb) {
      if (this.getCompliantWith && crumb.text.includes('FORMAT')) {
        return crumb.text.replace("FORMAT", this.getCompliantWith);
      }
      if (this.getCurrentRegistry && crumb.text.includes('REGISTRY')) {
        return crumb.text.replace("REGISTRY", this.getCurrentRegistry);
      }
      let tagText = [];
      ['subjects', 'domains', 'taxonomies', 'user_defined_tags'].forEach((tagField) => {
        if (this.getQueryParams[tagField] && this.getQueryParams[tagField].length > 0) {
          tagText.push(...this.getQueryParams[tagField]);
        }
      });
      if (tagText.length > 0 && crumb.text.includes('...')) {
        return crumb.text.replace("...", `<b>${tagText.join(', ')}</b>`);
      }
      return crumb.text;
    },
  }
}

</script>

<style scoped>
</style>