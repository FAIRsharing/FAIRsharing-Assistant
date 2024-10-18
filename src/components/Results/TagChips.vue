<template>
  <section :class="['mb-1 overflow-hidden',{'chips-container-fixed-height':!isColumn}]">
    <div>
      <v-chip
        v-for="(chip,index) in chips"
        :key="chip.label+'_'+index"
        variant="flat"
        :color="getChipColor(chip)"
        class="mr-2 my-1"
      >
        <KeywordTooltip
          v-if="chip.type === 'subjects' || chip.type === 'domains' "
          :keyword="chip"
        />
        <div
          v-else
          class="ellipse-width-80 text-center"
        >
          {{ chip.label }}
        </div>
      </v-chip>
      <v-chip
        v-if="remainTagCount!==0 && remainTagCount!==1"
        disabled
        variant="outlined"
        label
      >
        {{ `+${remainTagCount} more tags` }}
      </v-chip>
      <v-chip
        v-else-if="remainTagCount===1"
        disabled
        variant="outlined"
        label
      >
        {{ `one more tag` }}
      </v-chip>
    </div>
  </section>
</template>

<script>
/*
 * Very similar code (but with additional functionality) appears in the FAIRsharing
 * code as SearchLinkChips.vue.
 */
import KeywordTooltip from "./KeywordTooltip";
import recordsCardUtils from "@/utils/recordsCardUtils";

export default {
  name: "TagChips",
  components: { KeywordTooltip },
  mixins: [recordsCardUtils],
  props: {
    record: {
      default: () => ({}),
      type: Object
    }
  },
  data() {
    return {
      chips: [],
      remainTagCount: 0,
      isColumn: false,
      getMaxItemShown: 5
    }
  },
  mounted() {
    this.setChips(this.record);
  }
}
</script>

<style scoped>
.chips-container-fixed-height {
  height: 40px;
}
</style>
