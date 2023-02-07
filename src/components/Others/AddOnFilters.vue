<template>
  <v-row>
    <v-col cols="12">
      <v-switch
        v-model="refineToggle"
        class="d-inline-block mr-2"
        label="Data preservation policy"
        inset
        @change="selectRefineOption()"
      />
    </v-col>
  </v-row>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: 'AddOnFilters',
  data:() => {
    return {
      refineToggle: false
    }
  },
  computed:{
    ...mapGetters("bubbleSelectedStore", ['getAllResources', 'getTopResource', 'getResource', 'getSubject', 'getDomain']),
  },
  methods: {
    selectRefineOption() {
      return this.refineToggle
    }
  }
};
</script>