import { createApp, configureCompat } from "vue";
// import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
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
import {library} from "@fortawesome/fontawesome-svg-core";
import {faQuestionCircle} from "@fortawesome/free-solid-svg-icons";


library.add(faQuestionCircle)

configureCompat({
  COMPONENT_ASYNC: false,
  WATCH_ARRAY: false,
  COMPONENT_V_MODEL: false
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
  // .component("font-awesome-icon", FontAwesomeIcon);

app.mount("#app");
