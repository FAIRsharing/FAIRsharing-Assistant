import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import store from './store'
import * as am5 from '@amcharts/amcharts5';


Vue.config.productionTip = false
Vue.use(am5);

new Vue({
  render: h => h(App),
  router,
  vuetify,
  store
}).$mount('#app')
