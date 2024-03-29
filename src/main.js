import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import store from './store'
import Particles from "vue2-particles";
import VueSanitize from "vue-sanitize";
//import SimpleAnalytics from "simple-analytics-vue";
import '@fortawesome/fontawesome-free/css/all.css'
import 'core-js/stable'
import 'roboto-fontface/css/roboto/roboto-fontface.css'

Vue.config.productionTip = false
Vue.use(Particles);
Vue.use(VueSanitize);
/*
Vue.use(SimpleAnalytics, {
  skip: process.env.NODE_ENV !== 'production'
})
 */

new Vue({
  render: (h) => h(App),
  router,
  vuetify,
  store
}).$mount('#app')
