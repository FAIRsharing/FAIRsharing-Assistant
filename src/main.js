import { createApp } from "vue";
import { createVuetify } from "vuetify";
import App from './App.vue'
import router from './router'
import store from './store'
import Particles from "@tsparticles/vue3";
import Vue3Sanitize from "vue-3-sanitize";
import '@fortawesome/fontawesome-free/css/all.css'
import 'core-js/stable'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import { loadFull } from "tsparticles";

import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

const vuetify = createVuetify({
    components,
    directives,
});

const app = createApp(App)
    .use(vuetify)
    .use(router)
    .use(store)
    .use(Particles, {
      init: async (engine) => {
        await loadFull(engine);
      },
    })
    .use(Vue3Sanitize);

app.mount("#app");
