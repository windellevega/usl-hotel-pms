// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import 'font-awesome/css/font-awesome.css';
import 'material-icons/css/material-icons.css';
import 'roboto-fontface/css/roboto/roboto-fontface.css';



Vue.use(Vuetify, { theme: {
  primary: '#E65100',
  secondary: '#424242',
  accent: '#82B1FF',
  error: '#E5143D',
  info: '#2196F3',
  success: '#4CAF50',
  warning: '#FFC107'
}})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
