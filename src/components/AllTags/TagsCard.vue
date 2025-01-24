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
import { mapGetters } from "vuex";
import ResourceCard from "@/components/Others/ResourceCard.vue";
import registryName from "@/utils/registryName";
import registryIcons from "@/utils/registryIcon";

export default {
  name: "TagsCard",
  components: { ResourceCard },
  props: {
    registry: {
      default: "",
      type: String,
    },
  },
  computed: {
    ...mapGetters("multiTagsStore", [
      "getCurrentRegistry",
      "getFairSharingRecords",
    ]),
    recordsCount() {
      let _module = this;
      if (
        _module.getFairSharingRecords &&
        _module.getFairSharingRecords.length === 0
      )
        return 0;
      else
        return _module.getFairSharingRecords.filter(
          (x) => x.registry === this.registry,
        ).length;
    },
  },
  methods: {
    registryName,
    registryIcons,
    registrySelected(registry) {
      if (registry === this.getCurrentRegistry) return true;
      else return false;
    },
  },
};
</script>
