<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div>
    <v-tooltip left>
      <template #activator="{ on, attrs }">
        <v-icon
          v-bind="attrs"
          small
          left
          class="grey--text ml-1 mr-1"
          v-on="on"
        >
          fa-question-circle
        </v-icon>
      </template>
      <span> Choose further refinements to narrow down your choice of {{ choice }}. </span>
    </v-tooltip>
    <v-btn
      color="primary"
      :disabled="count <= 0"
      text
      @click="makeChoice()"
    >
      Refine my choice
    </v-btn>
  </div>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: 'RefineButton',
  // TODO: Passing in these props fails to do what's required.
  props: {
    link: {
      default: '/',
      type: String
    },
    choice: {
      default: 'Database',
      type: String
    },
    count: {
      default: 0,
      type: Number
    }
  },
  computed: {
    ...mapGetters('multiTagsStore', ["getQueryParams"]),
  },
  methods: {
    // This passes the fairsharingRegistry parameter to the multiTagFilter when moving to the refine screen
    makeChoice() {
      let _module = this;
      let queryParams = _module.getQueryParams;
      queryParams['fairsharingRegistry'] = [ _module.choice.toLowerCase() ];
      _module.$store.commit('multiTagsStore/setQueryParams', queryParams);
      _module.$store.commit('multiTagsStore/setCurrentRegistry', _module.choice);
      _module.$router.push(_module.link);
    }
  }
}

</script>