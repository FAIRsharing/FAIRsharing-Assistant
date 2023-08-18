<template>
  <div>
    <p
      class="pt-6"
    >
      Tags you've selected will display in the four rows below.
    </p>
    <SelectedTags
      :research-page="true"
      @deleteTag="removeTag"
    />
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
      selectedQueryParam: []
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
  }
}

</script>
