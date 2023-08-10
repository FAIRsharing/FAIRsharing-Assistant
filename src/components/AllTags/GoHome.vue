<template>
  <div>
    <v-tooltip right>
      <template #activator="{ on, attrs }">
        <v-icon
          v-bind="attrs"
          small
          class="grey--text mr-1"
          v-on="on"
        >
          fa-question-circle
        </v-icon>
      </template>
      <span> Return to the home page, clearing all tags and filters. </span>
    </v-tooltip>
    <v-btn
      color="dev_color white--text"
      class="mr-10"
      @click="goHome()"
    >
      Home
    </v-btn>
  </div>
</template>

<script>
import {mapActions} from "vuex";

export default {
  name: 'GoHome',
  methods: {
    ...mapActions('multiTagsStore', ['resetMultiTags']),
    goHome() {
      this.resetMultiTags()
      const allSelectedTags = {
        domains: [],
        taxonomies: [],
        subjects: [],
        user_defined_tags: []
      }

      const allRecordTags = []
      this.$emit('startOver', [allSelectedTags, allRecordTags])
      this.$router.push('/')
    }
  }
}

</script>