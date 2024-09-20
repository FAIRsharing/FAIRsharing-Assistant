import { createVuetify } from 'vuetify'
import fairSharingTheme from './theme'
import { aliases, fa } from 'vuetify/iconsets/fa'
// import customIcons from './icons'
import 'vuetify/styles'
import * as components from "vuetify/lib/components";
import * as directives from "vuetify/lib/directives";

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'fairSharingTheme',
    themes: {
      fairSharingTheme
    },
    options: {
      customProperties: true,
    },
  },
  // icons: customIcons,
  icons: {
    defaultSet: 'fa',
    aliases,
    sets: {
      fa,
    },
  }
})


