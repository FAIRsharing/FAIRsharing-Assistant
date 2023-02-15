import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import store from './store'
import Particles from "particles.vue";
import * as am5 from '@amcharts/amcharts5'
import '@fortawesome/fontawesome-free/css/all.css'
import 'core-js/stable'
import 'roboto-fontface/css/roboto/roboto-fontface.css'

Vue.config.productionTip = false
Vue.use(Particles);
Vue.use(am5);

new Vue({
  render: (h) => h(App),
  router,
  vuetify,
  store
}).$mount('#app')
