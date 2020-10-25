import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import '@mdi/font/css/materialdesignicons.css';

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: 'mdi',
  },
  theme: {
    dark: true,
    themes: {
      light: {
        primary: '#1A8FE3',
        secondary: '#1A8FE3',
        accent: '#1A8FE3',
      },
      dark: {
        primary: '#1A8FE3',
        secondary: '#1A8FE3',
        accent: '#1A8FE3',
      },
    },
  },
});
