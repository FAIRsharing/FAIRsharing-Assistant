<template>
  <v-card
    class="full-width testcard"
    :class="[
      {'my-3 mx-0': $vuetify.display.smAndDown},
      {'mx-3 mb-0': $vuetify.display.mdAndUp},
      {'cardBorder': registrySelected},
    ]"
    max-width="350"
    height="auto"
    color="#ababab"
    elevation="6"
  >
    <div class="text-white d-flex flex-column justify-center pt-4">
      <div
        class="d-flex justify-center"
      >
        <v-img
          class="mt-5 full-width contain"
          max-width="200px"
          height="100px"
          :src="customIcons.values[registryIcon].icon"
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
import customIcons from "@/plugins/icons";

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
  data() {
    return {
      customIcons: customIcons
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
.cardBorder {
  border: 2px solid red
}
.cardHeight{
  max-height: 230px
}
</style>
