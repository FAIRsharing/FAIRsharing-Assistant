<template>
  <v-row>
    <v-col cols="12" class="ml-4">
      <v-chip
        v-if="getSummaryText()"
        key="help_breadcrumb"
        class="ma-2"
        color="pink"
        variant="flat"
        label
        @click="summary = true"
      >
        <v-icon size="x-large" icon="fa fa-question-circle" />
      </v-chip>
      <v-chip
        :key="crumbRoot.id"
        class="ma-2"
        color="pink"
        variant="flat"
        label
        @click="handleNavigation(crumbRoot.link)"
      >
        {{ formatBreadcrumb(crumbRoot) }}
      </v-chip>
      <v-chip
        v-for="crumb in getBreadcrumbs"
        :key="crumb.id"
        class="ma-2"
        color="pink"
        variant="flat"
        label
        @click="handleNavigation(crumb.link)"
      >
        <!-- This html is from a safe source -->
        <!-- eslint-disable vue/no-v-html -->
        <span v-html="formatBreadcrumb(crumb)" />
        <!-- eslint-enable vue/no-v-html -->
      </v-chip>
      <v-chip
        id="currentBreadcrumb"
        :key="'active_' + currentBreadcrumb.id"
        class="ma-2"
        color="pink"
        label
        variant="outlined"
      >
        <!-- This html is from a safe source -->
        <!-- eslint-disable vue/no-v-html -->
        <span v-html="formatBreadcrumb(currentBreadcrumb)" />
        <!-- eslint-enable vue/no-v-html -->
      </v-chip>
    </v-col>
  </v-row>
  <v-dialog :model-value="summary" width="auto">
    <v-card>
      <!-- This html is from a safe source -->
      <!-- eslint-disable vue/no-v-html -->
      <v-card-title> Summary </v-card-title>
      <v-card-text>
        <span v-html="getSummaryText()" />
      </v-card-text>
      <!-- eslint-enable vue/no-v-html -->
      <v-card-actions class="justify-center">
        <v-btn
          elevation="2"
          color="primary"
          variant="flat"
          @click="summary = false"
        >
          Close
        </v-btn>
        <v-btn
          elevation="2"
          color="accent2"
          variant="flat"
          @click="copySummary()"
        >
          Copy
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import stringUtils from "@/utils/stringUtils";
import questionSets from "@/data/questionPageData.json";
import summaries from "@/data/navigationSummary.json";
import { mapGetters } from "vuex";

export default {
  name: "Breadcrumbs",
  mixins: [stringUtils],
  data() {
    return {
      crumbRoot: {
        id: "crumbroot",
        link: "/",
        text: "Home",
      },
      currentBreadcrumb: {
        link: "/",
        text: "",
        id: "nullcrumb",
      },
      breadcrumbs: null,
      show: false,
      summary: false,
      path: "",
      summaryKey: "",
    };
  },
  computed: {
    ...mapGetters("navigationStore", [
      "getCompliantWith",
      "getCompliantWithPolicy",
      "getBreadcrumbs",
      "getRole",
      "getRestrict",
    ]),
    ...mapGetters("multiTagsStore", [
      "getCurrentRegistry",
      "getQueryParams",
      "getFairSharingRecords",
    ]),
  },
  watch: {
    $route() {
      this.setBreadcrumb();
    },
  },
  mounted() {
    this.setBreadcrumb();
  },
  methods: {
    setBreadcrumb() {
      let questionData = questionSets.questionSets.find(
        (q) => parseInt(q["path"]) === parseInt(this.$route.params.id),
      );
      // Breadcrumbs may be visible on a non-question page, specifically results if users have got there via the
      // questions. So, there won't be a currentBreadcrumb defined.
      try {
        this.currentBreadcrumb = JSON.parse(
          JSON.stringify(questionData.breadcrumb),
        );
      }
      catch {
        // TODO: Perhaps currentBreadcrumb definitions could be put in a JSON file...
        if (this.$route.path === "/results") {
          this.currentBreadcrumb = {
            id: "results_crumb",
            text: "Results",
            link: "/results",
          };
        }
        else if (this.$route.path === "/educational/claim") {
          this.currentBreadcrumb = {
            id: "educational_claim_crumb",
            text: "Claim your record(s) in FAIRsharing",
            link: "/educational/claim",
          };
        }
        else if (this.$route.path === "/educational/register") {
          this.currentBreadcrumb = {
            id: "eductional_register_crumb",
            text: "Register your resources(s) with FAIRsharing",
            link: "/educational/register",
          };
        }
        else if (this.$route.path === "/refine") {
          this.currentBreadcrumb = {
            id: "refine_crumb",
            text: "Refine your choice",
            link: "/refine",
          };
        }
      }
    },
    handleNavigation(link) {
      if (this.$route.params.id) {
        this.path = "/" + this.$route.params.id;
      }
      else {
        this.path = this.$route.path;
      }
      // TODO: Clearing things here means that we might not be able to get the necessary information on going back.
      // TODO: Perhaps these could go into the QuestionPage.vue file, to be run after going there and recovering the query?
      // TODO: Check that sliceBreadcrumb in particular is slicing correctly.
      this.$store.commit("navigationStore/sliceBreadcrumb", link);
      this.$store.commit("navigationStore/setNavigationState", this.path);
      this.$router.push({ path: link });
    },

    formatBreadcrumb(crumb) {
      if (this.getCompliantWith && crumb.text.includes("FORMAT")) {
        return crumb.text.replace("FORMAT", this.getCompliantWith);
      }
      if (crumb.text.includes("POLICY")) {
        if (this.getCompliantWithPolicy) {
          let length = this.getCompliantWithPolicy.split(",").length;
          if (length <= 2) {
            return crumb.text.replace("POLICY", this.getCompliantWithPolicy);
          }
          else {
            return crumb.text.replace("POLICY", `${length} policies`);
          }
        }
        else {
          return "No policy selected!";
        }
      }
      if (this.getCurrentRegistry && crumb.text.includes("Resource type")) {
        return crumb.text.replace("...", "");
      }
      let tagText = [];
      ["subjects", "domains", "taxonomies", "user_defined_tags"].forEach(
        (tagField) => {
          if (
            this.getQueryParams[tagField] &&
            this.getQueryParams[tagField].length > 0
          ) {
            tagText.push(...this.getQueryParams[tagField]);
          }
        },
      );
      if (
        tagText.length > 0 &&
        crumb.text.includes("...") &&
        crumb.text.includes("Research area")
      ) {
        return crumb.text.replace("...", `<b>${tagText.join(", ")}</b>`)
      }
      return crumb.text;
    },
    async copySummary() {
      try {
        await navigator.clipboard.writeText(this.getSummaryText());
      }
      /* v8 ignore start */
      catch ($e) {
        // An alert could be used here, perhaps.
      }
      /* v8 ignore stop */
    },

    getSummaryText() {
      // Questions have an ID...
      if (this.$route.path === "/refine") {
        this.summaryKey = "refine";
      }
      else if (this.$route.path === "/results") {
        this.summaryKey = "results";
      }
      else {
        this.summaryKey = String(this.$route.params.id);
      }
      let text = summaries[String(this.summaryKey)];
      if (!summaries[this.summaryKey]) {
        return null;
      }
      // There will be various places in the default text where substitutions must occur depending on the user's previous
      // choices (similar to what's been done with breadcrumbs, above).
      if (text.includes("STANDARD_4")) {
        if (this.getCompliantWith) {
          text = text.replace(
            "STANDARD_4",
            `You have selected the following relevant standards <b>${this.getCompliantWith}</b>`,
          );
        }
        else {
          text = text.replace(
            "STANDARD_4",
            "You have not selected any relevant standards for your data",
          );
        }
      }
      // These items may appear in more than one place.
      if (text.includes("COUNT")) {
        text = text.replace("COUNT", this.getFairSharingRecords.length);
      }
      if (text.includes("FILTERS")) {
        text = text.replace("FILTERS", `${this.prepareFilterSummary()}`);
      }
      if (text.includes("ROLE")) {
        if (this.getRole === "Researcher" && this.getRestrict === "database") {
          text = text.replace(
            "ROLE",
            `The FAIRsharing Assistant is set to the <b>${this.getRole}</b> role. We have restricted the available databases to those appropriate for data deposition, which means they: are repositories or knowledgebases/repositories, have a life cycle status of Ready or In development.`,
          );
        }
        else {
          text = text.replace(
            "ROLE",
            `The FAIRsharing Assistant is set to the <b>${this.getRole}</b> role.`,
          );
        }
      }
      else {
        text = text.replace("ROLE", "");
      }
      return text;
    },
    prepareFilterSummary() {
      let _module = this;
      let output = "";
      Object.keys(_module.getQueryParams).forEach(function (key) {
        let value;
        try {
          value = _module.getQueryParams[key].join(", ");
        }
        /* v8 ignore start */
        catch {
          //Ignoring in test as unable to understand the logic and purpose of the catch statement here
          value = _module.getQueryParams[key];
        }
        /* v8 ignore stop */
        output = output + `${_module.humaniseKey(key)}: ${value}<br>`;
      });
      return output;
    },
  },
};
</script>

<style scoped></style>
