<template>
  <ResourceCard
    :registry="registry"
    :registry-icon="registryIcons(registry)"
    :registry-selected="registrySelected(registry)"
    :registry-name="registryName(registry)"
    :records-count="recordsCount"
    :show-refine-button="true"
  />
</template>

<script>
import {mapGetters} from "vuex";
import ResourceCard from '@/components/Others/ResourceCard.vue'
import registryName from "@/utils/registryName";

export default {
  name: 'TagsCard',
  components: { ResourceCard },
  props: {
    registry: {
      default: "",
      type: String
    }
  },
  computed: {
    ...mapGetters('multiTagsStore', ["getCurrentRegistry", "getFairSharingRecords"]),
    recordsCount() {
      let _module = this;
      if (!_module.getFairSharingRecords) return 0
      else return _module.getFairSharingRecords.filter(x => x.registry === this.registry).length
    },
  },
  methods: {
    registryName,
    registrySelected(registry) {
      if (registry === this.getCurrentRegistry) return true;
      else return false;
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