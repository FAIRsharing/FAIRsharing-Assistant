<template>
  <div>
    <p
      v-if="getTopResource"
      class="ma-0 text-capitalize"
    >
      Resource Type Selected: {{ getResource ? getResource : getTopResource }}
    </p>
    <p
      v-if="getSubject"
      class="ma-0 text-capitalize"
    >
      Subject Type Selected: {{ getSubject }}
    </p>
    <p
      v-if="getDomain"
      class="ma-0 text-capitalize"
    >
      Domain Type Selected: {{ getDomain }}
    </p>
  </div>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: 'Selection',
  computed:{
    ...mapGetters("bubbleSelectedStore", ['getAllResources', 'getTopResource', 'getResource', 'getSubject', 'getDomain']),
  },

};
</script>