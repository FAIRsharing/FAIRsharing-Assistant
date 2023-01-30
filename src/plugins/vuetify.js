import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import light from './theme'
import customIcons from './icons'
Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {light},
    options: {
      customProperties: true,
    },
  },
  icons: customIcons,
});

