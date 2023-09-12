<template>
  <div>
    <v-btn
      size="small"
      tonal
      class="mb-2"
      @click="toggleSelected()"
    >
      {{ buttonMessage }}
    </v-btn>
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
      buttonMessage: 'Show selected tags'
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
