<template>
  <v-card
    class="full-width"
    :class="[
      {'my-3 mx-0': $vuetify.breakpoint.smAndDown},
      {'mx-3': $vuetify.breakpoint.mdAndUp}
    ]"
    :style="registrySelected ? 'border: 2px solid red;' : null"
    max-width="350"
    :max-height="showRefineButton? 'none' : 230"
    height="auto"
    color="#ababab"
    elevation="6"
  >
    <div class="white--text d-flex flex-column justify-center pt-4">
      <div
        class="d-flex justify-center"
      >
        <v-img
          class="mt-5 full-width"
          contain
          max-width="200px"
          height="100px"
          :src="$vuetify.icons.values[registryIcon].icon"
        />
      </div>
      <v-card-title class="d-inline text-h4 text-md-h5 text-lg-h4 text-center">
        {{ recordsCount }} {{ registryName }}
      </v-card-title>
    </div>
    <v-card-actions
      v-if="showRefineButton"
      class="text-center d-block actionBlock"
    >
      <RefineButton
        link="/refineregistry"
        :choice="registry"
        :count="recordsCount"
      />
    </v-card-actions>
  </v-card>
</template>

<script>

import RefineButton from "@/components/AllTags/RefineButton.vue";

export default {
  name: 'ResourceCard',
  components: {RefineButton},
  props:{
    registry: {
      type: String,
      default: "",
    },
    registryIcon:{
      type: String,
      default: "",
    },
    registrySelected: {
      type: Boolean,
      default: false,
    },
    registryName: {
      type: String,
      default: "",
    },
    recordsCount: {
      type: Number,
      default: 0
    },
    showRefineButton:{
      type: Boolean,
      default: false,
    }
  },
}

</script>


<style scoped lang="scss">
.block-category {
  &__card {
    transition: all .2ms ease;
    &:hover {
      transform: scale(1.05);
    }
  }
}
.v-divider {
  margin: 8px;
}
.actionBlock {
  background: #fff
}
</style>
