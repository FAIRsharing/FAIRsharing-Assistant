<template>
  <v-row>
    <v-col
      cols="12"
      class="ml-4"
    >
      <v-chip
        v-if="getSummaryText()"
        key="help_breadcrumb"
        class="ma-2"
        color="pink"
        text-color="white"
        label
        @click="summary = true"
      >
        <v-icon>fa fa-question-circle</v-icon>
      </v-chip>
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
        :key="'active_' + currentBreadcrumb.id"
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
    <v-dialog
      v-model="summary"
      activator="parent"
      width="auto"
    >
      <v-card>
        <!-- This html is from a safe source -->
        <!-- eslint-disable vue/no-v-html -->
        <v-card-title>
          Summary
        </v-card-title>
        <v-card-text
          v-html="getSummaryText()"
        />
        <!-- eslint-enable vue/no-v-html -->
        <v-card-actions>
          <v-btn
            color="primary"
            @click="summary = false"
          >
            Close
          </v-btn>
          <v-btn
            color="primary"
            @click="copySummary()"
          >
            Copy
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>

import questionSets from "@/data/questionPageData.json";
import summaries from "@/data/navigationSummary.json";
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
      breadcrumbs: null,
      show: false,
      summary: false
    }
  },
  computed: {
    ...mapGetters('navigationStore', ["getCompliantWith", "getCompliantWithPolicy", "getBreadcrumbs"]),
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
            id: 'results_crumb',
            text: 'Results',
            link: '/results'
          }
        }
        else if (this.$route.path === '/educational/claim') {
          this.currentBreadcrumb = {
            id: 'educational_claim_crumb',
            text: "Claim your record(s) in FAIRsharing",
            link: '/educational/claim'
          }
        }
        else if (this.$route.path === '/educational/register') {
          this.currentBreadcrumb = {
            id: "eductional_register_crumb",
            text: "Register your resources(s) with FAIRsharing",
            link: '/educational/register'
          }
        }
        else if (this.$route.path === '/refine') {
          this.currentBreadcrumb = {
            id: "refine_crumb",
            text: "Refine your choice",
            link: '/refine'
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
      let path;
      if (this.$route.params.id) {
        path = "/" + this.$route.params.id;
      }
      else {
        path = this.$route.path;
      }
      this.$store.commit('navigationStore/setNavigationState', path);
      this.$router.push({path: link});
    },
    formatBreadcrumb(crumb) {
      if (this.getCompliantWith && crumb.text.includes('FORMAT')) {
        return crumb.text.replace("FORMAT", this.getCompliantWith);
      }
      if (this.getCompliantWithPolicy && crumb.text.includes('POLICY')) {
        return crumb.text.replace("POLICY", this.getCompliantWithPolicy);
      }
      if (this.getCurrentRegistry && crumb.text.includes('Resource type')) {
        return crumb.text.replace('...', '');
      }
      let tagText = [];
      ['subjects', 'domains', 'taxonomies', 'user_defined_tags'].forEach((tagField) => {
        if (this.getQueryParams[tagField] && this.getQueryParams[tagField].length > 0) {
          tagText.push(...this.getQueryParams[tagField]);
        }
      });
      if (tagText.length > 0 && crumb.text.includes('...') && crumb.text.includes('Research area')) {
        return crumb.text.replace("...", `<b>${tagText.join(', ')}</b>`);
      }
      return crumb.text;
    },
    async copySummary() {
      try {
        await navigator.clipboard.writeText(this.getSummaryText());
      }
      catch($e) {
        // An alert could be used here, perhaps.
      }
    },
    getSummaryText() {
      let key = String(this.$route.params.id);
      return summaries[key];
    }
  }
}

</script>

<style scoped>
</style>