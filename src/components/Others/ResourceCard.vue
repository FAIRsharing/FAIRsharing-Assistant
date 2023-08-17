<template>
  <v-card
    class="mx-3 block-category__card full-width"
    :class="{'my-3': $vuetify.breakpoint.smAndDown}"
    :style="registrySelected ? 'border: 2px solid red;' : 'border: 1px solid white;'"
    max-width="350"
  >
    <div class="white--text d-flex flex-column justify-center pt-4 block-category__card__gradiant">
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
      class="text-center d-block"
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
    -webkit-transition: all .2s ease;
    -moz-transition: all .2s ease;
    -o-transition: all .2s ease;
    box-shadow: 0 1rem 2rem rgba(black, .15) !important;
    -webkit-box-shadow: 0 1rem 2rem rgba(black, .15) !important;
    -moz-box-shadow: 0 1rem 2rem rgba(black, .15) !important;
    -o-box-shadow: 0 1rem 2rem rgba(black, .15) !important;

    &:hover {
      transform: scale(1.05);
      -moz-transform: scale(1.05);
      -webkit-transform: scale(1.05);
      -o-transform: scale(1.05);
    }

    &__gradiant {
      background: rgb(171, 171, 171);
    }
  }
}
.v-divider {
  margin: 8px;
}
</style>
