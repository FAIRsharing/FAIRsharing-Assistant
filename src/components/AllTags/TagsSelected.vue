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
        <!-- This html is from a safe source -->
        <!-- eslint-disable vue/no-v-html -->
        <v-card-text>
          <!-- because javascript doesn't allow line breaks in text -->
          <span
            v-html="helpText.tags.join('\n')"
          />
        </v-card-text>
        <!-- eslint-enable vue/no-v-html -->
        <v-card-actions>
          <v-btn
            color="primary"
            @click="hideHelp()"
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
        @delete-tag="removeTag"
      />
    </transition>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import SelectedTags from "@/components/Others/SelectedTags.vue";
import helpDialogs from "@/data/helpDialogs.json"

export default {
  name: 'TagsSelected',
  components: { SelectedTags },
  data() {
    return {
      selectedTags: [],
      selectedQueryParam: [],
      showSelected: false,
      buttonMessage: 'Show selected tags',
      help: false,
      helpText: helpDialogs
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
    },
    hideHelp() {
      this.help = false;
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
