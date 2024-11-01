import { createApp, configureCompat } from "vue";
import createVuetify from "@/plugins/vuetify.js";
import App from './App.vue'
import router from './router'
import store from './store'
import Particles from "@tsparticles/vue3";
import Vue3Sanitize from "vue-3-sanitize";
import '@fortawesome/fontawesome-free/css/all.css'
import 'core-js/stable'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import { loadFull } from "tsparticles";

configureCompat({
  MODE: 3,
})

const app = createApp(App)
  .use(createVuetify)
  .use(router)
  .use(store)
  .use(Particles, {
    init: async (engine) => {
      await loadFull(engine);
    },
  })
  .use(Vue3Sanitize)

// app.config.compilerOptions.isCustomElement = tag => tag.startsWith('v-')

app.mount("#app");
