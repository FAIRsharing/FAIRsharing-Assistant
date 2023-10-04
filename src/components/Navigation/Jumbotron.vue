<template>
  <section
    class="px-md-10 pa-5 d-flex flex-column justify-center mb-6"
    :style="['z-index: 2', {
      backgroundImage: 'linear-gradient(180deg, rgba(37, 52, 66, 1) 0%, rgba(39, 170, 225, 1) 200%),url(' + '/assets/Home/BlockHero/pattern3.jpg',
      backgroundRepeat: 'repeat',
      backgroundBlendMode: 'multiply',
    }]"
    :class="getJumbotronData['pageName'] === 'HomeView' ? 'heroBlock' : null"
  >
    <!-- eslint-disable vue/no-v-html -->
    <Particles
      id="particles"
      :particles-init="particlesInit"
      :particles-loaded="particlesLoaded"
      :options="options"
    />
    <h1
      class="text-body-1 pt-2 text-sm-h4 text-md-h4 text-lg-h4 text-xl-h4 font-weight-medium white--text"
      style="z-index: 2"
    >
      <!--
      :class="getJumbotronData['pageName'] === 'HomeView' ? 'text-center' : getJumbotronData['pageName'] === 'Licence'? 'text-center' : 'text-left'"
      // This goes in the h1 above, should it be needed again.
      -->
      {{ getJumbotronData["title"] }} <em
        v-if="getJumbotronData['tempSubTitle']"
        class="green--text"
      >{{ getJumbotronData["tempSubTitle"] }}</em>
    </h1>

    <!--
    ,
        getJumbotronData['pageName'] === 'HomeView' ? 'text-center' : 'text-left'
        // removed from class in block below
    -->
    <h2
      v-if="getJumbotronData['subTitle']"
      :class="[
        'lato-font-medium my-4 primary--text px-1 font-weight-thin',
        {
          'lato-text-md': $vuetify.breakpoint.mdOnly,
          'lato-text-lg': $vuetify.breakpoint.lgAndUp,
          'lato-text-sm': $vuetify.breakpoint.smAndDown
        }
      ]"
      style="z-index: 2"
    >
      {{ getJumbotronData["subTitle"] }}
    </h2>
  </section>
</template>

<script>
import jumbotronData from "@/data/jumbotronData.json";
import { loadFull } from "tsparticles";

// These consts appear to be called by the tests but aren't shown as covered.
/* istanbul ignore next */
const particlesInit = async engine => {
  await loadFull(engine);
};
/* istanbul ignore next */
// eslint-disable-next-line no-unused-vars
const particlesLoaded = async container => {
  //console.log("Particles container loaded", container);
};

export default {
  name: "Jumbotron",
  data:() => {
    return {
      particlesInit,
      particlesLoaded,
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
            outModes: 'bounce',
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
      jumbotronData
    }
  },
  computed: {
    getJumbotronData(){
      let currentPage = []
      if (this.$route.name) {
        let route = this.$route.name;
        currentPage = jumbotronData.filter(({pageName}) => pageName === route)
      }
      return currentPage[0]
    }
  }
}
</script>


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