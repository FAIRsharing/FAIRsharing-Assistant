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
      this.currentBreadcrumb = questionSets.questionSets[parseInt(this.$route.params.id)].breadcrumb;
    },
    handleNavigation(link) {
      // TODO: replace crumbs with pills, and click them to jump to the right spot/slice crumb array.
      let position = Number.parseInt(link.replace('/',''));
      console.log("POS: " + position);
      this.$store.commit('navigationStore/sliceBreadcrumb', position);
      this.$router.push({path: link});

    },
    formatBreadcrumb(crumb) {
      if (this.getCompliantWith) {
        return crumb.text.replace("FORMAT", this.getCompliantWith);
      }
      else {
        return crumb.text;
      }
    },
  }
}

</script>

<style scoped>
</style>