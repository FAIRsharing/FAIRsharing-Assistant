<template>
  <v-row class="white--text footer-container ma-0">
    <v-col
      cols="12"
    >
      <!--  Dash style for footer  -->
      <div class="footer-dash" />
      <!--  Licence and copy right  -->
      <v-row
        class="d-flex flex-row justify-center align-center"
      >
        <v-col
          cols="12"
        >
          <p class="mb-0">
            <sup>*</sup> FAIRsharing uses ‘data’ to refer to datasets, software, materials or any other digital object.
          </p>
          <p class="mb-0">
            <sup>&Dagger;</sup> Please note that we do not recommend the use of your browser’s ‘back’ button as its behaviour is not yet fully integrated with the Assistant.
          </p>
          <p
            style="text-align: center"
            class="mb-0"
          >
            © FAIRsharing 2009-Present | Licenced under
            <a
              class="mr-2 underline-effect"
              href="http://creativecommons.org/licenses/by-sa/4.0/"
              target="_blank"
            >Creative Commons by Share Alike 4.0 International</a>
            <a
              href="/licence"
              class="underline-effect"
            ><img
              src="/assets/Home/Footer/FAIRsharingCC_BY_SA.png"
              alt="fairsharing licence"
            ></a>
          </p>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>

export default {
  name: "Footer",
}
</script>
<style scoped lang="scss">
li {
  min-width: 200px;
}

.footer-container {
  position: absolute;
  background: #253442;
  bottom: 0;
  width: 100%;
}

.footer-dash {
  position: absolute;
  top: -2px;
  left: 0;
  width: 100%;
  border-top: 3px dashed #253442;
}

</style>
