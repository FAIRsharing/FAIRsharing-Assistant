<template>
  <div class="full-width">
    <div
      v-for="(section, sectionName, sectionIndex) in sections"
      :key="'edit_keywords_' + sectionIndex"
      class="mb-3 d-flex flex-row"
      :class="{'flex-column': $vuetify.breakpoint.smAndDown}"
    >
      <div
        class="white--text py-3 px-4 titleCell full-width d-flex align-center justify-center"
        :class="section.color"
        :style="$vuetify.breakpoint.smAndDown ? 'max-width:100%': 'max-width:205px'"
      >
        <div class="d-flex justify-center">
          <Tooltip
            :tooltip-text="section.tooltip"
            :white-text="true"
          />
          <span class="font-weight-bold">{{ sectionName.toUpperCase() }}</span>
        </div>
      </div>
      <div
        class="tagsCell full-width"
        :class="section.color + ' lighten-2'"
      >
        <!--- For Research Page -->
        <v-chip-group
          v-if="researchPage"
          class="pl-2"
          column
        >
          <v-chip
            v-for="(tag, tagIndex) in getSelectedTags.filter(x => x.model === section.label)"
            :key="'section_' + sectionIndex + '_tag_' + tagIndex"
            :class="[section.color + '--text white']"
          >
            {{ capitaliseText(tag.label, tag.model) }}
            <v-tooltip bottom>
              <template #activator="{ on, attrs }">
                <!-- this is a dreadful cheat; without it the close icon becomes unreadable -->
                <div
                  @click="deleteTag(tag.id, tag.label, sectionName)"
                >
                  <v-icon
                    v-bind="attrs"
                    small
                    class="ml-1"
                    :class="[section.color + '--text white']"
                    v-on="on"
                  >
                    fa-times-circle
                  </v-icon>
                </div>
              </template>
              <span> Delete tag </span>
            </v-tooltip>
          </v-chip>
        </v-chip-group>
        <!--- For Refine Page -->
        <v-chip-group
          v-if="refinePage"
          class="pl-2"
          column
        >
          <v-chip
            v-for="(tag, tagIndex) in getQueryParams[section.refineLabel]"
            :key="'section_' + sectionIndex + '_tag_' + tagIndex"
            :class="[section.color + '--text white']"
          >
            {{ capitaliseText(tag, section.refineLabel) }}
          </v-chip>
        </v-chip-group>
      </div>
    </div>
  </div>
</template>

<script>
import stringUtils from "@/utils/stringUtils";
import {mapGetters} from "vuex";
import Tooltip from "@/components/Others/Tooltip.vue";

export default {
  name: 'SelectedTags',
  components: {Tooltip},
  mixins: [stringUtils],
  props:{
    researchPage : {
      type : Boolean,
      default: false
    },
    refinePage : {
      type : Boolean,
      default: false
    }
  },
  data() {
    return {
      colors: {
        domain: 'domain_color',
        taxonomy: 'taxonomic_color',
        subject: 'subject_color',
        user_defined_tag: 'tags_color'
      },
    }
  },
  computed: {
    ...mapGetters('multiTagsStore', ["getSelectedTags", "getQueryParams"]),
    sections() {
      return {
        subjects: {
          items: [],
          color: this.colors["subject"],
          tooltip: "Subjects you have selected will be shown here",
          label: 'subject',
          refineLabel: "subjects"
        },
        domains: {
          items: [],
          color: this.colors["domain"],
          tooltip: "Domains you have selected will be shown here",
          label: 'domain',
          refineLabel: "domains"
        },
        "taxonomic range": {
          items: [],
          color: this.colors["taxonomy"],
          tooltip: 'Taxonomy tags you have selected will be shown here',
          label: 'taxonomy',
          refineLabel: "taxonomies"
        },
        "user defined tags": {
          items: [],
          color: this.colors["user_defined_tag"],
          tooltip: "The tags shown here are those created by FAIRsharing users/curators to describe records when a suitable tag in the groups above couldn't be found",
          label: 'user_defined_tag',
          refineLabel: "userDefinedTags"
        },
      }
    },
  },
  methods:{
    deleteTag(id, label, sectionName){
      this.$emit("deleteTag", [id, label, sectionName])
    },
  }
}

</script>
