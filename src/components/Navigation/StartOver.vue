<template>
  <div>
    <div
      class="ma-0"
    >
      <v-btn
        v-bind="button['attributes']"
        class="white--text startOverBtn"
        @click="overlay = !overlay"
      >
        {{ button["text"] }}
      </v-btn>
    </div>
    <v-row justify="center">
      <v-overlay
        :z-index="zIndex"
        :value="overlay"
      >
        <v-card
          class="mx-auto d-flex align-center flex-column"
          outlined
          light
          min-width="200"
          width="400"
          max-width="600"
        >
          <v-card-title class="startOverText">
            Are you sure? This will clear all of your existing choices and start again from the beginning
          </v-card-title>
          <v-card-actions>
            <v-btn
              class="white--text startOverBtn"
              color="ready_color"
              raised
              @click="onStartOver()"
            >
              OK
            </v-btn>
            <v-btn
              class="white--text startOverBtn"
              color="accent3"
              raised
              @click="overlay = false"
            >
              CANCEL
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-overlay>
    </v-row>
  </div>
</template>

<script>
import {mapActions} from "vuex";

export default {
  name: "StartOver",
  data () {
    return {
      button: {
        text: "Start Over",
        attributes: {
          elevation:"2",
          raised: true,
          color: "accent2",
        }
      },
      overlay: false,
      zIndex: 3,
    }
  },

  methods:{
    // ...mapActions("addOnFilterSelectedStore", ["resetFiltersSelected"]),

    onStartOver() {
      this.overlay = false
      this.$router.push("/")
      // this.resetFiltersSelected()
    }
  }

}
</script>


<style scoped>
.startOverBtn {
  text-transform: initial;
}
.startOverText {
  word-break: initial;
}

</style>
