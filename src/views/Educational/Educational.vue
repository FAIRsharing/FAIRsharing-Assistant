<template>
  <div class="d-flex flex-column justify-start align-stretch">
    <Jumbotron />
    <div
      v-if="getBreadcrumbs.length > 1"
      class="mb-10 utilityButtons d-flex flex-row justify-space-around full-width margin-auto"
      :class="{ 'flex-column align-center': $vuetify.display.smAndDown }"
    >
      <Breadcrumbs />
    </div>
    <!-- Educational text follows... -->
    <v-container
      fluid
      class="wrapperClass d-flex flex-column align-content-stretch"
    >
      <v-row>
        <!-- This html is from a safe source -->
        <!-- eslint-disable vue/no-v-html -->
        <v-col v-for="(row, index) in text" :key="row + '-' + index" cols="12">
          <span v-html="row" />
        </v-col>
        <!-- eslint-enable vue/no-v-html -->
      </v-row>
    </v-container>
  </div>
</template>

<script>
import Breadcrumbs from "@/components/Navigation/Breadcrumbs.vue";
import Jumbotron from "@/components/Navigation/Jumbotron.vue";
import eduText from "@/data/educational.json";
import { mapGetters } from "vuex";

export default {
  name: "Educational",
  components: { Jumbotron, Breadcrumbs },
  data: () => {
    return {
      text: null,
    };
  },
  computed: {
    ...mapGetters("navigationStore", ["getBreadcrumbs"]),
  },
  mounted() {
    let whichText = this.$route.params.text;
    if (eduText[whichText]) {
      this.text = eduText[whichText];
    } else {
      this.text = ["<p>Nothing to see here!</p>"];
    }
  },
};
</script>
