<template>
  <div
    class="navSecond align-center ml-4"
  >
    <v-btn
      v-bind="button['attributes']"
      class="white--text backBtn"
      @click="addNodeToList"
    >
      {{ button["text"] }}
    </v-btn>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from "vuex";

export default {
  name: "AddNodeButton",
  props:{
    previousPage: {
      type: String,
      default: null
    },
  },
  data () {
    return {
      button: {
        text: "Add",
        attributes: {
          elevation:"2",
          raised: true,
          color: "accent",
        }
      },
    }
  },
  computed:{
    ...mapGetters("bubbleSelectedStore", ['getNodes']),
    ...mapMutations("nodeListStore", ['nodeListStore']),
  },
  methods:{
    addNodeToList() {
      this.$store.commit("nodeListStore/nodeLists", this.getNodes)

    }
  },
}
</script>


<style scoped>
.backBtn {
  text-transform: initial;
}

</style>
