<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-card
    class="mx-auto block-category__card"
    :style="registrySelected(registry) ? 'border: 2px solid red;' : 'border: 1px solid white;'"
    max-width="350"
    height="250"
  >
    <div class="white--text d-flex flex-column justify-center block-category__card__gradiant">
      <div
        style="height: 136px"
        class="d-flex justify-center"
      >
        <v-img
          class="mt-5"
          contain
          height="100px"
          :src="$vuetify.icons.values[registryIcons(registry)].icon"
        />
      </div>
      <v-card-title class="d-inline text-h4 text-md-h5 text-lg-h4 text-center">
        {{ recordsCount }} {{ registryName(registry) }}
      </v-card-title>
    </div>
    <v-card-actions class="text-center d-block">
      <RefineButton
        link="/refineregistry"
        :choice="registry"
        :count="recordsCount"
      />
    </v-card-actions>
  </v-card>
</template>

<script>
import {mapGetters} from "vuex";
import RefineButton from '@/components/AllTags/RefineButton.vue';

export default {
  name: 'TagsCard',
  components: { RefineButton },
  props: {
    registry: {
      default: "",
      type: String
    },
    recordsCount: {
      default: 0,
      type: Number
    }
  },
  computed: {
    ...mapGetters('multiTagsStore', ["getCurrentRegistry"]),
  },
  methods: {
    registrySelected(registry) {
      if (registry === this.getCurrentRegistry) {
        return true;
      }
      return false;
    },
    registryName(registry) {
      switch (registry) {
      case "Standard":
        return "Standards"
      case "Database":
        return "Databases"
      case "Policy":
        return "Policies"
      case "Collection":
        return "Collections"
      default:
        return registry
      }
    },

    registryIcons(registry) {
      switch (registry) {
      case "Standard":
        return "home_standard"
      case "Database":
        return "home_db"
      case "Policy":
        return "home_policies"
      case "Collection":
        return "home_collections"
      default:
        return "home_standard"
      }
    }
  }
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
      height: 200px;
      background: rgb(171, 171, 171);
    }
  }
}
.v-divider {
  margin: 8px;
}
</style>