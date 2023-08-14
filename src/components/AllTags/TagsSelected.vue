<template>
  <v-row>
    <p
      class="pt-6"
    >
      Tags you've selected will display in the four rows below.
    </p>
    <table id="tagsTable">
      <tbody>
        <tr
          v-for="(section, sectionName, sectionIndex) in sections"
          :key="'edit_keywords_' + sectionIndex"
          class="mb-3"
        >
          <td
            class="white--text py-2 px-4 titleCell"
            :class="section.color"
          >
            <v-tooltip right>
              <template #activator="{ on, attrs }">
                <v-icon
                  v-bind="attrs"
                  small
                  class="white--text mr-1"
                  v-on="on"
                >
                  fa-question-circle
                </v-icon>
              </template>
              <span> {{ section.tooltip }} </span>
            </v-tooltip>
            {{ sectionName.toUpperCase() }}
          </td>
          <td :class="section.color + ' lighten-2'">
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
                      @click="removeTag(tag.id)"
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
                  <span> Remove term </span>
                </v-tooltip>
              </v-chip>
            </v-chip-group>
          </td>
        </tr>
      </tbody>
    </table>
  </v-row>
</template>

<script>
import stringUtils from "@/utils/stringUtils";
import {mapGetters} from "vuex";

export default {
  name: 'TagsSelected',
  mixins: [stringUtils],
  data() {
    return {
      colors: {
        domain: 'domain_color',
        taxonomy: 'taxonomic_color',
        subject: 'subject_color',
        user_defined_tag: 'tags_color'
      },
      selectedTags: []
    }
  },
  computed: {
    ...mapGetters('multiTagsStore', ["getFairSharingRecords", "getSelectedTags"]),
    sections() {
      return {
        subjects: {
          items: [],
          color: this.colors["subject"],
          tooltip: "Subjects you have selected will be shown here.",
          label: 'subject'
        },
        domains: {
          items: [],
          color: this.colors["domain"],
          tooltip: "Domains you have selected will be shown here.",
          label: 'domain'
        },
        "taxonomic range": {
          items: [],
          color: this.colors["taxonomy"],
          tooltip: 'Taxonomy tags you have selected will be shown here.',
          label: 'taxonomy'
        },
        "user defined tags": {
          items: [],
          color: this.colors["user_defined_tag"],
          tooltip: "The tags shown here are those created by FAIRsharing users/curators to describe records when a suitable tag in the groups above couldn't be found.",
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
    removeTag(id){
      this.selectedTags = this.selectedTags.filter(el => el.id !== id);
      this.$store.commit('multiTagsStore/setSelectedTags', this.selectedTags);
      if (this.selectedTags && this.selectedTags.length === 0) {
        this.$store.commit('multiTagsStore/setFairSharingRecords', []);
      }
    },
  }
}

</script>

<style scoped>
table#tagsTable {
    border-collapse: collapse;
    width: 100%
}

table#tagsTable td.titleCell {
    width: 100px;
    white-space: nowrap;
    text-align: center;
    font-size: 16px;
    font-weight: bolder;
    height: 55px;
}

table#tagsTable tr {
    border-collapse: collapse;
    border-bottom: 10px solid white;
}

</style>