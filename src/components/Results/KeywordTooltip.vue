<template>
  <div>
    <v-tooltip v-if="keyword.definitions" location="bottom">
      <template #activator="{ props }">
        <div
          :class="['text-center', { 'ellipse-width-80': !fullWidth }]"
          v-bind="props"
        >
          {{ capitaliseText(keyword.label, "other") }}
        </div>
      </template>
      <div class="tooltip">
        <div :class="getChipColor(keyword)">
          <b v-if="keyword.type" class="mr-1">Type:</b> {{ keyword.type }}
        </div>
        <div><b class="mr-1">Name:</b> {{ keyword.label }}</div>
        <div v-if="keyword['model']">
          <b class="mr-1">Type:</b> {{ keyword["model"] }}
        </div>
        <div v-if="keyword['iri']">
          <b class="mr-1">URL:</b> {{ keyword["iri"] }}
        </div>
        <div v-if="keyword.definitions">
          <b class="mr-1">Definition:</b> <i> {{ keyword.definitions[0] }} </i>
        </div>
        <div>
          <b v-if="processArray(keyword['synonyms'])" class="mr-1">Synonyms:</b>
          {{ processArray(keyword["synonyms"]) }}
        </div>
      </div>
    </v-tooltip>
    <div v-else>
      {{ capitaliseText(keyword.label, "taxonomy") }}
    </div>
  </div>
</template>

<script>
import recordsCardUtils from "@/utils/recordsCardUtils";
export default {
  name: "KeywordTooltip",
  mixins: [recordsCardUtils],
  props: {
    keyword: { default: null, type: Object },
    fullWidth: { default: false, type: Boolean },
  },
  methods: {
    processArray(array) {
      if (!array || array.length === 0) return null;
      return (
        JSON.stringify(array)
          .replace(/,/g, ", ")
          .replace(/"/g, "")
          .replace("[", "")
          .replace("]", "")
          .replace(/:/g, ": ") + "."
      );
    },
  },
};
</script>

<style scoped>
.tooltip {
  max-width: 300px;
  padding: 5px 0;
}

b {
  text-decoration: underline;
}
</style>
