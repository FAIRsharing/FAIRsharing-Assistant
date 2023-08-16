<template>
  <v-row>
    <p
      class="pt-6"
    >
      Tags you've selected will display in the four rows below.
    </p>
    <div class="full-width">
      <div
        v-for="(section, sectionName, sectionIndex) in sections"
        :key="'edit_keywords_' + sectionIndex"
        class="mb-3 selectionWrapper d-flex flex-row"
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
          <v-chip-group
            class="pl-2"
            column
          >
            <v-chip
              v-for="(tag, tagIndex) in selectedTags.filter(x => x.model === section.label)"
              :key="'section_' + sectionIndex + '_tag_' + tagIndex"
              :class="[section.color + '--text white']"
            >
              {{ capitaliseText(tag.label, tag.model) }}
              <v-tooltip bottom>
                <template #activator="{ on, attrs }">
                  <!-- this is a dreadful cheat; without it the close icon becomes unreadable -->
                  <div
                    @click="removeTag(tag.id, tag.label, sectionName)"
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
                <span> Remove tag </span>
              </v-tooltip>
            </v-chip>
          </v-chip-group>
        </div>
      </div>
    </div>
  </v-row>
</template>

<script>
import stringUtils from "@/utils/stringUtils";
import {mapGetters} from "vuex";
import Tooltip from "@/components/Others/Tooltip.vue";

export default {
  name: 'TagsSelected',
  components: {Tooltip},
  mixins: [stringUtils],
  data() {
    return {
      colors: {
        domain: 'domain_color',
        taxonomy: 'taxonomic_color',
        subject: 'subject_color',
        user_defined_tag: 'tags_color'
      },
      selectedTags: [],
      selectedQueryParam: []
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
          label: 'subject'
        },
        domains: {
          items: [],
          color: this.colors["domain"],
          tooltip: "Domains you have selected will be shown here",
          label: 'domain'
        },
        "taxonomic range": {
          items: [],
          color: this.colors["taxonomy"],
          tooltip: 'Taxonomy tags you have selected will be shown here',
          label: 'taxonomy'
        },
        "user defined tags": {
          items: [],
          color: this.colors["user_defined_tag"],
          tooltip: "The tags shown here are those created by FAIRsharing users/curators to describe records when a suitable tag in the groups above couldn't be found",
          label: 'user_defined_tag'
        },
      }
    },
  },
  watch: {
    getSelectedTags: {
      handler(newValue) {
        this.selectedTags = newValue;
      },
    },
  },
  methods:{
    queryParamTags(sectionName) {
      switch (sectionName) {
      case "taxonomic range":
        return "taxonomies"
      case "user_defined_tag":
        return "userDefinedTags"
      default:
        return sectionName
      }
    },

    removeTag(id, label, sectionName){
      this.selectedTags = this.selectedTags.filter(el => el.id !== id);

      Object.keys(this.getQueryParams).forEach(key => {
        if(key === this.queryParamTags(sectionName)) {
          this.selectedQueryParam = this.getQueryParams[this.queryParamTags(sectionName)].filter(el => el !== label)
          this.getQueryParams[key] = this.selectedQueryParam
        }
      })
      this.$store.commit('multiTagsStore/setQueryParams', this.getQueryParams);
      this.$store.commit('multiTagsStore/setSelectedTags', this.selectedTags);
      if (this.selectedTags && !this.selectedTags.length) {
        this.$store.commit('multiTagsStore/setFairSharingRecords', []);
      }
    },
  }
}

</script>
