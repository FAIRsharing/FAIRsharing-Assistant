<template>
  <div>
    <v-btn
      color="info"
      class="mb-2"
      @click="toggleSelected()"
    >
      {{ buttonMessage }}
    </v-btn>
    <v-btn
      color="info"
      class="mb-2 ml-2"
      :disabled="help"
      @click="showHelp()"
    >
      Show help
    </v-btn>
    <!-- help -->
    <v-dialog
      v-model="help"
      width="auto"
    >
      <v-card>
        <v-card-title>
          About this page
        </v-card-title>
        <v-card-text>
          <p>
            Here's where you can select tags to identify the area of reseach you're interested in. There are four
            types of tag, all found via the same search box:
          </p>
          <ul
            class="mb-6"
            style="list-style-type: circle;"
          >
            <li>
              Subjects, based on our <a
                href="https://github.com/FAIRsharing/subject-ontology"
                _target="blank"
              >subject ontology</a>.
              These are most likely the tags you need.
            </li>
            <li>
              Domains, from our <a
                href="https://github.com/FAIRsharing/domain-ontology"
                _target="blank"
              >domain ontology</a>.
            </li>
            <li>Taxonomy (genus and/or species) terms, if you're looking for particular organisms.</li>
            <li>User defined tags, which are terms added by FAIRsharing users and not (yet) integrated into one of our ontologies.</li>
          </ul>
          <p>
            Search for terms using the text box below, and tick any of interest. The terms you've selected
            will be shown above. You can hide the selected terms to save space (they're hidden to start with).
            Searching for tags assumes that you want records tagged with <b>any of</b> the same type of tag, <b>and</b> any of other types.
            So, for example, if you select subjects A and B and domains C and D the search will be for all records with
            <i>(A or B) and (C or D)</i>.
          </p>
          <p>
            At the top of the screen are four boxes showing the records we have, and how many match your search. If you've
            restricted your search to a particular type of record (see refinements, below) then its box will be outlined in
            red (and results for others will be zero).
          </p>
          <p>
            From this screen, you can jump directly to the results, or you can further refine your choice of record. So, if you choose to refine
            database records you could, for example, selected only knowledgebases which have open data access. Some initial questions which
            will send you here will pre-select such refinements for you.
          </p>
          <p>If you have any questions, please <a href="mailto:contact@fairsharing.org">contact us!</a></p>
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="primary"
            @click="help = false"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- selected tags -->
    <transition name="fade">
      <SelectedTags
        v-if="showSelected"
        class="selected_tags"
        :research-page="true"
        @deleteTag="removeTag"
      />
    </transition>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import SelectedTags from "@/components/Others/SelectedTags.vue";

export default {
  name: 'TagsSelected',
  components: {SelectedTags},
  data() {
    return {
      selectedTags: [],
      selectedQueryParam: [],
      showSelected: false,
      buttonMessage: 'Show selected tags',
      help: false
    }
  },
  computed: {
    ...mapGetters('multiTagsStore', ["getSelectedTags", "getQueryParams"]),
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
    removeTag(tagParams){
      let id = tagParams[0]
      let label = tagParams[1]
      let sectionName = tagParams[2]
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
    toggleSelected() {
      this.showSelected = !this.showSelected;
      if (this.showSelected) {
        this.buttonMessage = "Hide selected tags"
      }
      else {
        this.buttonMessage = "Show selected tags"
      }
    },
    showHelp() {
      this.help = true;
    }
  }
}

</script>

<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

</style>
