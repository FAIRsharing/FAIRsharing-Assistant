<template>
  <section
    class="px-md-10 pa-5 d-flex flex-column justify-center heroBlock"
    :style="['z-index: 2', {
      backgroundImage: 'linear-gradient(180deg, rgba(37, 52, 66, 1) 0%, rgba(39, 170, 225, 1) 200%),url(' + '/assets/Home/BlockHero/pattern3.jpg',
      backgroundRepeat: 'repeat',
      backgroundBlendMode: 'multiply',
    }]"
  >
    <!-- eslint-disable vue/no-v-html -->
    <Particles
      id="particles"
      :options="options"
    />
    <h1
      class="full-width white--text font-weight-medium text-sm-h3 text-md-h3 text-lg-h3 text-xl-h3 text-center"
      style="z-index: 2"
    >
      FAIRsharing Assistant
    </h1>
    <!--    <LandingPage />-->
  </section>
</template>

<script>
export default {
  name: "Jumbotron",
  data:() => {
    return {
      options: {
        background: {
          color: {
            value: 'transparent'
          }
        },
        fullScreen: { enable: false },
        fpsLimit: 60,
        particles: {
          color: {
            value: '#1F8EBF'
          },
          links: {
            color: '#1F8EBF',
            distance: 100,
            enable: true,
            opacity: 0.5,
            width: 2
          },
          collisions: {
            enable: true
          },
          move: {
            direction: 'none',
            enable: true,
            outMode: 'bounce',
            random: false,
            speed: 1,
            straight: false
          },
          number: {
            density: {
              enable: true,
              value_area: 300
            },
            value: 100
          },
          opacity: {
            value: 0.5
          },
          shape: {
            type: null
          },
          size: {
            random: true,
            value: 5
          }
        },
        detectRetina: true
      },
    }
  },
  // computed: {
  //   getJumbotronData(){
  //     if (this.$route.name) {
  //       let route = this.$route.name;
  //       if (route === "search" && Object.keys(this.$route.query).includes("fairsharingRegistry")) {
  //         route = this.$route.query.fairsharingRegistry
  //       }
  //       return jumbotronData[route.toLowerCase()] || null
  //     }
  //     return null
  //   }
  // }
}
</script>

<style scoped>
/*section {*/
/*  height: 100px;*/
/*}*/
</style>

<style>
.heroBlock {
  transition-duration: inherit;
  transform: translateX(0);
  animation: smooth-text 2500ms ease-in forwards;
}
  @keyframes smooth-text {
    0%,
    25% {
      opacity: 0;
    }
    75%,
    100% {
      opacity: 1;
    }
  }




  #particles canvas{
    position: absolute;
    width: 100% !important;
    height: 50px !important;
    z-index: 1;
    left:0;
    top: 0;
  }

  #subtitle a {
    color: white;
    text-decoration: underline;
  }

</style>
