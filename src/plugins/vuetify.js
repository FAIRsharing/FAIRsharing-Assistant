import { createVuetify } from 'vuetify'
import fairSharingTheme from './theme'
import customIcons from './icons'
import 'vuetify/styles'
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

export default createVuetify({
  theme: {
    defaultTheme: 'fairSharingTheme',
    themes: {
      fairSharingTheme
    },
    options: {
      customProperties: true,
    },
  },
  icons: customIcons,
  components,
  directives
})


