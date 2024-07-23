import Vue from 'vue';
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import Vuetify from 'vuetify';
import store from './store';
import Particles from "@tsparticles/vue3";
import VueSanitize from "vue-sanitize";
//import SimpleAnalytics from "simple-analytics-vue";
import '@fortawesome/fontawesome-free/css/all.css'
import 'core-js/stable'
import 'roboto-fontface/css/roboto/roboto-fontface.css'

const vuetify = new Vuetify({});
Vue.config.productionTip = false
Vue.use(Particles);
Vue.use(VueSanitize);
/*
Vue.use(SimpleAnalytics, {
  skip: process.env.NODE_ENV !== 'production'
})
 */

/*
new Vue({
  render: (h) => h(App),
  router,
  vuetify,
  store
}).$mount('#app')
*/

createApp(App).use(router).use(vuetify).use(store).$mount('#app')
