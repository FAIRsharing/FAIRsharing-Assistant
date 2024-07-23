import { createApp } from 'vue';
import { createVuetify } from 'vuetify';
import App from './App.vue';
import router from './router';
import store from './store';
import Particles from "@tsparticles/vue3";
import VueSanitize from "vue-sanitize";
import '@fortawesome/fontawesome-free/css/all.css'
import 'core-js/stable'
import 'roboto-fontface/css/roboto/roboto-fontface.css'

const vuetify = createVuetify({});

createApp(App).use(vuetify).use(router).use(vuetify).use(store).use(Particles).use(VueSanitize).$mount('#app')
