// window._ = require('lodash')

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';


const baseURL = process.env.NODE_ENV === 'production' 
				? 'http://tasks-app.biteeb.co.ve/api/desktop/' //'http://localhost/TaskApp/public/api/desktop/'
				: 'http://tasks-app.biteeb.co.ve/api/desktop/'

window.$ = window.jQuery = require('jquery')

window.axios = require('axios')
window.axios.defaults.baseURL = baseURL
window.axios.defaults.headers.common['Authorization'] = localStorage.getItem('token');

Vue.config.productionTip = false

// Handlers
window.NotificationHandler = require('./handlers/NotificationHandler').default
window.ErrorHandler = require('./handlers/ErrorHandler').default

new Vue({
  router,
  store,
  vuetify,
  render: function (h) { return h(App) }
}).$mount('#app')
