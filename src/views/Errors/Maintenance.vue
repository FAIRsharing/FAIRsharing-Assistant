<template>
  <div>
    <h1 class="text-center mt-5 text-blue">
      Maintenance Mode
    </h1>
    <h3 class="text-center mb-5 text-blue">
      The site is currently down for maintenance and we hope to restore normal service as soon as possible.
      Please accept our apologies for any inconvenience.
    </h3>
  </div>
</template>

<script>
import { useHead } from '@unhead/vue'

useHead({
  title: 'FAIRassist | Maintenance Mode'
})
export default {
  name: "Maintenance",
}
</script>
