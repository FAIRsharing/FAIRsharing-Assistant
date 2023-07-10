<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div>
    <v-tooltip left>
      <template #activator="{ on, attrs }">
        <v-icon
          v-bind="attrs"
          small
          left
          class="grey--text ml-1 mr-1"
          v-on="on"
        >
          fa-question-circle
        </v-icon>
      </template>
      <span> Choose further refinements to narrow down your choice of {{ choice }}. </span>
    </v-tooltip>
    <router-link
      :to="link"
    >
      <v-btn
        color="primary"
        text
      >
        Refine my choice
      </v-btn>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'RefineButton',
  // TODO: Passing in these props fails to do what's required.
  props: {
    link: {
      default: '/',
      type: String
    },
    choice: {
      default: 'registry',
      type: String
    }
  }
}

</script>