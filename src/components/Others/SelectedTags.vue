<template>
  <div class="full-width">
    <div
      v-for="(section, sectionName, sectionIndex) in sections"
      :key="'edit_keywords_' + sectionIndex"
      class="mb-3 d-flex flex-row"
      :class="{ 'flex-column': $vuetify.display.smAndDown }"
    >
      <div
        class="text-white py-3 px-4 titleCell full-width d-flex align-center justify-center"
        :class="[
          'bg-' + section.color,
          { titleCellMobile: $vuetify.display.smAndDown },
        ]"
      >
        <div class="d-flex justify-center">
          <Tooltip :tooltip-text="section.tooltip" :white-text="true" />
          <span class="font-weight-bold">{{ sectionName.toUpperCase() }}</span>
        </div>
      </div>
      <div
        class="full-width d-flex align-center"
        :class="'bg-' + section.color + '_lighten_2'"
      >
        <!--- For Research Page -->
        <div v-if="researchPage" class="pl-2">
          <v-chip
            v-for="(tag, tagIndex) in getSelectedTags.filter(
              (x) => x.model === section.label,
            )"
            :key="'section_' + sectionIndex + '_tag_' + tagIndex"
            class="my-1 mr-2"
            :class="['text-' + section.color]"
            color="white"
            close-icon="fa fa-trash"
            variant="flat"
            closable
            @click:close="deleteTag(tag.id, tag.label, sectionName)"
          >
            {{ capitaliseText(tag.label, tag.model) }}
          </v-chip>
        </div>
        <!--- For Refine Page -->
        <div v-if="refinePage" class="pl-2">
          <v-chip
            v-for="(tag, tagIndex) in getQueryParams[section.refineLabel]"
            :key="'section_' + sectionIndex + '_tag_' + tagIndex"
            :class="['text-' + section.color]"
            color="white"
            variant="flat"
          >
            {{ capitaliseText(tag, section.refineLabel) }}
          </v-chip>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import stringUtils from "@/utils/stringUtils";
import { mapGetters } from "vuex";
import Tooltip from "@/components/Others/Tooltip.vue";

export default {
  name: "SelectedTags",
  components: { Tooltip },
  mixins: [stringUtils],
  props: {
    researchPage: {
      type: Boolean,
      default: false,
    },
    refinePage: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["deleteTag"],
  data() {
    return {
      colors: {
        domain: "domain_color",
        taxonomy: "taxonomic_color",
        subject: "subject_color",
        user_defined_tag: "tags_color",
      },
    };
  },
  computed: {
    ...mapGetters("multiTagsStore", ["getSelectedTags", "getQueryParams"]),
    sections() {
      return {
        subjects: {
          items: [],
          color: this.colors["subject"],
          tooltip: "Subjects you have selected will be shown here",
          label: "subject",
          refineLabel: "subjects",
        },
        domains: {
          items: [],
          color: this.colors["domain"],
          tooltip: "Domains you have selected will be shown here",
          label: "domain",
          refineLabel: "domains",
        },
        "taxonomic range": {
          items: [],
          color: this.colors["taxonomy"],
          tooltip: "Taxonomy tags you have selected will be shown here",
          label: "taxonomy",
          refineLabel: "taxonomies",
        },
        "user defined tags": {
          items: [],
          color: this.colors["user_defined_tag"],
          tooltip:
            "The tags shown here are those created by FAIRsharing users/curators to describe records when a suitable tag in the groups above couldn't be found",
          label: "user_defined_tag",
          refineLabel: "userDefinedTags",
        },
      };
    },
  },
  methods: {
    deleteTag(id, label, sectionName) {
      this.$emit("deleteTag", [id, label, sectionName]);
    },
  },
};
</script>

<style>
.titleCell {
  max-width: 205px;
}

.titleCellMobile {
  max-width: 100%;
}
</style>
