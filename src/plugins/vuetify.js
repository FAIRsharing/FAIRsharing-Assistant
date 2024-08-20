import { createVuetify } from 'vuetify'
import light from './theme'
import customIcons from './icons'

export default createVuetify({
  theme: {
    themes: {light},
    options: {
      customProperties: true,
    },
  },
  icons: customIcons,
})


