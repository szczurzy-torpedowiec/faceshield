import Vue from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import 'roboto-fontface/css/roboto/roboto-fontface.css';
import router from './router';
import communicationPlugin from './plugins/communication';
import store from './store';

Vue.config.productionTip = false;

Vue.use(communicationPlugin, {
  store,
});

new Vue({
  vuetify,
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');

console.log(process.env);
