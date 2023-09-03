import { createVuetify } from 'vuetify'
import { VDataTableVirtual } from 'vuetify/lib/labs/VDataTable/VDataTableVirtual'

import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

export default createVuetify({
  components: {
    VDataTableVirtual,
  },
  theme: {
    themes: {
      light: {
        colors: {
          primary: '#1867C0',
          secondary: '#5CBBF6',
        },
      },
    },
  },
})
